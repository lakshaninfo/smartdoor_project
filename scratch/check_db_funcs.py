with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if idx > 12570 and (line.strip().startswith('function ') or line.strip().startswith('async function ')):
        print(f"Line {idx+1}: {line.strip()[:80]}")

