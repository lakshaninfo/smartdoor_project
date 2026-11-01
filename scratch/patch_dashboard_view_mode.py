import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update initCampusSystem viewMode
old_init_viewmode = "setDashboardViewMode(appState.campus.viewMode || '3d', false);"
new_init_viewmode = """appState.campus.viewMode = '3d';
        setDashboardViewMode('3d', false);"""

if old_init_viewmode in content:
    content = content.replace(old_init_viewmode, new_init_viewmode, 1)
    print("Patched initCampusSystem viewMode")
else:
    print("old_init_viewmode not found")

# 2. Update setDashboardViewMode
old_set_dash = """    function setDashboardViewMode(mode, showFeedback = true) {

        if (!appState.campus) initCampusSystem();

        appState.campus.viewMode = mode;

        saveCampusData();

        const viewDashboard = document.getElementById("view-dashboard");
        if (viewDashboard) {
            if (mode === '3d') {
                viewDashboard.classList.add("view-3d-active");
                viewDashboard.setAttribute("data-view-mode", "3d");
            } else {
                viewDashboard.classList.remove("view-3d-active");
                viewDashboard.setAttribute("data-view-mode", "2d");
            }
        }

        const btn3d = document.getElementById("btn-view-3d");

        const btn2d = document.getElementById("btn-view-2d");

        const wrap3d = document.getElementById("campus-3d-wrapper");

        const wrap2d = document.getElementById("blueprint-svg-container");

        const breadcrumbNav = document.getElementById("campus-breadcrumb-nav");

        const bpModeSelector = document.getElementById("blueprint-mode-selector");
        const viewModeSelector = document.getElementById("view-mode-selector");
        const actions3d = document.getElementById("toolbar-actions-3d");
        const actions2d = document.getElementById("toolbar-actions-2d");

        // Sync sidebar and topbar states
        const navDash = document.getElementById("nav-dashboard");
        const navFp = document.getElementById("nav-floorplan");
        const mobDash = document.getElementById("mob-nav-dashboard");
        const mobFp = document.getElementById("mob-nav-floorplan");
        const topbarTitle = document.getElementById('topbar-page-title');

        if (mode === '3d') {
            if (navDash) navDash.classList.add("active");
            if (navFp) navFp.classList.remove("active");
            if (mobDash) mobDash.classList.add("active");
            if (mobFp) mobFp.classList.remove("active");
            if (topbarTitle) {
                topbarTitle.innerHTML = '<i data-lucide="building-2"></i><span>Campus 3D Overview</span>';
                if (window.lucide && lucide.createIcons) lucide.createIcons({ el: topbarTitle });
            }

            if (viewModeSelector) viewModeSelector.classList.remove('hidden');
            const statChip = document.getElementById("campus-stat-chip");
            if (statChip) statChip.classList.remove('hidden');

            if (btn3d) btn3d.classList.add("active");

            if (btn2d) btn2d.classList.remove("active");

            if (wrap3d) wrap3d.classList.remove("hidden");

            if (wrap2d) wrap2d.classList.add("hidden");

            if (breadcrumbNav) breadcrumbNav.classList.add("hidden");

            if (bpModeSelector) bpModeSelector.classList.add("hidden");
            if (actions3d) actions3d.classList.remove("hidden");
            if (actions2d) actions2d.classList.add("hidden");

            setMode('monitor');

            renderCampus3D();

            if (showFeedback) showToast("Switched to Campus 3D Overview", "info");

        } else {
            if (navFp) navFp.classList.add("active");
            if (navDash) navDash.classList.remove("active");
            if (mobFp) mobFp.classList.add("active");
            if (mobDash) mobDash.classList.remove("active");
            if (topbarTitle) {
                topbarTitle.innerHTML = '<i data-lucide="layout-grid"></i><span>Floor Plan Blueprint</span>';
                if (window.lucide && lucide.createIcons) lucide.createIcons({ el: topbarTitle });
            }

            if (viewModeSelector) viewModeSelector.classList.add('hidden');
            const statChip2 = document.getElementById("campus-stat-chip");
            if (statChip2) statChip2.classList.add('hidden');

            if (btn3d) btn3d.classList.remove("active");

            if (btn2d) btn2d.classList.add("active");

            if (wrap3d) wrap3d.classList.add("hidden");

            if (wrap2d) wrap2d.classList.remove("hidden");

            if (breadcrumbNav) breadcrumbNav.classList.remove("hidden");

            if (bpModeSelector) bpModeSelector.classList.remove("hidden");
            if (actions3d) actions3d.classList.add("hidden");
            if (actions2d) actions2d.classList.remove("hidden");

            renderPlan();

            updateCanvasEmptyState();

            updateUndoRedoUI();

            if (showFeedback) showToast("Switched to 2D Floor Plan", "info");

        }

    }"""

