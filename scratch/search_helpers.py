import os

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith(('.html', '.js', '.py')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fh:
                txt = fh.read()
            for fn in ['formatLogTimestampDetails', 'groupAllLogsByDoor', 'getRelativeTimeString']:
                if f'function {fn}' in txt or f'const {fn} =' in txt or f'let {fn} =' in txt:
                    print(f"Found definition of {fn} in {p}")

