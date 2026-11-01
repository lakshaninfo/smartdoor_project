import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/view_devices.html', 'r', encoding='utf-8') as f:
    print(f.read())

