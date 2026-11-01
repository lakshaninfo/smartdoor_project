with open('core/settings.py', 'r', encoding='utf-8') as f:
    text = f.read()

target = "STATIC_URL = 'static/'"
replacement = "STATIC_URL = 'static/'\nSTATICFILES_DIRS = [BASE_DIR / 'static']"

if target in text and 'STATICFILES_DIRS' not in text:
    text = text.replace(target, replacement)
    with open('core/settings.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully added STATICFILES_DIRS to core/settings.py!")
else:
    print("Already configured or target not found.")
