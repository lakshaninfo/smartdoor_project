import re

with open('logger/templates/logger/includes/view_database.html', 'r', encoding='utf-8') as f:
    db_html = f.read()

with open('scratch/scripts_test.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

# 1. Onclick handlers in view_database.html
onclicks = set(re.findall(r'onclick=[\"\']([a-zA-Z0-9_$]+)\s*\(', db_html))
print("Onclick handlers in view_database.html:", onclicks)
for fn in onclicks:
    found = re.search(r'(?:function\s+' + re.escape(fn) + r'\b|window\.' + re.escape(fn) + r'\s*=)', js_code)
    if not found:
        print(f"  MISSING ONCLICK: {fn}")
    else:
        print(f"  OK: {fn}")

# 2. Check all IDs referenced in DB studio functions
db_js_section = js_code[js_code.find('initDatabaseStudio'):]
get_ids = set(re.findall(r'getElementById\([\'\"]([a-zA-Z0-9_\-]+)[\'\"]\)', db_js_section))
print(f"\nTotal getElementById in DB JS: {len(get_ids)}")

html_ids = set(re.findall(r'id=[\"\']([a-zA-Z0-9_\-]+)[\"\']', db_html))
js_ids = set(re.findall(r'id=[\"\\\']([a-zA-Z0-9_\-]+)[\"\\\']', js_code))
known_ids = html_ids.union(js_ids)

missing = []
for gid in sorted(get_ids):
    if gid not in known_ids:
        missing.append(gid)

print(f"Missing IDs in DB studio: {missing}")

