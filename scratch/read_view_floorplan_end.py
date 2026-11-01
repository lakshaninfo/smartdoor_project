with open('logger/templates/logger/includes/view_floorplan.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(200, 320):
    if j < len(lines):
        print(f"  {j+1}: {lines[j]}", end='')

