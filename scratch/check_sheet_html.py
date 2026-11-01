with open(r'c:\Users\DELL\Downloads\SmartDoor – Polished Access Control App.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('data-act="dev"')
if pos != -1:
    print(text[pos-100:pos+1200])
