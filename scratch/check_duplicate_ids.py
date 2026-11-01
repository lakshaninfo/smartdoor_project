import os, re
from collections import Counter

templates_dir = 'logger/templates/logger'
html_files = {}
for root, dirs, files in os.walk(templates_dir):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fh:
                html_files[f] = fh.read()

# Check duplicate IDs across templates
all_ids_with_files = []
for fname, content in html_files.items():
    ids = re.findall(r'id=[\"\']([a-zA-Z0-9_\-]+)[\"\']', content)
    for i in ids:
        all_ids_with_files.append((i, fname))

counts = Counter([i for i, f in all_ids_with_files])
duplicates = {i: c for i, c in counts.items() if c > 1}
print(f"Duplicate IDs count: {len(duplicates)}")
for i, c in sorted(duplicates.items(), key=lambda x: -x[1])[:20]:
    files = [f for id_val, f in all_ids_with_files if id_val == i]
    print(f"  {i}: {c} times in {set(files)}")

