with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("First 30 lines:")
for i in range(min(30, len(lines))):
    print(f"{i+1}: {lines[i]}", end="")

print("\nLast 30 lines:")
for i in range(max(0, len(lines)-30), len(lines)):
    print(f"{i+1}: {lines[i]}", end="")

