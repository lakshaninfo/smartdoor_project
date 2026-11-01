with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'function initCampusSystem' in line:
        for j in range(idx, min(len(lines), idx+40)):
            print(f"{j+1}: {lines[j]}", end="")
        break

