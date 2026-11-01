import subprocess

filepath = 'logger/templates/logger/includes/scripts.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

bad = 'const btn = document.getElementById( tn-scope-);'
good = "const btn = document.getElementById('btn-scope-' + s);"

if bad in text:
    text = text.replace(bad, good)
    print("Replaced bad token successfully!")
else:
    print("bad token not found directly!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

# Verify syntax with node --check
script_start = text.find('<script>') + 8
script_end = text.rfind('</script>')
js_code = text[script_start:script_end]

with open('temp_check.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

res = subprocess.run(['node', '--check', 'temp_check.js'], capture_output=True, text=True)
print('STDOUT:', res.stdout)
print('STDERR:', res.stderr)

