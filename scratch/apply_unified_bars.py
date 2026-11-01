# Unified Toolbar & Clean Bar System Update

# 1. Update view_dashboard.html
filepath_vdb = 'logger/templates/logger/includes/view_dashboard.html'
with open(filepath_vdb, 'r', encoding='utf-8') as f:
    text_vdb = f.read()

# Replace canvas-toolbar-left to include campus-stat-chip
old_left_track = """                <!-- 1. Primary View Mode Selector: 3D Campus (Option A) vs 2D Floor Plan -->
                <div class="segmented-capsule-track" id="view-mode-selector">
                    <button type="button" class="segmented-capsule-btn active" id="btn-view-3d" onclick="switchMainTab('dashboard')" title="Campus 3D Overview (Option A)">
                        <i data-lucide="building-2"></i> <span class="tb-label">Campus 3D</span>
                    </button>
                    <button type="button" class="segmented-capsule-btn" id="btn-view-2d" onclick="switchMainTab('floorplan')" title="Floor Plan Blueprint">
                        <i data-lucide="layout-grid"></i> <span class="tb-label">Floor Plan</span>
                    </button>
                </div>"""

new_left_track = """                <!-- 1. Primary View Mode Selector: 3D Campus (Option A) vs 2D Floor Plan -->
                <div class="segmented-capsule-track" id="view-mode-selector">
                    <button type="button" class="segmented-capsule-btn active" id="btn-view-3d" onclick="switchMainTab('dashboard')" title="Campus 3D Overview (Option A)">
                        <i data-lucide="building-2"></i> <span class="tb-label">Campus 3D</span>
                    </button>
                    <button type="button" class="segmented-capsule-btn" id="btn-view-2d" onclick="switchMainTab('floorplan')" title="Floor Plan Blueprint">
                        <i data-lucide="layout-grid"></i> <span class="tb-label">Floor Plan</span>
                    </button>
                </div>

                <!-- 3D Mode Campus Telemetry Chip -->
                <div class="campus-stat-chip" id="campus-stat-chip">
                    <i data-lucide="building-2" style="color: var(--blue); width: 13px; height: 13px; flex-shrink: 0;"></i>
                    <span id="campus-summary-stat">3 Buildings • 6 Floors • 8 Active Sensors</span>
                </div>"""

if old_left_track in text_vdb:
    text_vdb = text_vdb.replace(old_left_track, new_left_track, 1)

# Remove the redundant secondary topbar inside campus-3d-wrapper
old_secondary_topbar = """            <!-- 3D Campus Quick Status & Guide Strip -->
            <div class="campus-3d-topbar">
                <div class="campus-3d-stat-pill">
                    <i data-lucide="building-2" style="color: var(--blue); width: 14px; height: 14px;"></i>
                    <span id="campus-summary-stat">3 Buildings • 6 Floors • 8 Active Sensors</span>
                </div>
                <div class="campus-guide-pill">
                    <i data-lucide="mouse-pointer-click" style="width: 13px; height: 13px;"></i>
                    <span>Click any 3D building to enter and inspect floor plans</span>
                </div>
                <div class="campus-actions-cluster">
                    <button type="button" class="btn-campus-action" onclick="toggleCampusLabels()" id="btn-toggle-labels" title="Toggle Detail Labels">
                        <i data-lucide="tag"></i> <span id="label-toggle-text">Labels</span>
                    </button>
                    <button type="button" class="btn-campus-action" onclick="openAddBuildingModal()" title="Add New Building">
                        <i data-lucide="plus"></i> <span>Add Building</span>
                    </button>
                </div>
            </div>"""

if old_secondary_topbar in text_vdb:
    text_vdb = text_vdb.replace(old_secondary_topbar, "")
    print("Removed redundant secondary 3D topbar!")

with open(filepath_vdb, 'w', encoding='utf-8') as f:
    f.write(text_vdb)

