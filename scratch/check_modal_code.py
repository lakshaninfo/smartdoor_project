with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'openUserModal' in line:
        print(f"Found openUserModal at line {idx+1}")
        for j in range(max(0, idx - 10), min(len(lines), idx + 60)):
            print(f"{j+1}: {lines[j]}", end='')
        break

