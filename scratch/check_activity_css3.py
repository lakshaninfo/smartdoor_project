import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if '#view-activity-page' in line and idx > 6000:
        print(f"Line {idx+1}")
        for j in range(max(0, idx-5), min(len(lines), idx+60)):
            print(f"  {j+1}: {lines[j]}", end="")
        break

