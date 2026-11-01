import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if ':root' in line:
        print(f"Line {idx+1}")
        for j in range(idx, min(len(lines), idx+30)):
            print(f"  {j+1}: {lines[j]}", end="")
        break

