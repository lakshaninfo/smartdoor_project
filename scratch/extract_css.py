import sys
sys.stdout.reconfigure(encoding='utf-8')

path = r'c:\Users\DELL\Downloads\SmartDoor – Polished Access Control App.html'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Extract <style> ... </style>
s_start = text.find('<style>')
s_end = text.find('</style>')
print('CSS length:', s_end - s_start)
css = text[s_start+7:s_end]

# Print non-sidebar CSS
for rule in css.split('}'):
    rule = rule.strip()
    if rule and not any(k in rule for k in ['.nav', '.app', '.brand', '.ni']):
        print(rule + '}')

