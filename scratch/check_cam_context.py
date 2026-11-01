with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('const cam = {')
print(text[max(0, idx-200):idx+800])