new_set_dash = """    function setDashboardViewMode(mode, showFeedback = true) {
        if (!appState.campus) initCampusSystem();

        // If 2D Blueprint is requested, redirect to dedicated Floor Plan workstation
        if (mode === '2d') {
            switchMainTab('floorplan');
            if (typeof setFloorPlanSubView === 'function') {
                setFloorPlanSubView('2d', showFeedback);
            }
            return;
        }

        appState.campus.viewMode = '3d';
        saveCampusData();

        const viewDashboard = document.getElementById("view-dashboard");
        if (viewDashboard) {
            viewDashboard.classList.add("view-3d-active");
            viewDashboard.setAttribute("data-view-mode", "3d");
            viewDashboard.classList.remove("hidden");
            viewDashboard.style.removeProperty("display");
        }

        const wrap3d = document.getElementById("campus-3d-wrapper");
        if (wrap3d) wrap3d.classList.remove("hidden");

        const statChip = document.getElementById("campus-stat-chip");
        if (statChip) statChip.classList.remove('hidden');

        const navDash = document.getElementById("nav-dashboard");
        if (navDash) navDash.classList.add("active");

        const topbarTitle = document.getElementById('topbar-page-title');
        if (topbarTitle) {
            topbarTitle.innerHTML = '<i data-lucide="building-2"></i><span>Campus 3D Overview</span>';
            if (window.lucide && lucide.createIcons) lucide.createIcons({ el: topbarTitle });
        }

        setMode('monitor');
        renderCampus3D();
        if (showFeedback) showToast("Switched to Campus 3D Overview", "info");
    }"""

if old_set_dash in content:
    content = content.replace(old_set_dash, new_set_dash, 1)
    print("Patched setDashboardViewMode")
else:
    print("Trying regex for setDashboardViewMode...")
    content = re.sub(
        r'function setDashboardViewMode\(mode, showFeedback = true\)\s*\{[\s\S]*?if \(showFeedback\) showToast\("Switched to 2D Floor Plan", "info"\);\s*\}\s*\}',
        new_set_dash.strip(),
        content
    )
    print("Patched setDashboardViewMode via regex")

# 3. Update switchMainTab for dashboard
old_switch_dash = """        if (tabName === 'dashboard') {
            if (viewDashboard) viewDashboard.classList.remove("hidden");
            if (typeof renderCampus3D === 'function') renderCampus3D();
        }"""

new_switch_dash = """        if (tabName === 'dashboard') {
            if (viewDashboard) {
                viewDashboard.classList.remove("hidden");
                viewDashboard.style.removeProperty("display");
            }
            const wrap3d = document.getElementById("campus-3d-wrapper");
            if (wrap3d) wrap3d.classList.remove("hidden");
            const statChip = document.getElementById("campus-stat-chip");
            if (statChip) statChip.classList.remove("hidden");
            if (typeof renderCampus3D === 'function') renderCampus3D();
        }"""

if old_switch_dash in content:
    content = content.replace(old_switch_dash, new_switch_dash, 1)
    print("Patched switchMainTab for dashboard")
else:
    print("old_switch_dash not found, trying regex...")
    content = re.sub(
        r'if \(tabName === \'dashboard\'\)\s*\{\s*if \(viewDashboard\) viewDashboard\.classList\.remove\("hidden"\);\s*if \(typeof renderCampus3D === \'function\'\) renderCampus3D\(\);\s*\}',
        new_switch_dash.strip(),
        content
    )
    print("Patched switchMainTab for dashboard via regex")

# 4. Update renderCampus3DScene to unhide wrap3d
old_scene_head = """    function renderCampus3DScene() {
        const campusStage = $('stage-campus') || $('stage');
        const campusScene = $('scene-campus') || $('scene');
        const campus = $('campus');
        if (!campusStage || !campusScene || !campus) return;"""

new_scene_head = """    function renderCampus3DScene() {
        const wrap3d = $('campus-3d-wrapper');
        if (wrap3d) wrap3d.classList.remove('hidden');
        const campusStage = $('stage-campus') || $('stage');
        const campusScene = $('scene-campus') || $('scene');
        const campus = $('campus');
        if (!campusStage || !campusScene || !campus) return;"""

if old_scene_head in content:
    content = content.replace(old_scene_head, new_scene_head, 1)
    print("Patched renderCampus3DScene head")
else:
    print("old_scene_head not found")

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved updated scripts.html")

