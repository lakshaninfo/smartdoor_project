import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Invert Floor Plan 3D horizontal drag
old_fp_drag = """        window.addEventListener('pointermove', e => {
            if (!drag) return;
            const dx = e.clientX - lx, dy = e.clientY - ly;
            lx = e.clientX;
            ly = e.clientY;
            moved += Math.abs(dx) + Math.abs(dy);
            vx = dx * 0.4;
            cam.rz += dx * 0.4;
            cam.rx = Math.max(0, Math.min(88, cam.rx - dy * 0.3));
            apply();
        });"""

new_fp_drag = """        window.addEventListener('pointermove', e => {
            if (!drag) return;
            const dx = e.clientX - lx, dy = e.clientY - ly;
            lx = e.clientX;
            ly = e.clientY;
            moved += Math.abs(dx) + Math.abs(dy);
            vx = -dx * 0.4;
            cam.rz -= dx * 0.4;
            cam.rx = Math.max(0, Math.min(88, cam.rx - dy * 0.3));
            apply();
        });"""

if old_fp_drag in content:
    content = content.replace(old_fp_drag, new_fp_drag, 1)
    print("Patched Floor Plan 3D drag horizontal inversion (left/right inverted)")
else:
    print("Warning: old_fp_drag not found")

# 2. Invert Campus 3D horizontal drag
old_campus_drag = """            window.addEventListener('pointermove', e => {
                if (!dragCampus) return;
                const dx = e.clientX - lxCampus, dy = e.clientY - lyCampus;
                lxCampus = e.clientX;
                lyCampus = e.clientY;
                movedCampus += Math.abs(dx) + Math.abs(dy);
                vxCampus = dx * 0.4;
                camCampus.rz += dx * 0.4;
                camCampus.rx = Math.max(0, Math.min(88, camCampus.rx - dy * 0.3));
                applyCampus();
            });"""

new_campus_drag = """            window.addEventListener('pointermove', e => {
                if (!dragCampus) return;
                const dx = e.clientX - lxCampus, dy = e.clientY - lyCampus;
                lxCampus = e.clientX;
                lyCampus = e.clientY;
                movedCampus += Math.abs(dx) + Math.abs(dy);
                vxCampus = -dx * 0.4;
                camCampus.rz -= dx * 0.4;
                camCampus.rx = Math.max(0, Math.min(88, camCampus.rx - dy * 0.3));
                applyCampus();
            });"""

if old_campus_drag in content:
    content = content.replace(old_campus_drag, new_campus_drag, 1)
    print("Patched Campus 3D drag horizontal inversion (left/right inverted)")
else:
    print("Warning: old_campus_drag not found")

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved scripts.html successfully!")

