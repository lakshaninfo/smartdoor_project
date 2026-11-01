import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if any(k in l for k in ['.scene-3d', '#scene', 'scene-campus']):
        print(f'{i+1}: {l.strip()[:100]}')

