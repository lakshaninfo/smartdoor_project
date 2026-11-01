with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('Stage Camera Presets on Dashboard')
print(text[idx-50:idx+600])

