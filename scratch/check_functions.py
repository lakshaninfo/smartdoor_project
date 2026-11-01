with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for term in ['UserModalMode', 'selectActivityDoorFilter', 'DoorFilter', 'exportLogs', 'toggleDoorLog', 'Expansion', 'performLogin', 'openUserModal']:
    matches = re.findall(r'.{0,40}' + re.escape(term) + r'.{0,40}', text)
    print(f"=== Term: {term} (found {len(matches)}) ===")
    for m in matches[:5]:
        print("  ", m.strip())

