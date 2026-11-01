with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('if (autoCampus && !dragCampus)')
print(text[idx-200:idx+600])

