import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS tokens to :root and [data-theme="dark"]
root_tokens = """
    --ink: #1c1c1e;
    --ink2: #6c6c70;
    --sep: rgba(60,60,67,.14);
    --fill: rgba(118,118,128,.12);
    --g2: #00a63e;
"""

dark_tokens = """
    --ink: #fff;
    --ink2: #98989f;
    --sep: rgba(84,84,88,.5);
    --fill: rgba(118,118,128,.24);
    --g2: #30d158;
"""

if ':root {' in content and '--ink:' not in content:
    content = content.replace(':root {', ':root {' + root_tokens, 1)

if '[data-theme="dark"] {' in content and '--ink:' not in content:
    content = content.replace('[data-theme="dark"] {', '[data-theme="dark"] {' + dark_tokens, 1)

polished_css = """
/* ==========================================================================
   POLISHED APPLE INSET ACCESS CONTROL STYLES (LOGS, DEVICES, ACCOUNT)
   ========================================================================== */
.in-polished {
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
}
.ph {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12px;
    flex-wrap: wrap;
    margin: 4px 0 18px;
}
.ph h1 {
    font-size: 32px;
    line-height: 1.1;
    letter-spacing: -.02em;
    margin: 0;
    font-weight: 700;
    color: var(--ink, var(--text-primary));
}
.ph p {
    margin: 6px 0 0;
    color: var(--ink2, var(--text-secondary));
    font-size: 15px;
}
.tools {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 14px;
    align-items: center;
}
.search {
    flex: 1;
    min-width: 200px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--fill, rgba(118,118,128,.12));
    border-radius: 12px;
    padding: 0 12px;
    min-height: 44px;
    color: var(--ink2, var(--text-secondary));
}
.search input {
    flex: 1;
    border: 0;
    background: none;
    outline: none;
    font-size: 15px;
    min-width: 0;
    color: var(--ink, var(--text-primary));
}
.sel {
    min-height: 44px;
    border: 0;
    border-radius: 12px;
    background: var(--fill, rgba(118,118,128,.12));
    padding: 0 14px;
    font-size: 15px;
    color: var(--ink, var(--text-primary));
    cursor: pointer;
    outline: none;
}
.seg {
    display: flex;
    background: var(--fill, rgba(118,118,128,.12));
    border-radius: 10px;
    padding: 2px;
    gap: 2px;
    overflow-x: auto;
}
.seg button, .seg .seg-btn {
    flex: 1;
    border: 0;
    background: none;
    min-height: 36px;
    padding: 0 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--ink2, var(--text-secondary));
    white-space: nowrap;
    transition: background .2s, color .2s, box-shadow .2s;
    cursor: pointer;
}
.seg button[aria-selected="true"], .seg button.active, .seg .seg-btn.active {
    background: var(--card, #fff);
    color: var(--ink, #1c1c1e);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,.18);
}
[data-theme="dark"] .seg button[aria-selected="true"],
[data-theme="dark"] .seg button.active,
[data-theme="dark"] .seg .seg-btn.active {
    background: #636366 !important;
    color: #fff !important;
}
.inset {
    background: var(--card, #fff);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.lr + .lr, .row + .row {
    border-top: .5px solid var(--sep, rgba(60,60,67,.14));
}
.lh, .row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 64px;
    padding: 10px 16px;
    border: 0;
    background: none;
    text-align: left;
    cursor: pointer;
    color: var(--ink, var(--text-primary));
    transition: background .15s ease;
    box-sizing: border-box;
}
.lh:hover, button.row:hover, .row:hover {
    background: var(--fill, rgba(118,118,128,.08));
}
.lr.open {
    background: color-mix(in srgb, var(--blue, #007aff) 5%, transparent);
}
.ico {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    flex: none;
    background: color-mix(in srgb, var(--green, #34c759) 16%, transparent);
    color: var(--g2, #00a63e);
}
.ico.bad {
    background: color-mix(in srgb, var(--red, #ff3b30) 15%, transparent);
    color: var(--red, #ff3b30);
}
.ico.warn {
    background: color-mix(in srgb, var(--orange, #ff9500) 16%, transparent);
    color: var(--orange, #ff9500);
}
.m {
    flex: 1;
    min-width: 0;
}
.m b {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: var(--ink, var(--text-primary));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.m span {
    font-size: 13px;
    color: var(--ink2, var(--text-secondary));
}
.t {
    text-align: right;
    font-size: 13px;
    color: var(--ink2, var(--text-secondary));
    flex: none;
}
.t b {
    display: block;
    font-size: 15px;
    color: var(--ink, var(--text-primary));
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}
.pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
    color: var(--g2, #00a63e);
    background: color-mix(in srgb, var(--green, #34c759) 15%, transparent);
    flex: none;
}
.pill i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
}
.pill.bad {
    color: var(--red, #ff3b30);
    background: color-mix(in srgb, var(--red, #ff3b30) 14%, transparent);
}
.pill.blue {
    color: var(--blue, #007aff);
    background: color-mix(in srgb, var(--blue, #007aff) 14%, transparent);
}
.pill.gray {
    color: var(--ink2, var(--text-secondary));
    background: var(--fill, rgba(118,118,128,.14));
}
.ch {
    width: 14px;
    height: 14px;
    color: var(--ink2, var(--text-secondary));
    opacity: .6;
    transition: transform .25s ease;
    flex: none;
}
.open .ch {
    transform: rotate(90deg);
}
.det {
    padding: 4px 16px 18px 68px;
}
.facts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 14px;
}
.fact {
    background: var(--bg, #f2f2f7);
    border-radius: 12px;
    padding: 10px 12px;
}
.fact small {
    display: block;
    font-size: 12px;
    color: var(--ink2, var(--text-secondary));
    margin-bottom: 3px;
}
.fact b {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink, var(--text-primary));
}
.mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
}
.hl {
    font-size: 13px;
    color: var(--ink2, var(--text-secondary));
    font-weight: 600;
    margin: 0 0 6px;
}
.evs {
    max-height: 230px;
    overflow: auto;
    border-radius: 12px;
    background: var(--bg, #f2f2f7);
}
.ev {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    font-size: 13px;
    color: var(--ink, var(--text-primary));
}
.ev + .ev {
    border-top: .5px solid var(--sep, rgba(60,60,67,.14));
}
.ev span:nth-child(2) {
    flex: 1;
    font-variant-numeric: tabular-nums;
}
.d {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--green, #34c759);
    flex: none;
}
.d.bad {
    background: var(--red, #ff3b30);
}
.bat {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}
.bt {
    width: 24px;
    height: 12px;
    border: 1.5px solid currentColor;
    border-radius: 4px;
    padding: 1px;
    position: relative;
    opacity: .95;
}
.bt::after {
    content: "";
    position: absolute;
    right: -4px;
    top: 2px;
    width: 2px;
    height: 4px;
    background: currentColor;
    border-radius: 0 1px 1px 0;
}
.bt i {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: currentColor;
}
.b-ok { color: var(--g2, #00a63e); }
.b-mid { color: var(--orange, #ff9500); }
.b-low { color: var(--red, #ff3b30); }

.sg {
    display: inline-flex;
    align-items: flex-end;
    gap: 2px;
    height: 14px;
}
.sg i {
    width: 3px;
    border-radius: 1px;
    background: var(--sep, rgba(60,60,67,.2));
}
.sg i:nth-child(1) { height: 5px; }
.sg i:nth-child(2) { height: 9px; }
.sg i:nth-child(3) { height: 14px; }
.sg i.on { background: var(--ink2, #6c6c70); }

.foot {
    margin: 12px 6px 0;
    color: var(--ink2, var(--text-secondary));
    font-size: 13px;
}
.empty {
    padding: 56px 20px;
    text-align: center;
}
.empty .ring {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--fill, rgba(118,118,128,.12));
    display: grid;
    place-items: center;
    margin: 0 auto 14px;
    color: var(--ink2, var(--text-secondary));
}
.empty .ring svg, .empty .ring i {
    width: 28px;
    height: 28px;
}
.empty h3 {
    margin: 0 0 4px;
    font-size: 18px;
    color: var(--ink, var(--text-primary));
}
.empty p {
    margin: 0 0 18px;
    color: var(--ink2, var(--text-secondary));
    font-size: 15px;
}
.hub {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    margin-bottom: 12px;
}
.hub .m b { font-size: 17px; }
.note {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    border: 0;
    text-align: left;
    margin-bottom: 12px;
    padding: 12px 16px;
    border-radius: 16px;
    background: color-mix(in srgb, var(--orange, #ff9500) 14%, var(--card, #fff));
    cursor: pointer;
    color: var(--ink, var(--text-primary));
}
.note span {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
}
.grp {
    margin: 22px 0 8px 16px;
    font-size: 13px;
    color: var(--ink2, var(--text-secondary));
    font-weight: 600;
    letter-spacing: .02em;
}
.prof {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
}
.prof .av {
    width: 64px;
    height: 64px;
    font-size: 26px;
    border-radius: 50%;
    background: var(--blue, #007aff);
    color: #fff;
    display: grid;
    place-items: center;
    font-weight: 700;
    flex: none;
}
.prof h2 {
    margin: 0;
    font-size: 22px;
    color: var(--ink, var(--text-primary));
}
.prof p {
    margin: 2px 0 8px;
    color: var(--ink2, var(--text-secondary));
    font-size: 14px;
}
.link {
    border: 0;
    background: none;
    color: var(--blue, #007aff);
    font-size: 14px;
    font-weight: 600;
    min-height: 32px;
    cursor: pointer;
    padding: 0 4px;
}
.btn.soft {
    background: color-mix(in srgb, var(--blue, #007aff) 14%, transparent);
    color: var(--blue, #007aff);
}
.btn.soft:hover {
    background: color-mix(in srgb, var(--blue, #007aff) 22%, transparent);
}
@media (max-width: 860px) {
    .det { padding-left: 16px; }
    .facts { grid-template-columns: 1fr; }
    .lh .t { display: none; }
    .lh .pill { order: 3; }
    .ph h1 { font-size: 28px; }
}
"""

if '.in-polished' not in content:
    content += "\n" + polished_css
    print("Added polished CSS rules to header_styles.html")
else:
    print("Polished CSS already in header_styles.html")

with open('logger/templates/logger/includes/header_styles.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved header_styles.html successfully")

