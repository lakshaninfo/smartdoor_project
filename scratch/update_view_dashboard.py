import os

html_path = r'logger/templates/logger/includes/view_dashboard.html'
with open(html_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update View 1 to the unified stage and remove View 3
s1 = text.find('<!-- ============================================== -->\n        <!-- VIEW 1: OPTION A - 3D ISOMETRIC CAMPUS MAP')
if s1 == -1:
    s1 = text.find('<!-- VIEW 1: OPTION A - 3D ISOMETRIC CAMPUS MAP')

s2 = text.find('<!-- ============================================== -->\n        <!-- VIEW 2: 2D FLOOR PLAN BLUEPRINT WORKSPACE')
if s2 == -1:
    s2 = text.find('<!-- VIEW 2: 2D FLOOR PLAN BLUEPRINT WORKSPACE')

view1_new = '''<!-- ============================================== -->
        <!-- VIEW 1: UNIFIED 3D CAMPUS & INTERIOR STAGE     -->
        <!-- ============================================== -->
        <div class="campus-3d-wrapper" id="campus-3d-wrapper">
            <div class="stage" id="stage">
                <!-- Vertical Level Selector (GF, 1F, 2F) -->
                <div class="lv" id="lv"></div>

                <!-- Zone Details & List Side Panel -->
                <aside id="side"></aside>

                <!-- Floating Camera Preset Controls (Top Right) -->
                <div class="stage-camera-bar" id="stage-camera-bar">
                    <button type="button" class="stage-cam-btn on" data-v="iso">Isometric</button>
                    <button type="button" class="stage-cam-btn" data-v="top">Top</button>
                    <button type="button" class="stage-cam-btn" data-v="side">Side</button>
                    <button type="button" class="stage-cam-btn" id="ta">Auto-rotate</button>
                </div>

                <!-- 3D Transform Scene Root (preserve-3d) -->
                <div id="scene">
                    <div id="campus"></div>
                    <div id="interior"></div>
                </div>

                <!-- Click-to-Enter Quick Fade Transition Veil Overlay -->
                <div class="veil" id="veil"></div>

                <!-- Interactive Context Hint (Bottom Left) -->
                <div class="hint" id="hint">Click a building to go inside • Drag to rotate • Scroll to zoom</div>
            </div>
        </div>

        '''

text_part1 = text[:s1] + view1_new + text[s2:]

# Now remove the duplicate VIEW 3 block between s3 and s4
s3 = text_part1.find('<!-- ============================================== -->\n            <!-- VIEW 3: 3D INTERACTIVE BUILDING FLOOR PLAN')
if s3 == -1:
    s3 = text_part1.find('<!-- VIEW 3: 3D INTERACTIVE BUILDING FLOOR PLAN')

s4 = text_part1.find('<!-- Mobile Drawer Backdrop Overlay')

if s3 != -1 and s4 != -1:
    text_part2 = text_part1[:s3] + text_part1[s4:]
else:
    text_part2 = text_part1

# Add <div class="bc" id="bc"><b>Campus 3D</b></div> into campus-breadcrumb-nav
bc_needle = '<div class="campus-breadcrumb-nav hidden" id="campus-breadcrumb-nav">'
if bc_needle in text_part2:
    text_part3 = text_part2.replace(
        bc_needle,
        '<div class="bc" id="bc"><b>Campus 3D</b></div>\n                ' + bc_needle
    )
else:
    text_part3 = text_part2

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(text_part3)

print('Updated view_dashboard.html successfully!')
