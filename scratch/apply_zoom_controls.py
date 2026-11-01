import sys
sys.stdout.reconfigure(encoding='utf-8')

# 1. Update view_dashboard.html
with open('logger/templates/logger/includes/view_dashboard.html', 'r', encoding='utf-8') as f:
    d_content = f.read()

d_target = """                <!-- Click-to-Enter Quick Fade Transition Veil Overlay -->
                <div class="veil" id="veil-campus"></div>"""

d_replacement = """                <!-- Floating Zoom & Fit Controls for Campus 3D -->
                <div class="canvas-grouped-pill" id="campus-zoom-pill" onpointerdown="event.stopPropagation()">
                    <button type="button" class="btn-zoom-icon" onclick="fitCampus3DView()" title="Fit to Screen"><i data-lucide="maximize-2"></i></button>
                    <div class="btn-zoom-sep"></div>
                    <button type="button" class="btn-zoom-icon" id="btn-campus-zoom-out" onclick="zoomCampus3D(-0.15)" title="Zoom Out"><i data-lucide="minus"></i></button>
                    <span id="campus-zoom-level-text" class="zoom-level-label">85%</span>
                    <button type="button" class="btn-zoom-icon" id="btn-campus-zoom-in" onclick="zoomCampus3D(0.15)" title="Zoom In"><i data-lucide="plus"></i></button>
                    <div class="btn-zoom-sep"></div>
                    <button type="button" class="btn-zoom-icon" onclick="resetCampus3DZoom()" title="Reset View"><i data-lucide="locate-fixed"></i></button>
                </div>

                <!-- Click-to-Enter Quick Fade Transition Veil Overlay -->
                <div class="veil" id="veil-campus"></div>"""

if d_target in d_content:
    d_content = d_content.replace(d_target, d_replacement, 1)
    with open('logger/templates/logger/includes/view_dashboard.html', 'w', encoding='utf-8') as f:
        f.write(d_content)
    print("Updated view_dashboard.html successfully")
else:
    print("d_target not found in view_dashboard.html")

# 2. Update view_floorplan.html
with open('logger/templates/logger/includes/view_floorplan.html', 'r', encoding='utf-8') as f:
    fp_content = f.read()

fp_target = """                <!-- 3D Transform Scene Root (preserve-3d) -->
                <div id="scene">
                    <div id="interior" style="display: block;"></div>
                </div>

                <!-- Quick Fade Transition Veil Overlay -->
                <div class="veil" id="veil"></div>"""

fp_replacement = """                <!-- 3D Transform Scene Root (preserve-3d) -->
                <div id="scene">
                    <div id="interior" style="display: block;"></div>
                </div>

                <!-- Floating Zoom & Fit Controls for Floor Plan 3D -->
                <div class="canvas-grouped-pill" id="fp3d-zoom-pill" onpointerdown="event.stopPropagation()">
                    <button type="button" class="btn-zoom-icon" onclick="fitFp3DView()" title="Fit to Screen"><i data-lucide="maximize-2"></i></button>
                    <div class="btn-zoom-sep"></div>
                    <button type="button" class="btn-zoom-icon" id="btn-fp3d-zoom-out" onclick="zoomFp3D(-0.15)" title="Zoom Out"><i data-lucide="minus"></i></button>
                    <span id="fp3d-zoom-level-text" class="zoom-level-label">100%</span>
                    <button type="button" class="btn-zoom-icon" id="btn-fp3d-zoom-in" onclick="zoomFp3D(0.15)" title="Zoom In"><i data-lucide="plus"></i></button>
                    <div class="btn-zoom-sep"></div>
                    <button type="button" class="btn-zoom-icon" onclick="resetFp3DZoom()" title="Reset View"><i data-lucide="locate-fixed"></i></button>
                </div>

                <!-- Quick Fade Transition Veil Overlay -->
                <div class="veil" id="veil"></div>"""

if fp_target in fp_content:
    fp_content = fp_content.replace(fp_target, fp_replacement, 1)
    with open('logger/templates/logger/includes/view_floorplan.html', 'w', encoding='utf-8') as f:
        f.write(fp_content)
    print("Updated view_floorplan.html successfully")
else:
    print("fp_target not found in view_floorplan.html")

