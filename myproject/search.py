# -*- coding: utf-8 -*- 

import sys
import solr
import re

from bson import ObjectId
from HTMLParser import HTMLParser

class MLStripper(HTMLParser):
	def __init__(self):
		self.reset()
		self.fed = []
	def handle_data(self, d):
		self.fed.append(d)
	def strip(self, html):
		self.feed(html)
		return u" ".join(self.fed)

import Queue
import threading
from models import User, Post

class ThreadIndexer(threading.Thread):
	"""
	인덱스 추가/삭제를 위한 쓰레드
	"""
	def __init__(self):
		threading.Thread.__init__(self)
		self.queue = Queue.Queue()
		self.fts = FTS_engine()
	
	def send(self, msg):
		self.queue.put(msg)
		
	def run(self):

		while True:
			# 큐에서 작업을 하나 가져온다
			msg = self.queue.get()
			try:
				if msg['action'] == 'add':
					if msg['collection'] == 'Post':
						pid = ObjectId(msg['id'])
						post = Post.objects.with_id(pid)
						text = [post.title, MLStripper().strip(post.content), post.author.name]
						text.extend(post.tags)
						text.extend([c.content for c in post.comments])
						text = _clean(" ".join(text))
						doc = dict(id=msg['id'], collection=msg['collection'], text=text)
						if post.category and not post.category.public:
							doc['collection'] = str(post.category.id)
						self.fts.add_doc(doc)
					elif msg['collection'] == 'User':
						uid = ObjectId(msg['id'])
						user = User.objects.with_id(uid)
						self.fts.add_doc(dict(id=msg['id'], 
											  collection=msg['collection'], 
											  name=user.name))
				elif msg['action'] == 'del':
					self.fts.delete(msg['id'])
				elif msg['action'] == 'keyword':
					self.fts.add_keyword(msg['keyword'])
			except:
				pass
			
			# 작업 완료를 알리기 위해 큐에 시그널을 보낸다.
			self.queue.task_done()
	
	def end(self):
		self.queue.join()


class FTS_engine(object):
	def __init__(self):
		self.conn = solr.Solr('http://localhost:8983/solr')
	
	def __del__(self):
		self.conn.close()
	
	def delete_index(self):
		self.conn.delete_query("*:*")
		self.conn.commit()
		
	def rebuild_index(self, docs):
		self.delete_index()
		self.conn.add_many(docs)
		self.conn.commit()
		self.conn.optimize()
	
	def prefix(self, which, word, rows=20, **params):
		results = []
		if which == 'keyword':
			query = "keyword:%s*" % "\ ".join(word.split())
			response = self.conn.select(query, fields='keyword', rows=rows, **params)
			for hit in response.results:
				results.append(hit['keyword'])
		elif which == 'user':
			query = "collection:User AND name:%s*" % word.split()[0]
			response = self.conn.select(query, fields='name', rows=rows, **params)
			for hit in response.results:
				results.append(hit['name'])
		return results
	
	def search(self, query, collections=None, rows=20, **params):
		query = " ".join(query.split())
		thread_indexer.send(dict(action='keyword', keyword=query))
		
		if collections:
			query = "text:(%s) AND collection:(Post User %s)" % (query, " ".join(collections)) 
		else:
			query = "text:(%s) AND collection:(Post User)" % query
			
		response = self.conn.select(query, highlight=True, fields='*', rows=rows, **params)
		results = []
		for hit in response.results:
			results.append(dict(id=hit['id'],
								collection=hit['collection'],
								highlight=response.highlighting[hit['id']]['text'][0]))
		return results
	
	def add_doc(self, doc):
		self.conn.add(doc)
		self.conn.commit()
		self.conn.optimize()

	def add_keyword(self, keyword):
		query = 'keyword:%s' % keyword.replace(' ', '\ ')
		response = self.conn.select(query, fields='keyword')
		if response.numFound == 0:
			self.add_doc(dict(id=str(ObjectId()), keyword=keyword))
			
	def delete(self, id):
		self.conn.delete(id)
		self.conn.commit()
		self.conn.optimize()

def _clean(text):
	"""
	Clean the text for indexing.
	
	Strip certain control characters to avoid illegal character exception
	"""
	#SolrException: HTTP code=400, reason=Illegal character ((CTRL-CHAR, code 20))
	#               at [row,col {unknown-source}]: [3519,150]
	#See also:      http://mail-archives.apache.org/mod_mbox/lucene-solr-user/200901.mbox
	#                     /%3C2c138bed0901040803x4cc07a29i3e022e7f375fc5f@mail.gmail.com%3E
	if not text: return None
	text = re.sub('[\x00-\x08\x0B\x0C\x0E-\x1F]', ' ', text)
	return text

if __name__ == "__main__":
	from mongoengine import connect
	
	keyword = False
	user = False
	args = []
	connect('nurin_db')
	fts = FTS_engine();
	
	if len(sys.argv) < 2:
		print """
  Search keywords in Solr server.
  
  Usage: %s [options] [keyword keyword ...]
   options
   -r : rebuild index
   -d : delete index
   -k : keyword search. It will returns the matched words only.
"""

	for arg in sys.argv[1:]:
		if arg == "-r":	# rebuild index
			docs = []
			fts.delete_index()
			for post in Post.objects.all():
				text = [post.title, MLStripper().strip(post.content), post.author.name]
				text.extend(post.tags)
				text.extend([c.content for c in post.comments])
				text = _clean(" ".join(text))
				doc = dict(id=str(post.id), collection="Post", text=text)
				if post.category and not post.category.public:
					doc['collection'] = str(post.category.id)
				fts.conn.add(doc)
			for user in User.objects.all():
				fts.conn.add(dict(id=str(user.id), collection="User", name=user.name))
			fts.conn.commit()
			fts.conn.optimize()
		elif arg == "-d":
			fts.delete_index()
			args = []
			break
		elif arg == "-k":
			keyword = True
		elif arg == "-u":
			user = True
		else:
			args.append(arg.decode('utf-8'))
	
	if args:
		import __builtin__
		
		t = ThreadIndexer()
		t.setDaemon(True)
		t.start()
		__builtin__.index = t

		if keyword:
			results = fts.prefix('keyword', " ".join(args))
			print u"%s: %d" % (" ".join(args), len(results))
	
			for r in results:
				print " ", r
		elif user:
			results = fts.prefix('user', " ".join(args))
			print " ".join(args), ":", len(results)
			for r in results:
				print " ", r
		else:
			query = " ".join(args)
			results = fts.search(query)
			print u"%s: %d" % (query, len(results))
	
#			for r in results:
#				print
#				print "Collection: %s, ID: %s" % (r['collection'], r['id'])
#				print " ", r['highlight']

		t.end()
