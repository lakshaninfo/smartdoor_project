import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'DOMContentLoaded' in line:
        print(f"DOMContentLoaded at line {idx+1}: {line.strip()}")
        # print next 10 lines
        for j in range(idx+1, min(len(lines), idx+15)):
            print(f"  {j+1}: {lines[j]}", end="")
        print("="*40)

