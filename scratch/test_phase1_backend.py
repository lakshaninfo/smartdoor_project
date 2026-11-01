import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import django
django.setup()

import time
from django.test import RequestFactory
from django.db import connection
from logger.models import DoorLog
from logger.views import dashboard, live_status_api, full_logs_api, database_devices_api

factory = RequestFactory()

def run_tests():
    print("=== TESTING PHASE 1: BACKEND QUERY OPTIMIZATIONS ===")

    # 1. Verify SQLite Indexes
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA index_list('logger_doorlog');")
        indexes = cursor.fetchall()
        index_names = [idx[1] for idx in indexes]
        print(f"Discovered {len(index_names)} indexes on logger_doorlog: {index_names}")
        assert any('idx_doorlog_time_desc' in name for name in index_names), "Missing idx_doorlog_time_desc"
        assert any('idx_doorlog_mac_time' in name for name in index_names), "Missing idx_doorlog_mac_time"
        print("PASS: Database indexes verified in SQLite schema.")

    # 2. Test dashboard view
    t0 = time.perf_counter()
    req = factory.get('/')
    from django.contrib.auth.models import AnonymousUser
    req.user = AnonymousUser()
    res = dashboard(req)
    t_dash = (time.perf_counter() - t0) * 1000
    assert res.status_code == 200, f"Dashboard returned {res.status_code}"
    print(f"PASS: dashboard() executed in {t_dash:.2f}ms (HTTP {res.status_code})")

    # 3. Test live_status_api
    t0 = time.perf_counter()
    req = factory.get('/api/status')
    res = live_status_api(req)
    t_status = (time.perf_counter() - t0) * 1000
    assert res.status_code == 200
    import json
    data = json.loads(res.content)
    assert isinstance(data, list)
    assert len(data) == 8, f"Expected 8 devices, got {len(data)}"
    print(f"PASS: live_status_api() returned {len(data)} latest doors in {t_status:.2f}ms")

    # 4. Test database_devices_api
    t0 = time.perf_counter()
    req = factory.get('/api/devices')
    req.user = AnonymousUser()
    res = database_devices_api(req)
    t_dev = (time.perf_counter() - t0) * 1000
    assert res.status_code == 200
    data = json.loads(res.content)
    devices = data.get('devices', [])
    assert len(devices) == 8, f"Expected 8 devices, got {len(devices)}"
    total_logs_sum = sum(d['total_logs_count'] for d in devices)
    assert total_logs_sum == DoorLog.objects.count(), f"Total logs sum mismatch: {total_logs_sum} vs {DoorLog.objects.count()}"
    print(f"PASS: database_devices_api() returned {len(devices)} devices in {t_dev:.2f}ms with aggregated SQL counts ({total_logs_sum} logs)")

    # 5. Test full_logs_api (default format)
    t0 = time.perf_counter()
    req = factory.get('/api/logs')
    res = full_logs_api(req)
    t_logs = (time.perf_counter() - t0) * 1000
    assert res.status_code == 200
    data = json.loads(res.content)
    assert isinstance(data, list), "Default format should return JSON array"
    assert len(data) == 100
    assert 'X-Total-Count' in res.headers
    print(f"PASS: full_logs_api() default array format returned {len(data)} items in {t_logs:.2f}ms with headers X-Total-Count={res.headers['X-Total-Count']}")

    # 6. Test full_logs_api (paginated format)
    t0 = time.perf_counter()
    req = factory.get('/api/logs?page=2&limit=25')
    res = full_logs_api(req)
    t_pag = (time.perf_counter() - t0) * 1000
    assert res.status_code == 200
    data = json.loads(res.content)
    assert isinstance(data, dict), "Paginated format should return JSON dict"
    assert data['page'] == 2
    assert data['page_size'] == 25
    assert len(data['logs']) == 25
    assert data['total'] == DoorLog.objects.count()
    expected_pages = (DoorLog.objects.count() + 25 - 1) // 25
    assert data['total_pages'] == expected_pages
    assert data['has_next'] is True
    assert data['has_prev'] is True
    print(f"PASS: full_logs_api() paginated format returned page 2/{expected_pages} (total {data['total']} logs) in {t_pag:.2f}ms")

    # 7. Test full_logs_api (filtering: mac, state, since_id)
    first_mac = devices[0]['mac_address']
    req = factory.get(f'/api/logs?mac={first_mac}')
    res = full_logs_api(req)
    data = json.loads(res.content)
    assert all(item['mac_address'] == first_mac for item in data)
    print(f"PASS: full_logs_api() filter by mac ({first_mac}) returned {len(data)} matching logs")

    req = factory.get('/api/logs?state=OPEN')
    res = full_logs_api(req)
    data = json.loads(res.content)
    assert all(item['door_state'].upper() == 'OPEN' for item in data)
    print(f"PASS: full_logs_api() filter by state=OPEN returned {len(data)} matching logs")

    # since_id
    min_id = DoorLog.objects.order_by('-id')[10].id
    req = factory.get(f'/api/logs?since_id={min_id}')
    res = full_logs_api(req)
    data = json.loads(res.content)
    assert len(data) == 10
    assert all(item['id'] > min_id for item in data)
    print(f"PASS: full_logs_api() delta filter since_id={min_id} returned {len(data)} delta logs")

    print("\n=======================================================")
    print("ALL PHASE 1 BACKEND OPTIMIZATION TESTS PASSED 100%!")
    print("=======================================================")

if __name__ == '__main__':
    run_tests()
