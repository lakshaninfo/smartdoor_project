import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if '#view-activity-page' in line and idx > 7000:
        print(f"Line {idx+1}: {line.strip()[:80]}")

