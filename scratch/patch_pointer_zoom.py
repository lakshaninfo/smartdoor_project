import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update campusStage wheel listener
old_campus_wheel = """            campusStage.addEventListener('wheel', e => {
                e.preventDefault();
                camCampus.zoom = Math.max(0.35, Math.min(2.4, camCampus.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
                applyCampus();
                updateCampus3DZoomUI();
            }, { passive: false });"""

new_campus_wheel = """            campusStage.addEventListener('wheel', e => {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.12 : -0.12;
                zoomCampus3D(delta, e.clientX, e.clientY);
            }, { passive: false });"""

if old_campus_wheel in content:
    content = content.replace(old_campus_wheel, new_campus_wheel, 1)
    print("Patched campusStage wheel to focal zoom")
else:
    print("Warning: old_campus_wheel not found")

# 2. Update stage wheel listener
old_stage_wheel = """        stage.addEventListener('wheel', e => {
            e.preventDefault();
            cam.zoom = Math.max(0.35, Math.min(2.4, cam.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
            apply();
            updateFp3DZoomUI();
        }, { passive: false });"""

new_stage_wheel = """        stage.addEventListener('wheel', e => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.12 : -0.12;
            zoomFp3D(delta, e.clientX, e.clientY);
        }, { passive: false });"""

if old_stage_wheel in content:
    content = content.replace(old_stage_wheel, new_stage_wheel, 1)
    print("Patched stage wheel to focal zoom")
else:
    print("Warning: old_stage_wheel not found")

# 3. Update zoomCampus3D and zoomFp3D functions with focal-point zoom math
old_zoom_campus = """    function zoomCampus3D(delta) {
        if (typeof camCampus === 'undefined' || !camCampus) return;
        camCampus.zoom = Math.max(0.35, Math.min(2.4, +(camCampus.zoom + delta).toFixed(2)));
        if (typeof applyCampus === 'function') applyCampus();
        updateCampus3DZoomUI();
    }"""

new_zoom_campus = """    function zoomCampus3D(delta, clientX = null, clientY = null) {
        if (typeof camCampus === 'undefined' || !camCampus) return;
        const stage = document.getElementById('stage-campus') || document.getElementById('stage');
        const stageW = (stage && stage.clientWidth > 100) ? stage.clientWidth : 1000;
        const baseScale = Math.min(1.2, stageW / 1000);
        const s_old = Math.max(0.35, camCampus.zoom * baseScale);

        const targetZoom = Math.max(0.35, Math.min(2.4, +(camCampus.zoom + delta).toFixed(2)));
        if (Math.abs(targetZoom - camCampus.zoom) < 0.001) {
            updateCampus3DZoomUI();
            return;
        }
        const s_new = Math.max(0.35, targetZoom * baseScale);

        if (clientX !== null && clientY !== null && stage) {
            const rect = stage.getBoundingClientRect();
            const screenOffX = (clientX - rect.left) - stage.clientWidth / 2;
            const screenOffY = (clientY - rect.top) - stage.clientHeight / 2;

            const dScreenX = screenOffX * (1 / s_old - 1 / s_new);
            const dScreenY = screenOffY * (1 / s_old - 1 / s_new);

            const rxRad = camCampus.rx * Math.PI / 180;
            const rzRad = camCampus.rz * Math.PI / 180;
            const cosRx = Math.max(0.08, Math.cos(rxRad));

            const y1 = dScreenY / cosRx;
            const dcx = dScreenX * Math.cos(rzRad) + y1 * Math.sin(rzRad);
            const dcy = -dScreenX * Math.sin(rzRad) + y1 * Math.cos(rzRad);

            camCampus.cx += dcx;
            camCampus.cy += dcy;
        }

        camCampus.zoom = targetZoom;
        if (typeof applyCampus === 'function') applyCampus();
        updateCampus3DZoomUI();
    }"""

if old_zoom_campus in content:
    content = content.replace(old_zoom_campus, new_zoom_campus, 1)
    print("Patched zoomCampus3D with cursor focal zoom")
else:
    print("Warning: old_zoom_campus not found")

old_zoom_fp = """    function zoomFp3D(delta) {
        if (typeof cam === 'undefined' || !cam) return;
        cam.zoom = Math.max(0.35, Math.min(2.4, +(cam.zoom + delta).toFixed(2)));
        if (typeof apply === 'function') apply();
        updateFp3DZoomUI();
    }"""

new_zoom_fp = """    function zoomFp3D(delta, clientX = null, clientY = null) {
        if (typeof cam === 'undefined' || !cam) return;
        const stage = document.getElementById('stage');
        const stageW = (stage && stage.clientWidth > 100) ? stage.clientWidth : 1000;
        const baseScale = Math.min(1.2, stageW / 1000);
        const s_old = Math.max(0.35, cam.zoom * baseScale);

        const targetZoom = Math.max(0.35, Math.min(2.4, +(cam.zoom + delta).toFixed(2)));
        if (Math.abs(targetZoom - cam.zoom) < 0.001) {
            updateFp3DZoomUI();
            return;
        }
        const s_new = Math.max(0.35, targetZoom * baseScale);

        if (clientX !== null && clientY !== null && stage) {
            const rect = stage.getBoundingClientRect();
            const screenOffX = (clientX - rect.left) - stage.clientWidth / 2;
            const screenOffY = (clientY - rect.top) - stage.clientHeight / 2;

            const dScreenX = screenOffX * (1 / s_old - 1 / s_new);
            const dScreenY = screenOffY * (1 / s_old - 1 / s_new);

            const rxRad = cam.rx * Math.PI / 180;
            const rzRad = cam.rz * Math.PI / 180;
            const cosRx = Math.max(0.08, Math.cos(rxRad));

            const y1 = dScreenY / cosRx;
            const dcx = dScreenX * Math.cos(rzRad) + y1 * Math.sin(rzRad);
            const dcy = -dScreenX * Math.sin(rzRad) + y1 * Math.cos(rzRad);

            cam.cx += dcx;
            cam.cy += dcy;
        }

        cam.zoom = targetZoom;
        if (typeof apply === 'function') apply();
        updateFp3DZoomUI();
    }"""

if old_zoom_fp in content:
    content = content.replace(old_zoom_fp, new_zoom_fp, 1)
    print("Patched zoomFp3D with cursor focal zoom")
else:
    print("Warning: old_zoom_fp not found")

# 4. Enhance 2D zoomCanvas container lookup
old_2d_container = """            const svgContainer = document.querySelector('.svg-container');"""
new_2d_container = """            const svgContainer = document.getElementById("blueprint-svg-container") || document.querySelector('.svg-container');"""

if old_2d_container in content:
    content = content.replace(old_2d_container, new_2d_container, 1)
    print("Patched 2D zoomCanvas container lookup")

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved scripts.html successfully!")

