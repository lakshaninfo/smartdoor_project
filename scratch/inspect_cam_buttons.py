with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
funcs = ['setCameraView', 'toggleAutoRotate', 'setCampusCameraView', 'toggleCampusAutoRotate']
for fn in funcs:
    matches = list(re.finditer(rf'function {fn}\b', text))
    print(f'=== {fn}: found {len(matches)} ===')
    for m in matches:
        idx = m.start()
        print(text[idx:idx+800])
        print('-'*40)

