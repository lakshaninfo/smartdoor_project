with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Lines around 8150-8175:")
for j in range(8148, 8175):
    if j < len(lines):
        print(f"  {j+1}: {lines[j]}", end='')

print("\nLines around 8680-8700:")
for j in range(8680, 8700):
    if j < len(lines):
        print(f"  {j+1}: {lines[j]}", end='')

