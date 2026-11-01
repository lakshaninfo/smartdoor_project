with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Strip <script> and </script>
js = content.replace('<script>', '').replace('</script>', '')

with open('scratch/scripts_full.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Wrote scratch/scripts_full.js")

