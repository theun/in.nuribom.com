from pymongo import Connection
from mongoengine import *
from myproject.models import *
import sys

connect('nurin_db')

db = Connection('localhost').nurin_db
users = db['user']
alarms = db['alarm']

def _migrate():
	global users, alarms

	rows = []
	for alarm in alarms.find():
		rows.append(alarm.copy())
	alarms.drop()

	for alarm in rows:
		alarms.save(alarm)

	for alarm in Alarm.objects:		
		type = alarm.type
		if type == 'blog-add' or type == 'blog-edit':
			alarm.who = alarm.doc.author
		elif type == 'comment-add':
			alarm.who = alarm.doc.comments[-1].author
		elif type == 'like-it':
			alarm.who = alarm.doc
		elif type == 'group-add' or type == 'group-member-add':
			alarm.who = alarm.doc.owner
		try:
			alarm.save()
		except:
			pass
		
def _clean():
	global users, alarms
	
	for user in users.find():
		if 'alarms' in user:
			alarms.drop()
			user['alarms'] = []
			users.save(user)

if __name__ == "__main__":
	if len(sys.argv) == 1:
		_migrate()
	elif sys.argv[1] == 'clean':
		_clean()
