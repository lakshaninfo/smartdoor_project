import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Inspect fetchDoorHistoryLogs start to end of groups
idx = text.find('groups.forEach(group =>')
end_idx = text.find('if (tableBody) tableBody.innerHTML = rowsHtml;', idx)
print('Groups length:', end_idx - idx)

# Inspect loadDatabaseDevicesList devices.forEach
idx2 = text.find('devices.forEach(dev =>')
end_idx2 = text.find('container.innerHTML = html;', idx2)
print('Devices length:', end_idx2 - idx2)

