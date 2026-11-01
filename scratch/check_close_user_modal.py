with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('closeUserModal')
if pos != -1:
    print(text[pos-100:pos+300])

