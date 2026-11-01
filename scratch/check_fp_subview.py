with open('logger/templates/logger/includes/view_floorplan.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(25, 75):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end="")

