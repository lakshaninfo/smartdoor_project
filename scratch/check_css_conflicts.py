import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    text = f.read()

for cls in ['.inset', '.lr', '.lh', '.facts', '.fact', '.bat', '.bt', '.sg', '.prof', '.hub', '.ph']:
    print(cls, 'in header_styles:', cls + ' ' in text or cls + '{' in text)

