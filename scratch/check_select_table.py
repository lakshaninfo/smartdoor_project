with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(12808, 12870):
    print(f"{i+1}: {lines[i]}", end="")

