with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(10245, 10270):
    if j < len(lines):
        print(f"  {j+1}: {lines[j]}", end='')

