with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'setViewMode(' in line:
        print(f"Line {idx+1}: {line.strip()}")

