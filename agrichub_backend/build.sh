#!/usr/bin/env bash

set -e

pip install -r requirements.txt

echo "=== Farmers migrations BEFORE migrate ==="
python manage.py showmigrations farmers

echo "=== Running database migrations ==="
python manage.py migrate --verbosity 3 --noinput

echo "=== Farmers migrations AFTER migrate ==="
python manage.py showmigrations farmers

echo "=== Django system check ==="
python manage.py check

echo "=== Creating admin ==="
python manage.py create_admin

echo "=== Collecting static files ==="
python manage.py collectstatic --noinput