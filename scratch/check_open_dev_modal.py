with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function openDeviceDetailModal')
if pos != -1:
    print(text[pos+3200:pos+4200])
