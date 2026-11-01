import os, sys, django, json
sys.path.insert(0, os.path.abspath('.'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from logger.models import DoorLog

c = Client()
passed = 0
failed = 0

def test(desc, condition, details=""):
    global passed, failed
    if condition:
        print(f"  [PASS] {desc}")
        passed += 1
    else:
        print(f"  [FAIL] {desc} - {details}")
        failed += 1

print("=== 1. TESTING DJANGO BACKEND & VIEWS ===")

# Dashboard HTML rendering
r = c.get('/')
test("GET / (Dashboard)", r.status_code == 200, f"Status: {r.status_code}")
content = r.content.decode('utf-8')
test("Dashboard contains #toast-container", 'id="toast-container"' in content)
test("Dashboard contains #user-auth-modal", 'id="user-auth-modal"' in content)
test("Dashboard contains #campus-3d-wrapper", 'id="campus-3d-wrapper"' in content)
test("Dashboard contains #view-floorplan-page", 'id="view-floorplan-page"' in content)
test("Dashboard contains #view-activity-page", 'id="view-activity-page"' in content)
test("Dashboard contains #view-logs-page", 'id="view-logs-page"' in content)
test("Dashboard contains #view-devices-page", 'id="view-devices-page"' in content)
test("Dashboard contains #view-users-page", 'id="view-users-page"' in content)
test("Dashboard contains #view-account-page", 'id="view-account-page"' in content)
test("Dashboard contains #view-database-page", 'id="view-database-page"' in content)

# Live Status & Logs API
r = c.get('/api/status')
test("GET /api/status returns 200", r.status_code == 200)
test("GET /api/status returns list", isinstance(r.json(), list) and len(r.json()) > 0)

r = c.get('/api/logs')
test("GET /api/logs returns 200", r.status_code == 200)
test("GET /api/logs returns records", len(r.json()) > 0)

# ESP32 API with POST form-data
r = c.post('/api/update', {
    'api_key': 'Everbolt_SmartDoor_2026',
    'mac': '11:22:33:44:55:66',
    'name': 'Test Front Door',
    'state': 'OPEN',
    'batt': '95'
})
test("POST /api/update (Form-data) returns 200", r.status_code == 200)
latest_log = DoorLog.objects.filter(mac_address='11:22:33:44:55:66').first()
test("DoorLog record created via form-data", latest_log is not None and latest_log.door_state == 'OPEN' and latest_log.battery == 95)

# ESP32 API with JSON payload
r = c.post('/api/update', data=json.dumps({
    'api_key': 'Everbolt_SmartDoor_2026',
    'mac': '11:22:33:44:55:77',
    'name': 'Test Window',
    'state': 'CLOSED',
    'batt': 88
}), content_type='application/json')
test("POST /api/update (JSON payload) returns 200", r.status_code == 200)
latest_log2 = DoorLog.objects.filter(mac_address='11:22:33:44:55:77').first()
test("DoorLog record created via JSON", latest_log2 is not None and latest_log2.door_state == 'CLOSED' and latest_log2.battery == 88)

# Auth APIs
r = c.post('/api/login', data=json.dumps({'username': 'admin', 'password': 'admin123'}), content_type='application/json')
test("POST /api/login (valid admin) returns 200", r.status_code == 200 and r.json().get('status') == 'success')

r = c.get('/api/database/overview')
test("GET /api/database/overview (admin) returns 200", r.status_code == 200 and 'tables' in r.json())

# Cleanup temporary test records
DoorLog.objects.filter(mac_address__in=['11:22:33:44:55:66', '11:22:33:44:55:77']).delete()

print(f"\nDjango Tests: {passed} passed, {failed} failed")
if failed > 0:
    sys.exit(1)

