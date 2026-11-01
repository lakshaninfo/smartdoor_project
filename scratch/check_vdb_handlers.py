import re

with open('logger/templates/logger/includes/view_database.html', 'r', encoding='utf-8') as f:
    vdb_content = f.read()

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    scripts_content = f.read()

# Find all onclick, oninput, onchange etc. in view_database.html
handlers = re.findall(r'on\w+="([^"]+)"', vdb_content)
print("Event handlers in view_database.html:")
unique_fns = set()
for h in handlers:
    fn_name = h.split('(')[0].strip()
    unique_fns.add(fn_name)
    print(f"  {h} -> {fn_name}")

print("\nExistence in scripts.html:")
for fn in sorted(unique_fns):
    found = fn in scripts_content
    print(f"  {fn}: {'FOUND' if found else 'MISSING'}")

