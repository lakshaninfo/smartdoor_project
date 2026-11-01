import os, re

def audit():
    templates_dir = 'logger/templates/logger'
    html_files = {}
    for root, dirs, files in os.walk(templates_dir):
        for f in files:
            if f.endswith('.html'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as fh:
                    html_files[f] = fh.read()

    all_html = '\n'.join(html_files.values())

    with open('scratch/scripts_test.js', 'r', encoding='utf-8') as f:
        js_code = f.read()

    # 1. Check onclick handlers in HTML
    onclicks = re.findall(r'onclick=[\"\']([a-zA-Z0-9_$]+)\s*\(', all_html)
    print(f'Unique onclick handlers found: {len(set(onclicks))}')
    missing_funcs = []
    for fn in set(onclicks):
        pattern = r'(?:function\s+' + re.escape(fn) + r'\b|window\.' + re.escape(fn) + r'\s*=|const\s+' + re.escape(fn) + r'\s*=|let\s+' + re.escape(fn) + r'\s*=|var\s+' + re.escape(fn) + r'\s*=)'
        if not re.search(pattern, js_code):
            missing_funcs.append(fn)

    print(f'Missing onclick functions in JS: {missing_funcs}')

    # 2. Check getElementById in JS
    get_ids = re.findall(r'getElementById\([\'\"]([a-zA-Z0-9_\-]+)[\'\"]\)', js_code)
    print(f'Unique getElementById calls: {len(set(get_ids))}')

    html_ids = set(re.findall(r'id=[\"\']([a-zA-Z0-9_\-]+)[\"\']', all_html))
    js_ids = set(re.findall(r'id=[\"\\\']([a-zA-Z0-9_\-]+)[\"\\\']', js_code))
    all_known_ids = html_ids.union(js_ids)

    missing_ids = []
    for gid in sorted(set(get_ids)):
        if gid not in all_known_ids:
            missing_ids.append(gid)

    print(f'IDs queried with getElementById but not in templates or JS ({len(missing_ids)}):')
    for m in missing_ids:
        print(f'  - {m}')

    # 3. Check fetch URLs in JS vs logger/urls.py
    fetch_urls = set(re.findall(r'fetch\([\'\"`](/api/[^?\'\"`$]+)', js_code))
    print(f'\nUnique API fetch URLs: {len(fetch_urls)}')
    for u in sorted(fetch_urls):
        print(f'  Fetch URL: {u}')

if __name__ == '__main__':
    audit()

