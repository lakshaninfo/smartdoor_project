import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update applyCampus() to call updateCampus3DZoomUI()
old_apply_campus = """        scene.style.transform = `scale(${s}) rotateX(${camCampus.rx}deg) rotateZ(${camCampus.rz}deg) translate3d(${-(camCampus.cx - 394)}px,${-(camCampus.cy - 234)}px,${-camCampus.cz}px)`;
    }"""
new_apply_campus = """        scene.style.transform = `scale(${s}) rotateX(${camCampus.rx}deg) rotateZ(${camCampus.rz}deg) translate3d(${-(camCampus.cx - 394)}px,${-(camCampus.cy - 234)}px,${-camCampus.cz}px)`;
        if (typeof updateCampus3DZoomUI === 'function') updateCampus3DZoomUI();
    }"""

if old_apply_campus in content:
    content = content.replace(old_apply_campus, new_apply_campus, 1)
    print("Patched applyCampus")
else:
    print("Warning: old_apply_campus not found directly")

# 2. Update apply() to call updateFp3DZoomUI()
old_apply = """        scene.style.transform = `scale(${s}) rotateX(${cam.rx}deg) rotateZ(${cam.rz}deg) translate3d(${-(cam.cx - 394)}px,${-(cam.cy - 234)}px,${-cam.cz}px)`;
    }"""
new_apply = """        scene.style.transform = `scale(${s}) rotateX(${cam.rx}deg) rotateZ(${cam.rz}deg) translate3d(${-(cam.cx - 394)}px,${-(cam.cy - 234)}px,${-cam.cz}px)`;
        if (typeof updateFp3DZoomUI === 'function') updateFp3DZoomUI();
    }"""

if old_apply in content:
    content = content.replace(old_apply, new_apply, 1)
    print("Patched apply")
else:
    print("Warning: old_apply not found directly")

# 3. Prevent dragging when clicking zoom pill on stage and campusStage
old_stage_down = """        stage.onpointerdown = e => {
            drag = true;"""
new_stage_down = """        stage.onpointerdown = e => {
            if (e.target.closest && (e.target.closest('.canvas-grouped-pill') || e.target.closest('.btn-zoom-icon'))) return;
            drag = true;"""

if old_stage_down in content:
    content = content.replace(old_stage_down, new_stage_down, 1)
    print("Patched stage.onpointerdown")
else:
    print("Warning: old_stage_down not found")

old_campus_down = """            campusStage.onpointerdown = e => {
                dragCampus = true;"""
new_campus_down = """            campusStage.onpointerdown = e => {
                if (e.target.closest && (e.target.closest('.canvas-grouped-pill') || e.target.closest('.btn-zoom-icon'))) return;
                dragCampus = true;"""

if old_campus_down in content:
    content = content.replace(old_campus_down, new_campus_down, 1)
    print("Patched campusStage.onpointerdown")
else:
    print("Warning: old_campus_down not found")

# 4. Update wheel listeners to trigger zoom UI
old_campus_wheel = """            campusStage.addEventListener('wheel', e => {
                e.preventDefault();
                camCampus.zoom = Math.max(0.35, Math.min(2.4, camCampus.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
                applyCampus();
            }, { passive: false });"""

new_campus_wheel = """            campusStage.addEventListener('wheel', e => {
                e.preventDefault();
                camCampus.zoom = Math.max(0.35, Math.min(2.4, camCampus.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
                applyCampus();
                updateCampus3DZoomUI();
            }, { passive: false });"""

if old_campus_wheel in content:
    content = content.replace(old_campus_wheel, new_campus_wheel, 1)
    print("Patched campusStage wheel")
else:
    print("Warning: old_campus_wheel not found")

old_stage_wheel = """        stage.addEventListener('wheel', e => {
            e.preventDefault();
            cam.zoom = Math.max(0.35, Math.min(2.4, cam.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
            apply();
        }, { passive: false });"""

new_stage_wheel = """        stage.addEventListener('wheel', e => {
            e.preventDefault();
            cam.zoom = Math.max(0.35, Math.min(2.4, cam.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
            apply();
            updateFp3DZoomUI();
        }, { passive: false });"""

if old_stage_wheel in content:
    content = content.replace(old_stage_wheel, new_stage_wheel, 1)
    print("Patched stage wheel")
else:
    print("Warning: old_stage_wheel not found")

