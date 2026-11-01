with open('logger/templates/logger/includes/view_floorplan.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'<button[^>]+(?:Isometric|Auto-rotate|Top|Side)[^>]*>[\s\S]*?</button>', text, re.IGNORECASE))
for m in matches:
    print(m.group(0))
    print('='*40)

