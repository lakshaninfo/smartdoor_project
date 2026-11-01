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

with open('scratch/scripts_test.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

# Find querySelector('#...')
q_ids = set(re.findall(r'querySelector(?:All)?\([\'\"]#([a-zA-Z0-9_\-]+)', js_code))
print(f"Total querySelector(#id) queried: {len(q_ids)}")

html_ids = set(re.findall(r'id=[\"\']([a-zA-Z0-9_\-]+)[\"\']', all_html))
js_ids = set(re.findall(r'id=[\"\']([a-zA-Z0-9_\-]+)[\"\']', js_code))
known_ids = html_ids.union(js_ids)

missing_qids = []
for qid in sorted(q_ids):
    if qid not in known_ids:
        missing_qids.append(qid)

print(f"Missing querySelector IDs ({len(missing_qids)}): {missing_qids}")

