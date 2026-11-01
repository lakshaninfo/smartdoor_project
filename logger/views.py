from django.shortcuts import render
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils import timezone
import json
from .models import DoorLog
from django.db.models import Count

@csrf_exempt
def esp32_api(request):
    if request.method == 'POST':
        api_key = request.POST.get('api_key')
        mac = request.POST.get('mac')
        name = request.POST.get('name')
        state = request.POST.get('state')
        batt_str = request.POST.get('batt')

        if not api_key and request.body:
            try:
                data = json.loads(request.body.decode('utf-8'))
                api_key = data.get('api_key')
                mac = data.get('mac')
                name = data.get('name')
                state = data.get('state')
                batt_str = data.get('batt')
            except Exception:
                pass

        if batt_str is None:
            batt_str = '100'

        # Check API Key
        if api_key != "Everbolt_SmartDoor_2026":
            return HttpResponseForbidden("Forbidden: Invalid API Key")
        if not mac or not state:
            return HttpResponseBadRequest("Bad Request: Missing data")

        try:
            battery = int(batt_str)
        except (ValueError, TypeError):
            battery = 100

        # Normalize state & name
        clean_state = str(state).strip().upper()
        clean_name = (name or mac).strip()
        clean_mac = str(mac).strip().upper()

        # Save to database
        DoorLog.objects.create(mac_address=clean_mac, door_name=clean_name, door_state=clean_state, battery=battery)
        return HttpResponse("Success: Data logged to Django DB.", status=200)

    return HttpResponse("Method not allowed", status=405)

import re

def is_mobile_user_agent(request):
    user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
    # Check Sec-CH-UA-Mobile client hint header if present
    ch_mobile = request.META.get('HTTP_SEC_CH_UA_MOBILE', '')
    if ch_mobile == '?1':
        return True

    mobile_patterns = [
        'mobile', 'android', 'iphone', 'ipod', 'ipad', 'blackberry',
        'iemobile', 'opera mini', 'opera mobi', 'windows phone', 'webos', 
        'silk', 'kindle', 'phone', 'touch'
    ]
    return any(p in user_agent for p in mobile_patterns)

def dashboard(request):
    history = list(DoorLog.objects.order_by('-timestamp')[:10])
    macs = list(DoorLog.objects.values_list('mac_address', flat=True).distinct())
    latest_ids = []
    for mac in macs:
        lid = DoorLog.objects.filter(mac_address=mac).values_list('id', flat=True).first()
        if lid:
            latest_ids.append(lid)
    latest_doors = {log.mac_address: log for log in DoorLog.objects.filter(id__in=latest_ids)}

    is_mobile = is_mobile_user_agent(request)

    # Unified responsive dashboard driven by Native CSS Media Queries
    return render(request, 'logger/dashboard.html', {
        'latest_doors': latest_doors.values(),
        'history': history,
        'user': request.user,
        'is_mobile': is_mobile
    })

def live_status_api(request):
    macs = list(DoorLog.objects.values_list('mac_address', flat=True).distinct())
    latest_ids = []
    for mac in macs:
        lid = DoorLog.objects.filter(mac_address=mac).values_list('id', flat=True).first()
        if lid:
            latest_ids.append(lid)

    logs = DoorLog.objects.filter(id__in=latest_ids).only(
        'mac_address', 'door_name', 'door_state', 'battery', 'timestamp'
    )
    result = []
    for log in logs:
        local_ts = timezone.localtime(log.timestamp) if timezone.is_aware(log.timestamp) else log.timestamp
        result.append({
            'mac_address': log.mac_address,
            'door_name': log.door_name,
            'door_state': log.door_state,
            'battery': getattr(log, 'battery', 100),
            'timestamp': local_ts.strftime("%Y-%m-%d %H:%M:%S")
        })
    return JsonResponse(result, safe=False)

