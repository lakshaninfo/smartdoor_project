import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/topbar.html', 'r', encoding='utf-8') as f:
    text = f.read()

print(text)

