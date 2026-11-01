import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'theme', text, re.I)]
print('Theme matches count:', len(matches))
for idx in matches[:10]:
    start = max(0, idx - 20)
    end = min(len(text), idx + 60)
    print(repr(text[start:end]))

