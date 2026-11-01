with open(r'c:\Users\DELL\Downloads\SmartDoor – Polished Access Control App.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find(':root')
if pos != -1:
    print(text[pos:pos+600])

pos_dark = text.find('[data-theme="dark"]')
if pos_dark != -1:
    print(text[pos_dark:pos_dark+600])