# 2. Update scripts.html for campus-stat-chip toggle in setDashboardViewMode
filepath_scripts = 'logger/templates/logger/includes/scripts.html'
with open(filepath_scripts, 'r', encoding='utf-8') as f:
    text_scripts = f.read()

old_stat_toggle_3d = """            if (viewModeSelector) viewModeSelector.classList.remove('hidden');"""
new_stat_toggle_3d = """            if (viewModeSelector) viewModeSelector.classList.remove('hidden');
            const statChip = document.getElementById("campus-stat-chip");
            if (statChip) statChip.classList.remove('hidden');"""

if old_stat_toggle_3d in text_scripts:
    text_scripts = text_scripts.replace(old_stat_toggle_3d, new_stat_toggle_3d, 1)

old_stat_toggle_2d = """            if (viewModeSelector) viewModeSelector.classList.add('hidden');"""
new_stat_toggle_2d = """            if (viewModeSelector) viewModeSelector.classList.add('hidden');
            const statChip2 = document.getElementById("campus-stat-chip");
            if (statChip2) statChip2.classList.add('hidden');"""

if old_stat_toggle_2d in text_scripts:
    text_scripts = text_scripts.replace(old_stat_toggle_2d, new_stat_toggle_2d, 1)

with open(filepath_scripts, 'w', encoding='utf-8') as f:
    f.write(text_scripts)
print("Updated scripts.html statChip toggling!")

# 3. Update header_styles.html with refined CSS
filepath_styles = 'logger/templates/logger/includes/header_styles.html'
with open(filepath_styles, 'r', encoding='utf-8') as f:
    css = f.read()

# Update breadcrumb-text-truncate max-width
old_trunc = """    .breadcrumb-text-truncate {
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
    }"""

new_trunc = """    .breadcrumb-text-truncate {
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        vertical-align: middle;
        font-size: 11.5px;
    }
    @media (max-width: 900px) {
        .breadcrumb-text-truncate {
            max-width: 135px;
        }
    }
    @media (max-width: 768px) {
        .breadcrumb-text-truncate {
            max-width: 95px;
        }
    }
    .campus-stat-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 30px;
        background: var(--bg-muted);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        padding: 0 10px;
        font-size: 11.5px;
        font-weight: 600;
        color: var(--text-secondary);
        white-space: nowrap;
    }
    .campus-stat-chip.hidden {
        display: none !important;
    }
    @media (max-width: 860px) {
        .campus-stat-chip {
            display: none !important;
        }
    }
    /* Polished Designer Ribbon Styles */
    .designer-ribbon {
        display: flex;
        align-items: center;
        gap: 6px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 6px 10px;
        margin-bottom: 8px;
        min-height: 42px;
        box-sizing: border-box;
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
        box-shadow: var(--shadow-xs);
        animation: ribbonSlideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-theme="dark"] .designer-ribbon {
        background: rgba(15, 23, 42, 0.85);
        border-color: rgba(51, 65, 85, 0.8);
    }
    .designer-tool-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        height: 29px;
        padding: 0 10px;
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 500;
        color: var(--text-primary);
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
    }
    [data-theme="dark"] .designer-tool-btn {
        background: rgba(30, 41, 59, 0.85);
        border-color: rgba(71, 85, 105, 0.6);
        color: #f1f5f9;
    }
    .designer-tool-btn:hover:not(:disabled) {
        background: var(--bg-hover);
        border-color: var(--blue);
        color: var(--blue);
        transform: translateY(-1px);
    }
    .designer-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: var(--radius-sm);
        height: 29px;
        padding: 0 12px;
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
    }"""

if old_trunc in css:
    css = css.replace(old_trunc, new_trunc, 1)
    with open(filepath_styles, 'w', encoding='utf-8') as f:
        f.write(css)
    print("Updated header_styles.html with refined typography and stat chip!")
else:
    print("old_trunc pattern not matched directly, appending...")

