with open('logger/views.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'DoorLog.objects' in line or 'def ' in line:
        print(f"L{i+1}: {line.strip()}")

