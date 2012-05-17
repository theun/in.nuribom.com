#!/bin/bash
set -e
LOGFILE=/var/log/gunicorn/nurin.log
LOGDIR=$(dirname $LOGFILE)
source ../env/bin/activate
test -d $LOGDIR || mkdir -p $LOGDIR
exec ../env/bin/gunicorn_paster -c gunicorn.conf.py production.ini
