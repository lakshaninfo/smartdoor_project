import subprocess

filepath = 'logger/templates/logger/includes/scripts.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace any occurrence of \x08tn-scope-
text = text.replace('\x08tn-scope-', "'btn-scope-' + s")
text = text.replace('document.getElementById(\x08tn-scope-);', "document.getElementById('btn-scope-' + s);")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

# Check syntax
script_start = text.find('<script>') + 8
script_end = text.rfind('</script>')
js_code = text[script_start:script_end]

with open('temp_check.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

res = subprocess.run(['node', '--check', 'temp_check.js'], capture_output=True, text=True)
if res.returncode == 0:
    print("SUCCESS! Node syntax check PASSED with 0 errors!")
else:
    print('STDOUT:', res.stdout)
    print('STDERR:', res.stderr)

