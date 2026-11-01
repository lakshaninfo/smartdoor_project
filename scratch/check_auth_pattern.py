with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find performRegister through performLogout
pattern = r'function\s+performRegister\s*\(\)\s*\{[\s\S]*?function\s+performLogout\s*\(\)\s*\{[\s\S]*?showSplash\(\);[\s\S]*?\}'
match = re.search(pattern, text)
if match:
    print("Found performRegister -> performLogout match:")
    print(match.group(0)[:200])
    print("...")
    print(match.group(0)[-200:])
else:
    print("Pattern not matched directly")