# 5. Insert Zoom Control Engine functions
zoom_functions = """
    // =========================================================================
    // 3D Campus & Floor Plan Zoom HUD Controls Engine
    // =========================================================================
    function updateCampus3DZoomUI() {
        const zoomText = document.getElementById("campus-zoom-level-text");
        const btnOut = document.getElementById("btn-campus-zoom-out");
        const btnIn = document.getElementById("btn-campus-zoom-in");
        if (!zoomText) return;

        const currentZoom = (typeof camCampus !== 'undefined' && camCampus && camCampus.zoom) ? camCampus.zoom : 0.85;
        const pct = Math.round(currentZoom * 100);
        zoomText.textContent = `${pct}%`;

        if (btnOut) {
            const isAtMin = currentZoom <= 0.36;
            btnOut.style.opacity = isAtMin ? '0.35' : '1';
            btnOut.style.pointerEvents = isAtMin ? 'none' : 'auto';
            btnOut.title = isAtMin ? "Minimum zoom reached (35%)" : "Zoom Out";
        }
        if (btnIn) {
            const isAtMax = currentZoom >= 2.39;
            btnIn.style.opacity = isAtMax ? '0.35' : '1';
            btnIn.style.pointerEvents = isAtMax ? 'none' : 'auto';
            btnIn.title = isAtMax ? "Maximum zoom reached (240%)" : "Zoom In";
        }
    }

    function zoomCampus3D(delta) {
        if (typeof camCampus === 'undefined' || !camCampus) return;
        camCampus.zoom = Math.max(0.35, Math.min(2.4, +(camCampus.zoom + delta).toFixed(2)));
        if (typeof applyCampus === 'function') applyCampus();
        updateCampus3DZoomUI();
    }

    function fitCampus3DView() {
        if (typeof camCampus === 'undefined' || !camCampus) return;
        if (typeof camToCampus === 'function') {
            camToCampus({ rx: 56, rz: -34, zoom: 0.85, cx: 600, cy: 300, cz: 0 }, 500);
        } else {
            camCampus.rx = 56;
            camCampus.rz = -34;
            camCampus.zoom = 0.85;
            if (typeof applyCampus === 'function') applyCampus();
        }
        setTimeout(updateCampus3DZoomUI, 520);
    }

    function resetCampus3DZoom() {
        if (typeof camCampus === 'undefined' || !camCampus) return;
        if (typeof camToCampus === 'function') {
            camToCampus({ rx: 56, rz: -34, zoom: 0.85 }, 500);
        } else {
            camCampus.rx = 56;
            camCampus.rz = -34;
            camCampus.zoom = 0.85;
            if (typeof applyCampus === 'function') applyCampus();
        }
        setTimeout(updateCampus3DZoomUI, 520);
        if (typeof showToast === 'function') showToast("Campus 3D zoom reset.", "info");
    }

    function updateFp3DZoomUI() {
        const zoomText = document.getElementById("fp3d-zoom-level-text");
        const btnOut = document.getElementById("btn-fp3d-zoom-out");
        const btnIn = document.getElementById("btn-fp3d-zoom-in");
        if (!zoomText) return;

        const currentZoom = (typeof cam !== 'undefined' && cam && cam.zoom) ? cam.zoom : 0.62;
        const pct = Math.round(currentZoom * 100);
        zoomText.textContent = `${pct}%`;

        if (btnOut) {
            const isAtMin = currentZoom <= 0.36;
            btnOut.style.opacity = isAtMin ? '0.35' : '1';
            btnOut.style.pointerEvents = isAtMin ? 'none' : 'auto';
            btnOut.title = isAtMin ? "Minimum zoom reached (35%)" : "Zoom Out";
        }
        if (btnIn) {
            const isAtMax = currentZoom >= 2.39;
            btnIn.style.opacity = isAtMax ? '0.35' : '1';
            btnIn.style.pointerEvents = isAtMax ? 'none' : 'auto';
            btnIn.title = isAtMax ? "Maximum zoom reached (240%)" : "Zoom In";
        }
    }

    function zoomFp3D(delta) {
        if (typeof cam === 'undefined' || !cam) return;
        cam.zoom = Math.max(0.35, Math.min(2.4, +(cam.zoom + delta).toFixed(2)));
        if (typeof apply === 'function') apply();
        updateFp3DZoomUI();
    }

    function fitFp3DView() {
        if (typeof cam === 'undefined' || !cam) return;
        if (typeof camTo === 'function') {
            camTo({ rx: 58, rz: -34, zoom: 0.75, cx: 394, cy: 234, cz: 0 }, 500);
        } else {
            cam.rx = 58;
            cam.rz = -34;
            cam.zoom = 0.75;
            if (typeof apply === 'function') apply();
        }
        setTimeout(updateFp3DZoomUI, 520);
    }

    function resetFp3DZoom() {
        if (typeof cam === 'undefined' || !cam) return;
        if (typeof camTo === 'function') {
            camTo({ rx: 58, rz: -34, zoom: 0.62 }, 500);
        } else {
            cam.rx = 58;
            cam.rz = -34;
            cam.zoom = 0.62;
            if (typeof apply === 'function') apply();
        }
        setTimeout(updateFp3DZoomUI, 520);
        if (typeof showToast === 'function') showToast("Floor Plan 3D zoom reset.", "info");
    }

    // Export zoom functions globally
    window.updateCampus3DZoomUI = updateCampus3DZoomUI;
    window.zoomCampus3D = zoomCampus3D;
    window.fitCampus3DView = fitCampus3DView;
    window.resetCampus3DZoom = resetCampus3DZoom;

    window.updateFp3DZoomUI = updateFp3DZoomUI;
    window.zoomFp3D = zoomFp3D;
    window.fitFp3DView = fitFp3DView;
    window.resetFp3DZoom = resetFp3DZoom;
"""

marker = "window.toggleCampusAutoRotate = toggleCampusAutoRotate;"
if marker in content:
    content = content.replace(marker, marker + zoom_functions, 1)
    print("Inserted 3D zoom functions into scripts.html")
else:
    print("Warning: marker not found, appending before closing script tag")
    content = content.replace("</script>", zoom_functions + "\n</script>", 1)

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved updated scripts.html")

