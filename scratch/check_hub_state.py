with open('Main_Hub_Unit/Main_Hub_Unit.ino', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
matches = re.findall(r'.{0,50}state.{0,50}', text)
for m in matches[:15]:
    if 'cloud' in m or 'post' in m.lower() or 'log' in m.lower():
        print(m.strip())

