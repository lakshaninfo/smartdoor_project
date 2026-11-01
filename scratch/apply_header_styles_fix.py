import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    content = f.read()

root_vars = """
        /* Apple Activity Analytics Global Design System Tokens */
        --act-bg: #f2f2f7;
        --act-card: #ffffff;
        --act-ink: #1c1c1e;
        --act-ink2: #6c6c70;
        --act-sub: #86868b;
        --act-sep: rgba(60, 60, 67, 0.14);
        --act-fill: rgba(118, 118, 128, 0.12);
        --act-blue: #007aff;
        --act-red: #ff3b30;
        --act-green: #34c759;
        --act-orange: #ff9500;
        --act-bar: rgba(0, 122, 255, 0.22);
"""

dark_vars = """
    [data-theme="dark"] {
        --act-bg: #000000;
        --act-card: #1c1c1e;
        --act-ink: #ffffff;
        --act-ink2: #98989f;
        --act-sub: #98989f;
        --act-sep: rgba(84, 84, 88, 0.5);
        --act-fill: rgba(118, 118, 128, 0.24);
        --act-blue: #0a84ff;
        --act-red: #ff453a;
        --act-green: #30d158;
        --act-orange: #ff9f0a;
        --act-bar: rgba(10, 132, 255, 0.28);
    }
"""

global_act_styles = """
    /* ============================================================
     * Global Standalone Activity Analytics Classes (.stats, .stat, .ringw, .chart, .col)
     * ============================================================ */
    .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 8px;
    }

    .stat {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .stat small {
        display: block;
        color: var(--act-ink2);
        font-size: 13px;
        margin-bottom: 4px;
        font-weight: 500;
        letter-spacing: -0.01em;
    }

    .stat b {
        font-size: 40px;
        letter-spacing: -0.03em;
        line-height: 1;
        font-variant-numeric: tabular-nums;
        color: var(--act-ink);
        font-weight: 700;
    }

    .stat.r b {
        color: var(--act-orange);
    }

    .ringw {
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
    }

    .ringw svg {
        width: 46px;
        height: 46px;
        transform: rotate(-90deg);
        flex: none;
    }

    .ringw circle {
        fill: none;
        stroke-width: 6;
        stroke-linecap: round;
    }

    .chart {
        display: flex;
        align-items: flex-end;
        gap: 6px;
        height: 190px;
        position: relative;
        padding-top: 24px;
    }

    .col {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        gap: 6px;
        background: none;
        border: 0;
        padding: 0;
        cursor: pointer;
        font: inherit;
        color: var(--act-ink2);
        min-width: 0;
    }

    .bar {
        width: 100%;
        max-width: 34px;
        border-radius: 8px;
        background: var(--act-bar);
        transition: height 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.2s;
        min-height: 4px;
        position: relative;
    }

    .col.on .bar {
        background: var(--act-blue);
    }

    .col:hover .bar {
        background: color-mix(in srgb, var(--act-blue) 60%, transparent);
    }

    .col.on:hover .bar {
        background: var(--act-blue);
    }

    .col .v {
        font-size: 13px;
        font-weight: 700;
        color: var(--act-ink);
        opacity: 0;
        transition: opacity 0.2s;
        font-variant-numeric: tabular-nums;
        height: 16px;
    }

    .col.on .v {
        opacity: 1;
    }

    .col .t {
        font-size: 12px;
        font-weight: 500;
        color: var(--act-ink2);
        opacity: 0.55;
        transition: opacity 0.2s, color 0.2s;
        height: 16px;
    }

    .col.show .t,
    .col.on .t {
        opacity: 1;
    }

    .col.on .t {
        color: var(--act-ink);
        font-weight: 700;
    }

    .insight {
        color: var(--act-ink2);
        font-size: 13px;
        margin: 16px 0 0;
        line-height: 1.45;
    }

    .insight b {
        color: var(--act-ink);
        font-weight: 600;
    }
"""

# Insert root_vars into :root
if '--act-green: #34c759;' not in content[:3000]:
    content = content.replace(':root {', ':root {' + root_vars, 1)
    print("Added --act-* tokens into :root")

# Insert dark_vars after :root block
if '[data-theme="dark"] {' not in content[:5000]:
    # Insert right after the closing brace of the main :root declaration
    root_end = content.find('}', content.find(':root {'))
    if root_end != -1:
        content = content[:root_end+1] + "\n" + dark_vars + "\n" + content[root_end+1:]
        print("Added dark theme tokens")

# Append global_act_styles before </style>
if '.stat {' not in content:
    style_end = content.rfind('</style>')
    if style_end != -1:
        content = content[:style_end] + "\n" + global_act_styles + "\n" + content[style_end:]
        print("Added global standalone Activity Analytics CSS rules")

with open('logger/templates/logger/includes/header_styles.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved updated header_styles.html")

