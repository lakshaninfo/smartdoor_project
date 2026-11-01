with open('logger/templates/logger/includes/view_floorplan.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('fp-camera-bar')
print(text[max(0, idx-300):idx+1200])