def full_logs_api(request):
    mac = request.GET.get('mac')
    door_state = request.GET.get('state')
    since_id = request.GET.get('since_id')

    try:
        page = max(1, int(request.GET.get('page', 1)))
    except (ValueError, TypeError):
        page = 1

    try:
        limit = min(500, max(1, int(request.GET.get('limit', request.GET.get('page_size', 100)))))
    except (ValueError, TypeError):
        limit = 100

    offset = (page - 1) * limit

    qs = DoorLog.objects.all()
    if mac:
        qs = qs.filter(mac_address=mac)
    if door_state:
        qs = qs.filter(door_state__iexact=door_state)
    if since_id:
        try:
            qs = qs.filter(id__gt=int(since_id))
        except (ValueError, TypeError):
            pass

    total_count = qs.count()
    logs = qs.order_by('-timestamp')[offset:offset + limit]

    data = []
    for log in logs:
        local_ts = timezone.localtime(log.timestamp) if timezone.is_aware(log.timestamp) else log.timestamp
        data.append({
            'id': log.id,
            'mac_address': log.mac_address,
            'door_name': log.door_name,
            'door_state': log.door_state,
            'battery': getattr(log, 'battery', 100),
            'timestamp': local_ts.strftime("%Y-%m-%d %H:%M:%S")
        })

    format_type = request.GET.get('format')
    if format_type == 'paginated' or 'page' in request.GET:
        total_pages = (total_count + limit - 1) // limit if limit > 0 else 1
        response = JsonResponse({
            'logs': data,
            'total': total_count,
            'page': page,
            'page_size': limit,
            'total_pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        })
    else:
        response = JsonResponse(data, safe=False)

    response['X-Total-Count'] = str(total_count)
    response['X-Page'] = str(page)
    response['X-Page-Size'] = str(limit)
    return response

# -------------------------------------------------------------
# User Account Authentication & Management Views
# -------------------------------------------------------------
@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
        except Exception:
            username = request.POST.get('username')
            password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'success', 'username': user.username, 'email': user.email})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid username or password'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@csrf_exempt
def logout_api(request):
    logout(request)
    return JsonResponse({'status': 'success', 'message': 'Logged out successfully'})

