with open('logger/views.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add Count import if missing
if 'from django.db.models import Count' not in text:
    text = text.replace('from .models import DoorLog', 'from .models import DoorLog\nfrom django.db.models import Count')

# Replace dashboard, live_status_api, full_logs_api
old_section = '''def dashboard(request):
    all_logs = DoorLog.objects.order_by('-timestamp')
    latest_doors = {}
    history = []

    # Filter for the live dashboard and history
    for log in all_logs:
        if log.mac_address not in latest_doors:
            latest_doors[log.mac_address] = log
        if len(history) < 10:
            history.append(log)

    is_mobile = is_mobile_user_agent(request)

    # Unified responsive dashboard driven by Native CSS Media Queries
    return render(request, 'logger/dashboard.html', {
        'latest_doors': latest_doors.values(),
        'history': history,
        'user': request.user,
        'is_mobile': is_mobile
    })

def live_status_api(request):
    all_logs = DoorLog.objects.order_by('-timestamp')
    latest_doors = {}
    for log in all_logs:
        if log.mac_address not in latest_doors:
            local_ts = timezone.localtime(log.timestamp) if timezone.is_aware(log.timestamp) else log.timestamp
            latest_doors[log.mac_address] = {
                'mac_address': log.mac_address,
                'door_name': log.door_name,
                'door_state': log.door_state,
                'battery': getattr(log, 'battery', 100),
                'timestamp': local_ts.strftime("%Y-%m-%d %H:%M:%S")
            }
    return JsonResponse(list(latest_doors.values()), safe=False)

def full_logs_api(request):
    mac = request.GET.get('mac')
    if mac:
        logs = DoorLog.objects.filter(mac_address=mac).order_by('-timestamp')[:100]
    else:
        logs = DoorLog.objects.order_by('-timestamp')[:100]
    
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
    return JsonResponse(data, safe=False)'''

new_section = '''def dashboard(request):
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
    return response'''

# Replace database_devices_api
old_devices = '''def database_devices_api(request):
    all_logs = DoorLog.objects.order_by('-timestamp')
    devices = {}
    
    for log in all_logs:
        mac = log.mac_address
        if mac not in devices:
            local_ts = timezone.localtime(log.timestamp) if timezone.is_aware(log.timestamp) else log.timestamp
            devices[mac] = {
                'mac_address': mac,
                'door_name': log.door_name,
                'last_state': log.door_state,
                'last_battery': getattr(log, 'battery', 100),
                'last_polled': local_ts.strftime("%Y-%m-%d %H:%M:%S"),
                'total_logs_count': 1
            }
        else:
            devices[mac]['total_logs_count'] += 1
            
    return JsonResponse({
        'devices': list(devices.values()),
        'is_admin': request.user.is_authenticated and request.user.is_superuser
    })'''

new_devices = '''def database_devices_api(request):
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
    })'''

if old_section in text and old_devices in text:
    text = text.replace(old_section, new_section)
    text = text.replace(old_devices, new_devices)
    with open('logger/views.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully optimized logger/views.py queries!")
else:
    print("Could not find exact text match, checking substrings...")
    if old_section not in text:
        print("old_section missing")
    if old_devices not in text:
        print("old_devices missing")

