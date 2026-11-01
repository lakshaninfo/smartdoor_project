import sys
sys.stdout.reconfigure(encoding='utf-8')

for name in ['view_logs.html', 'view_devices.html', 'view_account.html']:
    path = f'logger/templates/logger/includes/{name}'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f'=== {name} (length: {len(content)}) ===')
    print('\n'.join(content.splitlines()[:30]))
    print('...')

