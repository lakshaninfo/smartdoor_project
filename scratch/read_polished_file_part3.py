import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r'c:\Users\DELL\Downloads\SmartDoor – Polished Access Control App.html'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

lines = text.splitlines()
for i in range(118, 198):
    print(f'{i+1}: {lines[i]}')

