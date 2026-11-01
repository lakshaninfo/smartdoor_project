import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(26045, 26085):
    print(f"{i+1}: {lines[i]}", end="")

