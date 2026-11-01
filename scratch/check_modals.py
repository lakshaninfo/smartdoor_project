with open('logger/templates/logger/includes/modals.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'id="([^"]*modal[^"]*)"', text, re.IGNORECASE)
print("Modals in modals.html:", matches)
