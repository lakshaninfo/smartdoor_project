with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1761, 1850):
    print(f"{i+1}: {lines[i]}", end="")

