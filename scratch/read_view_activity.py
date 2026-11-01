import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/view_activity.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("view_activity.html contents:")
print(content[:3000])

