#!/usr/bin/env bash
#!/usr/bin/env bash
pip install -r requirements.txt

python manage.py showmigrations products

python manage.py migrate --verbosity 3

python manage.py create_admin

python manage.py collectstatic --noinput