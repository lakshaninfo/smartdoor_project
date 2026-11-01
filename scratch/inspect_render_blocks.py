import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Check fetchDoorHistoryLogs groups.forEach
idx1 = text.find('groups.forEach(group =>')
if idx1 != -1:
    print('Found groups.forEach at', idx1)
    print(text[idx1:idx1+1800])

# 2. Check loadDatabaseDevicesList devices.forEach
idx2 = text.find('devices.forEach(dev =>')
if idx2 != -1:
    print('Found devices.forEach at', idx2)
    print(text[idx2:idx2+1800])

