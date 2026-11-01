import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('SmartDoorTraitCollection')
if idx != -1:
    print('Found SmartDoorTraitCollection at index', idx)
    print(text[idx:idx+900])

