import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("header_styles.html length:", len(content))
print("Last 1000 characters:")
print(content[-1000:])

