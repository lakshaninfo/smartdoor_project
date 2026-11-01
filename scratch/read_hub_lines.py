with open('Main_Hub_Unit/Main_Hub_Unit.ino', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for j in range(85, 135):
    if j < len(lines):
        print(f"  {j+1}: {lines[j]}", end='')

