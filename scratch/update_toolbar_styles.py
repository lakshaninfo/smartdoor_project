filepath_scripts = 'logger/templates/logger/includes/scripts.html'
with open(filepath_scripts, 'r', encoding='utf-8') as f:
    text_scripts = f.read()

old_scripts_chunk = """        const bpModeSelector = document.getElementById("blueprint-mode-selector");
        const viewModeSelector = document.getElementById("view-mode-selector");"""

new_scripts_chunk = """        const bpModeSelector = document.getElementById("blueprint-mode-selector");
        const viewModeSelector = document.getElementById("view-mode-selector");
        const actions3d = document.getElementById("toolbar-actions-3d");
        const actions2d = document.getElementById("toolbar-actions-2d");"""

if old_scripts_chunk in text_scripts:
    text_scripts = text_scripts.replace(old_scripts_chunk, new_scripts_chunk, 1)

old_3d_toggle = """            if (bpModeSelector) bpModeSelector.classList.add("hidden");

            setMode('monitor');"""

new_3d_toggle = """            if (bpModeSelector) bpModeSelector.classList.add("hidden");
            if (actions3d) actions3d.classList.remove("hidden");
            if (actions2d) actions2d.classList.add("hidden");

            setMode('monitor');"""

if old_3d_toggle in text_scripts:
    text_scripts = text_scripts.replace(old_3d_toggle, new_3d_toggle, 1)

old_2d_toggle = """            if (bpModeSelector) bpModeSelector.classList.remove("hidden");

            renderElevatorRail();"""

new_2d_toggle = """            if (bpModeSelector) bpModeSelector.classList.remove("hidden");
            if (actions3d) actions3d.classList.add("hidden");
            if (actions2d) actions2d.classList.remove("hidden");

            renderElevatorRail();"""

if old_2d_toggle in text_scripts:
    text_scripts = text_scripts.replace(old_2d_toggle, new_2d_toggle, 1)

with open(filepath_scripts, 'w', encoding='utf-8') as f:
    f.write(text_scripts)
print("Updated scripts.html toolbar toggling!")

# Now update header_styles.html
filepath_styles = 'logger/templates/logger/includes/header_styles.html'
with open(filepath_styles, 'r', encoding='utf-8') as f:
    css = f.read()

new_toolbar_css = """
    /* ========================================================
       CLEAN, MODERN TOOLBAR & DESIGNER RIBBON SYSTEM
       ======================================================== */
    .canvas-toolbar-right {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
    }
    .toolbar-actions-cluster {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
    }
    .toolbar-actions-cluster.hidden {
        display: none !important;
    }
    .breadcrumb-text-truncate {
        max-width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        vertical-align: middle;
        font-size: 11.5px;
    }
    @media (max-width: 900px) {
        .breadcrumb-text-truncate {
            max-width: 90px;
        }
    }
    .campus-breadcrumb-nav {
        display: inline-flex !important;
        align-items: center;
        gap: 4px;
        height: 32px;
        background: var(--bg-muted);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        padding: 0 6px;
        flex-shrink: 0;
        box-sizing: border-box;
    }
    .campus-breadcrumb-nav.hidden {
        display: none !important;
    }
    .btn-breadcrumb-node {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        height: 24px;
        padding: 0 7px;
        border: none;
        background: transparent;
        font-family: var(--font-sans);
        font-size: 11.5px;
        font-weight: 600;
        color: var(--blue);
        cursor: pointer;
        border-radius: 4px;
        white-space: nowrap;
        transition: all 0.15s ease;
    }
    .btn-breadcrumb-node:hover {
        background: var(--bg-card);
        color: var(--blue-hover);
    }
    .breadcrumb-chevron {
        color: var(--text-muted);
        display: inline-flex;
        align-items: center;
        opacity: 0.6;
        font-size: 10px;
        margin: 0 1px;
    }
    .btn-breadcrumb-dropdown {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        height: 24px;
        padding: 0 8px;
        border: 1px solid var(--border);
        background: var(--bg-card);
        font-family: var(--font-sans);
        font-size: 11.5px;
        font-weight: 600;
        color: var(--text-primary);
        cursor: pointer;
        border-radius: 4px;
        white-space: nowrap;
        box-shadow: var(--shadow-xs);
        transition: all 0.15s ease;
    }
    .btn-breadcrumb-dropdown:hover {
        border-color: var(--blue);
        color: var(--blue);
    }

    /* Dedicated Designer Tool Ribbon Strip */
    .designer-ribbon {
        display: flex;
        align-items: center;
        gap: 5px;
        background: var(--bg-subtle);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 5px 8px;
        margin-bottom: 8px;
        min-height: 38px;
        box-sizing: border-box;
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
        box-shadow: var(--shadow-xs);
        animation: ribbonSlideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes ribbonSlideDown {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .designer-ribbon.hidden {
        display: none !important;
    }
    .designer-tool-group {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        flex-shrink: 0;
    }
    .designer-divider {
        width: 1px;
        height: 18px;
        background: var(--border);
        margin: 0 5px;
        flex-shrink: 0;
        align-self: center;
    }
    .designer-tool-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        height: 28px;
        padding: 0 9px;
        font-family: var(--font-sans);
        font-size: 11.5px;
        font-weight: 500;
        color: var(--text-secondary);
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
    }
    .designer-tool-btn:hover:not(:disabled) {
        background: var(--bg-hover);
        border-color: var(--blue);
        color: var(--blue);
    }
    .designer-tool-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
    .designer-tool-btn i, .designer-tool-btn svg {
        width: 13px;
        height: 13px;
    }
    .designer-actions-right {
        margin-left: auto;
    }
    .designer-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        border-radius: var(--radius-sm);
        height: 28px;
        padding: 0 10px;
        font-family: var(--font-sans);
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
    }
    .designer-action-btn.btn-save {
        background: var(--blue);
        color: #ffffff;
        border: 1px solid var(--blue);
        box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
    }
    .designer-action-btn.btn-save:hover {
        background: var(--blue-hover);
    }
    .designer-action-btn.btn-template {
        background: var(--bg-card);
        color: var(--text-primary);
        border: 1px solid var(--border);
    }
    .designer-action-btn.btn-template:hover {
        border-color: var(--blue);
        color: var(--blue);
    }
    .designer-action-btn.btn-clear {
        background: transparent;
        color: var(--red);
        border: 1px solid transparent;
    }
    .designer-action-btn.btn-clear:hover {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
    }
"""

if 'CLEAN, MODERN TOOLBAR & DESIGNER RIBBON SYSTEM' not in css:
    style_end = css.rfind('</style>')
    css = css[:style_end] + '\n\n' + new_toolbar_css + '\n' + css[style_end:]
    with open(filepath_styles, 'w', encoding='utf-8') as f:
        f.write(css)
    print("Updated header_styles.html with clean toolbar & ribbon CSS!")
else:
    print("CSS already present in header_styles.html")

