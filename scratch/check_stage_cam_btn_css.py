with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'([^\n\{]*stage-cam-btn[^\n\{]*\{[\s\S]*?\})', text))
for m in matches:
    print(m.group(0))
    print('='*40)

