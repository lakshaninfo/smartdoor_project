import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r'c:\Users\DELL\Downloads\SmartDoor – Polished Access Control App.html'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

print('Length of file:', len(text))
lines = text.splitlines()
print('Total lines:', len(lines))

# Print first 100 lines
for i in range(min(80, len(lines))):
    print(f'{i+1}: {lines[i]}')

