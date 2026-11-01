with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'function $(' in line or 'const $ =' in line or 'let $ =' in line or 'var $ =' in line:
        print(f"Line {idx+1}: {line.strip()}")

