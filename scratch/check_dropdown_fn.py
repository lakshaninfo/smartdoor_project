with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
for fn in ['toggleCustomDropdown', 'filterActivityTable', 'setDateFilter']:
    print(f"=== {fn} ===")
    matches = [line.strip() for line in text.split('\n') if f'function {fn}' in line or f'{fn} =' in line]
    print("Found:", matches)

