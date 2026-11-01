with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('fetch(url)')
if pos != -1:
    print(text[pos:pos+1000])
