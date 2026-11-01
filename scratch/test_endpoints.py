import os, sys, django
sys.path.insert(0, os.path.abspath('.'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
import json

c = Client()

print("1. Testing GET / (dashboard)...")
r = c.get('/')
print(f"   Status: {r.status_code}")

print("2. Testing GET /api/status...")
r = c.get('/api/status')
print(f"   Status: {r.status_code}, items count: {len(r.json())}")

print("3. Testing GET /api/logs...")
r = c.get('/api/logs')
print(f"   Status: {r.status_code}, logs count: {len(r.json())}")

print("4. Testing GET /api/users...")
r = c.get('/api/users')
print(f"   Status: {r.status_code}, users count: {len(r.json()['users'])}")

print("5. Testing GET /api/devices...")
r = c.get('/api/devices')
print(f"   Status: {r.status_code}, devices count: {len(r.json()['devices'])}")

print("6. Testing GET /manifest.json...")
r = c.get('/manifest.json')
print(f"   Status: {r.status_code}, content_type: {r.headers.get('Content-Type')}")

print("7. Testing POST /api/login with invalid password...")
r = c.post('/api/login', data=json.dumps({'username': 'admin', 'password': 'wrongpassword'}), content_type='application/json')
print(f"   Status: {r.status_code}, response: {r.json()}")

print("8. Testing POST /api/login with valid password...")
r = c.post('/api/login', data=json.dumps({'username': 'admin', 'password': 'admin123'}), content_type='application/json')
print(f"   Status: {r.status_code}, response: {r.json()}")

print("9. Testing Database Overview as logged in admin...")
r = c.get('/api/database/overview')
print(f"   Status: {r.status_code}, tables count: {r.json().get('tables_count')}")

print("10. Testing POST /api/logout...")
r = c.post('/api/logout')
print(f"   Status: {r.status_code}, response: {r.json()}")

print("11. Testing Database Overview as logged out user...")
r = c.get('/api/database/overview')
print(f"   Status: {r.status_code}, response: {r.json()}")
