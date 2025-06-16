#!/usr/bin/env bash

# Stop execution on any error
set -o errexit

# Install dependencies from requirements.txt
pip install --upgrade pip
pip install -r requirements.txt

# (Optional) Collect static files, uncomment if needed
# python manage.py collectstatic --no-input
