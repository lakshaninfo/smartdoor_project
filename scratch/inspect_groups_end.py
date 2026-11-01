import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('groups.forEach(group =>')
if idx != -1:
    end_groups = text.find('tableBody.innerHTML', idx)
    print(text[end_groups-200:end_groups+400])

