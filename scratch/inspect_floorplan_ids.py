with open('logger/templates/logger/includes/view_floorplan.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re
matches = re.findall(r'id="([^"]+)"', content)
print('IDs in view_floorplan.html:')
for m in matches:
    print('  -', m)

