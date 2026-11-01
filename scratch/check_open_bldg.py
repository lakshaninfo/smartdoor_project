with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'openBuildingFromCampus' in line:
        print(f"Line {idx+1}: {line.strip()}")
        for j in range(idx, min(len(lines), idx + 50)):
            print(f"  {j+1}: {lines[j]}", end='')
        break

