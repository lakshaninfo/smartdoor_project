with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''/* ==========================================================================
   POLISHED APPLE INSET ACCESS CONTROL STYLES (LOGS, DEVICES, ACCOUNT)
   ========================================================================== */
.in-polished {'''

replacement = '''/* ==========================================================================
   POLISHED APPLE INSET ACCESS CONTROL STYLES (LOGS, DEVICES, ACCOUNT)
   ========================================================================== */
:root {
    --bg: #f2f2f7;
    --card: #ffffff;
    --ink: #1c1c1e;
    --ink2: #6c6c70;
    --sep: rgba(60,60,67,.14);
    --fill: rgba(118,118,128,.12);
    --blue: #007aff;
    --red: #ff3b30;
    --green: #34c759;
    --orange: #ff9500;
    --g2: #00a63e;
}

[data-theme="dark"], :root[data-theme="dark"], html[data-theme="dark"] {
    --bg: #000000;
    --card: #1c1c1e;
    --ink: #ffffff;
    --ink2: #98989f;
    --sep: rgba(84,84,88,.5);
    --fill: rgba(118,118,128,.24);
    --blue: #0a84ff;
    --red: #ff453a;
    --green: #30d158;
    --orange: #ff9f0a;
    --g2: #30d158;
}

.in-polished {'''

if target in text:
    text = text.replace(target, replacement)
    with open('logger/templates/logger/includes/header_styles.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully added Apple Inset CSS theme variables!")
else:
    print("Target not found!")

