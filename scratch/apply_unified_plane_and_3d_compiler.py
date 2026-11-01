import sys
import re

scripts_path = r'logger/templates/logger/includes/scripts.html'

with open(scripts_path, 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('\r\n', '\n')

# ==============================================================================
# 1. 2D PLAN TO 3D FLOOR COMPILER FUNCTION
# ==============================================================================
compiler_code = '''    // --------------------------------------------------------------------------
    // 2D BLUEPRINT TO 3D ARCHITECTURAL FLOOR PLAN COMPILER
    // Translates user 2D rooms, drawn walls, doors and windows into 3D geometry
    // --------------------------------------------------------------------------
    function compile2DPlanTo3DFloor(fl, floorIdx, totalFloors) {
        const WH = 36;
        const plan = fl.plan || {};
        const rooms = plan.rooms || [];
        const doors = plan.doors || [];
        const windows = plan.windows || [];

        const levelNum = fl.level != null ? fl.level : floorIdx;
        const levelId = levelNum === 0 ? 'GF' : `${levelNum}F`;
        const levelName = fl.name || (levelNum === 0 ? 'Ground Floor' : `Floor ${levelNum}`);

        if (rooms.length === 0) {
            return {
                id: levelId,
                name: levelName,
                sub: '0 Monitored Zones • Blank Layout',
                rooms: [],
                walls: [],
                dev: []
            };
        }

        // 1. Process Rooms into Floor Tiles and Zone Info
        const fRooms = [];
        rooms.forEach((r, rIdx) => {
            const pts = (r.points && r.points.length > 0) ? r.points : [
                { x: r.x || 80, y: r.y || 60 },
                { x: (r.x || 80) + (r.w || 300), y: r.y || 60 },
                { x: (r.x || 80) + (r.w || 300), y: (r.y || 60) + (r.h || 200) },
                { x: r.x || 80, y: (r.y || 60) + (r.h || 200) }
            ];

            const xs = pts.map(p => p.x);
            const ys = pts.map(p => p.y);
            const rx = Math.min(...xs);
            const ry = Math.min(...ys);
            const rw = Math.max(...xs) - rx;
            const rh = Math.max(...ys) - ry;

            // Check if any door in or near this room has live open/alarm state
            const roomDoors = doors.filter(d =>
                d.x >= rx - 20 && d.x <= rx + rw + 20 && d.y >= ry - 20 && d.y <= ry + rh + 20
            );
            const hasAlarm = roomDoors.some(d => {
                const dev = (appState.devices || []).find(x => x.mac === d.deviceMac);
                return dev && (dev.state === 'open' || dev.state === 'alarm');
            });

            fRooms.push({
                n: r.name || `Zone ${rIdx + 1}`,
                x: rx,
                y: ry,
                w: rw,
                h: rh,
                c: r.color || 'var(--floor)',
                ok: !hasAlarm,
                m: [
                    ['Zone Type', r.shape === 'l-shape' ? 'L-Shaped Suite' : (r.shape === 'custom' ? 'Custom Polygon' : 'Office / Room')],
                    ['Dimensions', `${Math.round(rw)} × ${Math.round(rh)} px`],
                    ['Access Doors', `${roomDoors.length} Monitored Points`],
                    ['Security Status', hasAlarm ? 'ALERT / OPEN' : 'SECURED']
                ]
            });
        });

        // 2. Process Extruded Walls from Room Polygons with Door Openings
        const fWalls = [];
        const wallThick = 6;

        rooms.forEach(r => {
            const pts = (r.points && r.points.length > 0) ? r.points : [
                { x: r.x || 80, y: r.y || 60 },
                { x: (r.x || 80) + (r.w || 300), y: r.y || 60 },
                { x: (r.x || 80) + (r.w || 300), y: (r.y || 60) + (r.h || 200) },
                { x: r.x || 80, y: (r.y || 60) + (r.h || 200) }
            ];

            for (let i = 0; i < pts.length; i++) {
                const p1 = pts[i];
                const p2 = pts[(i + 1) % pts.length];

                const x1 = Math.min(p1.x, p2.x);
                const x2 = Math.max(p1.x, p2.x);
                const y1 = Math.min(p1.y, p2.y);
                const y2 = Math.max(p1.y, p2.y);

                const isHoriz = Math.abs(p1.y - p2.y) < 3;
                const isVert = Math.abs(p1.x - p2.x) < 3;

                if (isHoriz) {
                    const segLen = x2 - x1;
                    if (segLen < 12) continue;

                    // Check for doors/windows along this horizontal wall
                    const fixtures = [...doors, ...windows].filter(f =>
                        Math.abs(f.y - y1) < 22 && f.x >= x1 + 10 && f.x <= x2 - 10
                    ).sort((a, b) => a.x - b.x);

                    if (fixtures.length === 0) {
                        fWalls.push([x1, y1 - wallThick / 2, segLen, wallThick, WH, false]);
                    } else {
                        let curX = x1;
                        fixtures.forEach(fix => {
                            const holeStart = Math.max(curX, fix.x - 20);
                            const holeEnd = Math.min(x2, fix.x + 20);
                            if (holeStart > curX + 4) {
                                fWalls.push([curX, y1 - wallThick / 2, holeStart - curX, wallThick, WH, false]);
                            }
                            curX = holeEnd;
                        });
                        if (curX < x2 - 4) {
                            fWalls.push([curX, y1 - wallThick / 2, x2 - curX, wallThick, WH, false]);
                        }
                    }
                } else if (isVert) {
                    const segLen = y2 - y1;
                    if (segLen < 12) continue;

                    // Check for doors/windows along this vertical wall
                    const fixtures = [...doors, ...windows].filter(f =>
                        Math.abs(f.x - x1) < 22 && f.y >= y1 + 10 && f.y <= y2 - 10
                    ).sort((a, b) => a.y - b.y);

                    if (fixtures.length === 0) {
                        fWalls.push([x1 - wallThick / 2, y1, wallThick, segLen, WH, false]);
                    } else {
                        let curY = y1;
                        fixtures.forEach(fix => {
                            const holeStart = Math.max(curY, fix.y - 20);
                            const holeEnd = Math.min(y2, fix.y + 20);
                            if (holeStart > curY + 4) {
                                fWalls.push([x1 - wallThick / 2, curY, wallThick, holeStart - curY, WH, false]);
                            }
                            curY = holeEnd;
                        });
                        if (curY < y2 - 4) {
                            fWalls.push([x1 - wallThick / 2, curY, wallThick, y2 - curY, WH, false]);
                        }
                    }
                }
            }
        });

        // 3. Process 3D Doors & Windows (dev)
        const fDev = [];
        doors.forEach(d => {
            const isVert = (d.rotation === 90 || d.rotation === 270);
            const axis = isVert ? 'Y' : 'X';
            const isAlarm = (appState.devices || []).some(dev => dev.mac === d.deviceMac && (dev.state === 'open' || dev.state === 'alarm'));
            fDev.push([d.x, d.y, d.name || 'Door Sensor', isAlarm, axis, 40, false, false]);
        });

        windows.forEach(w => {
            const isVert = (w.rotation === 90 || w.rotation === 270);
            const axis = isVert ? 'Y' : 'X';
            fDev.push([w.x, w.y, w.name || 'Window Sensor', false, axis, 40, true, true]);
        });

        return {
            id: levelId,
            name: levelName,
            sub: `${fRooms.length} Monitored Zones • ${fDev.length} Hardware Sensors`,
            rooms: fRooms,
            walls: fWalls,
            dev: fDev
        };
    }
'''

# Insert compile2DPlanTo3DFloor right before buildInteriorForBuilding
target_build_interior_start = '    // Build Interior DOM with Authentic Walls, Real 3D Doors & No Props Clutter\n    function buildInteriorForBuilding(building) {'

new_build_interior_start = compiler_code + '''
    // Build Interior DOM with Authentic Walls, Real 3D Doors & No Props Clutter
    function buildInteriorForBuilding(building) {
        const interior = $('interior');
        if (!interior) return;
        interior.innerHTML = '';

        el(interior, 'ground', 'left:-260px;top:-240px;width:1308px;height:948px;transform:translateZ(-6px)');
        el(interior, 'grid', 'left:-300px;top:-300px;width:1388px;height:1068px;transform:translateZ(-7px)');

        // Retrieve full building data with user floor plans from appState.campus
        const appBldg = (appState.campus && appState.campus.buildings)
            ? (appState.campus.buildings.find(b => b.id === building.id || b.name === building.name) || building)
            : building;

        const bldFloors = (appBldg.floors && appBldg.floors.length > 0)
            ? appBldg.floors
            : (appState.plan ? [{ id: 'gf', name: 'Ground Floor', level: 0, plan: appState.plan }] : []);

        // Compile user 2D floor plans into 3D floors F
        F = [];
        bldFloors.forEach((fl, idx) => {
            if (fl.plan && fl.plan.rooms && fl.plan.rooms.length > 0) {
                // User has custom designed/edited rooms in 2D blueprint: compile directly to 3D!
                F.push(compile2DPlanTo3DFloor(fl, idx, bldFloors.length));
            } else if (F_MASTER[idx]) {
                // Fall back to master template
                F.push(F_MASTER[idx]);
            } else {
                F.push(compile2DPlanTo3DFloor(fl, idx, bldFloors.length));
            }
        });

        if (F.length === 0) F = F_MASTER;

        nF = F.length;
        cur = Math.min(cur, nF - 1);
        if (cur < 0) cur = 0;
        sel = null;'''

target_interior_header = '''    // Build Interior DOM with Authentic Walls, Real 3D Doors & No Props Clutter
    function buildInteriorForBuilding(building) {
        const interior = $('interior');
        if (!interior) return;
        interior.innerHTML = '';

        el(interior, 'ground', 'left:-260px;top:-240px;width:1308px;height:948px;transform:translateZ(-6px)');
        el(interior, 'grid', 'left:-300px;top:-300px;width:1388px;height:1068px;transform:translateZ(-7px)');

        // Always use the master architectural floor plan
        F = F_MASTER;
        nF = Math.min(F.length, building.fl || 3);
        cur = 0;
        sel = null;'''

if target_interior_header in code:
    code = code.replace(target_interior_header, new_build_interior_start, 1)
    print("Step 1: Integrated 2D-to-3D plan compiler in buildInteriorForBuilding")
else:
    print("Error: target_interior_header not found")

# ==============================================================================
# 2. UPDATE savePlanManual TO SYNCHRONIZE WITH 3D MODEL
# ==============================================================================
target_save_manual = '''    function savePlanManual() {

        savePlan();

        showToast("Layout saved", "success");

    }'''

new_save_manual = '''    function savePlanManual() {
        savePlan();
        const activeBldg = (appState.campus && appState.campus.buildings)
            ? appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId) : null;
        if (activeBldg && typeof buildInteriorForBuilding === 'function') {
            const b3d = (typeof B !== 'undefined' && Array.isArray(B)) ? B.find(x => x.id === activeBldg.id || x.name === activeBldg.name) : activeBldg;
            buildInteriorForBuilding(b3d || activeBldg);
        }
        showToast("Layout saved and synchronized with 3D model", "success");
    }'''

if target_save_manual in code:
    code = code.replace(target_save_manual, new_save_manual, 1)
    print("Step 2: Updated savePlanManual to re-compile 3D floor plan on save")
else:
    print("Error: target_save_manual not found")

# ==============================================================================
# 3. UNIFY CAMPUS BACKGROUND PLANE AND INTEGRATE ALL BUILDINGS
# ==============================================================================
target_campus_scene = '''        // Build Campus Terrain & Buildings
        campus.innerHTML = \'\';

        el(campus, \'ground\', \'left:-200px;top:-200px;width:1500px;height:1000px;transform:translateZ(-8px)\');
        box(campus, -70, -120, 1160, 640, 10, \'slab\', \'var(--gnd)\', -10);

        env = el(campus, \'bgrp\', \'\');
        box(env, -40, 255, 1100, 16, 2, \'road\', \'var(--road)\');
        box(env, 200, 222, 8, 34, 2, \'road\', \'var(--road)\');
        box(env, 560, 170, 8, 86, 2, \'road\', \'var(--road)\');
        box(env, -40, 40, 60, 160, 2, \'grass\', \'var(--gnd)\');
        box(env, 1010, 60, 60, 180, 2, \'grass\', \'var(--gnd)\');

        const cr = el(env, \'car\', \'animation-delay:-6s\');
        box(cr, 0, 256, 34, 6, 8, \'prop\', \'#f97316\', 2);
        box(cr, 8, 256, 17, 6, 6, \'prop\', \'#e2e8f0\', 10);

        const cr2 = el(env, \'car\', \'animation-duration:30s;animation-delay:-18s;animation-direction:reverse\');
        box(cr2, 0, 264, 34, 6, 8, \'prop\', \'#8b5cf6\', 2);
        box(cr2, 8, 264, 17, 6, 6, \'prop\', \'#e2e8f0\', 10);

        box(env, 780, 300, 230, 170, 2, \'lot\', \'var(--road)\');
        [
            [800, 315, \'#ef4444\'], [800, 350, \'#06b6d4\'], [800, 385, \'#f8fafc\'],
            [800, 420, \'#eab308\'], [900, 315, \'#3b82f6\'], [900, 385, \'#ef4444\']
        ].forEach(([x, y, c]) => {
            box(env, x, y, 34, 16, 8, \'prop\', c, 2);
            box(env, x + 8, y + 2, 17, 12, 6, \'prop\', \'#e2e8f0\', 10);
        });

        [
            [90, 262], [415, 235], [775, 250], [1030, 250], [700, 240], [60, 40], [90, 200]
        ].forEach(([x, y]) => {
            box(env, x - 2, y - 2, 4, 4, 10, \'prop\', \'#92400e\', 2);
            box(env, x - 8, y - 8, 16, 16, 18, \'prop\', \'#22c55e\', 12);
        });

        // Buildings Collection B dynamically built directly from appState.campus.buildings
        B = [];
        const bList = (appState.campus && appState.campus.buildings && appState.campus.buildings.length > 0)
            ? appState.campus.buildings
            : [
                { id: \'bldg_warehouse\', name: \'Logistics Center\', iso: { x: 120, y: 20, width: 280, depth: 200 }, floors: [1, 2, 3], color: \'#e6ecf6\' },
                { id: \'bldg_admin\', name: \'Admin Block\', iso: { x: 470, y: 0, width: 220, depth: 170 }, floors: [1, 2, 3], color: \'#eaeef7\' }
            ];

        bList.forEach((cb, idx) => {
            const hasBldgAlarm = (cb.floors || []).some(fl =>
                (fl.plan?.doors || []).some(d => (appState.devices || []).some(dev => dev.mac === d.deviceMac && (dev.state === \'open\' || dev.state === \'alarm\')))
            );
            const sensorCount = (cb.floors || []).reduce((acc, fl) => acc + (fl.plan?.doors?.length || 0), 0);
            const x = cb.iso?.x ?? (100 + (idx % 2) * 320);
            const y = cb.iso?.y ?? (20 + Math.floor(idx / 2) * 260);
            const w = cb.iso?.width ?? (cb.type === \'warehouse\' ? 280 : 220);
            const h = cb.iso?.depth ?? (cb.type === \'warehouse\' ? 200 : 170);

            B.push({
                id: cb.id,
                name: cb.name,
                x: x,
                y: y,
                w: w,
                h: h,
                fl: (cb.floors || []).length || 2,
                bad: hasBldgAlarm ? 1 : 0,
                s: sensorCount,
                c: cb.color || \'#e6ecf6\'
            });
        });'''

new_campus_scene = '''        // Build Campus Terrain & Buildings on ONE Unified Background Plane
        campus.innerHTML = '';

        // Dynamically collect and position ALL buildings in a clean, spacious 3-column campus park
        B = [];
        const bList = (appState.campus && appState.campus.buildings && appState.campus.buildings.length > 0)
            ? appState.campus.buildings
            : [
                { id: 'bldg_warehouse', name: 'Logistics Center', floors: [1, 2, 3], color: '#e6ecf6' },
                { id: 'bldg_admin', name: 'Admin Block', floors: [1, 2, 3], color: '#eaeef7' }
            ];

        const COLS = 3;
        const COL_PITCH = 340;
        const ROW_PITCH = 280;
        const START_X = 60;
        const START_Y = 40;

        bList.forEach((cb, idx) => {
            const col = idx % COLS;
            const row = Math.floor(idx / COLS);

            const hasBldgAlarm = (cb.floors || []).some(fl =>
                (fl.plan?.doors || []).some(d => (appState.devices || []).some(dev => dev.mac === d.deviceMac && (dev.state === 'open' || dev.state === 'alarm')))
            );
            const sensorCount = (cb.floors || []).reduce((acc, fl) => acc + (fl.plan?.doors?.length || 0), 0);

            const w = (cb.type === 'warehouse') ? 260 : 220;
            const h = (cb.type === 'warehouse') ? 180 : 160;
            const x = START_X + col * COL_PITCH;
            const y = START_Y + row * ROW_PITCH;

            // Update cb.iso coordinates for consistency
            if (!cb.iso) cb.iso = {};
            cb.iso.x = x;
            cb.iso.y = y;
            cb.iso.width = w;
            cb.iso.depth = h;

            B.push({
                id: cb.id,
                name: cb.name,
                x: x,
                y: y,
                w: w,
                h: h,
                fl: (cb.floors || []).length || 2,
                bad: hasBldgAlarm ? 1 : 0,
                s: sensorCount,
                c: cb.color || '#e6ecf6'
            });
        });

        // Calculate overall bounding box of ALL buildings on campus
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        B.forEach(b => {
            minX = Math.min(minX, b.x);
            minY = Math.min(minY, b.y);
            maxX = Math.max(maxX, b.x + b.w);
            maxY = Math.max(maxY, b.y + b.h);
        });

        if (B.length === 0) {
            minX = 0; minY = 0; maxX = 800; maxY = 500;
        }

        // ONE unified ground plane spanning ALL buildings with balanced margins
        const padX = 140;
        const padY = 120;
        const slabX = minX - padX;
        const slabY = minY - padY;
        const slabW = Math.max(1160, (maxX - minX) + padX * 2);
        const slabH = Math.max(680, (maxY - minY) + padY * 2);

        // 1. Soft radial shadow under the unified campus slab
        el(campus, 'ground', `left:${slabX - 100}px;top:${slabY - 100}px;width:${slabW + 200}px;height:${slabH + 200}px;border-radius:50%;transform:translateZ(-8px)`);

        // 2. The ONE unified ground slab holding ALL buildings
        box(campus, slabX, slabY, slabW, slabH, 10, 'slab', 'var(--gnd)', -10);

        // 3. Cohesive Environment Network (roads, trees, parking across entire slab)
        env = el(campus, 'bgrp', '');

        // Main Avenues running across rows
        const numRows = Math.ceil(B.length / COLS);
        for (let r = 0; r <= numRows; r++) {
            const roadY = START_Y + r * ROW_PITCH - 40;
            if (roadY >= slabY && roadY <= slabY + slabH - 30) {
                box(env, slabX + 30, roadY, slabW - 60, 18, 2, 'road', 'var(--road)');
                // Animated car along the avenue
                if (r === 0) {
                    const cr = el(env, 'car', 'animation-delay:-6s');
                    box(cr, slabX + 60, roadY + 2, 34, 6, 8, 'prop', '#f97316', 2);
                    box(cr, slabX + 68, roadY + 2, 17, 6, 6, 'prop', '#e2e8f0', 10);
                } else if (r === 1) {
                    const cr2 = el(env, 'car', 'animation-duration:32s;animation-delay:-16s;animation-direction:reverse');
                    box(cr2, slabX + 120, roadY + 8, 34, 6, 8, 'prop', '#3b82f6', 2);
                    box(cr2, slabX + 128, roadY + 8, 17, 6, 6, 'prop', '#e2e8f0', 10);
                }
            }
        }

        // Connecting cross avenues between building columns
        for (let c = 0; c < COLS - 1; c++) {
            const roadX = START_X + c * COL_PITCH + 260;
            box(env, roadX, slabY + 30, 18, slabH - 60, 2, 'road', 'var(--road)');
        }

        // Green park verges & landscape trees between buildings
        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < COLS; c++) {
                const tx1 = START_X + c * COL_PITCH + 235;
                const ty1 = START_Y + r * ROW_PITCH + 20;
                box(env, tx1, ty1, 4, 4, 10, 'prop', '#92400e', 2);
                box(env, tx1 - 6, ty1 - 6, 16, 16, 18, 'prop', '#22c55e', 12);

                const tx2 = START_X + c * COL_PITCH - 20;
                const ty2 = START_Y + r * ROW_PITCH + 100;
                box(env, tx2, ty2, 4, 4, 10, 'prop', '#92400e', 2);
                box(env, tx2 - 6, ty2 - 6, 16, 16, 18, 'prop', '#16a34a', 12);
            }
        }

        // Corner green parks on the unified slab
        box(env, slabX + 30, slabY + 30, 80, 50, 2, 'grass', 'var(--gnd)');
        box(env, slabX + slabW - 110, slabY + 30, 80, 50, 2, 'grass', 'var(--gnd)');

        // Center camera dynamically on the midpoint of the entire campus
        camCampus.cx = (minX + maxX) / 2;
        camCampus.cy = (minY + maxY) / 2;
        const campusDim = Math.max(slabW / 1200, slabH / 700);
        camCampus.zoom = Math.max(0.40, Math.min(0.85, 0.85 / campusDim));'''

if target_campus_scene in code:
    code = code.replace(target_campus_scene, new_campus_scene, 1)
    print("Step 3: Implemented dynamic unified background plane across all buildings")
else:
    print("Error: target_campus_scene not found")

with open(scripts_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Batch complete.")

