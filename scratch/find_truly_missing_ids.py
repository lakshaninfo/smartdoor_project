import os, re

templates_dir = 'logger/templates/logger'
html_files = {}
for root, dirs, files in os.walk(templates_dir):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fh:
                html_files[f] = fh.read()

all_html = '\n'.join(html_files.values())
all_html_ids = set(re.findall(r'id=[\"\']([a-zA-Z0-9_\-]+)[\"\']', all_html))

with open('scratch/scripts_test.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

# Also find IDs created inside JS strings, e.g., id="foo" or id='foo'
js_created_ids = set(re.findall(r'id=[\"\']([a-zA-Z0-9_\-]+)[\"\']', js_code))
total_known = all_html_ids.union(js_created_ids)

# Find getElementById calls
get_ids = set(re.findall(r'getElementById\([\'\"]([a-zA-Z0-9_\-]+)[\'\"]\)', js_code))
# Also $('id') helper calls
helper_ids = set(re.findall(r'\$\([\'\"]([a-zA-Z0-9_\-]+)[\'\"]\)', js_code))
all_queried_ids = get_ids.union(helper_ids)

truly_missing = []
for qid in sorted(all_queried_ids):
    if qid not in total_known:
        truly_missing.append(qid)

print(f"Total queried IDs: {len(all_queried_ids)}")
print(f"Truly missing IDs ({len(truly_missing)}):")
for m in truly_missing:
    # find which line in JS queries this
    lines = js_code.split('\n')
    found_lines = [i+1 for i, l in enumerate(lines) if f"'{m}'" in l or f'"{m}"' in l]
    print(f"  - {m}: lines {found_lines}")

