with open('logger/views.py', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('def db_table_data_api')
if pos != -1:
    print(text[pos:pos+1500])

