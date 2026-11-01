import os

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith(('.html', '.js', '.py')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
                txt = fh.read()
            if 'db-row-modal' in txt or 'db-create-table-modal' in txt:
                print(f"{p}: found match")

