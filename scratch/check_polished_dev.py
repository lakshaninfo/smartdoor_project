with open(r'c:\Users\DELL\Downloads\SmartDoor – Polished Access Control App.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\.[a-zA-Z0-9_\-,\s\.:>]+?\{[^}]+?\})', text)
for m in matches:
    if '.row' in m or '.m' in m:
        print(m)