@csrf_exempt
def register_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email', '')
            password = data.get('password')
        except Exception:
            username = request.POST.get('username')
            email = request.POST.get('email', '')
            password = request.POST.get('password')

        if not username or not password:
            return JsonResponse({'status': 'error', 'message': 'Username and password are required'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'status': 'error', 'message': 'Username already exists! Choose another name.'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({'status': 'success', 'username': user.username, 'email': user.email})
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

def user_info_api(request):
    users = list(User.objects.values('id', 'username', 'email', 'is_superuser', 'date_joined'))
    # Format date_joined
    for u in users:
        u['date_joined'] = u['date_joined'].strftime("%Y-%m-%d %H:%M")
    
    current_user = {
        'is_authenticated': request.user.is_authenticated,
        'username': request.user.username if request.user.is_authenticated else 'Guest',
        'email': request.user.email if request.user.is_authenticated else '',
        'is_superuser': request.user.is_superuser if request.user.is_authenticated else False
    }
    return JsonResponse({'current_user': current_user, 'users': users})

@csrf_exempt
def delete_user_api(request, user_id):
    if request.method == 'POST' or request.method == 'DELETE':
        if not request.user.is_authenticated or not request.user.is_superuser:
            return JsonResponse({'status': 'error', 'message': 'Permission Denied: Only Administrator accounts can remove users!'}, status=403)

        try:
            target_user = User.objects.get(id=user_id)
            if target_user.id == request.user.id:
                return JsonResponse({'status': 'error', 'message': 'You cannot delete your own active admin session!'}, status=400)
            
            uname = target_user.username
            target_user.delete()
            return JsonResponse({'status': 'success', 'message': f'User @{uname} has been removed successfully!'})
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User account not found'}, status=404)

    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)


def database_devices_api(request):
    counts_map = {
        item['mac_address']: item['total_count']
        for item in DoorLog.objects.values('mac_address').annotate(total_count=Count('id'))
    }

    latest_ids = []
    for mac in counts_map.keys():
        lid = DoorLog.objects.filter(mac_address=mac).values_list('id', flat=True).first()
        if lid:
            latest_ids.append(lid)

    latest_logs = DoorLog.objects.filter(id__in=latest_ids).only(
        'mac_address', 'door_name', 'door_state', 'battery', 'timestamp'
    )

    devices = []
    for log in latest_logs:
        mac = log.mac_address
        local_ts = timezone.localtime(log.timestamp) if timezone.is_aware(log.timestamp) else log.timestamp
        devices.append({
            'mac_address': mac,
            'door_name': log.door_name,
            'last_state': log.door_state,
            'last_battery': getattr(log, 'battery', 100),
            'last_polled': local_ts.strftime("%Y-%m-%d %H:%M:%S"),
            'total_logs_count': counts_map.get(mac, 1)
        })

    return JsonResponse({
        'devices': devices,
        'is_admin': request.user.is_authenticated and request.user.is_superuser
    })


@csrf_exempt
def delete_device_logs_api(request, mac_address):
    if request.method in ['POST', 'DELETE']:
        mac_clean = (mac_address or '').strip()
        door_name = ''
        if request.body:
            try:
                import json
                body_data = json.loads(request.body)
                door_name = (body_data.get('door_name') or '').strip()
            except Exception:
                pass

        from django.db.models import Q
        q = Q(mac_address__iexact=mac_clean)
        if door_name:
            q |= (Q(door_name__iexact=door_name) & (Q(mac_address='') | Q(mac_address__isnull=True)))

        deleted_count, _ = DoorLog.objects.filter(q).delete()
        return JsonResponse({
            'status': 'success',
            'message': f'Successfully removed device {mac_clean} ({deleted_count} database log records deleted).',
            'deleted_count': deleted_count,
            'mac_address': mac_clean
        })
    return JsonResponse({'status': 'error', 'message': 'Invalid HTTP method'}, status=405)


def manifest_json(request):
    manifest = {
        "name": "SmartDoor Access Control",
        "short_name": "SmartDoor",
        "description": "Smart IoT Door Access & Security Monitoring Platform",
        "start_url": "/?view=mobile",
        "display": "standalone",
        "orientation": "portrait-primary",
        "background_color": "#ffffff",
        "theme_color": "#2563eb",
        "icons": [
            {
                "src": "https://cdn.jsdelivr.net/npm/lucide-static@0.469.0/icons/shield-check.svg",
                "sizes": "192x192 512x512",
                "type": "image/svg+xml",
                "purpose": "any maskable"
            }
        ]
    }
    return JsonResponse(manifest, content_type="application/manifest+json")





# =====================================================================
# DATABASE MANAGEMENT STUDIO API (ADMIN SUPERUSER ONLY)
# =====================================================================
from functools import wraps
from django.db import connection
from django.conf import settings
from django.http import FileResponse
import os, time, datetime, csv, io, re

def db_admin_required(view_func):
    """Enforces strict Superuser / Administrator authorization for DB management."""
    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_superuser:
            return JsonResponse({
                'status': 'error',
                'message': 'Permission Denied: Administrator Superuser clearance required.'
            }, status=403)
        return view_func(request, *args, **kwargs)
    return _wrapped

def _serialize_cell(val):
    if val is None:
        return None
    if isinstance(val, (datetime.datetime, datetime.date)):
        return val.isoformat()
    if isinstance(val, bytes):
        try:
            return val.decode('utf-8')
        except UnicodeDecodeError:
            return val.hex()
    if isinstance(val, (int, float, bool, str)):
        return val
    return str(val)

def _sanitize_ident(name):
    if not name or not re.match(r'^[a-zA-Z0-9_]+$', str(name)):
        raise ValueError(f"Invalid identifier name: '{name}'")
    return str(name)

@db_admin_required
def db_overview_api(request):
    """Returns database metadata, tables list, row counts, and storage stats."""
    db_path = settings.DATABASES['default']['NAME']
    file_size_bytes = os.path.getsize(db_path) if os.path.exists(db_path) else 0

    with connection.cursor() as cursor:
        cursor.execute("SELECT sqlite_version();")
        sqlite_ver = cursor.fetchone()[0]

        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;")
        table_names = [r[0] for r in cursor.fetchall()]

        tables = []
        total_rows = 0
        for tbl in table_names:
            try:
                cursor.execute(f'SELECT COUNT(*) FROM "{tbl}";')
                cnt = cursor.fetchone()[0]
                cursor.execute(f'PRAGMA table_info("{tbl}");')
                col_count = len(cursor.fetchall())
                tables.append({
                    'name': tbl,
                    'row_count': cnt,
                    'col_count': col_count
                })
                total_rows += cnt
            except Exception as e:
                tables.append({'name': tbl, 'row_count': 0, 'col_count': 0, 'error': str(e)})

    return JsonResponse({
        'status': 'success',
        'engine': 'SQLite 3',
        'version': sqlite_ver,
        'database_name': os.path.basename(db_path),
        'file_size_bytes': file_size_bytes,
        'file_size_formatted': f"{file_size_bytes / 1024:.1f} KB" if file_size_bytes < 1048576 else f"{file_size_bytes / 1048576:.2f} MB",
        'tables_count': len(tables),
        'total_rows_count': total_rows,
        'tables': tables
    })

@db_admin_required
def db_table_schema_api(request, table_name):
    """Returns schema metadata: columns, data types, primary keys, nullability."""
    try:
        clean_table = _sanitize_ident(table_name)
    except ValueError as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    with connection.cursor() as cursor:
        cursor.execute(f'PRAGMA table_info("{clean_table}");')
        rows = cursor.fetchall()
        columns = []
        pk_column = None
        for cid, name, ctype, notnull, dflt, pk in rows:
            is_pk = bool(pk)
            if is_pk and not pk_column:
                pk_column = name
            columns.append({
                'cid': cid,
                'name': name,
                'type': ctype or 'TEXT',
                'not_null': bool(notnull),
                'default_value': dflt,
                'is_pk': is_pk
            })

    return JsonResponse({
        'status': 'success',
        'table_name': clean_table,
        'columns': columns,
        'pk_column': pk_column
    })

@db_admin_required
def db_table_data_api(request, table_name):
    """Returns paginated, searchable, sortable rows for a given table."""
    try:
        clean_table = _sanitize_ident(table_name)
    except ValueError as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    page = max(1, int(request.GET.get('page', 1)))
    page_size = max(5, min(200, int(request.GET.get('page_size', 25))))
    offset = (page - 1) * page_size
    search = request.GET.get('search', '').strip()
    sort_col = request.GET.get('sort_col', '').strip()
    sort_dir = 'DESC' if request.GET.get('sort_dir', '').upper() == 'DESC' else 'ASC'

    with connection.cursor() as cursor:
        cursor.execute(f'PRAGMA table_info("{clean_table}");')
        cols_info = cursor.fetchall()
        col_names = [c[1] for c in cols_info]
        pk_col = next((c[1] for c in cols_info if c[5]), col_names[0] if col_names else 'id')

        where_sql = ""
        params = []
        if search:
            search_conds = []
            for col in col_names:
                search_conds.append(f'CAST("{col}" AS TEXT) LIKE %s')
                params.append(f'%{search}%')
            where_sql = " WHERE " + " OR ".join(search_conds)

        cursor.execute(f'SELECT COUNT(*) FROM "{clean_table}"{where_sql};', params)
        total_rows = cursor.fetchone()[0]

        order_sql = ""
        if sort_col and sort_col in col_names:
            order_sql = f' ORDER BY "{sort_col}" {sort_dir}'
        elif pk_col in col_names:
            order_sql = f' ORDER BY "{pk_col}" DESC'

        query_sql = f'SELECT * FROM "{clean_table}"{where_sql}{order_sql} LIMIT %s OFFSET %s;'
        cursor.execute(query_sql, params + [page_size, offset])
        raw_rows = cursor.fetchall()

        rows = []
        for r in raw_rows:
            rows.append([_serialize_cell(val) for val in r])

    total_pages = max(1, (total_rows + page_size - 1) // page_size)

    return JsonResponse({
        'status': 'success',
        'table_name': clean_table,
        'columns': col_names,
        'pk_column': pk_col,
        'rows': rows,
        'total_rows': total_rows,
        'page': page,
        'page_size': page_size,
        'total_pages': total_pages
    })

@csrf_exempt
@db_admin_required
def db_insert_row_api(request, table_name):
    """Inserts a new record into table_name."""
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'POST method required.'}, status=405)

    try:
        clean_table = _sanitize_ident(table_name)
        body = json.loads(request.body.decode('utf-8'))
        data = body.get('data', {})
        if not data:
            return JsonResponse({'status': 'error', 'message': 'No column data provided.'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Invalid request: {e}'}, status=400)

    with connection.cursor() as cursor:
        cursor.execute(f'PRAGMA table_info("{clean_table}");')
        cols_info = {c[1]: c for c in cursor.fetchall()}

        insert_cols = []
        insert_vals = []
        for col_name, val in data.items():
            if col_name in cols_info:
                if cols_info[col_name][5] and (val == '' or val is None):
                    continue
                insert_cols.append(_sanitize_ident(col_name))
                insert_vals.append(val if val != '' else None)

        if not insert_cols:
            return JsonResponse({'status': 'error', 'message': 'No valid columns provided for insertion.'}, status=400)

        cols_clause = ', '.join([f'"{c}"' for c in insert_cols])
        placeholders = ', '.join(['%s'] * len(insert_vals))
        insert_sql = f'INSERT INTO "{clean_table}" ({cols_clause}) VALUES ({placeholders});'

        try:
            cursor.execute(insert_sql, insert_vals)
            new_id = cursor.lastrowid
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Database error: {e}'}, status=400)

    return JsonResponse({
        'status': 'success',
        'message': f'Record inserted successfully into {clean_table}.',
        'insert_id': new_id
    })

@csrf_exempt
@db_admin_required
def db_update_row_api(request, table_name):
    """Updates an existing record by primary key."""
    if request.method not in ['POST', 'PUT']:
        return JsonResponse({'status': 'error', 'message': 'POST/PUT method required.'}, status=405)

    try:
        clean_table = _sanitize_ident(table_name)
        body = json.loads(request.body.decode('utf-8'))
        pk_col = _sanitize_ident(body.get('pk_column', 'id'))
        pk_val = body.get('pk_value')
        data = body.get('data', {})
        if pk_val is None or not data:
            return JsonResponse({'status': 'error', 'message': 'Missing pk_value or update data.'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Invalid request: {e}'}, status=400)

    with connection.cursor() as cursor:
        cursor.execute(f'PRAGMA table_info("{clean_table}");')
        valid_cols = {c[1] for c in cursor.fetchall()}

        set_clauses = []
        set_vals = []
        for col_name, val in data.items():
            if col_name in valid_cols and col_name != pk_col:
                clean_col = _sanitize_ident(col_name)
                set_clauses.append(f'"{clean_col}" = %s')
                set_vals.append(val if val != '' else None)

        if not set_clauses:
            return JsonResponse({'status': 'error', 'message': 'No fields to update.'}, status=400)

        update_sql = f'UPDATE "{clean_table}" SET {", ".join(set_clauses)} WHERE "{pk_col}" = %s;'
        try:
            cursor.execute(update_sql, set_vals + [pk_val])
            rows_aff = cursor.rowcount
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Database error: {e}'}, status=400)

    return JsonResponse({
        'status': 'success',
        'message': f'Record in {clean_table} updated successfully.',
        'rows_affected': rows_aff
    })

@csrf_exempt
@db_admin_required
def db_delete_row_api(request, table_name):
    """Deletes one or multiple rows by primary key."""
    if request.method not in ['POST', 'DELETE']:
        return JsonResponse({'status': 'error', 'message': 'POST/DELETE method required.'}, status=405)

    try:
        clean_table = _sanitize_ident(table_name)
        body = json.loads(request.body.decode('utf-8'))
        pk_col = _sanitize_ident(body.get('pk_column', 'id'))
        pk_vals = body.get('pk_values', [])
        if not pk_vals:
            single_val = body.get('pk_value')
            if single_val is not None:
                pk_vals = [single_val]
        if not pk_vals:
            return JsonResponse({'status': 'error', 'message': 'No primary key values provided for deletion.'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Invalid request: {e}'}, status=400)

    with connection.cursor() as cursor:
        placeholders = ', '.join(['%s'] * len(pk_vals))
        delete_sql = f'DELETE FROM "{clean_table}" WHERE "{pk_col}" IN ({placeholders});'
        try:
            cursor.execute(delete_sql, pk_vals)
            rows_aff = cursor.rowcount
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Database error: {e}'}, status=400)

    return JsonResponse({
        'status': 'success',
        'message': f'{rows_aff} record(s) deleted from {clean_table}.',
        'deleted_count': rows_aff
    })

@csrf_exempt
@db_admin_required
def db_truncate_table_api(request, table_name):
    """Empties all rows from table_name and resets autoincrement sequence."""
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'POST method required.'}, status=405)

    try:
        clean_table = _sanitize_ident(table_name)
    except ValueError as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    with connection.cursor() as cursor:
        try:
            cursor.execute(f'DELETE FROM "{clean_table}";')
            rows_aff = cursor.rowcount
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence';")
            if cursor.fetchone():
                cursor.execute('DELETE FROM sqlite_sequence WHERE name = %s;', [clean_table])
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Database error: {e}'}, status=400)

    return JsonResponse({
        'status': 'success',
        'message': f'Table "{clean_table}" successfully emptied ({rows_aff} rows removed).',
        'deleted_count': rows_aff
    })

@csrf_exempt
@db_admin_required
def db_drop_table_api(request, table_name):
    """Permanently drops table_name."""
    if request.method not in ['POST', 'DELETE']:
        return JsonResponse({'status': 'error', 'message': 'POST/DELETE method required.'}, status=405)

    try:
        clean_table = _sanitize_ident(table_name)
        if clean_table in ['auth_user', 'django_migrations']:
            return JsonResponse({'status': 'error', 'message': f'Security Protection: Cannot drop core system table "{clean_table}".'}, status=400)
    except ValueError as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    with connection.cursor() as cursor:
        try:
            cursor.execute(f'DROP TABLE "{clean_table}";')
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Database error: {e}'}, status=400)

    return JsonResponse({
        'status': 'success',
        'message': f'Table "{clean_table}" permanently dropped from database.'
    })

@csrf_exempt
@db_admin_required
def db_create_table_api(request):
    """Creates a new table with user-defined columns."""
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'POST method required.'}, status=405)

    try:
        body = json.loads(request.body.decode('utf-8'))
        table_name = _sanitize_ident(body.get('table_name', ''))
        columns = body.get('columns', [])
        if not table_name or not columns:
            return JsonResponse({'status': 'error', 'message': 'Table name and columns required.'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Invalid request: {e}'}, status=400)

    col_defs = []
    has_pk = False
    for col in columns:
        col_name = _sanitize_ident(col.get('name', ''))
        col_type = col.get('type', 'TEXT').upper()
        if col_type not in ['INTEGER', 'TEXT', 'REAL', 'BLOB', 'VARCHAR(100)', 'VARCHAR(255)', 'DATETIME', 'BOOLEAN']:
            col_type = 'TEXT'

        def_parts = [f'"{col_name}" {col_type}']
        if col.get('is_pk'):
            def_parts.append('PRIMARY KEY')
            if col_type == 'INTEGER':
                def_parts.append('AUTOINCREMENT')
            has_pk = True
        if col.get('not_null') and not col.get('is_pk'):
            def_parts.append('NOT NULL')
        if col.get('default_value'):
            def_parts.append(f"DEFAULT '{col['default_value']}'")

        col_defs.append(' '.join(def_parts))

    if not has_pk:
        col_defs.insert(0, '"id" INTEGER PRIMARY KEY AUTOINCREMENT')

    create_sql = f'CREATE TABLE "{table_name}" (\n  ' + ',\n  '.join(col_defs) + '\n);'

    with connection.cursor() as cursor:
        try:
            cursor.execute(create_sql)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'Database error: {e}'}, status=400)

    return JsonResponse({
        'status': 'success',
        'message': f'Table "{table_name}" created successfully.',
        'table_name': table_name
    })

@csrf_exempt
@db_admin_required
def db_query_runner_api(request):
    """Executes arbitrary raw SQL query and returns result grid or execution status."""
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'POST method required.'}, status=405)

    try:
        body = json.loads(request.body.decode('utf-8'))
        sql = (body.get('sql') or '').strip()
        if not sql:
            return JsonResponse({'status': 'error', 'message': 'Empty SQL query.'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Invalid request payload: {e}'}, status=400)

    start_time = time.perf_counter()
    with connection.cursor() as cursor:
        try:
            cursor.execute(sql)
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

            if cursor.description:
                col_names = [d[0] for d in cursor.description]
                raw_rows = cursor.fetchall()
                rows = [[_serialize_cell(val) for val in r] for r in raw_rows]
                return JsonResponse({
                    'status': 'success',
                    'is_select': True,
                    'columns': col_names,
                    'rows': rows,
                    'row_count': len(rows),
                    'duration_ms': elapsed_ms
                })
            else:
                rows_aff = cursor.rowcount
                return JsonResponse({
                    'status': 'success',
                    'is_select': False,
                    'rows_affected': rows_aff,
                    'message': f'Query executed successfully. ({rows_aff} row(s) affected)',
                    'duration_ms': elapsed_ms
                })
        except Exception as e:
            elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return JsonResponse({
                'status': 'error',
                'message': str(e),
                'duration_ms': elapsed_ms
            }, status=400)

@db_admin_required
def db_backup_download_api(request):
    """Serves the live db.sqlite3 database file as an instant downloadable backup."""
    db_path = settings.DATABASES['default']['NAME']
    if not os.path.exists(db_path):
        return JsonResponse({'status': 'error', 'message': 'Database file not found.'}, status=404)

    timestamp_str = timezone.now().strftime("%Y%m%d_%H%M%S")
    filename = f"smartdoor_db_backup_{timestamp_str}.sqlite3"
    response = FileResponse(open(db_path, 'rb'), as_attachment=True, filename=filename)
    return response

@db_admin_required
def db_export_table_api(request, table_name):
    """Exports table records as CSV or JSON."""
    try:
        clean_table = _sanitize_ident(table_name)
    except ValueError as e:
        return HttpResponseBadRequest(str(e))

    export_format = request.GET.get('format', 'csv').lower()

    with connection.cursor() as cursor:
        cursor.execute(f'SELECT * FROM "{clean_table}";')
        col_names = [d[0] for d in cursor.description]
        raw_rows = cursor.fetchall()

    if export_format == 'json':
        data = []
        for r in raw_rows:
            data.append({col_names[i]: _serialize_cell(r[i]) for i in range(len(col_names))})
        response = HttpResponse(json.dumps(data, indent=2), content_type='application/json')
        response['Content-Disposition'] = f'attachment; filename="{clean_table}_export.json"'
        return response
    else:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(col_names)
        for r in raw_rows:
            writer.writerow([_serialize_cell(val) for val in r])
        response = HttpResponse(output.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{clean_table}_export.csv"'
        return response
