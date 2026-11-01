with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('POLISHED APPLE INSET')
if pos != -1:
    section = text[pos:]
    print(":root in polished section:", ":root" in section)
    print("data-theme in polished section:", "data-theme" in section)
    if ":root" in section:
        p2 = section.find(":root")
        print(section[p2:p2+300])
