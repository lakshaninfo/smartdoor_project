with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if idx > 12970 and ('modal' in line.lower() or 'openinsert' in line.lower() or 'opencreate' in line.lower()):
        print(f"{idx+1}: {line.strip()[:100]}")

