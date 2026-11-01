with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'([^\n]*\bauto\b[^\n]*)', text))
print(f'Total matches: {len(matches)}')
for m in matches[:30]:
    line = m.group(0).strip()
    if not line.startswith('//') and not 'autocomplete' in line and not 'overflow' in line:
        print(' ', line)

