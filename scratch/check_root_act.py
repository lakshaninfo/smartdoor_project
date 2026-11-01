import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re
matches = re.findall(r'--act-[\w-]+', content)
print("Matches in header_styles.html:", set(matches))
print("Is --act- in :root?", ':root' in content and '--act-green' in content[:2000])

