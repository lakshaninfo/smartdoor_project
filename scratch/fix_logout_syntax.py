with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("window.performLogout = performLogout;);\n\n    }", "window.performLogout = performLogout;\n")
text = text.replace("window.performLogout = performLogout;);", "window.performLogout = performLogout;")

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(text)

# Also update scratch/scripts_test.js
js = text
if '<script>' in js:
    js = js.split('<script>', 1)[1]
if '</script>' in js:
    js = js.rsplit('</script>', 1)[0]

with open('scratch/scripts_test.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Fixed performLogout trailing syntax.")

