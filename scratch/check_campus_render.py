with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'renderCampus3D' in line:
        print(f"Line {idx+1}: {line.strip()}")
        for j in range(max(0, idx-2), min(len(lines), idx+15)):
            print(f"  {j+1}: {lines[j]}", end="")
        print("\n" + "="*40)

