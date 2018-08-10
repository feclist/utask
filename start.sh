#!/bin/bash

echo "Running Django server"

pip install -r requirements.txt
cd utask
python manage.py migrate
python manage.py runserver 0.0.0.0:8000