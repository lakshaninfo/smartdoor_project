import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(13580, len(lines)):
    print(f"{i+1}: {lines[i]}", end="")

