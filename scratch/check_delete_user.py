with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if '/api/users/delete' in line:
        print(f"Line {idx+1}: {line.strip()[:100]}")
        for j in range(max(0, idx - 10), min(len(lines), idx + 25)):
            print(f"  {j+1}: {lines[j]}", end='')

