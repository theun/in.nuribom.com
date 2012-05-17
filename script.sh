#!/bin/bash
set -e
LOGFILE=/var/log/gunicorn/nurin.log
LOGDIR=$(dirname $LOGFILE)
cd /home/theun/workspace/pyramid_test/MyProject
source ../env/bin/activate
test -d $LOGDIR || mkdir -p $LOGDIR
exec ../env/bin/gunicorn_paster -c gunicorn.conf.py development.ini
