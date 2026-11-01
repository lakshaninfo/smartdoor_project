with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'([^\n]*\bcam\s*=[^\n]*)', text))
for m in matches:
    print(m.group(0).strip())

