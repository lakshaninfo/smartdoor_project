with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx in range(9840, min(len(lines), 9940)):
    print(f"{idx+1}: {lines[idx]}", end="")

