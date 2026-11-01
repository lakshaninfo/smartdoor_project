with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('Floor Plan 3D Camera Transformation Engine')
print(text[idx+2500:idx+5500])

