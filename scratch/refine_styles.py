import os

header_styles_path = r'logger/templates/logger/includes/header_styles.html'
with open(header_styles_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Refine #side to top: 56px and max-height calc(100% - 70px)
old_side = '''#side {
    right: 14px;
    top: 14px;
    width: 260px;
    padding: 14px;
    max-height: calc(100% - 28px);
    overflow: auto;
}'''

new_side = '''#side {
    right: 14px;
    top: 56px;
    width: 260px;
    padding: 14px;
    max-height: calc(100% - 70px);
    overflow: auto;
}'''

if old_side in text:
    text = text.replace(old_side, new_side)

# Refine .bc style
old_bc = '''.bc {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 5px 10px;
    color: var(--ink);
}
.bc span {
    color: var(--mute);
    font-weight: 500;
}
.bc b {
    padding: 2px 6px;
}'''

new_bc = '''.bc {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 700;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 5px 12px;
    color: var(--ink);
    white-space: nowrap;
}
.bc span {
    color: var(--mute);
    font-weight: 500;
    font-size: 11px;
    margin: 0 2px;
}
.bc b {
    padding: 1px 4px;
}'''

if old_bc in text:
    text = text.replace(old_bc, new_bc)

with open(header_styles_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated side & bc styling successfully!')

