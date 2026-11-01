import sys
import re

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    content = f.read()

for cls in ['stats', 'stat', 'ringw', 'chart', 'col']:
    matches = list(re.finditer(r'(^|[^\w#.-])\.' + cls + r'\s*\{', content))
    print(f".{cls} {{ standalone: {len(matches)} occurrences")

