with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\[data-theme=\"?dark\"?\][^{]*\{[^}]*\})', text)
print(f"Found {len(matches)} data-theme dark rules")
for m in matches[:5]:
    print(m)

