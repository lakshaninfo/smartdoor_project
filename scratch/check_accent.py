with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'([^\n]*--accent:[^\n]*)', text))
for m in matches:
    print(m.group(0).strip())

