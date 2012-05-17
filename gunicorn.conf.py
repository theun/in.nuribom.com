import os

def numCPUs():
	if not hasattr(os, "sysconf"):
		raise RuntimeError("No sysconf detected.")
	return os.sysconf("SC_NPROCESSORS_ONLN")

user = 'theun'
group = 'theun'
workers = numCPUs() * 2 + 1
backlog = 2048
loglevel = "debug"
