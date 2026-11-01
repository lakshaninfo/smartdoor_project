with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'selectBuildingFromCampus' in line or 'openB' in line:
        print(f"Line {idx+1}: {line.strip()[:100]}")
        for j in range(max(0, idx - 5), min(len(lines), idx + 20)):
            print(f"  {j+1}: {lines[j]}", end='')

