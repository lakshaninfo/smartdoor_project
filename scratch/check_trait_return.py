import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('SmartDoorTraitCollection =')
if idx != -1:
    end_idx = text.find('})();', idx)
    print(text[end_idx-300:end_idx+5])

