

    // -------------------------------------------------------------

    // Core Application State

    // -------------------------------------------------------------

    const appState = {

        mode: 'monitor',

        selectedId: null,

        isDrawingCustom: false,

        customPoints: [],

        mouseCoords: { x: 0, y: 0 },

        dragState: {

            type: null,

            targetId: null,

            vertexIdx: null,

            startX: 0,

            startY: 0,

            initialX: 0,

            initialY: 0,

            initialW: 0,

            initialH: 0,

            initialPoints: []

        },

        plan: {

            rooms: [],

            doors: [],

            windows: []

        },

        activeStatus: {},

        activeBattery: {},

        deviceRegistry: {},

        lastPollDataStr: "",

        lastLogsDataHash: "",

        lastDevicesDataHash: "",

        isAuthenticated: false,

        allLogsCache: []  // For client-side search filtering

    };

    // -------------------------------------------------------------

    // =============================================================

    // OPTION A: 3D ISOMETRIC CAMPUS & MULTI-FLOOR ARCHITECTURAL ENGINE

    // =============================================================

    function getDefaultCampusData() {

        return {

            viewMode: '3d', // Default to Option A 3D Campus Overview

            activeBuildingId: 'bldg_hq',

            activeFloorId: 'floor_hq_g',

            sensorScope: 'floor', // 'floor' | 'building' | 'campus'

            buildings: [

                {

                    id: 'bldg_hq',
                    name: 'Main Headquarters',
                    type: 'tower',
                    color: '#2563eb',
                    iso: { x: 260, y: 70, width: 140, depth: 110 },

                    floors: [

                        {

                            id: 'floor_hq_g',

                            name: 'Ground Floor (L0)',

                            level: 0,

                            plan: {

                                rooms: [

                                    { id: "room_living", name: "Living Room", shape: 'rect', points: [{ x: 80, y: 60 }, { x: 400, y: 60 }, { x: 400, y: 260 }, { x: 80, y: 260 }] },

                                    { id: "room_bedroom", name: "Master Bedroom", shape: 'rect', points: [{ x: 400, y: 60 }, { x: 720, y: 60 }, { x: 720, y: 260 }, { x: 400, y: 260 }] },

                                    { id: "room_kitchen", name: "Kitchen & Dining", shape: 'rect', points: [{ x: 80, y: 260 }, { x: 400, y: 260 }, { x: 400, y: 440 }, { x: 80, y: 440 }] },

                                    { id: "room_balcony", name: "Balcony & Patio", shape: 'rect', points: [{ x: 400, y: 260 }, { x: 720, y: 260 }, { x: 720, y: 440 }, { x: 400, y: 440 }] }

                                ],

                                doors: [

                                    { id: "door_main", name: "Main Entrance", deviceMac: "24:6F:28:AB:12:01", x: 80, y: 160, rotation: 90 },

                                    { id: "door_bedroom", name: "Bedroom Door", deviceMac: "24:6F:28:AB:12:02", x: 400, y: 160, rotation: 90 },

                                    { id: "door_balcony", name: "Balcony Door", deviceMac: "24:6F:28:AB:12:03", x: 560, y: 260, rotation: 0 }

                                ],

                                windows: [

                                    { id: "window_living", name: "Living Room Window", deviceMac: "", x: 240, y: 60, rotation: 0 },

                                    { id: "window_kitchen", name: "Kitchen Window", deviceMac: "24:6F:28:AB:12:04", x: 240, y: 440, rotation: 180 },

                                    { id: "window_bedroom", name: "Bedroom Window", deviceMac: "", x: 720, y: 160, rotation: 90 }

                                ]

                            }

                        },

                        {

                            id: 'floor_hq_1',

                            name: 'Floor 1 - Offices (L1)',

                            level: 1,

                            plan: {

                                rooms: [

                                    { id: "room_exec", name: "Executive Suite", shape: 'rect', points: [{ x: 80, y: 60 }, { x: 400, y: 60 }, { x: 400, y: 260 }, { x: 80, y: 260 }] },

                                    { id: "room_board", name: "Boardroom", shape: 'rect', points: [{ x: 400, y: 60 }, { x: 720, y: 60 }, { x: 720, y: 260 }, { x: 400, y: 260 }] },

                                    { id: "room_open", name: "Open Workspace", shape: 'rect', points: [{ x: 80, y: 260 }, { x: 520, y: 260 }, { x: 520, y: 440 }, { x: 80, y: 440 }] },

                                    { id: "room_server", name: "Server Vault", shape: 'rect', points: [{ x: 520, y: 260 }, { x: 720, y: 260 }, { x: 720, y: 440 }, { x: 520, y: 440 }] }

                                ],

                                doors: [

                                    { id: "door_exec", name: "Executive Door", deviceMac: "24:6F:28:AB:12:05", x: 400, y: 160, rotation: 90 },

                                    { id: "door_server", name: "Server Vault Door", deviceMac: "", x: 520, y: 350, rotation: 90 }

                                ],

                                windows: [

                                    { id: "win_exec", name: "Executive Window", deviceMac: "", x: 240, y: 60, rotation: 0 },

                                    { id: "win_board", name: "Boardroom Window", deviceMac: "", x: 560, y: 60, rotation: 0 }

                                ]

                            }

                        },

                        {

                            id: 'floor_hq_2',

                            name: 'Floor 2 - R&D Lab (L2)',

                            level: 2,

                            plan: {

                                rooms: [

                                    { id: "room_rd_lab", name: "Hardware Prototyping", shape: 'rect', points: [{ x: 80, y: 60 }, { x: 420, y: 60 }, { x: 420, y: 440 }, { x: 80, y: 440 }] },

                                    { id: "room_test_chamber", name: "Anechoic Chamber", shape: 'rect', points: [{ x: 420, y: 60 }, { x: 720, y: 60 }, { x: 720, y: 260 }, { x: 420, y: 260 }] },

                                    { id: "room_cleanroom", name: "Cleanroom Lab", shape: 'rect', points: [{ x: 420, y: 260 }, { x: 720, y: 260 }, { x: 720, y: 440 }, { x: 420, y: 440 }] }

                                ],

                                doors: [

                                    { id: "door_lab_entry", name: "R&D Lab Entry", deviceMac: "24:6F:28:AB:12:06", x: 420, y: 160, rotation: 90 }

                                ],

                                windows: [

                                    { id: "win_lab", name: "Lab Window", deviceMac: "", x: 250, y: 60, rotation: 0 }

                                ]

                            }

                        }

                    ]

                },

                {

                    id: 'bldg_warehouse',
                    name: 'Logistics Center',
                    type: 'warehouse',
                    color: '#059669',
                    iso: { x: 40, y: 310, width: 170, depth: 130 },

                    floors: [

                        {

                            id: 'floor_wh_g',

                            name: 'Ground Floor - Logistics Bay',

                            level: 0,

                            plan: {

                                rooms: [

                                    { id: "room_loading_bay", name: "Main Loading Bay", shape: 'rect', points: [{ x: 80, y: 60 }, { x: 460, y: 60 }, { x: 460, y: 440 }, { x: 80, y: 440 }] },

                                    { id: "room_cold_storage", name: "Cold Storage Vault", shape: 'rect', points: [{ x: 460, y: 60 }, { x: 720, y: 60 }, { x: 720, y: 250 }, { x: 460, y: 250 }] },

                                    { id: "room_dispatch_office", name: "Dispatch Office", shape: 'rect', points: [{ x: 460, y: 250 }, { x: 720, y: 250 }, { x: 720, y: 440 }, { x: 460, y: 440 }] }

                                ],

                                doors: [

                                    { id: "door_garage", name: "Garage Entry", deviceMac: "24:6F:28:AB:12:07", x: 80, y: 250, rotation: 90 },

                                    { id: "door_garden", name: "Back Garden Gate", deviceMac: "", x: 460, y: 350, rotation: 90 }

                                ],

                                windows: [

                                    { id: "win_dispatch", name: "Dispatch Window", deviceMac: "", x: 590, y: 440, rotation: 180 }

                                ]

                            }

                        }

                    ]

                },

                {

                    id: 'bldg_ops',
                    name: 'Operations Annex',
                    type: 'lab',
                    color: '#7c3aed',
                    iso: { x: 370, y: 310, width: 140, depth: 105 },

                    floors: [

                        {

                            id: 'floor_ops_g',

                            name: 'Ground Floor - Assembly Bay',

                            level: 0,

                            plan: {

                                rooms: [

                                    { id: "room_assembly", name: "Robotics Assembly Floor", shape: 'rect', points: [{ x: 80, y: 60 }, { x: 450, y: 60 }, { x: 450, y: 440 }, { x: 80, y: 440 }] },

                                    { id: "room_staging", name: "Materials Staging", shape: 'rect', points: [{ x: 450, y: 60 }, { x: 720, y: 60 }, { x: 720, y: 440 }, { x: 450, y: 440 }] }

                                ],

                                doors: [

                                    { id: "door_assembly_in", name: "Assembly Security Portal", deviceMac: "24:6F:28:AB:12:08", x: 450, y: 250, rotation: 90 }

                                ],

                                windows: []

                            }

                        },

                        {

                            id: 'floor_ops_1',

                            name: 'Floor 1 - QA & Testing Lab',

                            level: 1,

                            plan: {

                                rooms: [

                                    { id: "room_qa", name: "Quality Assurance Lab", shape: 'rect', points: [{ x: 80, y: 60 }, { x: 400, y: 60 }, { x: 400, y: 440 }, { x: 80, y: 440 }] },

                                    { id: "room_calibration", name: "Sensor Calibration Room", shape: 'rect', points: [{ x: 400, y: 60 }, { x: 720, y: 60 }, { x: 720, y: 440 }, { x: 400, y: 440 }] }

                                ],

                                doors: [

                                    { id: "door_qa_entry", name: "QA Lab Door", deviceMac: "", x: 400, y: 250, rotation: 90 }

                                ],

                                windows: []

                            }

                        }

                    ]

                }

            ]

        };

    }

    
    // --- ANTIGRAVITY PROCEDURAL CAMPUS ENGINE ---
    function hashCoord(x, y, seed = 0) {
        let h = ((Math.floor(x) * 374761393 + Math.floor(y) * 668265263 + seed * 982451653) ^ 0x5bf03635) >>> 0;
        h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0;
        h = (h ^ (h >>> 16)) >>> 0;
        return (h >>> 0) / 4294967296.0;
    }

    function findSpaciousParcel(existingBuildings, bWidth = 140, bDepth = 110) {
        const minGap = 85;
        const candidateParcels = [
            { col: 0, row: 0 },
            { col: 1, row: 0 },
            { col: 2, row: 0 },
            { col: 0, row: 1 },
            { col: 1, row: 1 },
            { col: 2, row: 1 },
            { col: -1, row: 0 },
            { col: -1, row: 1 },
            { col: 0, row: -1 },
            { col: 1, row: -1 },
            { col: 2, row: -1 },
            { col: 0, row: 2 },
            { col: 1, row: 2 },
            { col: 2, row: 2 },
            { col: -1, row: -1 },
            { col: -1, row: 2 }
        ];

        for (let r = 3; r <= 8; r++) {
            for (let c = -r + 1; c <= r; c++) {
                candidateParcels.push({ col: c, row: -r + 1 });
                candidateParcels.push({ col: c, row: r });
            }
            for (let rw = -r + 2; rw <= r - 1; rw++) {
                candidateParcels.push({ col: -r + 1, row: rw });
                candidateParcels.push({ col: r, row: rw });
            }
        }

        for (const cell of candidateParcels) {
            const baseX = 40 + cell.col * 270;
            const baseY = 70 + cell.row * 240;
            const jitterX = Math.round(hashCoord(cell.col, cell.row, 13) * 26 - 13);
            const jitterY = Math.round(hashCoord(cell.col, cell.row, 29) * 26 - 13);
            const candX = baseX + jitterX;
            const candY = baseY + jitterY;
            const candX2 = candX + bWidth;
            const candY2 = candY + bDepth;

            let collides = false;
            for (const b of (existingBuildings || [])) {
                const bx = b.iso?.x ?? 260;
                const by = b.iso?.y ?? 70;
                const bw = b.iso?.width ?? 140;
                const bd = b.iso?.depth ?? 110;
                const bx2 = bx + bw;
                const by2 = by + bd;

                if (!(candX2 + minGap < bx || candX > bx2 + minGap || candY2 + minGap < by || candY > by2 + minGap)) {
                    collides = true;
                    break;
                }
            }

            if (!collides) {
                return { x: candX, y: candY };
            }
        }

        const fallbackCol = (existingBuildings || []).length;
        return { x: 40 + fallbackCol * 280, y: 70 };
    }

    function sanitizeAndSpaceCampusBuildings(buildings) {
        if (!buildings || buildings.length <= 1) return false;
        let modified = false;
        const minGap = 80;

        for (let i = 0; i < buildings.length; i++) {
            const b = buildings[i];
            if (!b.iso) {
                b.iso = { x: 260, y: 70, width: 140, depth: 110 };
                modified = true;
            }
            if (!b.iso.width) b.iso.width = b.type === 'warehouse' ? 170 : 140;
            if (!b.iso.depth) b.iso.depth = b.type === 'warehouse' ? 130 : 110;
        }

        for (let i = 1; i < buildings.length; i++) {
            const bA = buildings[i];
            let hasOverlap = false;
            for (let j = 0; j < i; j++) {
                const bB = buildings[j];
                const aX1 = bA.iso.x, aY1 = bA.iso.y;
                const aX2 = bA.iso.x + bA.iso.width, aY2 = bA.iso.y + bA.iso.depth;
                const bX1 = bB.iso.x, bY1 = bB.iso.y;
                const bX2 = bB.iso.x + bB.iso.width, bY2 = bB.iso.y + bB.iso.depth;

                if (!(aX2 + minGap < bX1 || aX1 > bX2 + minGap || aY2 + minGap < bY1 || aY1 > bY2 + minGap)) {
                    hasOverlap = true;
                    break;
                }
            }
            if (hasOverlap) {
                const newPos = findSpaciousParcel(buildings.slice(0, i), bA.iso.width, bA.iso.depth);
                bA.iso.x = newPos.x;
                bA.iso.y = newPos.y;
                modified = true;
            }
        }
        return modified;
    }

    function initCampusSystem() {

        try {

            const raw = localStorage.getItem("smartdoor_campus_data");

            if (raw) {

                appState.campus = JSON.parse(raw);
                if (appState.campus.buildings) {
                    appState.campus.buildings.forEach(b => { delete b.metric; });
                }

            } else {

                appState.campus = getDefaultCampusData();

                // If user had existing plan from single-building mode, copy to ground floor of HQ

                const savedOldPlan = localStorage.getItem("smartdoor_floorplan");

                if (savedOldPlan) {

                    try {

                        const oldPlan = JSON.parse(savedOldPlan);

                        if (oldPlan.rooms && oldPlan.rooms.length > 0) {

                            appState.campus.buildings[0].floors[0].plan = oldPlan;

                        }

                    } catch (e) { }

                }

                saveCampusData();

            }

        } catch (e) {

            console.error("Campus init error:", e);

            appState.campus = getDefaultCampusData();

        }

        // Validate active building and floor

        let currentBldg = appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId);

        if (!currentBldg && appState.campus.buildings.length > 0) {

            currentBldg = appState.campus.buildings[0];

            appState.campus.activeBuildingId = currentBldg.id;

        }

        if (currentBldg) {

            let currentFloor = currentBldg.floors.find(f => f.id === appState.campus.activeFloorId);

            if (!currentFloor && currentBldg.floors.length > 0) {

                currentFloor = currentBldg.floors[0];

                appState.campus.activeFloorId = currentFloor.id;

            }

            if (currentFloor) {

                appState.plan = currentFloor.plan;

            }

        }

        setDashboardViewMode(appState.campus.viewMode || '3d', false);
        const savedScope = appState.campus.sensorScope || 'floor';
        ['floor', 'bldg', 'campus'].forEach(s => {
            const btn = document.getElementById('btn-scope-' + s);
            if (btn) {
                if ((savedScope === 'building' && s === 'bldg') || savedScope === s) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });

    }

    function saveCampusData() {

        if (!appState.campus) return;

        try {

            localStorage.setItem("smartdoor_campus_data", JSON.stringify(appState.campus));

        } catch (e) {

            console.error("Error saving campus data:", e);

        }

    }

    // -------------------------------------------------------------

    // Isometric Projection Math

    // -------------------------------------------------------------

    function projectIso(x, y, z = 0, ox = 470, oy = 95) {

        const cos30 = 0.866025;

        const sin30 = 0.5;

        const sx = ox + (x - y) * cos30;

        const sy = oy + (x + y) * sin30 - z;

        return { x: Math.round(sx * 10) / 10, y: Math.round(sy * 10) / 10 };

    }

    // -------------------------------------------------------------

    // 3D Campus Isometric Rendering Engine (Option A)

    // -------------------------------------------------------------

    function renderCampus3DLegacySVG() {
        const svg = document.getElementById("campus-3d-svg");
        const overlay = document.getElementById("campus-3d-pins-overlay");
        if (!svg) return;
        if (overlay) overlay.innerHTML = '';

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const campus = appState.campus;
        if (!campus || !campus.buildings) return;

        // Auto-resolve any colliding or improperly spaced buildings in saved state
        if (typeof sanitizeAndSpaceCampusBuildings === 'function') {
            if (sanitizeAndSpaceCampusBuildings(campus.buildings)) {
                if (typeof saveCampusData === 'function') saveCampusData();
            }
        }

        const labelsVisible = appState.campusLabelsVisible !== false;

        // 1. Theme Color Palettes
        const cSlabTop = isDark ? '#0b1329' : '#f8fafc';
        const cSlabLeft = isDark ? '#060a17' : '#cbd5e1';
        const cSlabRight = isDark ? '#040710' : '#94a3b8';
        const cGridLine = isDark ? 'rgba(56, 189, 248, 0.07)' : 'rgba(148, 163, 184, 0.22)';
        const cRoad = isDark ? '#111827' : '#e2e8f0';
        const cRoadLine = isDark ? '#f59e0b' : '#ffffff';
        const cLawn = isDark ? 'rgba(16, 185, 129, 0.14)' : 'rgba(16, 185, 129, 0.22)';
        const cLawnBorder = isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.50)';

        // 2. SVG Definitions (Gradients, Shadows, Light Trails)
        let svgHtml = `
            <defs>
                <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${isDark ? '#0f172a' : '#f8fafc'}" />
                    <stop offset="100%" stop-color="${isDark ? '#020617' : '#e2e8f0'}" />
                </linearGradient>
                <linearGradient id="roadAsphalt" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${isDark ? '#1e293b' : '#cbd5e1'}" />
                    <stop offset="100%" stop-color="${isDark ? '#0f172a' : '#94a3b8'}" />
                </linearGradient>
                <linearGradient id="metalSiloGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="${isDark ? '#334155' : '#94a3b8'}" />
                    <stop offset="35%" stop-color="${isDark ? '#64748b' : '#e2e8f0'}" />
                    <stop offset="70%" stop-color="${isDark ? '#475569' : '#cbd5e1'}" />
                    <stop offset="100%" stop-color="${isDark ? '#1e293b' : '#64748b'}" />
                </linearGradient>
                <linearGradient id="wallLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${isDark ? '#1e293b' : '#f1f5f9'}" />
                    <stop offset="100%" stop-color="${isDark ? '#090d16' : '#cbd5e1'}" />
                </linearGradient>
                <linearGradient id="wallRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${isDark ? '#334155' : '#ffffff'}" />
                    <stop offset="100%" stop-color="${isDark ? '#111827' : '#e2e8f0'}" />
                </linearGradient>
                <linearGradient id="corrugatedRoof" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${isDark ? '#334155' : '#e2e8f0'}" />
                    <stop offset="50%" stop-color="${isDark ? '#1e293b' : '#cbd5e1'}" />
                    <stop offset="100%" stop-color="${isDark ? '#0f172a' : '#94a3b8'}" />
                </linearGradient>
                <linearGradient id="curtainGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${isDark ? '#0284c7' : '#bae6fd'}" stop-opacity="0.85" />
                    <stop offset="100%" stop-color="${isDark ? '#0369a1' : '#7dd3fc'}" stop-opacity="0.9" />
                </linearGradient>
                <linearGradient id="solarGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${isDark ? '#1e3a8a' : '#3b82f6'}" stop-opacity="0.9" />
                    <stop offset="100%" stop-color="${isDark ? '#0f172a' : '#1d4ed8'}" stop-opacity="0.95" />
                </linearGradient>
                <linearGradient id="waterPoolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${isDark ? '#0284c7' : '#38bdf8'}" stop-opacity="0.85" />
                    <stop offset="100%" stop-color="${isDark ? '#0369a1' : '#0284c7'}" stop-opacity="0.95" />
                </linearGradient>
                <linearGradient id="trailCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#06b6d4" stop-opacity="0" />
                    <stop offset="50%" stop-color="#38bdf8" stop-opacity="1" />
                    <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="trailAmberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#f59e0b" stop-opacity="0" />
                    <stop offset="50%" stop-color="#fbbf24" stop-opacity="1" />
                    <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
                </linearGradient>
                <radialGradient id="lampGlowRadial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="${isDark ? '#38bdf8' : '#fed7aa'}" stop-opacity="${isDark ? '0.6' : '0.4'}" />
                    <stop offset="50%" stop-color="${isDark ? '#0284c7' : '#fdba74'}" stop-opacity="${isDark ? '0.2' : '0.1'}" />
                    <stop offset="100%" stop-color="#000000" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="fountainRadial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.9" />
                    <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.7" />
                    <stop offset="100%" stop-color="#0284c7" stop-opacity="0.4" />
                </radialGradient>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="campusCardShadow" x="-25%" y="-25%" width="150%" height="160%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.10" />
                </filter>
                <filter id="campusCardShadowHover" x="-25%" y="-25%" width="150%" height="160%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#2563eb" flood-opacity="0.22" />
                </filter>
                <filter id="campusCardShadowDark" x="-25%" y="-25%" width="150%" height="160%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.65" />
                    <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#38bdf8" flood-opacity="0.20" />
                </filter>
                <filter id="campusCardShadowDarkHover" x="-25%" y="-25%" width="150%" height="160%">
                    <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.75" />
                    <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#38bdf8" flood-opacity="0.40" />
                </filter>
            </defs>
        `;

        // 3. Compute Dynamic Campus Bounds from Buildings
        let minIsoX = 40, maxIsoX = 540, minIsoY = 50, maxIsoY = 440;
        (campus.buildings || []).forEach(b => {
            const bx = b.iso?.x ?? 260;
            const by = b.iso?.y ?? 70;
            const bw = b.iso?.width ?? 140;
            const bd = b.iso?.depth ?? 110;
            minIsoX = Math.min(minIsoX, bx);
            minIsoY = Math.min(minIsoY, by);
            maxIsoX = Math.max(maxIsoX, bx + bw);
            maxIsoY = Math.max(maxIsoY, by + bd);
        });

        // Setback margin padding around outer buildings
        const marginPadding = 150;
        const slabMinX = Math.min(-60, Math.floor((minIsoX - marginPadding) / 50) * 50);
        const slabMinY = Math.min(-60, Math.floor((minIsoY - marginPadding) / 50) * 50);
        const slabMaxX = Math.max(560, Math.ceil((maxIsoX + marginPadding) / 50) * 50);
        const slabMaxY = Math.max(460, Math.ceil((maxIsoY + marginPadding) / 50) * 50);

        // Screen points collector for dynamic viewBox framing
        const screenPoints = [];
        function registerScreenPoint(pt) {
            if (pt && typeof pt.x === 'number' && typeof pt.y === 'number') {
                screenPoints.push(pt);
            }
        }

        // 4. Dynamic 3D Architectural Base Podium Slab
        const slabP0 = projectIso(slabMinX, slabMinY, 0);
        const slabP1 = projectIso(slabMaxX, slabMinY, 0);
        const slabP2 = projectIso(slabMaxX, slabMaxY, 0);
        const slabP3 = projectIso(slabMinX, slabMaxY, 0);
        const slabDrop = 16;
        const slabB1 = projectIso(slabMaxX, slabMinY, -slabDrop);
        const slabB2 = projectIso(slabMaxX, slabMaxY, -slabDrop);
        const slabB3 = projectIso(slabMinX, slabMaxY, -slabDrop);

        registerScreenPoint(slabP0);
        registerScreenPoint(slabP1);
        registerScreenPoint(slabP2);
        registerScreenPoint(slabP3);
        registerScreenPoint(slabB1);
        registerScreenPoint(slabB2);
        registerScreenPoint(slabB3);

        svgHtml += `
            <polygon points="${slabP3.x},${slabP3.y} ${slabP2.x},${slabP2.y} ${slabB2.x},${slabB2.y} ${slabB3.x},${slabB3.y}" fill="${cSlabLeft}" />
            <polygon points="${slabP2.x},${slabP2.y} ${slabP1.x},${slabP1.y} ${slabB1.x},${slabB1.y} ${slabB2.x},${slabB2.y}" fill="${cSlabRight}" />
            <polygon points="${slabP0.x},${slabP0.y} ${slabP1.x},${slabP1.y} ${slabP2.x},${slabP2.y} ${slabP3.x},${slabP3.y}" fill="url(#groundGrad)" stroke="${isDark ? '#1e293b' : '#cbd5e1'}" stroke-width="1.2" />
        `;

        if (isDark) {
            for (let gx = slabMinX + 30; gx <= slabMaxX - 30; gx += 50) {
                const ga = projectIso(gx, slabMinY + 10, 0);
                const gb = projectIso(gx, slabMaxY - 10, 0);
                svgHtml += `<line x1="${ga.x}" y1="${ga.y}" x2="${gb.x}" y2="${gb.y}" stroke="${cGridLine}" stroke-width="1" />`;
            }
            for (let gy = slabMinY + 30; gy <= slabMaxY - 30; gy += 50) {
                const ga = projectIso(slabMinX + 10, gy, 0);
                const gb = projectIso(slabMaxX - 10, gy, 0);
                svgHtml += `<line x1="${ga.x}" y1="${ga.y}" x2="${gb.x}" y2="${gb.y}" stroke="${cGridLine}" stroke-width="1" />`;
            }
        }

        // 5. Procedural Connected Road Network
        // Find all corridor rows and columns that intersect the expanded slab
        const roadRowMin = Math.floor(slabMinY / 240);
        const roadRowMax = Math.ceil(slabMaxY / 240);
        const roadColMin = Math.floor(slabMinX / 270);
        const roadColMax = Math.ceil(slabMaxX / 270);

        const roadW = 38;

        // East-West Boulevards
        for (let r = roadRowMin; r <= roadRowMax; r++) {
            const rY = r * 240 + 195;
            if (rY >= slabMinY + 10 && rY + roadW <= slabMaxY - 10) {
                const p0 = projectIso(slabMinX + 10, rY, 0);
                const p1 = projectIso(slabMaxX - 10, rY, 0);
                const p2 = projectIso(slabMaxX - 10, rY + roadW, 0);
                const p3 = projectIso(slabMinX + 10, rY + roadW, 0);
                svgHtml += `<polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="url(#roadAsphalt)" opacity="0.95" />`;

                const c0 = projectIso(slabMinX + 15, rY + roadW / 2, 0);
                const c1 = projectIso(slabMaxX - 15, rY + roadW / 2, 0);
                svgHtml += `<line x1="${c0.x}" y1="${c0.y}" x2="${c1.x}" y2="${c1.y}" stroke="${cRoadLine}" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.75" />`;

                if (isDark) {
                    svgHtml += `
                        <line x1="${c0.x}" y1="${c0.y - 3}" x2="${c1.x}" y2="${c1.y - 3}" stroke="url(#trailCyanGrad)" stroke-width="2.2" stroke-dasharray="24 36" class="iso-light-trail" />
                        <line x1="${c1.x}" y1="${c1.y + 3}" x2="${c0.x}" y2="${c0.y + 3}" stroke="url(#trailAmberGrad)" stroke-width="2.2" stroke-dasharray="20 32" class="iso-light-trail-rev" />
                    `;
                }
            }
        }

        // North-South Avenues
        for (let c = roadColMin; c <= roadColMax; c++) {
            const rX = c * 270 + 215;
            if (rX >= slabMinX + 10 && rX + roadW <= slabMaxX - 10) {
                const p0 = projectIso(rX, slabMinY + 10, 0);
                const p1 = projectIso(rX + roadW, slabMinY + 10, 0);
                const p2 = projectIso(rX + roadW, slabMaxY - 10, 0);
                const p3 = projectIso(rX, slabMaxY - 10, 0);
                svgHtml += `<polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="url(#roadAsphalt)" opacity="0.95" />`;

                const c0 = projectIso(rX + roadW / 2, slabMinY + 15, 0);
                const c1 = projectIso(rX + roadW / 2, slabMaxY - 15, 0);
                svgHtml += `<line x1="${c0.x}" y1="${c0.y}" x2="${c1.x}" y2="${c1.y}" stroke="${cRoadLine}" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.75" />`;

                if (isDark) {
                    svgHtml += `
                        <line x1="${c0.x - 3}" y1="${c0.y}" x2="${c1.x - 3}" y2="${c1.y}" stroke="url(#trailCyanGrad)" stroke-width="2.2" stroke-dasharray="20 30" class="iso-light-trail" />
                    `;
                }
            }
        }

        // Crosswalk Zebras at Road Intersections
        for (let r = roadRowMin; r <= roadRowMax; r++) {
            const rY = r * 240 + 195;
            for (let c = roadColMin; c <= roadColMax; c++) {
                const rX = c * 270 + 215;
                if (rX >= slabMinX + 20 && rX + roadW <= slabMaxX - 20 && rY >= slabMinY + 20 && rY + roadW <= slabMaxY - 20) {
                    for (let z = 0; z < 3; z++) {
                        const zA = projectIso(rX + 4 + z * 10, rY - 4, 0);
                        const zB = projectIso(rX + 10 + z * 10, rY - 4, 0);
                        const zC = projectIso(rX + 10 + z * 10, rY + 1, 0);
                        const zD = projectIso(rX + 4 + z * 10, rY + 1, 0);
                        svgHtml += `<polygon points="${zA.x},${zA.y} ${zB.x},${zB.y} ${zC.x},${zC.y} ${zD.x},${zD.y}" fill="#ffffff" opacity="0.75" />`;
                    }
                }
            }
        }

        // 6. Isometric Vehicles Helper
        function renderIsoCar(cx, cy, color, angle = 'horizontal') {
            const cL = angle === 'horizontal' ? 20 : 11;
            const cW = angle === 'horizontal' ? 11 : 20;
            const cH = 6;
            const b0 = projectIso(cx - cL / 2, cy - cW / 2, 0);
            const b1 = projectIso(cx + cL / 2, cy - cW / 2, 0);
            const b2 = projectIso(cx + cL / 2, cy + cW / 2, 0);
            const b3 = projectIso(cx - cL / 2, cy + cW / 2, 0);

            const m0 = projectIso(cx - cL / 2, cy - cW / 2, cH * 0.6);
            const m1 = projectIso(cx + cL / 2, cy - cW / 2, cH * 0.6);
            const m2 = projectIso(cx + cL / 2, cy + cW / 2, cH * 0.6);
            const m3 = projectIso(cx - cL / 2, cy + cW / 2, cH * 0.6);

            const r0 = projectIso(cx - cL * 0.25, cy - cW * 0.35, cH);
            const r1 = projectIso(cx + cL * 0.25, cy - cW * 0.35, cH);
            const r2 = projectIso(cx + cL * 0.25, cy + cW * 0.35, cH);
            const r3 = projectIso(cx - cL * 0.25, cy + cW * 0.35, cH);

            registerScreenPoint(b0);
            registerScreenPoint(b2);

            return `
                <g class="iso-car">
                    <polygon points="${b0.x + 2},${b0.y + 1} ${b1.x + 2},${b1.y + 1} ${b2.x + 2},${b2.y + 1} ${b3.x + 2},${b3.y + 1}" fill="rgba(0,0,0,0.32)" />
                    <polygon points="${b3.x},${b3.y} ${m3.x},${m3.y} ${m2.x},${m2.y} ${b2.x},${b2.y}" fill="${color}" filter="brightness(0.85)" />
                    <polygon points="${b2.x},${b2.y} ${m2.x},${m2.y} ${m1.x},${m1.y} ${b1.x},${b1.y}" fill="${color}" filter="brightness(0.70)" />
                    <polygon points="${m0.x},${m0.y} ${m1.x},${m1.y} ${m2.x},${m2.y} ${m3.x},${m3.y}" fill="${color}" />
                    <polygon points="${m3.x},${m3.y} ${r3.x},${r3.y} ${r2.x},${r2.y} ${m2.x},${m2.y}" fill="${isDark ? '#0284c7' : '#0369a1'}" opacity="0.8" />
                    <polygon points="${m2.x},${m2.y} ${r2.x},${r2.y} ${r1.x},${r1.y} ${m1.x},${m1.y}" fill="${isDark ? '#0369a1' : '#075985'}" opacity="0.85" />
                    <polygon points="${r0.x},${r0.y} ${r1.x},${r1.y} ${r2.x},${r2.y} ${r3.x},${r3.y}" fill="${color}" filter="brightness(1.1)" />
                    <circle cx="${m2.x - 1}" cy="${m2.y}" r="1.5" fill="#fef08a" />
                    <circle cx="${m1.x - 1}" cy="${m1.y}" r="1.5" fill="#fef08a" />
                </g>
            `;
        }

        // 7. Tree Species Renderers (4 Realistic Architectures)
        function renderBroadleafTree(tx, ty, scale = 1) {
            const p0 = projectIso(tx, ty, 0);
            const pTrunk = projectIso(tx, ty, 10 * scale);
            const pCrown1 = projectIso(tx, ty, 15 * scale);
            const pCrown2 = projectIso(tx, ty, 20 * scale);
            registerScreenPoint(p0);
            registerScreenPoint(pCrown2);

            return `
                <ellipse cx="${p0.x + 3 * scale}" cy="${p0.y + 2 * scale}" rx="${8 * scale}" ry="${4.5 * scale}" fill="rgba(0,0,0,0.25)" />
                <line x1="${p0.x}" y1="${p0.y}" x2="${pTrunk.x}" y2="${pTrunk.y}" stroke="${isDark ? '#78350f' : '#92400e'}" stroke-width="${2.2 * scale}" />
                <circle cx="${pCrown1.x}" cy="${pCrown1.y}" r="${7 * scale}" fill="${isDark ? '#065f46' : '#059669'}" opacity="0.9" />
                <circle cx="${pCrown2.x}" cy="${pCrown2.y}" r="${5.5 * scale}" fill="${isDark ? '#10b981' : '#34d399'}" opacity="0.95" />
                <circle cx="${pCrown2.x - 1.5 * scale}" cy="${pCrown2.y - 1.5 * scale}" r="${2.5 * scale}" fill="${isDark ? '#6ee7b7' : '#a7f3d0'}" opacity="0.8" />
            `;
        }

        function renderPineTree(tx, ty, scale = 1) {
            const p0 = projectIso(tx, ty, 0);
            const pTrunk = projectIso(tx, ty, 8 * scale);
            const pT1 = projectIso(tx, ty, 14 * scale);
            const pT2 = projectIso(tx, ty, 21 * scale);
            const pT3 = projectIso(tx, ty, 27 * scale);
            registerScreenPoint(p0);
            registerScreenPoint(pT3);

            const cBase = isDark ? '#064e3b' : '#047857';
            const cMid = isDark ? '#065f46' : '#059669';
            const cTop = isDark ? '#10b981' : '#34d399';

            return `
                <ellipse cx="${p0.x + 2 * scale}" cy="${p0.y + 1 * scale}" rx="${6 * scale}" ry="${3.5 * scale}" fill="rgba(0,0,0,0.22)" />
                <line x1="${p0.x}" y1="${p0.y}" x2="${pTrunk.x}" y2="${pTrunk.y}" stroke="${isDark ? '#451a03' : '#78350f'}" stroke-width="${2 * scale}" />
                <polygon points="${pT1.x - 8 * scale},${pT1.y + 3 * scale} ${pT1.x + 8 * scale},${pT1.y + 3 * scale} ${pT1.x},${pT1.y - 5 * scale}" fill="${cBase}" />
                <polygon points="${pT2.x - 6.5 * scale},${pT2.y + 2 * scale} ${pT2.x + 6.5 * scale},${pT2.y + 2 * scale} ${pT2.x},${pT2.y - 4.5 * scale}" fill="${cMid}" />
                <polygon points="${pT3.x - 4.5 * scale},${pT3.y + 1.5 * scale} ${pT3.x + 4.5 * scale},${pT3.y + 1.5 * scale} ${pT3.x},${pT3.y - 4 * scale}" fill="${cTop}" />
            `;
        }

        function renderBlossomTree(tx, ty, scale = 1) {
            const p0 = projectIso(tx, ty, 0);
            const pTrunk = projectIso(tx, ty, 9 * scale);
            const pCrown1 = projectIso(tx, ty, 14 * scale);
            const pCrown2 = projectIso(tx, ty, 19 * scale);
            registerScreenPoint(p0);
            registerScreenPoint(pCrown2);

            return `
                <ellipse cx="${p0.x + 2 * scale}" cy="${p0.y + 1 * scale}" rx="${7.5 * scale}" ry="${4 * scale}" fill="rgba(0,0,0,0.20)" />
                <line x1="${p0.x}" y1="${p0.y}" x2="${pTrunk.x}" y2="${pTrunk.y}" stroke="${isDark ? '#5c2b14' : '#78350f'}" stroke-width="${2 * scale}" />
                <circle cx="${pCrown1.x}" cy="${pCrown1.y}" r="${7 * scale}" fill="${isDark ? '#9d174d' : '#f43f5e'}" opacity="0.85" />
                <circle cx="${pCrown2.x}" cy="${pCrown2.y}" r="${5.5 * scale}" fill="${isDark ? '#f43f5e' : '#fda4af'}" opacity="0.92" />
                <circle cx="${pCrown2.x - 1.5 * scale}" cy="${pCrown2.y - 1.5 * scale}" r="${2.5 * scale}" fill="${isDark ? '#fbcfe8' : '#fff1f2'}" opacity="0.85" />
            `;
        }

        function renderCypressTree(tx, ty, scale = 1) {
            const p0 = projectIso(tx, ty, 0);
            const pTrunk = projectIso(tx, ty, 6 * scale);
            const pTop = projectIso(tx, ty, 26 * scale);
            registerScreenPoint(p0);
            registerScreenPoint(pTop);

            return `
                <ellipse cx="${p0.x + 1 * scale}" cy="${p0.y + 1 * scale}" rx="${4.5 * scale}" ry="${2.5 * scale}" fill="rgba(0,0,0,0.22)" />
                <line x1="${p0.x}" y1="${p0.y}" x2="${pTrunk.x}" y2="${pTrunk.y}" stroke="${isDark ? '#451a03' : '#78350f'}" stroke-width="${1.8 * scale}" />
                <ellipse cx="${(pTrunk.x + pTop.x) / 2}" cy="${(pTrunk.y + pTop.y) / 2}" rx="${3.8 * scale}" ry="${10 * scale}" fill="${isDark ? '#064e3b' : '#047857'}" />
                <ellipse cx="${(pTrunk.x + pTop.x) / 2 - 0.8 * scale}" cy="${(pTrunk.y + pTop.y) / 2 - 1 * scale}" rx="${2.5 * scale}" ry="${8 * scale}" fill="${isDark ? '#059669' : '#10b981'}" opacity="0.75" />
            `;
        }

        // 8. Procedural Sector Environment Amenities (No Repetition!)
        // Check which sectors are occupied by buildings
        const sortedBuildings = [...campus.buildings].sort((a, b) => {
            const posA = (a.iso?.x || 0) + (a.iso?.y || 0);
            const posB = (b.iso?.x || 0) + (b.iso?.y || 0);
            return posA - posB;
        });

        function doesSectorHaveBuilding(secX, secY, secW, secD) {
            return sortedBuildings.some(b => {
                const bx = b.iso?.x ?? 260;
                const by = b.iso?.y ?? 70;
                const bw = b.iso?.width ?? 140;
                const bd = b.iso?.depth ?? 110;
                // Collision between sector rect and building footprint
                return !(secX + secW < bx || secX > bx + bw || secY + secD < by || secY > by + bd);
            });
        }

        for (let col = roadColMin; col <= roadColMax; col++) {
            for (let row = roadRowMin; row <= roadRowMax; row++) {
                const secX = 40 + col * 270;
                const secY = 65 + row * 240;
                const secW = 165;
                const secD = 125;

                // Check bounds within slab
                if (secX < slabMinX + 15 || secX + secW > slabMaxX - 15 || secY < slabMinY + 15 || secY + secD > slabMaxY - 15) {
                    continue;
                }

                const hasBldg = doesSectorHaveBuilding(secX, secY, secW, secD);
                const themeVal = Math.floor(hashCoord(col, row, 77) * 7);

                if (!hasBldg) {
                    // Render Distinct Campus Zone Amenity
                    if (themeVal === 0) {
                        // THEME 0: Modern Reflection Water Fountain & Stone Plaza
                        const p0 = projectIso(secX, secY, 0);
                        const p1 = projectIso(secX + secW, secY, 0);
                        const p2 = projectIso(secX + secW, secY + secD, 0);
                        const p3 = projectIso(secX, secY + secD, 0);
                        registerScreenPoint(p0);
                        registerScreenPoint(p2);

                        svgHtml += `<polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="${isDark ? '#172033' : '#e2e8f0'}" stroke="${isDark ? '#334155' : '#cbd5e1'}" stroke-width="1" />`;

                        // Fountain Basin
                        const fcx = secX + secW / 2;
                        const fcy = secY + secD / 2;
                        const f0 = projectIso(fcx - 32, fcy - 24, 0);
                        const f1 = projectIso(fcx + 32, fcy - 24, 0);
                        const f2 = projectIso(fcx + 32, fcy + 24, 0);
                        const f3 = projectIso(fcx - 32, fcy + 24, 0);
                        svgHtml += `<polygon points="${f0.x},${f0.y} ${f1.x},${f1.y} ${f2.x},${f2.y} ${f3.x},${f3.y}" fill="url(#waterPoolGrad)" stroke="${isDark ? '#38bdf8' : '#0284c7'}" stroke-width="1.5" />`;

                        const fCenter = projectIso(fcx, fcy, 4);
                        svgHtml += `
                            <ellipse cx="${fCenter.x}" cy="${fCenter.y}" rx="14" ry="7" fill="url(#fountainRadial)" />
                            <circle cx="${fCenter.x}" cy="${fCenter.y}" r="3" fill="#ffffff" opacity="0.9" filter="drop-shadow(0 0 4px #38bdf8)" />
                        `;

                        // 4 Benches around fountain
                        const b1 = projectIso(fcx - 42, fcy, 0);
                        const b2 = projectIso(fcx + 42, fcy, 0);
                        svgHtml += `
                            <line x1="${b1.x - 7}" y1="${b1.y}" x2="${b1.x + 7}" y2="${b1.y}" stroke="${isDark ? '#b45309' : '#92400e'}" stroke-width="3" stroke-linecap="round" />
                            <line x1="${b2.x - 7}" y1="${b2.y}" x2="${b2.x + 7}" y2="${b2.y}" stroke="${isDark ? '#b45309' : '#92400e'}" stroke-width="3" stroke-linecap="round" />
                        `;

                        // Corner Trees
                        svgHtml += renderBlossomTree(secX + 16, secY + 16, 0.95);
                        svgHtml += renderBlossomTree(secX + secW - 16, secY + 16, 0.95);

                    } else if (themeVal === 1) {
                        // THEME 1: Solar Canopy Carport & EV Charging Hub
                        const p0 = projectIso(secX + 10, secY + 10, 0);
                        const p1 = projectIso(secX + secW - 10, secY + 10, 0);
                        const p2 = projectIso(secX + secW - 10, secY + secD - 10, 0);
                        const p3 = projectIso(secX + 10, secY + secD - 10, 0);
                        registerScreenPoint(p0);
                        registerScreenPoint(p2);

                        svgHtml += `<polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="${isDark ? '#0f172a' : '#cbd5e1'}" stroke="${isDark ? '#334155' : '#94a3b8'}" stroke-width="1" />`;

                        // Parking Bay Lines
                        for (let st = 0; st < 4; st++) {
                            const sX = secX + 25 + st * 32;
                            const sA = projectIso(sX, secY + 15, 0);
                            const sB = projectIso(sX, secY + secD - 15, 0);
                            svgHtml += `<line x1="${sA.x}" y1="${sA.y}" x2="${sB.x}" y2="${sB.y}" stroke="${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)'}" stroke-width="1.2" stroke-dasharray="3 3" />`;
                        }

                        // Parked Cars
                        const carColors = ['#ef4444', '#38bdf8', '#f8fafc', '#eab308', '#10b981', '#8b5cf6'];
                        const cCol1 = carColors[Math.floor(hashCoord(col, row, 1) * carColors.length)];
                        const cCol2 = carColors[Math.floor(hashCoord(col, row, 2) * carColors.length)];
                        const cCol3 = carColors[Math.floor(hashCoord(col, row, 3) * carColors.length)];

                        svgHtml += renderIsoCar(secX + 40, secY + secD / 2, cCol1, 'vertical');
                        svgHtml += renderIsoCar(secX + 72, secY + secD / 2, cCol2, 'vertical');
                        svgHtml += renderIsoCar(secX + 104, secY + secD / 2, cCol3, 'vertical');

                        // Photovoltaic Solar Glass Canopy Overhead
                        const canH = 22;
                        const cP0 = projectIso(secX + 15, secY + 15, canH);
                        const cP1 = projectIso(secX + secW - 15, secY + 15, canH);
                        const cP2 = projectIso(secX + secW - 15, secY + secD * 0.45, canH - 4);
                        const cP3 = projectIso(secX + 15, secY + secD * 0.45, canH - 4);

                        svgHtml += `
                            <polygon points="${cP0.x},${cP0.y} ${cP1.x},${cP1.y} ${cP2.x},${cP2.y} ${cP3.x},${cP3.y}" fill="url(#solarGlassGrad)" stroke="${isDark ? '#60a5fa' : '#2563eb'}" stroke-width="1.2" opacity="0.88" />
                        `;

                    } else if (themeVal === 2) {
                        // THEME 2: Zen Botanical Arboretum & Sakura Grove
                        const p0 = projectIso(secX + 5, secY + 5, 0);
                        const p1 = projectIso(secX + secW - 5, secY + 5, 0);
                        const p2 = projectIso(secX + secW - 5, secY + secD - 5, 0);
                        const p3 = projectIso(secX + 5, secY + secD - 5, 0);
                        registerScreenPoint(p0);
                        registerScreenPoint(p2);

                        svgHtml += `<polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="${cLawn}" stroke="${cLawnBorder}" stroke-width="1.2" stroke-dasharray="4 4" />`;

                        // Winding Crushed Stone Path
                        const pathA = projectIso(secX + 10, secY + secD / 2, 0);
                        const pathB = projectIso(secX + secW / 2, secY + secD / 2, 0);
                        const pathC = projectIso(secX + secW - 10, secY + 25, 0);
                        svgHtml += `<path d="M ${pathA.x} ${pathA.y} Q ${pathB.x} ${pathB.y} ${pathC.x} ${pathC.y}" stroke="${isDark ? '#475569' : '#cbd5e1'}" stroke-width="5" fill="none" opacity="0.8" />`;

                        // Mixture of Trees
                        svgHtml += renderBlossomTree(secX + 28, secY + 28, 1.1);
                        svgHtml += renderPineTree(secX + secW - 32, secY + 36, 1.05);
                        svgHtml += renderBroadleafTree(secX + 38, secY + secD - 28, 1.15);
                        svgHtml += renderCypressTree(secX + secW - 30, secY + secD - 30, 1.0);

                    } else if (themeVal === 3) {
                        // THEME 3: Contemporary Sculpture & Reflection Basin
                        const p0 = projectIso(secX + 8, secY + 8, 0);
                        const p1 = projectIso(secX + secW - 8, secY + 8, 0);
                        const p2 = projectIso(secX + secW - 8, secY + secD - 8, 0);
                        const p3 = projectIso(secX + 8, secY + secD - 8, 0);
                        registerScreenPoint(p0);
                        registerScreenPoint(p2);

                        svgHtml += `<polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="${isDark ? '#1e293b' : '#f1f5f9'}" stroke="${isDark ? '#475569' : '#cbd5e1'}" stroke-width="1" />`;

                        // Raised Stone Plinth with Modern Metallic Prism
                        const cx = secX + secW / 2, cy = secY + secD / 2;
                        const mB0 = projectIso(cx - 16, cy - 16, 0);
                        const mB1 = projectIso(cx + 16, cy - 16, 0);
                        const mB2 = projectIso(cx + 16, cy + 16, 0);
                        const mB3 = projectIso(cx - 16, cy + 16, 0);
                        const mTip = projectIso(cx, cy, 28);
                        svgHtml += `
                            <polygon points="${mB0.x},${mB0.y} ${mB1.x},${mB1.y} ${mB2.x},${mB2.y} ${mB3.x},${mB3.y}" fill="${isDark ? '#334155' : '#94a3b8'}" />
                            <polygon points="${mB3.x},${mB3.y} ${mB2.x},${mB2.y} ${mTip.x},${mTip.y}" fill="${isDark ? '#38bdf8' : '#0284c7'}" opacity="0.9" />
                            <polygon points="${mB2.x},${mB2.y} ${mB1.x},${mB1.y} ${mTip.x},${mTip.y}" fill="${isDark ? '#0284c7' : '#0369a1'}" opacity="0.8" />
                            <circle cx="${mTip.x}" cy="${mTip.y}" r="2" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)" />
                        `;

                        // Flanking Trees
                        svgHtml += renderCypressTree(secX + 22, secY + 22, 1.1);
                        svgHtml += renderCypressTree(secX + secW - 22, secY + secD - 22, 1.1);

                    } else if (themeVal === 4) {
                        // THEME 4: Dedicated Executive Helipad
                        const cx = secX + secW / 2, cy = secY + secD / 2;
                        const hr = 42;
                        const hPts = [];
                        for (let a = 0; a < 8; a++) {
                            const rad = (a * Math.PI) / 4;
                            hPts.push(projectIso(cx + hr * Math.cos(rad), cy + hr * Math.sin(rad), 0));
                        }
                        registerScreenPoint(hPts[0]);
                        registerScreenPoint(hPts[4]);

                        const ptsStr = hPts.map(p => `${p.x},${p.y}`).join(' ');
                        svgHtml += `
                            <polygon points="${ptsStr}" fill="${isDark ? '#1e293b' : '#94a3b8'}" stroke="#eab308" stroke-width="2" />
                        `;

                        // Center "H" Marking
                        const hCenter = projectIso(cx, cy, 0);
                        svgHtml += `
                            <circle cx="${hCenter.x}" cy="${hCenter.y}" r="16" fill="none" stroke="#eab308" stroke-width="2" stroke-dasharray="4 2" />
                            <text x="${hCenter.x}" y="${hCenter.y + 4}" fill="#ffffff" font-size="14" font-weight="900" font-family="monospace" text-anchor="middle">H</text>
                        `;

                        // Perimeter Beacon Lights
                        hPts.forEach((hp, idx) => {
                            if (idx % 2 === 0) {
                                svgHtml += `<circle cx="${hp.x}" cy="${hp.y}" r="2" fill="${isDark ? '#38bdf8' : '#f59e0b'}" filter="${isDark ? 'url(#softGlow)' : 'none'}" />`;
                            }
                        });

                    } else if (themeVal === 5) {
                        // THEME 5: Industrial Infrastructure Utility Pad & Silos
                        const p0 = projectIso(secX + 10, secY + 10, 0);
                        const p1 = projectIso(secX + secW - 10, secY + 10, 0);
                        const p2 = projectIso(secX + secW - 10, secY + secD - 10, 0);
                        const p3 = projectIso(secX + 10, secY + secD - 10, 0);
                        registerScreenPoint(p0);
                        registerScreenPoint(p2);

                        svgHtml += `<polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="${isDark ? '#1e293b' : '#cbd5e1'}" stroke="${isDark ? '#475569' : '#94a3b8'}" stroke-width="1" />`;

                        // Silo A & B
                        function renderSilo(sx, sy, r, h) {
                            const bL = projectIso(sx - r, sy, 0);
                            const bR = projectIso(sx + r, sy, 0);
                            const bF = projectIso(sx, sy + r, 0);
                            const tL = projectIso(sx - r, sy, h);
                            const tR = projectIso(sx + r, sy, h);
                            const tT = projectIso(sx, sy - r, h);
                            const tF = projectIso(sx, sy + r, h);
                            const tC = projectIso(sx, sy, h);

                            return `
                                <g class="iso-silo">
                                    <ellipse cx="${bF.x}" cy="${bF.y + 1}" rx="${r * 0.9}" ry="${r * 0.45}" fill="rgba(0,0,0,0.3)" />
                                    <polygon points="${bL.x},${bL.y} ${tL.x},${tL.y} ${tR.x},${tR.y} ${bR.x},${bR.y}" fill="url(#metalSiloGrad)" />
                                    <polygon points="${tL.x},${tL.y} ${tT.x},${tT.y} ${tR.x},${tR.y} ${tF.x},${tF.y}" fill="${isDark ? '#475569' : '#cbd5e1'}" stroke="${isDark ? '#64748b' : '#94a3b8'}" stroke-width="1" />
                                    <circle cx="${tC.x}" cy="${tC.y}" r="2" fill="${isDark ? '#38bdf8' : '#3b82f6'}" opacity="0.8" />
                                </g>
                            `;
                        }

                        svgHtml += renderSilo(secX + 45, secY + 60, 12, 34);
                        svgHtml += renderSilo(secX + 75, secY + 60, 13, 38);

                        // Connecting Pipe
                        const pA = projectIso(secX + 45, secY + 60, 32);
                        const pB = projectIso(secX + 75, secY + 60, 32);
                        svgHtml += `<line x1="${pA.x}" y1="${pA.y}" x2="${pB.x}" y2="${pB.y}" stroke="${isDark ? '#94a3b8' : '#475569'}" stroke-width="2.5" stroke-linecap="round" />`;

                        // Safety Hazard Stripes on Pad Curb
                        for (let hz = 0; hz < 6; hz++) {
                            const hzA = secX + 95 + hz * 9;
                            const pA1 = projectIso(hzA, secY + secD - 12, 0);
                            const pA2 = projectIso(hzA + 5, secY + secD - 12, 0);
                            svgHtml += `<line x1="${pA1.x}" y1="${pA1.y}" x2="${pA2.x}" y2="${pA2.y}" stroke="#facc15" stroke-width="2.5" />`;
                        }

                    } else {
                        // THEME 6: Outdoor Social Dining Terrace & Pergola
                        const p0 = projectIso(secX + 10, secY + 10, 0);
                        const p1 = projectIso(secX + secW - 10, secY + 10, 0);
                        const p2 = projectIso(secX + secW - 10, secY + secD - 10, 0);
                        const p3 = projectIso(secX + 10, secY + secD - 10, 0);
                        registerScreenPoint(p0);
                        registerScreenPoint(p2);

                        svgHtml += `<polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="${isDark ? '#1e293b' : '#fed7aa'}" opacity="0.5" stroke="${isDark ? '#b45309' : '#f97316'}" stroke-width="1" />`;

                        // Pergola Slats Overhead
                        const pergH = 18;
                        for (let sl = 0; sl < 5; sl++) {
                            const slY = secY + 25 + sl * 16;
                            const s0 = projectIso(secX + 25, slY, pergH);
                            const s1 = projectIso(secX + secW - 25, slY, pergH);
                            svgHtml += `<line x1="${s0.x}" y1="${s0.y}" x2="${s1.x}" y2="${s1.y}" stroke="${isDark ? '#92400e' : '#b45309'}" stroke-width="2.5" stroke-linecap="round" />`;
                        }

                        // Round Tables
                        [secX + 45, secX + secW - 45].forEach(tx => {
                            const tCenter = projectIso(tx, secY + secD / 2, 0);
                            svgHtml += `
                                <circle cx="${tCenter.x}" cy="${tCenter.y}" r="6" fill="${isDark ? '#f8fafc' : '#ffffff'}" stroke="#94a3b8" stroke-width="1" />
                                <circle cx="${tCenter.x}" cy="${tCenter.y}" r="2" fill="${isDark ? '#38bdf8' : '#2563eb'}" />
                            `;
                        });

                        svgHtml += renderBroadleafTree(secX + 24, secY + secD - 20, 0.9);
                    }
                }
            }
        }

        // 9. Streetlamps along Road Corridors
        for (let col = roadColMin; col <= roadColMax; col++) {
            for (let row = roadRowMin; row <= roadRowMax; row++) {
                const slX = col * 270 + 205;
                const slY = row * 240 + 185;
                if (slX >= slabMinX + 25 && slX <= slabMaxX - 25 && slY >= slabMinY + 25 && slY <= slabMaxY - 25) {
                    const pBase = projectIso(slX, slY, 0);
                    const pHead = projectIso(slX, slY, 22);
                    const pArm = projectIso(slX + 4, slY, 22);
                    registerScreenPoint(pBase);
                    registerScreenPoint(pHead);

                    svgHtml += `
                        ${isDark ? `<ellipse cx="${pBase.x + 6}" cy="${pBase.y + 4}" rx="20" ry="10" fill="url(#lampGlowRadial)" />` : ''}
                        <line x1="${pBase.x}" y1="${pBase.y}" x2="${pHead.x}" y2="${pHead.y}" stroke="${isDark ? '#64748b' : '#475569'}" stroke-width="1.8" />
                        <line x1="${pHead.x}" y1="${pHead.y}" x2="${pArm.x}" y2="${pArm.y}" stroke="${isDark ? '#94a3b8' : '#334155'}" stroke-width="1.8" />
                        <circle cx="${pArm.x}" cy="${pArm.y}" r="2" fill="${isDark ? '#e0f2fe' : '#fef08a'}" filter="${isDark ? 'url(#softGlow)' : 'none'}" />
                    `;
                }
            }
        }

        // 10. Render 3D Buildings
        let totalFloorsCount = 0;
        let totalSensorsCount = 0;
        const buildingCardAnchors = [];

        sortedBuildings.forEach(bldg => {
            const floorCount = Math.max(1, (bldg.floors || []).length);
            totalFloorsCount += floorCount;

            const dynamicHeight = Math.max(50, 38 + floorCount * 32);
            const bx = bldg.iso?.x ?? 260;
            const by = bldg.iso?.y ?? 70;
            const bw = bldg.iso?.width ?? 140;
            const bd = bldg.iso?.depth ?? 110;

            let isBldgBreached = false;
            let bldgSensorCount = 0;
            (bldg.floors || []).forEach(fl => {
                const doors = fl.plan?.doors || [];
                const windows = fl.plan?.windows || [];
                doors.forEach(d => {
                    if (d.deviceMac) {
                        bldgSensorCount++;
                        if (appState.activeStatus && appState.activeStatus[d.deviceMac] === 'OPEN') {
                            isBldgBreached = true;
                        }
                    }
                });
                windows.forEach(w => {
                    if (w.deviceMac) {
                        bldgSensorCount++;
                        if (appState.activeStatus && appState.activeStatus[w.deviceMac] === 'OPEN') {
                            isBldgBreached = true;
                        }
                    }
                });
            });
            totalSensorsCount += bldgSensorCount;

            const baseColor = bldg.color || '#2563eb';
            const strokeCol = isDark ? 'rgba(59, 130, 246, 0.45)' : '#94a3b8';

            // Base and Roof points
            const v0 = projectIso(bx, by, 0);
            const v1 = projectIso(bx + bw, by, 0);
            const v2 = projectIso(bx + bw, by + bd, 0);
            const v3 = projectIso(bx, by + bd, 0);

            const t0 = projectIso(bx, by, dynamicHeight);
            const t1 = projectIso(bx + bw, by, dynamicHeight);
            const t2 = projectIso(bx + bw, by + bd, dynamicHeight);
            const t3 = projectIso(bx, by + bd, dynamicHeight);

            const roofCx = (t0.x + t1.x + t2.x + t3.x) / 4;
            const roofCy = (t0.y + t1.y + t2.y + t3.y) / 4;

            registerScreenPoint(v0);
            registerScreenPoint(v2);
            registerScreenPoint(t0);
            registerScreenPoint(t2);

            // Ground Cast Shadow
            const shDist = dynamicHeight * 0.45;
            const s0 = projectIso(bx + shDist, by - shDist * 0.4, 0);
            const s1 = projectIso(bx + bw + shDist, by - shDist * 0.4, 0);
            const s2 = projectIso(bx + bw, by + bd, 0);
            const s3 = projectIso(bx, by + bd, 0);

            // Floor Bands & Windows
            let floorLinesSvg = '';
            const floorH = dynamicHeight / floorCount;

            for (let f = 1; f <= floorCount; f++) {
                const zFloor = f * floorH;
                const fLeft1 = projectIso(bx, by + bd, zFloor);
                const fLeft2 = projectIso(bx + bw, by + bd, zFloor);
                const fRight1 = projectIso(bx + bw, by + bd, zFloor);
                const fRight2 = projectIso(bx + bw, by, zFloor);

                floorLinesSvg += `
                    <line x1="${fLeft1.x}" y1="${fLeft1.y}" x2="${fLeft2.x}" y2="${fLeft2.y}" stroke="${strokeCol}" stroke-width="1.2" opacity="0.65" />
                    <line x1="${fRight1.x}" y1="${fRight1.y}" x2="${fRight2.x}" y2="${fRight2.y}" stroke="${strokeCol}" stroke-width="1.2" opacity="0.65" />
                `;

                const winZ = zFloor - floorH * 0.35;
                const winH = floorH * 0.42;

                // Front Wall (Left) Windows
                for (let wb = 0; wb < 4; wb++) {
                    const wx0 = bx + bw * (0.08 + wb * 0.23);
                    const wx1 = bx + bw * (0.24 + wb * 0.23);
                    const wp0 = projectIso(wx0, by + bd, winZ);
                    const wp1 = projectIso(wx1, by + bd, winZ);
                    const wp2 = projectIso(wx1, by + bd, winZ - winH);
                    const wp3 = projectIso(wx0, by + bd, winZ - winH);

                    const winFill = isDark ? '#38bdf8' : '#60a5fa';
                    const winOpacity = isDark ? '0.85' : '0.65';
                    floorLinesSvg += `
                        <polygon points="${wp0.x},${wp0.y} ${wp1.x},${wp1.y} ${wp2.x},${wp2.y} ${wp3.x},${wp3.y}" fill="${winFill}" opacity="${winOpacity}" stroke="${strokeCol}" stroke-width="0.75" />
                    `;
                }

                // Side Wall (Right) Windows
                for (let sb = 0; sb < 3; sb++) {
                    const sy0 = by + bd * (0.12 + sb * 0.28);
                    const sy1 = by + bd * (0.30 + sb * 0.28);
                    const sp0 = projectIso(bx + bw, sy0, winZ);
                    const sp1 = projectIso(bx + bw, sy1, winZ);
                    const sp2 = projectIso(bx + bw, sy1, winZ - winH);
                    const sp3 = projectIso(bx + bw, sy0, winZ - winH);

                    const sFill = isDark ? '#38bdf8' : '#93c5fd';
                    floorLinesSvg += `
                        <polygon points="${sp0.x},${sp0.y} ${sp1.x},${sp1.y} ${sp2.x},${sp2.y} ${sp3.x},${sp3.y}" fill="${sFill}" opacity="${isDark ? '0.75' : '0.6'}" stroke="${strokeCol}" stroke-width="0.75" />
                    `;
                }
            }

            // Real Architectural Building Geometry
            let buildingSpecificSvg = '';

            const isWarehouse = bldg.type === 'warehouse' || bldg.id === 'bldg_warehouse' || bldg.name.toLowerCase().includes('logistics');
            const isTower = bldg.type === 'tower' || bldg.id === 'bldg_hq' || bldg.name.toLowerCase().includes('headquarter');
            const isDatacenter = bldg.type === 'datacenter' || bldg.name.toLowerCase().includes('server') || bldg.name.toLowerCase().includes('data');

            if (isWarehouse) {
                // REAL WAREHOUSE ARCHITECTURE: Loading dock, hazard stripes, roll-up sectional doors, gabled roof
                const dockD = 16, dockH = 10;
                const dP0 = projectIso(bx, by + bd, 0);
                const dP1 = projectIso(bx + bw, by + bd, 0);
                const dP2 = projectIso(bx + bw, by + bd + dockD, 0);
                const dP3 = projectIso(bx, by + bd + dockD, 0);
                const dT2 = projectIso(bx + bw, by + bd + dockD, dockH);
                const dT3 = projectIso(bx, by + bd + dockD, dockH);
                const dL0 = projectIso(bx, by + bd, dockH);
                const dL1 = projectIso(bx + bw, by + bd, dockH);

                buildingSpecificSvg += `
                    <polygon points="${dP3.x},${dP3.y} ${dT3.x},${dT3.y} ${dT2.x},${dT2.y} ${dP2.x},${dP2.y}" fill="${isDark ? '#334155' : '#94a3b8'}" stroke="${strokeCol}" stroke-width="1" />
                    <polygon points="${dL0.x},${dL0.y} ${dL1.x},${dL1.y} ${dT2.x},${dT2.y} ${dT3.x},${dT3.y}" fill="${isDark ? '#475569' : '#cbd5e1'}" stroke="${strokeCol}" stroke-width="1" />
                `;

                // Hazard Stripes
                for (let hz = 0; hz < 8; hz++) {
                    const hxA = bx + bw * (hz / 8);
                    const hxB = bx + bw * ((hz + 0.5) / 8);
                    const hz0 = projectIso(hxA, by + bd + dockD, dockH);
                    const hz1 = projectIso(hxB, by + bd + dockD, dockH);
                    const hz2 = projectIso(hxB, by + bd + dockD, 0);
                    const hz3 = projectIso(hxA, by + bd + dockD, 0);
                    buildingSpecificSvg += `<polygon points="${hz0.x},${hz0.y} ${hz1.x},${hz1.y} ${hz2.x},${hz2.y} ${hz3.x},${hz3.y}" fill="#facc15" opacity="0.85" />`;
                }

                // 3 Rollup Sectional Doors
                for (let bay = 0; bay < 3; bay++) {
                    const bayX = bx + bw * (0.15 + bay * 0.28);
                    const bayW = bw * 0.20;
                    const bayH = dynamicHeight * 0.52;
                    const b0 = projectIso(bayX, by + bd, dockH);
                    const b1 = projectIso(bayX + bayW, by + bd, dockH);
                    const b2 = projectIso(bayX + bayW, by + bd, dockH + bayH);
                    const b3 = projectIso(bayX, by + bd, dockH + bayH);

                    buildingSpecificSvg += `
                        <polygon points="${b0.x},${b0.y} ${b1.x},${b1.y} ${b2.x},${b2.y} ${b3.x},${b3.y}" fill="${isDark ? '#0f172a' : '#475569'}" stroke="${strokeCol}" stroke-width="1.2" />
                    `;
                    for (let sl = 1; sl <= 4; sl++) {
                        const sZ = dockH + (bayH * sl / 5);
                        const sL = projectIso(bayX, by + bd, sZ);
                        const sR = projectIso(bayX + bayW, by + bd, sZ);
                        buildingSpecificSvg += `<line x1="${sL.x}" y1="${sL.y}" x2="${sR.x}" y2="${sR.y}" stroke="${isDark ? '#334155' : '#94a3b8'}" stroke-width="1" />`;
                    }
                    const bLabel = projectIso(bayX + bayW / 2, by + bd, dockH + bayH + 6);
                    buildingSpecificSvg += `<text x="${bLabel.x}" y="${bLabel.y}" fill="#facc15" font-size="8.5" font-weight="900" text-anchor="middle">D${bay + 1}</text>`;
                }

                // Gabled Roof
                const ridgeH = dynamicHeight + 14;
                const pRidgeL = projectIso(bx, by + bd / 2, ridgeH);
                const pRidgeR = projectIso(bx + bw, by + bd / 2, ridgeH);

                buildingSpecificSvg += `
                    <polygon points="${t0.x},${t0.y} ${t1.x},${t1.y} ${pRidgeR.x},${pRidgeR.y} ${pRidgeL.x},${pRidgeL.y}" fill="url(#corrugatedRoof)" stroke="${baseColor}" stroke-width="1.5" />
                    <polygon points="${t3.x},${t3.y} ${pRidgeL.x},${pRidgeL.y} ${pRidgeR.x},${pRidgeR.y} ${t2.x},${t2.y}" fill="url(#wallLeftGrad)" stroke="${baseColor}" stroke-width="1.5" />
                    <polygon points="${t3.x},${t3.y} ${pRidgeL.x},${pRidgeL.y} ${t0.x},${t0.y}" fill="${isDark ? '#1e293b' : '#cbd5e1'}" stroke="${strokeCol}" stroke-width="1" />
                    <line x1="${pRidgeL.x}" y1="${pRidgeL.y}" x2="${pRidgeR.x}" y2="${pRidgeR.y}" stroke="${baseColor}" stroke-width="2.5" />
                `;

                [0.35, 0.65].forEach(xf => {
                    const fanCenter = projectIso(bx + bw * xf, by + bd / 2, ridgeH + 3);
                    buildingSpecificSvg += `
                        <circle cx="${fanCenter.x}" cy="${fanCenter.y}" r="6" fill="${isDark ? '#475569' : '#94a3b8'}" stroke="${strokeCol}" stroke-width="1" />
                        <circle cx="${fanCenter.x}" cy="${fanCenter.y}" r="2" fill="${isDark ? '#38bdf8' : '#0284c7'}" />
                    `;
                });

            } else if (isTower) {
                // CORPORATE TOWER: Double-height glass lobby, entrance canopy, revolving door, rooftop helipad
                const podH = 26;
                const pLeft1 = projectIso(bx, by + bd, podH);
                const pLeft2 = projectIso(bx + bw, by + bd, podH);
                buildingSpecificSvg += `<line x1="${pLeft1.x}" y1="${pLeft1.y}" x2="${pLeft2.x}" y2="${pLeft2.y}" stroke="${baseColor}" stroke-width="2" />`;

                for (let col = 0; col <= 5; col++) {
                    const cX = bx + bw * (col / 5);
                    const cB = projectIso(cX, by + bd, 0);
                    const cT = projectIso(cX, by + bd, podH);
                    buildingSpecificSvg += `<line x1="${cB.x}" y1="${cB.y}" x2="${cT.x}" y2="${cT.y}" stroke="${isDark ? '#94a3b8' : '#475569'}" stroke-width="2" />`;
                }

                // Entrance Revolving Doors
                const drL = projectIso(bx + bw * 0.42, by + bd, 0);
                const drR = projectIso(bx + bw * 0.58, by + bd, 0);
                const drT = projectIso(bx + bw * 0.50, by + bd, 18);
                buildingSpecificSvg += `
                    <polygon points="${drL.x},${drL.y} ${drR.x},${drR.y} ${drR.x},${drT.y} ${drL.x},${drT.y}" fill="#fef08a" opacity="0.85" filter="drop-shadow(0 0 6px #fef08a)" />
                `;

                // Entrance Portico Canopy
                const cnpW = bw * 0.36, cnpX = bx + bw * 0.32, cnpH = 16, cnpD = 16;
                const cnp0 = projectIso(cnpX, by + bd, cnpH);
                const cnp1 = projectIso(cnpX + cnpW, by + bd, cnpH);
                const cnp2 = projectIso(cnpX + cnpW, by + bd + cnpD, cnpH);
                const cnp3 = projectIso(cnpX, by + bd + cnpD, cnpH);
                const colA0 = projectIso(cnpX + 2, by + bd + cnpD - 2, 0);
                const colA1 = projectIso(cnpX + 2, by + bd + cnpD - 2, cnpH);
                const colB0 = projectIso(cnpX + cnpW - 2, by + bd + cnpD - 2, 0);
                const colB1 = projectIso(cnpX + cnpW - 2, by + bd + cnpD - 2, cnpH);

                buildingSpecificSvg += `
                    <line x1="${colA0.x}" y1="${colA0.y}" x2="${colA1.x}" y2="${colA1.y}" stroke="${isDark ? '#cbd5e1' : '#475569'}" stroke-width="2.2" />
                    <line x1="${colB0.x}" y1="${colB0.y}" x2="${colB1.x}" y2="${colB1.y}" stroke="${isDark ? '#cbd5e1' : '#475569'}" stroke-width="2.2" />
                    <polygon points="${cnp0.x},${cnp0.y} ${cnp1.x},${cnp1.y} ${cnp2.x},${cnp2.y} ${cnp3.x},${cnp3.y}" fill="url(#curtainGlass)" stroke="${baseColor}" stroke-width="1.5" />
                `;

                // Parapet & Roof Helipad
                buildingSpecificSvg += `
                    <polygon points="${t0.x},${t0.y} ${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}" fill="${isDark ? '#334155' : '#cbd5e1'}" stroke="${baseColor}" stroke-width="2" class="iso-roof" />
                    <circle cx="${roofCx}" cy="${roofCy}" r="22" fill="none" stroke="#facc15" stroke-width="2" stroke-dasharray="5 3" />
                    <text x="${roofCx}" y="${roofCy + 4}" fill="#facc15" font-size="12" font-weight="900" font-family="monospace" text-anchor="middle">H</text>
                `;

                // Antenna Mast
                const aBase = projectIso(bx + bw * 0.85, by + bd * 0.15, dynamicHeight);
                const aTop = projectIso(bx + bw * 0.85, by + bd * 0.15, dynamicHeight + 28);
                buildingSpecificSvg += `
                    <line x1="${aBase.x}" y1="${aBase.y}" x2="${aTop.x}" y2="${aTop.y}" stroke="${isDark ? '#94a3b8' : '#475569'}" stroke-width="2" />
                    <circle cx="${aTop.x}" cy="${aTop.y}" r="2" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)" />
                `;

            } else if (isDatacenter) {
                // DATA CENTER: High security cube, cooling louvers, rooftop condenser units, blue activity lights
                buildingSpecificSvg += `
                    <polygon points="${t0.x},${t0.y} ${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}" fill="${isDark ? '#0f172a' : '#334155'}" stroke="${baseColor}" stroke-width="2" class="iso-roof" />
                `;

                // Rooftop Condensers
                for (let cf = 0; cf < 3; cf++) {
                    const cfx = bx + bw * (0.25 + cf * 0.25);
                    const cfy = by + bd * 0.45;
                    const cfc = projectIso(cfx, cfy, dynamicHeight + 5);
                    buildingSpecificSvg += `
                        <circle cx="${cfc.x}" cy="${cfc.y}" r="6.5" fill="${isDark ? '#334155' : '#94a3b8'}" stroke="${baseColor}" stroke-width="1.2" />
                        <circle cx="${cfc.x}" cy="${cfc.y}" r="2" fill="#38bdf8" />
                    `;
                }

                // Front Wall Louvers & Status Light Bar
                const lZ0 = dynamicHeight * 0.3;
                const lL0 = projectIso(bx + 10, by + bd, lZ0);
                const lL1 = projectIso(bx + bw - 10, by + bd, lZ0);
                buildingSpecificSvg += `<line x1="${lL0.x}" y1="${lL0.y}" x2="${lL1.x}" y2="${lL1.y}" stroke="#06b6d4" stroke-width="3" filter="drop-shadow(0 0 6px #06b6d4)" />`;

            } else {
                // RESEARCH & OPERATIONS ANNEX: Terraced volumes, rooftop HVAC chillers, tech antenna
                buildingSpecificSvg += `
                    <polygon points="${t0.x},${t0.y} ${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}" fill="${isDark ? '#334155' : '#cbd5e1'}" stroke="${baseColor}" stroke-width="1.8" class="iso-roof" />
                `;

                const chCenter1 = projectIso(bx + bw * 0.35, by + bd * 0.35, dynamicHeight + 6);
                const chCenter2 = projectIso(bx + bw * 0.65, by + bd * 0.35, dynamicHeight + 6);
                buildingSpecificSvg += `
                    <circle cx="${chCenter1.x}" cy="${chCenter1.y}" r="5" fill="${isDark ? '#475569' : '#94a3b8'}" stroke="${strokeCol}" stroke-width="1" />
                    <circle cx="${chCenter2.x}" cy="${chCenter2.y}" r="5" fill="${isDark ? '#475569' : '#94a3b8'}" stroke="${strokeCol}" stroke-width="1" />
                `;
            }

            // Assemble Building SVG Group
            svgHtml += `
                <g class="iso-building-group" id="iso-bldg-${bldg.id}" onclick="selectBuildingFromCampus('${bldg.id}')">
                    <polygon points="${s0.x},${s0.y} ${s1.x},${s1.y} ${s2.x},${s2.y} ${s3.x},${s3.y}" fill="rgba(0,0,0,0.24)" />
                    <polygon points="${v3.x},${v3.y} ${t3.x},${t3.y} ${t2.x},${t2.y} ${v2.x},${v2.y}" fill="url(#wallLeftGrad)" stroke="${strokeCol}" stroke-width="1.2" class="iso-wall-left" />
                    <polygon points="${v2.x},${v2.y} ${t2.x},${t2.y} ${t1.x},${t1.y} ${v1.x},${v1.y}" fill="url(#wallRightGrad)" stroke="${strokeCol}" stroke-width="1.2" class="iso-wall-right" />
                    ${floorLinesSvg}
                    ${buildingSpecificSvg}
                    <circle cx="${roofCx}" cy="${roofCy}" r="5" class="${isBldgBreached ? 'iso-beacon-alarm' : 'iso-beacon-secured'}" />
                    <circle cx="${roofCx}" cy="${roofCy}" r="5" class="iso-beacon-ring" stroke="${isBldgBreached ? '#ef4444' : '#10b981'}" fill="none" />
                </g>
            `;

            buildingCardAnchors.push({
                bldg: bldg,
                roofCx: roofCx,
                roofCy: roofCy,
                dynamicHeight: dynamicHeight,
                isBldgBreached: isBldgBreached,
                floorCount: floorCount,
                bldgSensorCount: bldgSensorCount,
                baseColor: baseColor
            });
        });

        // 11. ANTI-COLLISION DETAIL CALLOUT WIDGETS ("WEGETS")
        // Mathematical non-overlapping placement algorithm
        let leaderWidgetsSvg = '';
        if (labelsVisible && buildingCardAnchors.length > 0) {
            const cardW = 205;
            const cardH = 46;
            const cardGap = 12;
            const placedBoxes = [];

            function boxesOverlap(b1, b2, gap = cardGap) {
                return !(b1.x + b1.w + gap < b2.x || b1.x > b2.x + b2.w + gap ||
                         b1.y + b1.h + gap < b2.y || b1.y > b2.y + b2.h + gap);
            }

            // Campus center in 2D screen coordinates
            const slabCenter = projectIso((slabMinX + slabMaxX) / 2, (slabMinY + slabMaxY) / 2, 0);

            // Sort building anchors to place outer/higher ones first
            const sortedAnchors = [...buildingCardAnchors].sort((a, b) => a.roofCy - b.roofCy);

            sortedAnchors.forEach(item => {
                const bldg = item.bldg;
                const roofCx = item.roofCx;
                const roofCy = item.roofCy;
                const baseColor = item.baseColor;
                const typeIcon = bldg.type === 'warehouse' ? 'package' : (bldg.type === 'lab' ? 'flask-conical' : (bldg.type === 'datacenter' ? 'server' : 'building-2'));

                // Determine ideal starting anchor based on building position
                let candX, candY;
                if (roofCx < slabCenter.x - 40) {
                    candX = Math.round(roofCx - cardW - 35);
                    candY = Math.round(roofCy - cardH / 2);
                } else if (roofCx > slabCenter.x + 40) {
                    candX = Math.round(roofCx + 35);
                    candY = Math.round(roofCy - cardH / 2);
                } else {
                    candX = Math.round(roofCx - cardW / 2);
                    candY = Math.round(roofCy - cardH - 50);
                }

                // Check collision and adjust candidate position until completely free
                let step = 0;
                while (placedBoxes.some(p => boxesOverlap({ x: candX, y: candY, w: cardW, h: cardH }, p)) && step < 30) {
                    step++;
                    if (step % 2 === 1) {
                        candY -= (cardH + cardGap);
                    } else {
                        if (roofCx < slabCenter.x) {
                            candX -= 25;
                        } else {
                            candX += 25;
                        }
                    }
                }

                placedBoxes.push({ x: candX, y: candY, w: cardW, h: cardH });

                // Register corners for dynamic viewBox framing
                registerScreenPoint({ x: candX, y: candY });
                registerScreenPoint({ x: candX + cardW, y: candY + cardH });

                // Route clean angled leader line
                const leaderStartX = roofCx;
                const leaderStartY = roofCy;
                let leaderEndX, leaderEndY, leaderElbowX, leaderElbowY;

                if (candX + cardW <= roofCx - 10) {
                    // Card is to the left
                    leaderEndX = candX + cardW;
                    leaderEndY = candY + cardH / 2;
                    leaderElbowX = leaderEndX + Math.min(40, Math.max(16, (roofCx - leaderEndX) * 0.45));
                    leaderElbowY = leaderEndY + 10;
                } else if (candX >= roofCx + 10) {
                    // Card is to the right
                    leaderEndX = candX;
                    leaderEndY = candY + cardH / 2;
                    leaderElbowX = leaderEndX - Math.min(40, Math.max(16, (leaderEndX - roofCx) * 0.45));
                    leaderElbowY = leaderEndY + 10;
                } else {
                    // Card is above
                    leaderEndX = candX + cardW / 2;
                    leaderEndY = candY + cardH;
                    leaderElbowX = roofCx;
                    leaderElbowY = (leaderStartY + leaderEndY) / 2;
                }

                registerScreenPoint({ x: leaderElbowX, y: leaderElbowY });

                const leaderColor = isDark ? 'rgba(56, 189, 248, 0.75)' : 'rgba(37, 99, 235, 0.75)';

                leaderWidgetsSvg += `
                    <g class="iso-leader-group" id="leader-${bldg.id}" onclick="selectBuildingFromCampus('${bldg.id}')">
                        <!-- Roof Anchor Pin Rings -->
                        <circle cx="${leaderStartX}" cy="${leaderStartY}" r="4" fill="${baseColor}" />
                        <circle cx="${leaderStartX}" cy="${leaderStartY}" r="8" fill="none" stroke="${baseColor}" stroke-width="1.2" opacity="0.6" />
                        <!-- Angled Technical Leader Polyline -->
                        <polyline points="${leaderStartX},${leaderStartY} ${leaderElbowX},${leaderElbowY} ${leaderEndX},${leaderEndY}" stroke="${leaderColor}" stroke-width="1.6" stroke-dasharray="4 3" fill="none" />
                        <!-- Terminal Connection Dot -->
                        <circle cx="${leaderEndX}" cy="${leaderEndY}" r="3" fill="${baseColor}" />

                        <!-- Native SVG Rounded Background Card -->
                        <rect x="${candX}" y="${candY}" width="${cardW}" height="${cardH}" rx="10" ry="10" class="campus-callout-svg-rect" />

                        <!-- HTML Card embedded in SVG ForeignObject -->
                        <foreignObject x="${candX}" y="${candY}" width="${cardW}" height="${cardH}" style="pointer-events: none; overflow: visible;">
                            <div xmlns="http://www.w3.org/1999/xhtml" class="campus-callout-card-svg" title="Click to enter ${bldg.name}">
                                <div class="campus-callout-top">
                                    <div class="campus-callout-title-wrap">
                                        <i data-lucide="${typeIcon}" style="width: 13px; height: 13px; color: ${baseColor};"></i>
                                        <span class="campus-callout-title" style="font-size: 11px; letter-spacing: -0.2px;">${bldg.name}</span>
                                    </div>
                                    ${item.isBldgBreached ?
                                        '<span class="status-pill-solid state-open" style="padding: 1px 5px; font-size: 9px;"><span class="state-dot dot-pulse-open"></span> ALARM</span>' :
                                        '<span class="status-pill-solid state-closed" style="padding: 1px 5px; font-size: 9px;"><span class="state-dot dot-closed"></span> SECURED</span>'
                                    }
                                </div>
                                <div class="campus-callout-sub" style="font-size: 10px;">
                                    <span>${item.floorCount} ${item.floorCount === 1 ? 'Floor' : 'Floors'} • ${item.bldgSensorCount} ${item.bldgSensorCount === 1 ? 'Sensor' : 'Sensors'}</span>
                                </div>
                            </div>
                        </foreignObject>
                    </g>
                `;
            });
        }

        // Append Leader Lines & ForeignObject Widgets to SVG
        svgHtml += `<!-- Non-Overlapping Margin Callout Widgets -->${leaderWidgetsSvg}`;

        svg.innerHTML = svgHtml;

        // 12. DYNAMIC VIEWBOX FRAMING CALCULATION
        // Automatically expands and scales to encompass all buildings, slab, and widgets
        if (screenPoints.length > 0) {
            let minSx = Infinity, maxSx = -Infinity, minSy = Infinity, maxSy = -Infinity;
            screenPoints.forEach(pt => {
                if (pt.x < minSx) minSx = pt.x;
                if (pt.x > maxSx) maxSx = pt.x;
                if (pt.y < minSy) minSy = pt.y;
                if (pt.y > maxSy) maxSy = pt.y;
            });

            const padX = 75;
            const padY = 65;
            const vbX = Math.floor(minSx - padX);
            const vbY = Math.floor(minSy - padY);
            const vbW = Math.ceil(maxSx - minSx + padX * 2);
            const vbH = Math.ceil(maxSy - minSy + padY * 2);

            svg.setAttribute("viewBox", `${vbX} ${vbY} ${vbW} ${vbH}`);
        }

        if (window.lucide && lucide.createIcons) {
            lucide.createIcons();
        }

        const summaryStat = document.getElementById("campus-summary-stat");
        if (summaryStat) {
            summaryStat.textContent = `${sortedBuildings.length} Buildings • ${totalFloorsCount} Floors • ${totalSensorsCount} Active Sensors`;
        }
    }

    function toggleCampusLabels() {
        appState.campusLabelsVisible = !(appState.campusLabelsVisible !== false);
        const btnText = document.getElementById("label-toggle-text");
        if (btnText) btnText.textContent = appState.campusLabelsVisible ? "Labels" : "Clean View";
        renderCampus3D();
        showToast(appState.campusLabelsVisible ? "Detail labels enabled" : "Clean architectural view enabled", "info");
    }


    function setDashboardViewMode(mode, showFeedback = true) {

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

            if (btn2d) btn2d.classList.add("active");

            if (btn3d) btn3d.classList.remove("active");

            if (wrap2d) wrap2d.classList.remove("hidden");

            if (wrap3d) wrap3d.classList.add("hidden");

            if (breadcrumbNav) breadcrumbNav.classList.remove("hidden");

            if (bpModeSelector) bpModeSelector.classList.remove("hidden");
            if (actions3d) actions3d.classList.add("hidden");
            if (actions2d) actions2d.classList.remove("hidden");

            renderElevatorRail();

            renderCampusBreadcrumbs();

            renderPlan();

            updateCanvasEmptyState();

            setTimeout(fitCanvasToRooms, 60);

            if (showFeedback) showToast("Switched to 2D Floor Plan Blueprint", "info");

        }

        if (window.lucide && lucide.createIcons) lucide.createIcons();

    }

    function selectBuildingFromCampus(buildingId) {
        selectBuilding(buildingId);
        const target = (typeof B !== 'undefined' && Array.isArray(B)) ? B.find(b => b.id === buildingId || b.name === buildingId) : null;
        if (target && typeof openB === 'function') {
            openB(target);
        } else {
            switchMainTab('floorplan');
            showToast("Entered building floor plan", "success");
        }
    }

    function selectBuilding(buildingId, floorId = null) {

        const bldg = appState.campus.buildings.find(b => b.id === buildingId);

        if (!bldg) return;

        appState.campus.activeBuildingId = buildingId;

        const targetFloor = floorId ? bldg.floors.find(f => f.id === floorId) : (bldg.floors[0] || null);

        if (targetFloor) {

            appState.campus.activeFloorId = targetFloor.id;

            appState.plan = targetFloor.plan;

        }

        saveCampusData();

        renderCampusBreadcrumbs();
        renderElevatorRail();

        if (window.currentFpSubView === '3d') {
            const b3d = (typeof B !== 'undefined' && Array.isArray(B)) ? B.find(x => x.id === bldg.id || x.name === bldg.name) : bldg;
            if (typeof buildInteriorForBuilding === 'function') {
                buildInteriorForBuilding(b3d || bldg);
                layout();
                renderLv();
                side();
                crumb();
                apply();
            }
        } else {
            renderPlan();
            updateCanvasEmptyState();
            updateUndoRedoUI();
        }

        appState.lastPollDataStr = null;
        if (typeof pollStatus === 'function') pollStatus();
    }

    function selectFloor(floorId) {
        const bldg = appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId);
        if (!bldg) return;

        const flIndex = bldg.floors.findIndex(f => f.id === floorId);
        if (flIndex === -1) return;
        const fl = bldg.floors[flIndex];

        appState.campus.activeFloorId = floorId;
        appState.plan = fl.plan;
        saveCampusData();

        renderCampusBreadcrumbs();
        renderElevatorRail();
        renderPlan();
        updateCanvasEmptyState();
        updateUndoRedoUI();

        // Synchronize 3D level selector and 3D interior floor
        if (typeof cur !== 'undefined' && typeof layout === 'function' && cur !== flIndex) {
            cur = flIndex;
            sel = null;
            if (typeof F !== 'undefined' && Array.isArray(F)) {
                F.forEach(f => {
                    if (f.rooms) f.rooms.forEach(r => { if (r.t) r.t.classList.remove('sel'); });
                });
            }
            layout();
            renderLv();
            side();
            crumb();
        }

        showToast(`Floor: ${fl.name}`, "info");
        appState.lastPollDataStr = null;
        if (typeof pollStatus === 'function') pollStatus();
    }

    function renderElevatorRail() {

        const container = document.getElementById("elevator-buttons-list");

        if (!container) return;

        const bldg = appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId);

        if (!bldg || !bldg.floors) return;

        // Sort descending: highest floor on top, ground floor at bottom

        const sortedFloors = [...bldg.floors].sort((a, b) => (b.level || 0) - (a.level || 0));

        let html = '';

        sortedFloors.forEach(f => {

            const isActive = f.id === appState.campus.activeFloorId;

            const levelLabel = f.level === 0 ? 'GF' : (f.level < 0 ? `B${Math.abs(f.level)}` : `${f.level}F`);

            // Check if any sensor on this floor has an alarm

            let hasFloorAlarm = false;

            const doors = f.plan?.doors || [];

            const wins = f.plan?.windows || [];

            doors.forEach(d => {

                if (d.deviceMac && appState.activeStatus && appState.activeStatus[d.deviceMac] === 'OPEN') {

                    hasFloorAlarm = true;

                }

            });

            wins.forEach(w => {

                if (w.deviceMac && appState.activeStatus && appState.activeStatus[w.deviceMac] === 'OPEN') {

                    hasFloorAlarm = true;

                }

            });

            html += `

                <button type="button" class="btn-elevator-floor ${isActive ? 'active' : ''}" onclick="selectFloor('${f.id}')" title="${f.name}">

                    <span>${levelLabel}</span>

                    ${hasFloorAlarm ? '<span class="elevator-floor-dot"></span>' : ''}

                </button>

            `;

        });

        container.innerHTML = html;

    }

    // -------------------------------------------------------------

    // Campus Breadcrumbs Dropdown

    // -------------------------------------------------------------

    function renderCampusBreadcrumbs() {

        const bldg = appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId) || appState.campus.buildings[0];

        const fl = bldg ? (bldg.floors.find(f => f.id === appState.campus.activeFloorId) || bldg.floors[0]) : null;

        const bldgNameEl = document.getElementById("breadcrumb-building-name");

        const floorNameEl = document.getElementById("breadcrumb-floor-name");

        if (bldgNameEl && bldg) bldgNameEl.textContent = bldg.name;

        if (floorNameEl && fl) floorNameEl.textContent = fl.name;

        // Populate Building Menu

        const bldgMenu = document.getElementById("building-select-menu");

        if (bldgMenu) {

            let bHtml = '<div style="padding: 6px 12px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Switch Building</div>';

            appState.campus.buildings.forEach(b => {

                const isCur = b.id === appState.campus.activeBuildingId;

                bHtml += `

                    <button type="button" class="dropdown-item ${isCur ? 'active' : ''}" onclick="selectBuilding('${b.id}'); toggleBuildingDropdown();">

                        <i data-lucide="building-2"></i>

                        <span>${b.name}</span>

                        <span style="margin-left: auto; font-size: 10px; color: var(--text-muted);">${b.floors.length}F</span>

                    </button>

                `;

            });

            bHtml += `

                <div style="border-top: 1px solid var(--border-subtle); margin: 4px 0;"></div>

                <button type="button" class="dropdown-item" onclick="openCampusManagerModal(); toggleBuildingDropdown();">

                    <i data-lucide="layers"></i>

                    <span>Manage Buildings &amp; Floors</span>

                </button>

            `;

            bldgMenu.innerHTML = bHtml;

        }

        // Populate Floor Menu

        const floorMenu = document.getElementById("floor-select-menu");

        if (floorMenu && bldg) {

            let fHtml = '<div style="padding: 6px 12px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Switch Floor</div>';

            bldg.floors.forEach(f => {

                const isCur = f.id === appState.campus.activeFloorId;

                fHtml += `

                    <button type="button" class="dropdown-item ${isCur ? 'active' : ''}" onclick="selectFloor('${f.id}'); toggleFloorDropdown();">

                        <i data-lucide="layers"></i>

                        <span>${f.name}</span>

                    </button>

                `;

            });

            fHtml += `

                <div style="border-top: 1px solid var(--border-subtle); margin: 4px 0;"></div>

                <button type="button" class="dropdown-item" onclick="openAddFloorModal('${bldg.id}'); toggleFloorDropdown();">

                    <i data-lucide="plus"></i>

                    <span>Add New Floor...</span>

                </button>

            `;

            floorMenu.innerHTML = fHtml;

        }

        if (window.lucide && lucide.createIcons) lucide.createIcons();

    }

    function toggleBuildingDropdown(e) {

        if (e) e.stopPropagation();

        const menu = document.getElementById("building-select-menu");

        const fMenu = document.getElementById("floor-select-menu");

        if (fMenu) fMenu.classList.add("hidden");

        if (menu) menu.classList.toggle("hidden");

    }

    function toggleFloorDropdown(e) {

        if (e) e.stopPropagation();

        const menu = document.getElementById("floor-select-menu");

        const bMenu = document.getElementById("building-select-menu");

        if (bMenu) bMenu.classList.add("hidden");

        if (menu) menu.classList.toggle("hidden");

    }

    document.addEventListener("click", () => {

        const bMenu = document.getElementById("building-select-menu");

        const fMenu = document.getElementById("floor-select-menu");

        if (bMenu) bMenu.classList.add("hidden");

        if (fMenu) fMenu.classList.add("hidden");

    });

    // -------------------------------------------------------------

    // Campus & Floors Management Modal System

    // -------------------------------------------------------------

    function openCampusManagerModal() {

        const modal = document.getElementById("campus-manager-modal");

        if (!modal) return;

        modal.classList.remove("hidden");

        switchCampusManagerTab('overview');

        renderCampusDirectory();

        if (window.lucide && lucide.createIcons) lucide.createIcons();

    }

    function closeCampusManagerModal() {

        const modal = document.getElementById("campus-manager-modal");

        if (modal && typeof closeModalAnimated === 'function') {
            closeModalAnimated(modal);
        } else if (modal) {
            modal.classList.add("hidden");
        }

    }

    function switchCampusManagerTab(tab) {

        const tabs = ['overview', 'add-building', 'add-floor'];

        tabs.forEach(t => {

            const btn = document.getElementById(`campus-tab-${t}`);

            const panel = document.getElementById(`campus-panel-${t}`);

            if (t === tab) {

                if (btn) btn.classList.add("active");

                if (panel) panel.classList.remove("hidden");

            } else {

                if (btn) btn.classList.remove("active");

                if (panel) panel.classList.add("hidden");

            }

        });

        if (tab === 'add-floor') {

            const select = document.getElementById("new-floor-bldg-select");

            if (select) {

                select.innerHTML = appState.campus.buildings.map(b => `

                    <option value="${b.id}" ${b.id === appState.campus.activeBuildingId ? 'selected' : ''}>${b.name}</option>

                `).join('');

            }

        }

        if (window.lucide && lucide.createIcons) lucide.createIcons();

    }

    function openAddBuildingModal() {

        openCampusManagerModal();

        switchCampusManagerTab('add-building');

    }

    function openAddFloorModal(bldgId = null) {

        openCampusManagerModal();

        switchCampusManagerTab('add-floor');

        if (bldgId) {

            const select = document.getElementById("new-floor-bldg-select");

            if (select) select.value = bldgId;

        }

    }

    function renderCampusDirectory() {

        const container = document.getElementById("campus-directory-list");

        if (!container) return;

        let html = '';

        appState.campus.buildings.forEach(bldg => {

            const isCur = bldg.id === appState.campus.activeBuildingId;

            html += `

                <div class="bldg-directory-card">

                    <div class="bldg-dir-header">

                        <div class="bldg-dir-title-wrap">

                            <i data-lucide="building-2" style="color: ${bldg.color || 'var(--blue)'};"></i>

                            <strong style="font-size: 13.5px;">${bldg.name}</strong>

                            <span class="count-badge">${bldg.floors.length} Floors</span>

                        </div>

                        <div style="display: flex; gap: 6px;">

                            <button type="button" class="btn btn-outline btn-sm" onclick="openAddFloorModal('${bldg.id}')" title="Add Floor">

                                <i data-lucide="plus"></i> <span>Floor</span>

                            </button>

                            <button type="button" class="btn btn-primary btn-sm" onclick="selectBuilding('${bldg.id}'); switchMainTab('floorplan'); closeCampusManagerModal();" title="Open Floor Plan">
                                <i data-lucide="external-link"></i> <span>Open</span>
                            </button>
                            ${appState.campus.buildings.length > 1 ? `
                            <button type="button" class="btn btn-outline btn-sm btn-delete-bldg" onclick="deleteBuilding('${bldg.id}')" title="Delete Building" style="color: var(--red); border-color: rgba(239, 68, 68, 0.4);">
                                <i data-lucide="trash-2"></i> <span>Delete</span>
                            </button>
                            ` : ''}
                        </div>

                    </div>

                    <div class="bldg-dir-floors-list">

                        ${bldg.floors.map(f => {

                const isFlCur = isCur && f.id === appState.campus.activeFloorId;

                const roomCount = f.plan?.rooms?.length || 0;

                const doorCount = f.plan?.doors?.length || 0;

                return `

                                <div class="floor-dir-item ${isFlCur ? 'active-floor' : ''}">

                                    <div style="display: flex; align-items: center; gap: 8px;">

                                        <i data-lucide="layers" style="width: 13px; height: 13px; color: var(--blue);"></i>

                                        <strong style="font-size: 12px;">${f.name}</strong>

                                        <span style="font-size: 11px; color: var(--text-muted);">(${roomCount} Rooms, ${doorCount} Doors)</span>

                                    </div>

                                    <div style="display: flex; align-items: center; gap: 6px;">

                                        <button type="button" class="btn btn-ghost btn-sm" onclick="selectBuilding('${bldg.id}', '${f.id}'); closeCampusManagerModal();" title="Inspect Floor Plan">

                                            <span>View</span>

                                        </button>

                                        ${bldg.floors.length > 1 ? `

                                            <button type="button" class="btn-ghost-delete" onclick="deleteFloor('${bldg.id}', '${f.id}')" title="Delete Floor">

                                                <i data-lucide="trash-2"></i>

                                            </button>

                                        ` : ''}

                                    </div>

                                </div>

                            `;

            }).join('')}

                    </div>

                </div>

            `;

        });

        container.innerHTML = html;

        if (window.lucide && lucide.createIcons) lucide.createIcons();

    }

        function createNewBuilding() {
        const nameInput = document.getElementById("new-bldg-name");
        const typeSelect = document.getElementById("new-bldg-type");
        const floorsInput = document.getElementById("new-bldg-floors-count");
        const colorInput = document.getElementById("new-bldg-color");

        const name = (nameInput?.value || '').trim();
        if (!name) {
            showToast("Please enter a building name", "warning");
            return;
        }

        const type = typeSelect?.value || 'tower';
        const numFloors = Math.max(1, Math.min(10, parseInt(floorsInput?.value || '2', 10)));
        const color = colorInput?.value || '#2563eb';
        const bldgId = `bldg_${Date.now()}`;

        // Organic architectural dimensions per building function
        let bWidth = 140, bDepth = 110;
        if (type === 'warehouse') {
            bWidth = 170;
            bDepth = 130;
        } else if (type === 'lab') {
            bWidth = 145;
            bDepth = 115;
        } else if (type === 'datacenter') {
            bWidth = 150;
            bDepth = 120;
        } else {
            bWidth = 140;
            bDepth = 110;
        }

        // Allocate spacious, guaranteed non-overlapping parcel
        const newPos = findSpaciousParcel(appState.campus.buildings, bWidth, bDepth);

        const newFloors = [];
        for (let i = 0; i < numFloors; i++) {
            const level = i;
            const floorName = level === 0 ? 'Ground Floor (L0)' : `Floor ${level}`;
            newFloors.push({
                id: `floor_${bldgId}_${level}`,
                name: floorName,
                level: level,
                plan: {
                    rooms: [
                        { id: `room_${bldgId}_${level}_1`, name: "Main Office Suite", shape: 'rect', points: [{ x: 80, y: 60 }, { x: 440, y: 60 }, { x: 440, y: 440 }, { x: 80, y: 440 }] },
                        { id: `room_${bldgId}_${level}_2`, name: "Conference Room", shape: 'rect', points: [{ x: 440, y: 60 }, { x: 720, y: 60 }, { x: 720, y: 440 }, { x: 440, y: 440 }] }
                    ],
                    doors: [
                        { id: `door_${bldgId}_${level}_1`, name: `${name} Entry`, deviceMac: "", x: 440, y: 240, rotation: 90 }
                    ],
                    windows: []
                }
            });
        }

        const newBuilding = {
            id: bldgId,
            name: name,
            type: type,
            color: color,
            iso: { x: newPos.x, y: newPos.y, width: bWidth, depth: bDepth },
            floors: newFloors
        };

        appState.campus.buildings.push(newBuilding);
        saveCampusData();
        renderCampus3D();
        showToast(`Building "${name}" added to campus!`, "success");
        if (nameInput) nameInput.value = '';
        switchCampusManagerTab('overview');
        renderCampusDirectory();
    }

    function createNewFloor() {

        const bldgSelect = document.getElementById("new-floor-bldg-select");

        const nameInput = document.getElementById("new-floor-name");

        const levelInput = document.getElementById("new-floor-level");

        const templateSelect = document.getElementById("new-floor-template");

        const bldgId = bldgSelect?.value;

        const bldg = appState.campus.buildings.find(b => b.id === bldgId);

        if (!bldg) {

            showToast("Please select a target building", "warning");

            return;

        }

        const name = (nameInput?.value || '').trim() || `Floor ${bldg.floors.length}`;

        const level = parseInt(levelInput?.value || `${bldg.floors.length}`, 10);

        const template = templateSelect?.value || 'empty';

        let newPlan = { rooms: [], doors: [], windows: [] };

        if (template === 'copy_ground' && bldg.floors.length > 0) {

            newPlan = JSON.parse(JSON.stringify(bldg.floors[0].plan));

        } else if (template === 'office') {

            newPlan = {

                rooms: [

                    { id: `room_${Date.now()}_1`, name: "Office 101", shape: 'rect', points: [{ x: 80, y: 60 }, { x: 400, y: 60 }, { x: 400, y: 260 }, { x: 80, y: 260 }] },

                    { id: `room_${Date.now()}_2`, name: "Meeting Hall", shape: 'rect', points: [{ x: 400, y: 60 }, { x: 720, y: 60 }, { x: 720, y: 260 }, { x: 400, y: 260 }] },

                    { id: `room_${Date.now()}_3`, name: "Open Workspace", shape: 'rect', points: [{ x: 80, y: 260 }, { x: 720, y: 260 }, { x: 720, y: 440 }, { x: 80, y: 440 }] }

                ],

                doors: [

                    { id: `door_${Date.now()}_1`, name: "Suite Entry", deviceMac: "", x: 400, y: 160, rotation: 90 }

                ],

                windows: []

            };

        }

        const newFloorId = `floor_${bldgId}_${Date.now()}`;

        bldg.floors.push({

            id: newFloorId,

            name: name,

            level: level,

            plan: newPlan

        });

        saveCampusData();

        renderCampus3D();

        showToast(`Floor "${name}" created! 3D height adjusted.`, "success");

        if (nameInput) nameInput.value = '';

        switchCampusManagerTab('overview');

        renderCampusDirectory();

    }

    async function deleteFloor(bldgId, floorId) {

        const bldg = appState.campus.buildings.find(b => b.id === bldgId);

        if (!bldg || bldg.floors.length <= 1) {

            showToast("A building must have at least one floor", "warning");

            return;

        }

        const fl = bldg.floors.find(f => f.id === floorId);

        const confirmed = await showConfirmDialog(

            `Delete floor "${fl?.name || floorId}"? Its rooms and layouts will be removed and the 3D building height will scale down.`,

            "Delete Floor",

            true

        );

        if (!confirmed) return;

        bldg.floors = bldg.floors.filter(f => f.id !== floorId);

        if (appState.campus.activeFloorId === floorId) {

            appState.campus.activeFloorId = bldg.floors[0].id;

            appState.plan = bldg.floors[0].plan;

        }

        saveCampusData();

        renderCampus3D();

        renderElevatorRail();

        renderCampusBreadcrumbs();

        renderCampusDirectory();

        showToast("Floor deleted and 3D height updated", "info");

    }

    async function deleteBuilding(bldgId) {
        if (!appState.campus || !appState.campus.buildings) return;

        const bldg = appState.campus.buildings.find(b => b.id === bldgId);
        if (!bldg) {
            showToast("Building not found", "warning");
            return;
        }

        if (appState.campus.buildings.length <= 1) {
            showToast("The campus must have at least one building", "warning");
            return;
        }

        const confirmed = await showConfirmDialog(
            `Delete building "${bldg.name}"?\nAll ${bldg.floors ? bldg.floors.length : 0} floors and room layouts in this building will be permanently removed from the 3D map and floor plans.`,
            "Delete Building",
            true
        );

        if (!confirmed) return;

        appState.campus.buildings = appState.campus.buildings.filter(b => b.id !== bldgId);

        if (appState.campus.activeBuildingId === bldgId) {
            const nextB = appState.campus.buildings[0];
            appState.campus.activeBuildingId = nextB.id;
            appState.campus.activeFloorId = nextB.floors && nextB.floors.length > 0 ? nextB.floors[0].id : null;
            appState.plan = nextB.floors && nextB.floors.length > 0 ? nextB.floors[0].plan : { rooms: [], doors: [], windows: [] };
        }

        saveCampusData();
        renderCampus3D();
        renderCampusDirectory();
        renderCampusBreadcrumbs();
        renderElevatorRail();

        const currentBldg = appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId);
        if (currentBldg) {
            const b3d = (typeof B !== 'undefined' && Array.isArray(B)) ? B.find(x => x.id === currentBldg.id || x.name === currentBldg.name) : currentBldg;
            if (typeof buildInteriorForBuilding === 'function') buildInteriorForBuilding(b3d || currentBldg);
            if (typeof renderPlan === 'function') renderPlan();
        }

        showToast(`Building "${bldg.name}" was successfully deleted`, "success");
    }
    window.deleteBuilding = deleteBuilding;

    // -------------------------------------------------------------

    // Sensor Scope Filter Handler (Floor, Building, Campus)

    // -------------------------------------------------------------

    function setSensorScope(scope) {
        if (!appState.campus) initCampusSystem();
        appState.campus.sensorScope = scope;
        saveCampusData();
        ['floor', 'bldg', 'campus'].forEach(s => {
            const btn = document.getElementById(`btn-scope-${s}`);
            if (btn) {
                if ((scope === 'building' && s === 'bldg') || scope === s) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            }
        });
        appState.lastPollDataStr = null;
        if (typeof pollStatus === 'function') pollStatus();
    }

    // Presets and Constants

    // -------------------------------------------------------------

    const PRESET_PLAN = {

        rooms: [

            { id: "room_living", name: "Living Room", shape: 'rect', points: [{ x: 80, y: 60 }, { x: 400, y: 60 }, { x: 400, y: 260 }, { x: 80, y: 260 }] },

            { id: "room_bedroom", name: "Master Bedroom", shape: 'rect', points: [{ x: 400, y: 60 }, { x: 720, y: 60 }, { x: 720, y: 260 }, { x: 400, y: 260 }] },

            { id: "room_kitchen", name: "Kitchen & Dining", shape: 'rect', points: [{ x: 80, y: 260 }, { x: 400, y: 260 }, { x: 400, y: 440 }, { x: 80, y: 440 }] },

            { id: "room_balcony", name: "Balcony & Patio", shape: 'rect', points: [{ x: 400, y: 260 }, { x: 720, y: 260 }, { x: 720, y: 440 }, { x: 400, y: 440 }] }

        ],

        doors: [

            { id: "door_main", name: "Main Entrance", deviceMac: "24:6F:28:AB:12:01", x: 80, y: 160, rotation: 90 },

            { id: "door_bedroom", name: "Bedroom Door", deviceMac: "24:6F:28:AB:12:02", x: 400, y: 160, rotation: 90 },

            { id: "door_balcony", name: "Balcony Door", deviceMac: "24:6F:28:AB:12:03", x: 560, y: 260, rotation: 0 }

        ],

        windows: [

            { id: "window_living", name: "Living Room Window", deviceMac: "", x: 240, y: 60, rotation: 0 },

            { id: "window_kitchen", name: "Kitchen Window", deviceMac: "24:6F:28:AB:12:04", x: 240, y: 440, rotation: 180 },

            { id: "window_bedroom", name: "Bedroom Window", deviceMac: "", x: 720, y: 160, rotation: 90 }

        ]

    };

    function getDeletedMacsList() {

        try {

            return JSON.parse(localStorage.getItem('smartdoor_deleted_macs') || '[]').map(m => (m || '').toLowerCase());

        } catch (e) {

            return [];

        }

    }

    function isMacDeleted(mac) {

        if (!mac) return false;

        return getDeletedMacsList().includes(mac.toLowerCase());

    }

    // -------------------------------------------------------------

    // Toast Notification System (Smart Grouping, Max 2, Instant Dismiss)

    // -------------------------------------------------------------

    const toastTimers = new WeakMap();

    function dismissToast(toast) {

        if (!toast || toast.classList.contains('toast-hide')) return;

        const timer = toastTimers.get(toast);

        if (timer) clearTimeout(timer);

        toast.classList.add('toast-hide');

        setTimeout(() => {

            if (toast && toast.parentNode) toast.remove();

        }, 220);

    }

    function showToast(message, type = 'info', customDuration = null) {

        let container = document.getElementById('toast-container');

        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(container);
        }

        // Tactile sensory feedback
        if (typeof triggerHaptic === 'function') {
            if (type === 'error' || type === 'danger' || type === 'warning') triggerHaptic('warning');
            else if (type === 'success') triggerHaptic('medium');
            else triggerHaptic('light');
        }

        const duration = customDuration || ((type === 'error' || type === 'danger' || type === 'warning') ? 3200 : 1800);

        // 1. Group duplicates: If same message is already visible, increment badge & reset timer

        const activeToasts = container.querySelectorAll('.toast:not(.toast-hide)');

        const lastToast = activeToasts.length > 0 ? activeToasts[activeToasts.length - 1] : null;

        if (lastToast && lastToast.dataset.rawMsg === message && lastToast.dataset.type === type) {

            let count = parseInt(lastToast.dataset.count || '1', 10) + 1;

            lastToast.dataset.count = count;

            const textEl = lastToast.querySelector('.toast-text');

            if (textEl) {

                textEl.innerHTML = `${message} <span class="toast-count-badge">×${count}</span>`;

            }

            lastToast.classList.remove('toast-pulse');

            void lastToast.offsetWidth;

            lastToast.classList.add('toast-pulse');

            const oldTimer = toastTimers.get(lastToast);

            if (oldTimer) clearTimeout(oldTimer);

            const newTimer = setTimeout(() => dismissToast(lastToast), duration);

            toastTimers.set(lastToast, newTimer);

            return;

        }

        // 2. Concurrency limit: Dismiss oldest toast if more than 2 are showing

        if (activeToasts.length >= 2) {

            dismissToast(activeToasts[0]);

        }

        const icons = {

            success: 'check-circle',

            error: 'x-circle',

            warning: 'alert-triangle',

            info: 'info'

        };

        const toast = document.createElement('div');

        toast.className = `toast toast-${type}`;

        toast.dataset.rawMsg = message;

        toast.dataset.type = type;

        toast.dataset.count = '1';

        toast.title = 'Click to dismiss';

        toast.innerHTML = `

            <span class="toast-icon"><i data-lucide="${icons[type] || 'info'}"></i></span>

            <span class="toast-text">${message}</span>

            <button type="button" class="toast-close-btn" aria-label="Dismiss">&times;</button>

        `;

        toast.addEventListener('click', () => dismissToast(toast));

        container.appendChild(toast);

        if (typeof lucide !== 'undefined' && lucide.createIcons) {

            lucide.createIcons({ el: toast });

        }

        const timer = setTimeout(() => dismissToast(toast), duration);

        toastTimers.set(toast, timer);

    }

    // -------------------------------------------------------------

    // Login Splash Screen Functions

    // -------------------------------------------------------------

    function splashSwitchTab(tab) {

        const loginForm = document.getElementById('splash-login-form');

        const regForm = document.getElementById('splash-register-form');

        const loginBtn = document.getElementById('splash-tab-login');

        const regBtn = document.getElementById('splash-tab-register');

        const errMsg = document.getElementById('splash-error-msg');

        if (errMsg) { errMsg.textContent = ''; errMsg.classList.remove('show'); }

        if (tab === 'login') {

            if (loginForm) loginForm.classList.remove('hidden');

            if (regForm) regForm.classList.add('hidden');

            if (loginBtn) loginBtn.classList.add('active');

            if (regBtn) regBtn.classList.remove('active');

        } else {

            if (regForm) regForm.classList.remove('hidden');

            if (loginForm) loginForm.classList.add('hidden');

            if (regBtn) regBtn.classList.add('active');

            if (loginBtn) loginBtn.classList.remove('active');

        }

    }

    function showSplashError(msg) {

        const errEl = document.getElementById('splash-error-msg');

        if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }

    }

    function setButtonLoading(btnId, loading) {

        const btn = document.getElementById(btnId);

        if (!btn) return;

        if (loading) {

            btn.classList.add('loading');

        } else {

            btn.classList.remove('loading');

        }

    }

    function hideSplash() {

        const splash = document.getElementById('login-splash');

        if (splash) {

            splash.style.transition = 'opacity 0.35s ease';

            splash.style.opacity = '0';

            setTimeout(() => splash.classList.add('hidden'), 380);

        }

    }

    function showSplash() {

        const splash = document.getElementById('login-splash');

        if (splash) {

            splash.classList.remove('hidden');

            splash.style.opacity = '1';

        }

    }

    function performSplashLogin() {

        const uname = (document.getElementById('splash-username') || {}).value?.trim();

        const pwd = (document.getElementById('splash-password') || {}).value;

        const errEl = document.getElementById('splash-error-msg');

        if (errEl) { errEl.classList.remove('show'); errEl.textContent = ''; }

        if (!uname || !pwd) {

            showSplashError('Username and password are required.');

            return;

        }

        setButtonLoading('splash-login-btn', true);

        fetch('/api/login', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ username: uname, password: pwd })

        })

            .then(r => r.json())

            .then(data => {

                setButtonLoading('splash-login-btn', false);

                if (data.status === 'success') {

                    hideSplash();

                    appState.isAuthenticated = true;

                    fetchUserInfo();

                    showToast(`Welcome back, ${data.username}!`, 'success');

                } else {

                    showSplashError(data.message || 'Invalid username or password.');

                }

            })

            .catch(() => {

                setButtonLoading('splash-login-btn', false);

                showSplashError('Cannot connect to server. Please try again.');

            });

    }

    function performSplashRegister() {

        const uname = (document.getElementById('splash-reg-username') || {}).value?.trim();

        const email = (document.getElementById('splash-reg-email') || {}).value?.trim();

        const pwd = (document.getElementById('splash-reg-password') || {}).value;

        const errEl = document.getElementById('splash-error-msg');

        if (errEl) { errEl.classList.remove('show'); errEl.textContent = ''; }

        if (!uname || !pwd) {

            showSplashError('Username and password are required.');

            return;

        }

        setButtonLoading('splash-register-btn', true);

        fetch('/api/register', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ username: uname, email: email, password: pwd })

        })

            .then(r => r.json())

            .then(data => {

                setButtonLoading('splash-register-btn', false);

                if (data.status === 'success') {

                    hideSplash();

                    appState.isAuthenticated = true;

                    fetchUserInfo();

                    showToast(`Account "${data.username}" created — welcome!`, 'success');

                } else {

                    showSplashError(data.message || 'Could not create account.');

                }

            })

            .catch(() => {

                setButtonLoading('splash-register-btn', false);

                showSplashError('Cannot connect to server. Please try again.');

            });

    }

    // Keyboard shortcut: Enter to submit splash form, Ctrl+Z/Ctrl+Y for Layout Undo/Redo

    document.addEventListener('keydown', (e) => {

        const splash = document.getElementById('login-splash');

        if (splash && !splash.classList.contains('hidden') && e.key === 'Enter') {

            const loginVisible = !document.getElementById('splash-login-form')?.classList.contains('hidden');

            if (loginVisible) performSplashLogin();

            else performSplashRegister();

            return;

        }

        // Enter & Escape handling for active Confirmation Modal

        const confirmModal = document.getElementById('confirm-modal') || document.getElementById('custom-confirm-modal');

        if (confirmModal && !confirmModal.classList.contains('hidden')) {

            if (e.key === 'Escape') {

                e.preventDefault();

                resolveConfirmModal(false);

                return;

            } else if (e.key === 'Enter') {

                e.preventDefault();

                resolveConfirmModal(true);

                return;

            }

        }

        // Undo / Redo / Delete keyboard shortcuts in Edit Layout mode

        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';

        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        if (appState.mode !== 'edit') return;

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {

            if (e.shiftKey) {

                e.preventDefault();

                redoLayout();

            } else {

                e.preventDefault();

                undoLayout();

            }

        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {

            e.preventDefault();

            redoLayout();

        } else if (e.key === 'Escape') {

            if (appState.isDrawingCustom) {

                cancelCustomDraw();

            } else if (appState.selectedId) {

                selectElement(null);

            }

        } else if ((e.key === 'Delete' || e.key === 'Backspace') && appState.selectedId) {

            e.preventDefault();

            deleteElement();

        }

    });

    // -------------------------------------------------------------

    // Custom Apple Dropdown Component — Fixed-Position Engine

    // Escapes overflow:hidden/auto ancestors (e.g. properties panel)

    // -------------------------------------------------------------

    function _getContainingBlock(element) {

        let el = element.parentElement;

        while (el && el !== document.documentElement && el !== document.body) {

            const style = window.getComputedStyle(el);

            if (

                style.transform !== 'none' ||

                style.perspective !== 'none' ||

                style.filter !== 'none' ||

                (style.contain && (style.contain.includes('paint') || style.contain.includes('layout') || style.contain.includes('strict') || style.contain.includes('content'))) ||

                (style.willChange && (style.willChange.includes('transform') || style.willChange.includes('perspective')))

            ) {

                return el;

            }

            el = el.parentElement;

        }

        return null;

    }

    function _positionDropdownMenu(container, menu) {

        const trigger = container.querySelector('.custom-dropdown-trigger');

        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();

        const cb = _getContainingBlock(menu);

        const cbRect = cb ? cb.getBoundingClientRect() : null;

        const offsetLeft = cbRect ? (rect.left - cbRect.left) : rect.left;

        const offsetTop = cbRect ? (rect.bottom + 4 - cbRect.top) : (rect.bottom + 4);

        const offsetBottom = cbRect ? (cbRect.bottom - rect.top + 4) : (window.innerHeight - rect.top + 4);

        const menuHeight = menu.scrollHeight || 180;

        const viewportH = window.innerHeight;

        const spaceBelow = viewportH - rect.bottom;

        const spaceAbove = rect.top;

        menu.style.position = 'fixed';

        menu.style.left = offsetLeft + 'px';

        menu.style.right = 'auto';

        menu.style.width = rect.width + 'px';

        menu.style.minWidth = rect.width + 'px';

        menu.style.zIndex = '99999';

        // Open upward if not enough space below

        if (spaceBelow < menuHeight + 10 && spaceAbove > spaceBelow) {

            menu.style.top = '';

            menu.style.bottom = offsetBottom + 'px';

        } else {

            menu.style.bottom = '';

            menu.style.top = offsetTop + 'px';

        }

    }

    function _closeAllDropdowns(exceptId) {

        document.querySelectorAll('.custom-dropdown-container.open').forEach(el => {

            if (el.id !== exceptId) {

                el.classList.remove('open');

                const m = el.querySelector('.custom-dropdown-menu');

                if (m) {

                    m.classList.add('hidden');

                    m.style.position = '';

                    m.style.top = '';

                    m.style.bottom = '';

                    m.style.left = '';

                    m.style.right = '';

                    m.style.width = '';

                    m.style.zIndex = '';

                    m.style.minWidth = '';

                }

            }

        });

    }

    function toggleCustomDropdown(containerId) {

        const container = document.getElementById(containerId);

        if (!container) return;

        const isOpen = container.classList.contains('open');

        _closeAllDropdowns(containerId);

        container.classList.toggle('open', !isOpen);

        const menu = container.querySelector('.custom-dropdown-menu');

        if (!menu) return;

        if (!isOpen) {

            menu.classList.remove('hidden');

            _positionDropdownMenu(container, menu);

        } else {

            menu.classList.add('hidden');

            menu.style.position = '';

            menu.style.top = '';

            menu.style.bottom = '';

            menu.style.left = '';

            menu.style.right = '';

            menu.style.width = '';

            menu.style.zIndex = '';

            menu.style.minWidth = '';

        }

        lucide.createIcons();

    }

    document.addEventListener('click', (e) => {

        if (!e.target.closest('.custom-dropdown-container')) {

            _closeAllDropdowns(null);

        }

    });

    // Reposition on scroll / resize to keep menus aligned

    window.addEventListener('scroll', () => _closeAllDropdowns(null), true);

    window.addEventListener('resize', () => _closeAllDropdowns(null));

    // -------------------------------------------------------------

    // Initialization

    // -------------------------------------------------------------

    document.addEventListener("DOMContentLoaded", () => {

        lucide.createIcons();

        // Check if user is already authenticated on page load

        fetch('/api/users')

            .then(r => r.json())

            .then(data => {

                if (data.current_user && data.current_user.is_authenticated) {

                    hideSplash();

                    appState.isAuthenticated = true;

                    fetchUserInfo();

                }

                // If not authenticated, splash stays visible

            })

            .catch(() => {

                // Server error — still hide splash to allow usage

                hideSplash();

            });

        loadPlan();

        const svg = document.getElementById("floorplan-svg");

        if (svg) {

            svg.addEventListener("mousedown", handleMouseDown);

            window.addEventListener("mousemove", handleMouseMove);

            window.addEventListener("mouseup", handleMouseUp);

            // Mobile Touch support for dragging elements in edit mode

            svg.addEventListener("touchstart", (e) => {

                if (appState.mode === 'edit' && e.touches.length === 1) {

                    const touch = e.touches[0];

                    const targetEl = document.elementFromPoint(touch.clientX, touch.clientY) || e.target;

                    const fakeEvent = {

                        clientX: touch.clientX,

                        clientY: touch.clientY,

                        target: targetEl,

                        stopPropagation: () => e.stopPropagation(),

                        preventDefault: () => e.preventDefault()

                    };

                    handleMouseDown(fakeEvent);

                    if (appState.dragState.type || appState.isDrawingCustom) {

                        e.preventDefault();

                    }

                }

            }, { passive: false });

            window.addEventListener("touchmove", (e) => {

                if (appState.dragState.type && e.touches.length === 1) {

                    e.preventDefault();

                    const touch = e.touches[0];

                    const fakeEvent = {

                        clientX: touch.clientX,

                        clientY: touch.clientY

                    };

                    handleMouseMove(fakeEvent);

                } else if (appState.isDrawingCustom && e.touches.length === 1) {

                    const touch = e.touches[0];

                    const coords = getSVGCoords({ clientX: touch.clientX, clientY: touch.clientY });

                    appState.mouseCoords = { x: snapToGrid(coords.x), y: snapToGrid(coords.y) };

                    renderDrawingPreview();

                }

            }, { passive: false });

            window.addEventListener("touchend", () => {

                if (appState.dragState.type) {

                    handleMouseUp();

                }

            });

        }

        // Swipe Gestures for Mobile Bottom Sheet Sensor Drawer

        const drawerHandle = document.getElementById("mobile-drawer-handle");

        if (drawerHandle) {

            let swipeStartY = 0;

            let swipeStartTime = 0;

            drawerHandle.addEventListener("touchstart", (e) => {

                if (e.touches.length === 1) {

                    swipeStartY = e.touches[0].clientY;

                    swipeStartTime = Date.now();

                }

            }, { passive: true });

            drawerHandle.addEventListener("touchend", (e) => {

                if (e.changedTouches.length === 1) {

                    const endY = e.changedTouches[0].clientY;

                    const deltaY = endY - swipeStartY;

                    const elapsed = Date.now() - swipeStartTime;

                    // Swipe UP (deltaY < -25px) -> Expand drawer

                    if (deltaY < -25) {

                        toggleMobileSensorDrawer(true);

                    }

                    // Swipe DOWN (deltaY > 25px) -> Collapse drawer

                    else if (deltaY > 25) {

                        toggleMobileSensorDrawer(false);

                    }

                }

            }, { passive: true });

        }

        autoRefreshAllData();

        setInterval(autoRefreshAllData, 2000);

    });

    function undoCustomPoint() {

        if (!appState.isDrawingCustom || appState.customPoints.length === 0) return;

        appState.customPoints.pop();

        renderDrawingPreview();

        showToast(`Point removed (${appState.customPoints.length} points remaining)`, "info");

    }

    // -------------------------------------------------------------

    // Mobile Bottom Sheet Drawer Control & Header Updates

    // -------------------------------------------------------------

    function toggleMobileSensorDrawer(forceState = null) {

        const panel = document.getElementById("right-sidebar-panel");

        const backdrop = document.getElementById("mobile-drawer-backdrop");

        if (!panel) return;

        const isCurrentlyExpanded = panel.classList.contains("mobile-expanded");

        const nextState = forceState !== null ? forceState : !isCurrentlyExpanded;

        panel.classList.toggle("mobile-expanded", nextState);

        if (backdrop) backdrop.classList.toggle("hidden", !nextState);

    }

    function updateMobileDrawerHeader() {

        const titleEl = document.getElementById("mob-sensor-title");

        const badgeEl = document.getElementById("mob-sensor-status-badge");

        const iconEl = document.getElementById("mob-drawer-icon");

        if (!titleEl) return;

        if (appState.mode === 'edit') {

            if (appState.selectedId) {

                let item = appState.plan.rooms.find(r => r.id === appState.selectedId) ||

                    appState.plan.doors.find(d => d.id === appState.selectedId) ||

                    appState.plan.windows.find(w => w.id === appState.selectedId);

                if (item) {

                    titleEl.innerHTML = `Selected: <strong>${item.name}</strong>`;

                    if (badgeEl) {

                        badgeEl.textContent = "CONFIGURE";

                        badgeEl.style.color = "var(--blue)";

                        badgeEl.style.background = "var(--blue-light)";

                        badgeEl.style.borderColor = "#bfdbfe";

                    }

                    if (iconEl) iconEl.setAttribute("data-lucide", "sliders");

                    lucide.createIcons();

                    return;

                }

            }

            titleEl.textContent = "Inspector";

            if (badgeEl) {

                badgeEl.textContent = "EDIT";

                badgeEl.style.color = "var(--orange)";

                badgeEl.style.background = "var(--orange-bg)";

                badgeEl.style.borderColor = "var(--orange-border)";

            }

            if (iconEl) iconEl.setAttribute("data-lucide", "sliders");

            lucide.createIcons();

        } else {

            const count = Object.keys(appState.activeStatus).length;

            const anyOpen = Object.values(appState.activeStatus).some(s => s === 'OPEN');

            titleEl.innerHTML = `Active Sensors (<span id="mob-sensor-count">${count}</span>)`;

            if (badgeEl) {

                badgeEl.textContent = anyOpen ? "UNSECURED" : "SECURED";

                badgeEl.style.color = anyOpen ? "var(--red)" : "var(--blue)";

                badgeEl.style.background = anyOpen ? "var(--red-bg)" : "var(--blue-light)";

                badgeEl.style.borderColor = anyOpen ? "var(--red-border)" : "#bfdbfe";

            }

            if (iconEl) iconEl.setAttribute("data-lucide", "activity");

            lucide.createIcons();

        }

    }

    // -------------------------------------------------------------

    // Room Geometry Helpers

    // -------------------------------------------------------------

    function getRoomPoints(room) {

        if (room.points && room.points.length > 0) return room.points;

        const x = room.x || 100, y = room.y || 100, w = room.w || 160, h = room.h || 120;

        return [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];

    }

    function getRoomBoundingBox(room) {

        const pts = getRoomPoints(room);

        const xs = pts.map(p => p.x), ys = pts.map(p => p.y);

        const minX = Math.min(...xs), maxX = Math.max(...xs);

        const minY = Math.min(...ys), maxY = Math.max(...ys);

        return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY, centerX: (minX + maxX) / 2, centerY: (minY + maxY) / 2 };

    }

    // -------------------------------------------------------------

    // Undo / Redo History Engine

    // -------------------------------------------------------------

    const MAX_PLAN_HISTORY = 40;

    const planUndoStack = [];

    const planRedoStack = [];

    function pushPlanHistory() {

        if (!appState.plan) return;

        const currentSnap = JSON.stringify(appState.plan);

        if (planUndoStack.length > 0 && planUndoStack[planUndoStack.length - 1] === currentSnap) {

            return;

        }

        planUndoStack.push(currentSnap);

        if (planUndoStack.length > MAX_PLAN_HISTORY) {

            planUndoStack.shift();

        }

        planRedoStack.length = 0;

        updateUndoRedoUI();

    }

    function pushSpecificPlanHistory(snapshot) {

        if (!snapshot) return;

        if (planUndoStack.length > 0 && planUndoStack[planUndoStack.length - 1] === snapshot) {

            return;

        }

        planUndoStack.push(snapshot);

        if (planUndoStack.length > MAX_PLAN_HISTORY) {

            planUndoStack.shift();

        }

        planRedoStack.length = 0;

        updateUndoRedoUI();

    }

    function undoLayout() {

        if (planUndoStack.length === 0) {

            showToast("Nothing to undo.", "info");

            return;

        }

        planRedoStack.push(JSON.stringify(appState.plan));

        const prevSnap = planUndoStack.pop();

        try {

            appState.plan = JSON.parse(prevSnap);

            if (appState.selectedId) {

                const stillExists = (appState.plan.rooms && appState.plan.rooms.some(r => r.id === appState.selectedId)) ||

                    (appState.plan.doors && appState.plan.doors.some(d => d.id === appState.selectedId)) ||

                    (appState.plan.windows && appState.plan.windows.some(w => w.id === appState.selectedId));

                if (!stillExists) appState.selectedId = null;

            }

            savePlan();

            renderPlan();

            updatePropertiesPanel();

            updateCanvasEmptyState();

            updateUndoRedoUI();

            showToast("Undo applied", "info");

        } catch (e) {

            console.error("Undo error:", e);

        }

    }

    function redoLayout() {

        if (planRedoStack.length === 0) {

            showToast("Nothing to redo.", "info");

            return;

        }

        planUndoStack.push(JSON.stringify(appState.plan));

        const nextSnap = planRedoStack.pop();

        try {

            appState.plan = JSON.parse(nextSnap);

            if (appState.selectedId) {

                const stillExists = (appState.plan.rooms && appState.plan.rooms.some(r => r.id === appState.selectedId)) ||

                    (appState.plan.doors && appState.plan.doors.some(d => d.id === appState.selectedId)) ||

                    (appState.plan.windows && appState.plan.windows.some(w => w.id === appState.selectedId));

                if (!stillExists) appState.selectedId = null;

            }

            savePlan();

            renderPlan();

            updatePropertiesPanel();

            updateCanvasEmptyState();

            updateUndoRedoUI();

            showToast("Redo applied", "info");

        } catch (e) {

            console.error("Redo error:", e);

        }

    }

    function updateUndoRedoUI() {

        const canUndo = planUndoStack.length > 0;

        const canRedo = planRedoStack.length > 0;

        const btnUndo = document.getElementById("btn-undo");

        const btnRedo = document.getElementById("btn-redo");

        const floatUndo = document.getElementById("btn-undo-float");

        const floatRedo = document.getElementById("btn-redo-float");

        if (btnUndo) { btnUndo.disabled = !canUndo; }

        if (btnRedo) { btnRedo.disabled = !canRedo; }

        if (floatUndo) { floatUndo.disabled = !canUndo; }

        if (floatRedo) { floatRedo.disabled = !canRedo; }

    }

    // -------------------------------------------------------------

    // Layout Controls & Mode Switching

    // -------------------------------------------------------------

    function setMode(mode) {

        _closeAllDropdowns(null);

        if (appState.mode === 'edit' && mode === 'monitor') {

            savePlan();

        }

        appState.mode = mode;

        if (mode === 'monitor' && appState.isDrawingCustom) cancelCustomDraw();

        document.body.classList.toggle('mode-edit', mode === 'edit');

        const btnMon = document.getElementById("btn-mode-monitor");

        const btnEdit = document.getElementById("btn-mode-edit");

        if (btnMon) btnMon.classList.toggle("active", mode === 'monitor');

        if (btnEdit) btnEdit.classList.toggle("active", mode === 'edit');

        const toolbar = document.getElementById("designer-toolbar");

        const help = document.getElementById("designer-help");

        if (toolbar) toolbar.classList.toggle("hidden", mode === 'monitor');

        if (help) help.classList.toggle("hidden", mode === 'monitor');

        const btnSave = document.getElementById("btn-save-layout");

        const btnDemo = document.getElementById("btn-load-demo");

        const btnClear = document.getElementById("btn-clear-layout");

        if (btnSave) btnSave.classList.toggle("hidden", mode === 'monitor');

        if (btnDemo) btnDemo.classList.toggle("hidden", mode === 'monitor');

        if (btnClear) btnClear.classList.toggle("hidden", mode === 'monitor');

        const floatUndo = document.getElementById("btn-undo-float");

        const floatRedo = document.getElementById("btn-redo-float");

        const floatSep = document.getElementById("float-undo-sep");

        if (floatUndo) floatUndo.classList.toggle("hidden", mode === 'monitor');

        if (floatRedo) floatRedo.classList.toggle("hidden", mode === 'monitor');

        if (floatSep) floatSep.classList.toggle("hidden", mode === 'monitor');

        const rightSensors = document.getElementById("right-sensors-sidebar");

        const propCard = document.getElementById("properties-card");

        const propPH = document.getElementById("properties-placeholder-card");

        const viewDashboard = document.getElementById("view-dashboard");

        if (mode === 'edit') {

            if (viewDashboard) {
                viewDashboard.classList.remove("view-3d-active");
                viewDashboard.setAttribute("data-view-mode", "2d");
            }
            if (appState.campus && appState.campus.viewMode !== '2d') {
                appState.campus.viewMode = '2d';
                saveCampusData();
            }

            if (rightSensors) rightSensors.classList.add("hidden");

            if (appState.selectedId) {

                if (propCard) propCard.classList.remove("hidden");

                if (propPH) propPH.classList.add("hidden");

            } else {

                if (propCard) propCard.classList.add("hidden");

                if (propPH) propPH.classList.remove("hidden");

            }

        } else {

            if (rightSensors) rightSensors.classList.remove("hidden");

            if (propCard) propCard.classList.add("hidden");

            if (propPH) propPH.classList.add("hidden");

            selectElement(null);

            toggleMobileSensorDrawer(false);

        }

        renderPlan();

        updateCanvasEmptyState();

        updateMobileDrawerHeader();

        updateUndoRedoUI();

        // On mobile: auto-expand drawer when entering Edit, auto-collapse when returning to Monitor

        const isMobile = window.innerWidth <= 768;

        if (isMobile) {

            if (mode === 'edit') {

                setTimeout(() => toggleMobileSensorDrawer(true), 150);

            } else {

                toggleMobileSensorDrawer(false);

            }

        }

    }

    function updateCanvasEmptyState() {

        const emptyState = document.getElementById('canvas-empty-state');

        if (!emptyState) return;

        const hasContent = appState.plan.rooms.length > 0 || appState.plan.doors.length > 0 || appState.plan.windows.length > 0;

        emptyState.classList.toggle('hidden', hasContent || appState.mode === 'edit');

    }

    function savePlan() {

        localStorage.setItem("smartdoor_floorplan", JSON.stringify(appState.plan));

        // Also persist into the active floor of the campus

        if (appState.campus && appState.campus.buildings) {

            const bldg = appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId);

            if (bldg) {

                const fl = bldg.floors.find(f => f.id === appState.campus.activeFloorId);

                if (fl) {

                    fl.plan = JSON.parse(JSON.stringify(appState.plan));

                    saveCampusData();

                    if (typeof renderCampus3D === 'function') renderCampus3D();

                }

            }

        }

    }

    function savePlanManual() {
        savePlan();
        const activeBldg = (appState.campus && appState.campus.buildings)
            ? appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId) : null;
        if (activeBldg && typeof buildInteriorForBuilding === 'function') {
            const b3d = (typeof B !== 'undefined' && Array.isArray(B)) ? B.find(x => x.id === activeBldg.id || x.name === activeBldg.name) : activeBldg;
            buildInteriorForBuilding(b3d || activeBldg);
        }
        showToast("Layout saved and synchronized with 3D model", "success");
    }

    function loadPlan() {

        const saved = localStorage.getItem("smartdoor_floorplan");

        let needsDefault = false;

        if (saved) {

            try {

                appState.plan = JSON.parse(saved);

                // If user had the old floating-island demo layout, upgrade seamlessly to clean architectural blueprint

                if (appState.plan.rooms && appState.plan.rooms.some(r => r.id === 'room_balcony' && r.shape === 'l-shape')) {

                    needsDefault = true;

                }

                const deletedMacs = getDeletedMacsList();

                if (appState.plan.doors) {

                    appState.plan.doors = appState.plan.doors.filter(d => {

                        const dMac = (d.deviceMac || '').toLowerCase();

                        return !dMac || !deletedMacs.includes(dMac);

                    });

                    appState.plan.doors.forEach(d => {

                        if (d.deviceMac && d.deviceMac.includes("00:1A:2B:3C:4D")) d.deviceMac = "";

                    });

                }

                if (appState.plan.windows) {

                    appState.plan.windows = appState.plan.windows.filter(w => {

                        const wMac = (w.deviceMac || '').toLowerCase();

                        return !wMac || !deletedMacs.includes(wMac);

                    });

                    appState.plan.windows.forEach(w => {

                        if (w.deviceMac && w.deviceMac.includes("00:1A:2B:3C:4D")) w.deviceMac = "";

                    });

                }

            } catch (e) {

                needsDefault = true;

            }

        } else {

            needsDefault = true;

        }

        if (needsDefault) {

            const deletedMacs = getDeletedMacsList();

            const freshPreset = JSON.parse(JSON.stringify(PRESET_PLAN));

            if (deletedMacs.length > 0) {

                freshPreset.doors = freshPreset.doors.filter(d => !d.deviceMac || !deletedMacs.includes(d.deviceMac.toLowerCase()));

                freshPreset.windows = freshPreset.windows.filter(w => !w.deviceMac || !deletedMacs.includes(w.deviceMac.toLowerCase()));

            }

            appState.plan = freshPreset;

            savePlan();

        }

        renderPlan();

        updateCanvasEmptyState();

        updateUndoRedoUI();

    }

    async function loadPresetPlan() {

        const confirmed = await showConfirmDialog("Reset to demo plan?", "Load Demo", false);

        if (confirmed) {

            try { localStorage.removeItem('smartdoor_deleted_macs'); } catch (e) { }

            pushPlanHistory();

            appState.plan = JSON.parse(JSON.stringify(PRESET_PLAN));

            savePlan();

            selectElement(null);

            renderPlan();

            updateCanvasEmptyState();

            updateUndoRedoUI();

            showToast("Demo loaded", "success");

        }

    }

    // Quick load for empty state button (no confirm needed)

    function loadPresetPlanQuick() {

        try { localStorage.removeItem('smartdoor_deleted_macs'); } catch (e) { }

        pushPlanHistory();

        appState.plan = JSON.parse(JSON.stringify(PRESET_PLAN));

        savePlan();

        selectElement(null);

        renderPlan();

        updateCanvasEmptyState();

        updateUndoRedoUI();

        showToast("Demo loaded", "success");

    }

    async function clearPlan() {

        const confirmed = await showConfirmDialog("Clear entire layout?", "Clear Layout", true);

        if (confirmed) {

            pushPlanHistory();

            appState.plan = { rooms: [], doors: [], windows: [] };

            savePlan();

            selectElement(null);

            renderPlan();

            updateCanvasEmptyState();

            updateUndoRedoUI();

            showToast("Layout cleared", "info");

        }

    }

    // -------------------------------------------------------------

    // SVG Rendering Engine

    // -------------------------------------------------------------

    function renderPlan() {

        renderRooms();

        renderWindows();

        renderDoors();

    }

    function renderRooms() {

        const group = document.getElementById("rooms-group");

        if (!group) return;

        group.innerHTML = appState.plan.rooms.map(room => {

            const isSelected = room.id === appState.selectedId;

            const pts = getRoomPoints(room);

            const ptsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

            const bbox = getRoomBoundingBox(room);

            let vertexHandles = '';

            if (appState.mode === 'edit' && isSelected) {

                vertexHandles = pts.map((p, idx) => `

                    <!-- Wide 48px touch hitbox for effortless mobile finger dragging -->

                    <circle class="room-vertex-handle" data-room-id="${room.id}" data-vertex-idx="${idx}" cx="${p.x}" cy="${p.y}" r="24" fill="transparent" stroke="transparent" style="cursor: move; touch-action: none;" />

                    <!-- Crisp visible corner circle -->

                    <circle class="room-vertex-handle-visual" cx="${p.x}" cy="${p.y}" r="8" pointer-events="none" />

                `).join('');

            }

            // Clean Architectural Vector Line Icons

            let iconSvg = '';

            const lname = (room.name || '').toLowerCase();

            if (lname.includes('bed')) {

                iconSvg = `<path d="M-8 4 v-6 h16 v6 M-8 0 h16 M-6 0 v-2 h4 v2 M2 0 v-2 h4 v2" fill="none" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;

            } else if (lname.includes('kitchen') || lname.includes('dining')) {

                iconSvg = `<path d="M-5 -4 v8 M-5 0 h2 M3 -4 v8 M1 -4 v2 a1.5 1.5 0 0 0 3 0 v-2" fill="none" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;

            } else if (lname.includes('balcony') || lname.includes('terrace') || lname.includes('patio')) {

                iconSvg = `<path d="M-7 4 h14 M-7 0 h14 M-6 -3 v7 M-2 -3 v7 M2 -3 v7 M6 -3 v7" fill="none" stroke="#2563EB" stroke-width="1.4" stroke-linecap="round"/>`;

            } else {

                iconSvg = `<path d="M-8 4 v-2 a1.5 1.5 0 0 1 1.5 -1.5 h13 a1.5 1.5 0 0 1 1.5 1.5 v2 M-8 1 h16 M-5 -0.5 v1.5 M5 -0.5 v1.5" fill="none" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;

            }

            return `

                <g class="room-group ${isSelected ? 'selected' : ''}" data-id="${room.id}">

                    <polygon class="room-polygon" points="${ptsStr}" />

                    <g transform="translate(${bbox.centerX}, ${bbox.centerY - 16})">

                        <circle cx="0" cy="0" r="13" fill="#EFF6FF" stroke="#DBEAFE" stroke-width="1"/>

                        ${iconSvg}

                    </g>

                    <text class="room-label" x="${bbox.centerX}" y="${bbox.centerY + 5}" text-anchor="middle" dominant-baseline="central">${room.name}</text>

                    <text class="room-tag-badge" x="${bbox.centerX}" y="${bbox.centerY + 19}" text-anchor="middle" dominant-baseline="central">MONITORED ZONE</text>

                    ${vertexHandles}

                </g>

            `;

        }).join('');

    }

    function renderDrawingPreview() {

        const previewGroup = document.getElementById("drawing-preview-group");

        if (!previewGroup) return;

        if (!appState.isDrawingCustom || appState.customPoints.length === 0) { previewGroup.innerHTML = ''; return; }

        const pts = appState.customPoints;

        const ptsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

        const lastPt = pts[pts.length - 1];

        const cur = (appState.mouseCoords && (appState.mouseCoords.x !== 0 || appState.mouseCoords.y !== 0)) ? appState.mouseCoords : lastPt;

        let markers = pts.map((p, idx) => `<circle class="drawing-point-marker" cx="${p.x}" cy="${p.y}" r="${idx === 0 ? '7' : '4'}" fill="${idx === 0 ? 'var(--green)' : 'var(--blue)'}" />`).join('');

        previewGroup.innerHTML = `

            <polygon points="${ptsStr}" fill="rgba(37,99,235,0.08)" stroke="var(--theme-primary)" stroke-width="1.5" stroke-dasharray="4,4" />

            <line x1="${lastPt.x}" y1="${lastPt.y}" x2="${cur.x}" y2="${cur.y}" class="drawing-guide-line" />

            <line x1="${cur.x}" y1="${cur.y}" x2="${pts[0].x}" y2="${pts[0].y}" class="drawing-guide-line" style="opacity:0.4;" />

            ${markers}

        `;

    }

    function renderDoors() {

        const group = document.getElementById("doors-group");

        if (!group) return;

        group.innerHTML = appState.plan.doors.map(door => {

            const isSelected = door.id === appState.selectedId;

            const state = appState.activeStatus[door.deviceMac] || 'UNKNOWN';

            const stateClass = state === 'OPEN' ? 'state-open' : (state === 'CLOSED' ? 'state-closed' : 'state-unknown');

            const batt = door.deviceMac ? appState.activeBattery[door.deviceMac] : null;

            const isOpen = state === 'OPEN';

            const leafRotation = isOpen ? 90 : 0;

            const radarBeacon = isOpen ? `

                <g class="radar-beacon">

                    <circle cx="0" cy="0" r="10" class="radar-wave-1" />

                    <circle cx="0" cy="0" r="10" class="radar-wave-2" />

                </g>

            ` : '';

            // Clean compact architectural fixture tag positioned close to the fixture

            const nameStr = door.name || '';

            const battStr = batt !== null && batt !== undefined ? `${batt}%` : '';

            const badgeLabel = battStr ? `${nameStr} · ${battStr}` : nameStr;

            const badgeWidth = Math.max(badgeLabel.length * 5.5 + 16, 44);

            const badgeHeight = 16;

            const rad = (door.rotation * Math.PI) / 180;

            // Clean 18px offset keeps tag neatly by the door hinge opening without flying into other rooms

            const ox = Math.round(18 * Math.cos(rad - Math.PI / 2));

            const oy = Math.round(18 * Math.sin(rad - Math.PI / 2));

            const fixtureChip = `

                <g class="fixture-chip-group" transform="translate(${ox}, ${oy}) rotate(${-door.rotation})">

                    <rect class="fixture-chip-bg" x="${-badgeWidth / 2}" y="${-badgeHeight / 2}" width="${badgeWidth}" height="${badgeHeight}" rx="4" />

                    <circle cx="${-badgeWidth / 2 + 7}" cy="0" r="2.5" fill="${isOpen ? '#EF4444' : '#10B981'}" />

                    <text class="fixture-chip-text" x="${-badgeWidth / 2 + 13}" y="0.5" dominant-baseline="middle">${badgeLabel}</text>

                </g>

            `;

            return `

                <g class="door-element ${isSelected ? 'selected' : ''} ${stateClass}" data-id="${door.id}" transform="translate(${door.x}, ${door.y}) rotate(${door.rotation})">

                    ${radarBeacon}

                    <line x1="0" y1="2" x2="0" y2="-42" stroke="#ffffff" stroke-width="8" />

                    <line x1="0" y1="2" x2="0" y2="-42" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="2,2" />

                    <path d="M 0 -40 A 40 40 0 0 1 40 0" class="door-arc" fill="none" stroke-width="1.5" stroke-dasharray="3,3" />

                    <line x1="0" y1="0" x2="0" y2="-40" class="door-leaf" stroke-width="3.5" style="transform-origin: 0px 0px; transform: rotate(${leafRotation}deg); transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);" />

                    <circle cx="0" cy="0" r="4.5" class="door-hinge-pulse" />

                    <circle cx="0" cy="0" r="4.5" class="door-hinge" />

                    ${fixtureChip}

                </g>

            `;

        }).join('');

    }

    function renderWindows() {

        const group = document.getElementById("windows-group");

        if (!group) return;

        group.innerHTML = appState.plan.windows.map(win => {

            const isSelected = win.id === appState.selectedId;

            const state = appState.activeStatus[win.deviceMac] || 'UNKNOWN';

            const stateClass = state === 'OPEN' ? 'state-open' : (state === 'CLOSED' ? 'state-closed' : 'state-unknown');

            const batt = win.deviceMac ? appState.activeBattery[win.deviceMac] : null;

            const isOpen = state === 'OPEN';

            const nameStr = win.name || '';

            const battStr = batt !== null && batt !== undefined ? `${batt}%` : '';

            const badgeLabel = battStr ? `${nameStr} · ${battStr}` : nameStr;

            const badgeWidth = Math.max(badgeLabel.length * 5.5 + 16, 44);

            const badgeHeight = 16;

            const wrad = (win.rotation * Math.PI) / 180;

            // Clean 14px offset

            const wox = Math.round(14 * Math.cos(wrad - Math.PI / 2));

            const woy = Math.round(14 * Math.sin(wrad - Math.PI / 2));

            const fixtureChip = `

                <g class="fixture-chip-group" transform="translate(${wox}, ${woy}) rotate(${-win.rotation})">

                    <rect class="fixture-chip-bg" x="${-badgeWidth / 2}" y="${-badgeHeight / 2}" width="${badgeWidth}" height="${badgeHeight}" rx="4" />

                    <circle cx="${-badgeWidth / 2 + 7}" cy="0" r="2.5" fill="${isOpen ? '#EF4444' : '#10B981'}" />

                    <text class="fixture-chip-text" x="${-badgeWidth / 2 + 13}" y="0.5" dominant-baseline="middle">${badgeLabel}</text>

                </g>

            `;

            return `

                <g class="window-element ${isSelected ? 'selected' : ''} ${stateClass}" data-id="${win.id}" transform="translate(${win.x}, ${win.y}) rotate(${win.rotation})">

                    <rect x="-20" y="-5" width="40" height="10" rx="1.5" class="window-frame" />

                    <line x1="-16" y1="-2" x2="0" y2="-2" class="window-pane pane-1" stroke-width="2.5" />

                    <line x1="0" y1="2" x2="16" y2="2" class="window-pane pane-2" stroke-width="2.5" />

                    ${fixtureChip}

                </g>

            `;

        }).join('');

    }

    // -------------------------------------------------------------

    // Drag & Drop Physics

    // -------------------------------------------------------------

    function isPointInPolygon(pt, polygon) {

        if (!polygon || polygon.length < 3) return false;

        let inside = false;

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {

            const xi = polygon[i].x, yi = polygon[i].y;

            const xj = polygon[j].x, yj = polygon[j].y;

            const intersect = ((yi > pt.y) !== (yj > pt.y)) && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;

        }

        return inside;

    }

    function getSVGCoords(event) {

        const svg = document.getElementById('floorplan-svg');

        const viewport = document.getElementById('viewport-group');

        if (!svg) return { x: 0, y: 0 };

        const pt = svg.createSVGPoint();

        pt.x = event.clientX;

        pt.y = event.clientY;

        if (viewport && viewport.getScreenCTM) {

            const vCtm = viewport.getScreenCTM();

            if (vCtm) {

                return pt.matrixTransform(vCtm.inverse());

            }

        }

        if (svg.getScreenCTM) {

            const sCtm = svg.getScreenCTM();

            if (sCtm) {

                return pt.matrixTransform(sCtm.inverse());

            }

        }

        return { x: event.clientX, y: event.clientY };

    }

    function handleMouseDown(e) {

        if (appState.mode !== 'edit') return;

        const coords = getSVGCoords(e);

        const snappedX = snapToGrid(coords.x);

        const snappedY = snapToGrid(coords.y);

        if (appState.isDrawingCustom) {

            if (e.stopPropagation) e.stopPropagation();

            if (e.preventDefault) e.preventDefault();

            appState.mouseCoords = { x: snappedX, y: snappedY };

            if (appState.customPoints.length >= 3) {

                const firstPt = appState.customPoints[0];

                if (Math.hypot(snappedX - firstPt.x, snappedY - firstPt.y) < 20) {

                    finishCustomDraw(); return;

                }

            }

            appState.customPoints.push({ x: snappedX, y: snappedY });

            renderDrawingPreview();

            return;

        }

        const target = e.target || {};

        const vertexHandle = (target.closest && target.closest('.room-vertex-handle')) || null;

        const roomGroup = (target.closest && target.closest('.room-group')) || null;

        const doorElement = (target.closest && target.closest('.door-element')) || null;

        const windowElement = (target.closest && target.closest('.window-element')) || null;

        // 1. Smart corner proximity detection on mobile

        let proximityVertexIdx = null;

        let proximityRoomId = null;

        if (appState.selectedId && !doorElement && !windowElement) {

            const selRoom = appState.plan.rooms.find(r => r.id === appState.selectedId);

            if (selRoom) {

                const pts = getRoomPoints(selRoom);

                for (let idx = 0; idx < pts.length; idx++) {

                    if (Math.hypot(coords.x - pts[idx].x, coords.y - pts[idx].y) <= 30) {

                        proximityVertexIdx = idx;

                        proximityRoomId = selRoom.id;

                        break;

                    }

                }

            }

        }

        if (vertexHandle || proximityVertexIdx !== null) {

            if (e.stopPropagation) e.stopPropagation();

            const id = vertexHandle ? vertexHandle.getAttribute('data-room-id') : proximityRoomId;

            const vIdx = vertexHandle ? parseInt(vertexHandle.getAttribute('data-vertex-idx')) : proximityVertexIdx;

            const room = appState.plan.rooms.find(r => r.id === id);

            room.points = getRoomPoints(room).map(p => ({ ...p }));

            if (appState.mode === 'edit') {

                appState.dragState = { type: 'move-vertex', targetId: id, vertexIdx: vIdx, startX: coords.x, startY: coords.y, initialX: room.points[vIdx].x, initialY: room.points[vIdx].y, initialPlanSnapshot: JSON.stringify(appState.plan) };

            }

            selectElement(id);

        } else if (doorElement) {

            if (e.stopPropagation) e.stopPropagation();

            const id = doorElement.getAttribute('data-id');

            const door = appState.plan.doors.find(d => d.id === id);

            if (appState.mode === 'edit') {

                appState.dragState = { type: 'move-door', targetId: id, startX: coords.x, startY: coords.y, initialX: door.x, initialY: door.y, initialPlanSnapshot: JSON.stringify(appState.plan) };

            }

            selectElement(id);

        } else if (windowElement) {

            if (e.stopPropagation) e.stopPropagation();

            const id = windowElement.getAttribute('data-id');

            const win = appState.plan.windows.find(w => w.id === id);

            if (appState.mode === 'edit') {

                appState.dragState = { type: 'move-window', targetId: id, startX: coords.x, startY: coords.y, initialX: win.x, initialY: win.y, initialPlanSnapshot: JSON.stringify(appState.plan) };

            }

            selectElement(id);

        } else if (roomGroup) {

            if (e.stopPropagation) e.stopPropagation();

            const id = roomGroup.getAttribute('data-id');

            const room = appState.plan.rooms.find(r => r.id === id);

            room.points = getRoomPoints(room).map(p => ({ ...p }));

            if (appState.mode === 'edit') {

                appState.dragState = { type: 'move-room', targetId: id, startX: coords.x, startY: coords.y, initialPoints: room.points.map(p => ({ ...p })), initialPlanSnapshot: JSON.stringify(appState.plan) };

            }

            selectElement(id);

        } else {

            // 2. Geometric fallback hit testing for rooms, doors, windows

            let geometricHit = false;

            for (const d of appState.plan.doors) {

                if (Math.hypot(coords.x - d.x, coords.y - d.y) <= 30) {

                    if (e.stopPropagation) e.stopPropagation();

                    if (appState.mode === 'edit') {

                        appState.dragState = { type: 'move-door', targetId: d.id, startX: coords.x, startY: coords.y, initialX: d.x, initialY: d.y, initialPlanSnapshot: JSON.stringify(appState.plan) };

                    }

                    selectElement(d.id);

                    geometricHit = true;

                    break;

                }

            }

            if (!geometricHit) {

                for (const w of appState.plan.windows) {

                    if (Math.hypot(coords.x - w.x, coords.y - w.y) <= 30) {

                        if (e.stopPropagation) e.stopPropagation();

                        if (appState.mode === 'edit') {

                            appState.dragState = { type: 'move-window', targetId: w.id, startX: coords.x, startY: coords.y, initialX: w.x, initialY: w.y, initialPlanSnapshot: JSON.stringify(appState.plan) };

                        }

                        selectElement(w.id);

                        geometricHit = true;

                        break;

                    }

                }

            }

            if (!geometricHit) {

                for (let i = appState.plan.rooms.length - 1; i >= 0; i--) {

                    const room = appState.plan.rooms[i];

                    const pts = getRoomPoints(room);

                    if (isPointInPolygon(coords, pts)) {

                        if (e.stopPropagation) e.stopPropagation();

                        room.points = pts.map(p => ({ ...p }));

                        if (appState.mode === 'edit') {

                            appState.dragState = { type: 'move-room', targetId: room.id, startX: coords.x, startY: coords.y, initialPoints: room.points.map(p => ({ ...p })), initialPlanSnapshot: JSON.stringify(appState.plan) };

                        }

                        selectElement(room.id);

                        geometricHit = true;

                        break;

                    }

                }

            }

            if (!geometricHit) {

                selectElement(null);

            }

        }

    }

    function handleMouseMove(e) {

        const coords = getSVGCoords(e);

        appState.mouseCoords = { x: snapToGrid(coords.x), y: snapToGrid(coords.y) };

        if (appState.isDrawingCustom) { renderDrawingPreview(); return; }

        if (!appState.dragState.type) return;

        const dx = coords.x - appState.dragState.startX;

        const dy = coords.y - appState.dragState.startY;

        if (appState.dragState.type === 'move-vertex') {

            const room = appState.plan.rooms.find(r => r.id === appState.dragState.targetId);

            const vIdx = appState.dragState.vertexIdx;

            room.points[vIdx].x = snapToGrid(appState.dragState.initialX + dx);

            room.points[vIdx].y = snapToGrid(appState.dragState.initialY + dy);

            renderRooms();

        } else if (appState.dragState.type === 'move-room') {

            const room = appState.plan.rooms.find(r => r.id === appState.dragState.targetId);

            if (room.points) room.points = appState.dragState.initialPoints.map(p => ({ x: snapToGrid(p.x + dx), y: snapToGrid(p.y + dy) }));

            renderRooms();

        } else if (appState.dragState.type === 'move-door') {

            const door = appState.plan.doors.find(d => d.id === appState.dragState.targetId);

            door.x = snapToGrid(appState.dragState.initialX + dx);

            door.y = snapToGrid(appState.dragState.initialY + dy);

            renderDoors();

        } else if (appState.dragState.type === 'move-window') {

            const win = appState.plan.windows.find(w => w.id === appState.dragState.targetId);

            win.x = snapToGrid(appState.dragState.initialX + dx);

            win.y = snapToGrid(appState.dragState.initialY + dy);

            renderWindows();

        }

    }

    function handleMouseUp() {

        if (appState.dragState.type) {

            const initSnap = appState.dragState.initialPlanSnapshot;

            appState.dragState = { type: null, targetId: null, initialPlanSnapshot: null };

            if (initSnap && initSnap !== JSON.stringify(appState.plan)) {

                pushSpecificPlanHistory(initSnap);

            }

            savePlan();

            updatePropertiesPanel();

        }

    }

    function snapToGrid(val) { return Math.round(val / 10) * 10; }

    // -------------------------------------------------------------

    // Toolbar Add & Custom Shape Functions

    // -------------------------------------------------------------

    function addRoom(shapeType = 'rect') {

        pushPlanHistory();

        const id = "room_" + Date.now();

        const offset = (appState.plan.rooms.length % 6) * 20;

        let newRoom;

        if (shapeType === 'l-shape') {

            newRoom = { id, name: "L-Room", shape: 'l-shape', points: [{ x: 200 + offset, y: 150 + offset }, { x: 360 + offset, y: 150 + offset }, { x: 360 + offset, y: 230 + offset }, { x: 280 + offset, y: 230 + offset }, { x: 280 + offset, y: 310 + offset }, { x: 200 + offset, y: 310 + offset }] };

        } else {

            newRoom = { id, name: "Room", shape: 'rect', points: [{ x: 200 + offset, y: 150 + offset }, { x: 360 + offset, y: 150 + offset }, { x: 360 + offset, y: 270 + offset }, { x: 200 + offset, y: 270 + offset }] };

        }

        appState.plan.rooms.push(newRoom);

        savePlan(); selectElement(id); renderPlan(); updateCanvasEmptyState(); updateUndoRedoUI();

        showToast(`${newRoom.name} added`, "success");

    }

    function startCustomDraw() {

        selectElement(null);

        appState.isDrawingCustom = true;

        appState.customPoints = [];

        const drawTb = document.getElementById("draw-actions-toolbar");

        if (drawTb) {

            drawTb.classList.remove("hidden");

            if (typeof lucide !== 'undefined' && lucide.createIcons) {

                lucide.createIcons({ el: drawTb });

            }

        }

        const btnDraw = document.getElementById("btn-tool-draw");

        if (btnDraw) {

            btnDraw.classList.add("btn-primary");

            btnDraw.classList.remove("btn-ghost");

        }

        showToast("Click canvas to add corners. Tap Done when finished.", "info");

    }

    function finishCustomDraw() {

        if (appState.customPoints.length < 3) { showToast("Need at least 3 points", "error"); return; }

        pushPlanHistory();

        const id = "room_" + Date.now();

        const newRoom = { id, name: "Room", shape: "polygon", points: [...appState.customPoints] };

        appState.plan.rooms.push(newRoom);

        appState.isDrawingCustom = false;

        appState.customPoints = [];

        const drawTb = document.getElementById("draw-actions-toolbar");

        if (drawTb) drawTb.classList.add("hidden");

        const btnDraw = document.getElementById("btn-tool-draw");

        if (btnDraw) {

            btnDraw.classList.remove("btn-primary");

            btnDraw.classList.add("btn-ghost");

        }

        const prevGroup = document.getElementById("drawing-preview-group");

        if (prevGroup) prevGroup.innerHTML = '';

        savePlan(); selectElement(id); renderPlan(); updateCanvasEmptyState(); updateUndoRedoUI();

        showToast("Room created", "success");

    }

    function cancelCustomDraw() {

        appState.isDrawingCustom = false;

        appState.customPoints = [];

        const drawTb = document.getElementById("draw-actions-toolbar");

        if (drawTb) drawTb.classList.add("hidden");

        const btnDraw = document.getElementById("btn-tool-draw");

        if (btnDraw) {

            btnDraw.classList.remove("btn-primary");

            btnDraw.classList.add("btn-ghost");

        }

        const prevGroup = document.getElementById("drawing-preview-group");

        if (prevGroup) prevGroup.innerHTML = '';

        showToast("Drawing canceled", "info");

    }

    function addDoor() {

        pushPlanHistory();

        const id = "door_" + Date.now();

        const offset = (appState.plan.doors.length % 6) * 25;

        appState.plan.doors.push({ id, name: "Door Sensor", deviceMac: "", x: 250 + offset, y: 200 + offset, rotation: 0 });

        savePlan(); selectElement(id); renderPlan(); updateCanvasEmptyState(); updateUndoRedoUI();

        showToast("Door sensor added", "success");

    }

    function addWindow() {

        pushPlanHistory();

        const id = "window_" + Date.now();

        const offset = (appState.plan.windows.length % 6) * 25;

        appState.plan.windows.push({ id, name: "Window Sensor", deviceMac: "", x: 300 + offset, y: 200 + offset, rotation: 0 });

        savePlan(); selectElement(id); renderPlan(); updateCanvasEmptyState(); updateUndoRedoUI();

        showToast("Window sensor added", "success");

    }

    // -------------------------------------------------------------

    // Selection and Properties Editor Panel

    // -------------------------------------------------------------

    function selectElement(id) {

        _closeAllDropdowns(null);

        appState.selectedId = id;

        renderPlan();

        updatePropertiesPanel();

        updateMobileDrawerHeader();

        // Monitor mode: show sensor details tooltip popover

        if (appState.mode === 'monitor') {

            if (id) {

                const door = appState.plan.doors.find(d => d.id === id);

                const win = appState.plan.windows.find(w => w.id === id);

                const sensor = door || win;

                if (sensor) {

                    const el = document.querySelector(`[data-id="${id}"]`);

                    const mac = sensor.deviceMac;

                    const state = (mac && appState.activeStatus[mac]) || 'SECURED';

                    const batt = (mac && appState.activeBattery[mac]) || 100;

                    showSensorTooltip(el || document.body, {

                        name: sensor.name || (door ? 'Door Sensor' : 'Window Sensor'),

                        mac: mac || 'Not Paired',

                        state: state,

                        battery: batt,

                        lastSeen: new Date().toLocaleTimeString()

                    });

                } else {

                    hideSensorTooltip();

                }

            } else {

                hideSensorTooltip();

            }

        } else {

            hideSensorTooltip();

        }

        // Mobile: tap flash feedback + auto-expand drawer when item selected

        if (window.innerWidth <= 768 && id) {

            const grp = document.querySelector(`[data-id="${id}"]`);

            if (grp) {

                grp.classList.add('tap-flash');

                setTimeout(() => grp.classList.remove('tap-flash'), 400);

            }

            if (appState.mode === 'edit') {

                setTimeout(() => toggleMobileSensorDrawer(true), 80);

            }

        }

    }

    function updatePropertiesPanel() {

        const panel = document.getElementById("properties-card");

        const placeholder = document.getElementById("properties-placeholder-card");

        const content = document.getElementById("properties-content");

        const footer = document.getElementById("properties-footer");

        if (!panel || !content) return;

        if (appState.mode !== 'edit' || !appState.selectedId) {

            panel.classList.add("hidden");

            if (appState.mode === 'edit' && placeholder) placeholder.classList.remove("hidden");

            if (footer) footer.innerHTML = "";

            return;

        }

        let item = appState.plan.rooms.find(r => r.id === appState.selectedId) ||

            appState.plan.doors.find(d => d.id === appState.selectedId) ||

            appState.plan.windows.find(w => w.id === appState.selectedId);

        if (!item) { panel.classList.add("hidden"); if (placeholder) placeholder.classList.remove("hidden"); return; }

        if (placeholder) placeholder.classList.add("hidden");

        panel.classList.remove("hidden");

        const type = appState.plan.rooms.includes(item) ? 'room' : (appState.plan.doors.includes(item) ? 'door' : 'window');

        // Custom Dropdown Data: Device (MAC)

        let currentMacLabel = '-- Unbound --';

        if (item.deviceMac) {

            if (appState.deviceRegistry[item.deviceMac]) {

                currentMacLabel = `${appState.deviceRegistry[item.deviceMac]} [${item.deviceMac}]`;

            } else {

                currentMacLabel = `${item.deviceMac} (Inactive)`;

            }

        }

        let macDropdownItems = `

            <div class="custom-dropdown-item ${!item.deviceMac ? 'selected-item' : ''}" onclick="selectPropDeviceMac('')">

                <span>-- Unbound --</span>

                ${!item.deviceMac ? '<i data-lucide="check"></i>' : ''}

            </div>

        `;

        Object.keys(appState.deviceRegistry).forEach(mac => {

            if (isMacDeleted(mac)) return;

            const isSelected = item.deviceMac === mac;

            macDropdownItems += `

                <div class="custom-dropdown-item ${isSelected ? 'selected-item' : ''}" onclick="selectPropDeviceMac('${mac}')">

                    <span>${appState.deviceRegistry[mac]} [${mac}]</span>

                    ${isSelected ? '<i data-lucide="check"></i>' : ''}

                </div>

            `;

        });

        if (item.deviceMac && !appState.deviceRegistry[item.deviceMac] && !isMacDeleted(item.deviceMac)) {

            macDropdownItems += `

                <div class="custom-dropdown-item selected-item" onclick="selectPropDeviceMac('${item.deviceMac}')">

                    <span>${item.deviceMac} (Inactive)</span>

                    <i data-lucide="check"></i>

                </div>

            `;

        }

        // Custom Dropdown Data: Rotation

        const rotationMap = { 0: '0° (Top)', 90: '90° (Right)', 180: '180° (Bottom)', 270: '270° (Left)' };

        const curRotation = item.rotation !== undefined ? item.rotation : 0;

        const currentRotationLabel = rotationMap[curRotation] || `${curRotation}°`;

        if (type === 'room') {

            const bbox = getRoomBoundingBox(item);

            const currentShape = item.shape || (item.points && item.points.length > 4 ? 'polygon' : 'rect');

            content.innerHTML = `

                <div class="form-group">

                    <label class="prop-label">Room Name</label>

                    <input type="text" id="prop-name" class="modal-input" value="${(item.name || '').replace(/"/g, '&quot;')}" onfocus="this._prevVal = this.value" onchange="if(this._prevVal !== this.value) { pushPlanHistory(); editProp('name', this.value); updateUndoRedoUI(); }" oninput="editProp('name', this.value)">

                </div>

                <div class="form-group">

                    <label class="prop-label">Shape</label>

                    <div class="custom-dropdown-container" id="dropdown-room-shape">

                        <div class="custom-dropdown-trigger" onclick="toggleCustomDropdown('dropdown-room-shape')">

                            <span>${currentShape === 'l-shape' ? 'L-Shape' : (currentShape === 't-shape' ? 'T-Shape' : (currentShape === 'angled' ? 'Angled' : (currentShape === 'polygon' ? 'Polygon' : 'Rectangle')))}</span>

                            <i data-lucide="chevron-down"></i>

                        </div>

                        <div class="custom-dropdown-menu hidden">

                            <div class="custom-dropdown-item ${currentShape === 'rect' ? 'selected-item' : ''}" onclick="changeRoomShape('${item.id}','rect')"><span>Rectangle</span>${currentShape === 'rect' ? '<i data-lucide="check"></i>' : ''}</div>

                            <div class="custom-dropdown-item ${currentShape === 'l-shape' ? 'selected-item' : ''}" onclick="changeRoomShape('${item.id}','l-shape')"><span>L-Shape</span>${currentShape === 'l-shape' ? '<i data-lucide="check"></i>' : ''}</div>

                            <div class="custom-dropdown-item ${currentShape === 't-shape' ? 'selected-item' : ''}" onclick="changeRoomShape('${item.id}','t-shape')"><span>T-Shape</span>${currentShape === 't-shape' ? '<i data-lucide="check"></i>' : ''}</div>

                            <div class="custom-dropdown-item ${currentShape === 'angled' ? 'selected-item' : ''}" onclick="changeRoomShape('${item.id}','angled')"><span>Angled</span>${currentShape === 'angled' ? '<i data-lucide="check"></i>' : ''}</div>

                        </div>

                    </div>

                </div>

                <div class="form-group">

                    <label class="prop-label">Rotate & Flip</label>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">

                        <button class="btn btn-ghost btn-sm" onclick="rotateRoom('${item.id}',90)"><i data-lucide="rotate-cw"></i> +90°</button>

                        <button class="btn btn-ghost btn-sm" onclick="rotateRoom('${item.id}',-90)"><i data-lucide="rotate-ccw"></i> -90°</button>

                        <button class="btn btn-ghost btn-sm" onclick="flipRoomHorizontal('${item.id}')"><i data-lucide="flip-horizontal"></i> Flip H</button>

                        <button class="btn btn-ghost btn-sm" onclick="flipRoomVertical('${item.id}')"><i data-lucide="flip-vertical"></i> Flip V</button>

                    </div>

                </div>

                <div class="prop-telemetry-card">
                    <div class="prop-telemetry-header">
                        <span class="prop-telemetry-title">
                            <i data-lucide="layers"></i>
                            <span>Zone Geometry</span>
                        </span>
                        <span class="prop-status-pill status-bound">
                            ${Math.round(bbox.width)} &times; ${Math.round(bbox.height)} px
                        </span>
                    </div>
                    <div class="prop-telemetry-grid">
                        <div class="prop-telemetry-item">
                            <span class="telemetry-lbl">Preset Shape</span>
                            <span class="telemetry-val">${currentShape.toUpperCase()}</span>
                        </div>
                        <div class="prop-telemetry-item">
                            <span class="telemetry-lbl">Bound Vertices</span>
                            <span class="telemetry-val">${item.points ? item.points.length : 4} Points</span>
                        </div>
                    </div>
                </div>
            `;

            const footerHtml = `
                <div class="prop-actions-row">
                    <button type="button" class="btn-apple btn-apple-secondary" onclick="addVertexToRoom('${item.id}')" title="Add Corner Handle">
                        <i data-lucide="plus-circle"></i> <span>Add Corner</span>
                    </button>
                    <button type="button" class="btn-apple btn-apple-destructive" onclick="deleteElement()" title="Delete Room">
                        <i data-lucide="trash-2"></i> <span>Delete Room</span>
                    </button>
                </div>
            `;
            if (footer) {
                footer.innerHTML = footerHtml;
            } else {
                content.insertAdjacentHTML('beforeend', `<div class="prop-footer">${footerHtml}</div>`);
            }

        } else {

            content.innerHTML = `

                <div class="form-group">

                    <label class="prop-label">Sensor Label</label>

                    <input type="text" id="prop-name" class="modal-input" value="${(item.name || '').replace(/"/g, '&quot;')}" onfocus="this._prevVal = this.value" onchange="if(this._prevVal !== this.value) { pushPlanHistory(); editProp('name', this.value); updateUndoRedoUI(); }" oninput="editProp('name', this.value)">

                </div>

                <div class="form-group">

                    <label class="prop-label">Device (MAC)</label>

                    <div class="custom-dropdown-container" id="dropdown-prop-mac">

                        <div class="custom-dropdown-trigger" onclick="toggleCustomDropdown('dropdown-prop-mac')">

                            <span>${currentMacLabel}</span>

                            <i data-lucide="chevron-down"></i>

                        </div>

                        <div class="custom-dropdown-menu hidden" style="max-height: 180px; overflow-y: auto;">

                            ${macDropdownItems}

                        </div>

                    </div>

                </div>

                <div class="form-group">

                    <label class="prop-label">Rotation</label>

                    <div class="custom-dropdown-container" id="dropdown-prop-rotation">

                        <div class="custom-dropdown-trigger" onclick="toggleCustomDropdown('dropdown-prop-rotation')">

                            <span>${currentRotationLabel}</span>

                            <i data-lucide="chevron-down"></i>

                        </div>

                        <div class="custom-dropdown-menu hidden">

                            <div class="custom-dropdown-item ${curRotation === 0 ? 'selected-item' : ''}" onclick="selectPropRotation(0)">

                                <span>0° (Top)</span>

                                ${curRotation === 0 ? '<i data-lucide="check"></i>' : ''}

                            </div>

                            <div class="custom-dropdown-item ${curRotation === 90 ? 'selected-item' : ''}" onclick="selectPropRotation(90)">

                                <span>90° (Right)</span>

                                ${curRotation === 90 ? '<i data-lucide="check"></i>' : ''}

                            </div>

                            <div class="custom-dropdown-item ${curRotation === 180 ? 'selected-item' : ''}" onclick="selectPropRotation(180)">

                                <span>180° (Bottom)</span>

                                ${curRotation === 180 ? '<i data-lucide="check"></i>' : ''}

                            </div>

                            <div class="custom-dropdown-item ${curRotation === 270 ? 'selected-item' : ''}" onclick="selectPropRotation(270)">

                                <span>270° (Left)</span>

                                ${curRotation === 270 ? '<i data-lucide="check"></i>' : ''}

                            </div>

                        </div>

                    </div>

                </div>

                                <div class="prop-telemetry-card">
                    <div class="prop-telemetry-header">
                        <span class="prop-telemetry-title">
                            <i data-lucide="${type === 'door' ? 'door-closed' : 'maximize'}"></i>
                            <span>${type === 'door' ? 'Door Sensor' : 'Window Sensor'}</span>
                        </span>
                        <span class="prop-status-pill ${item.deviceMac ? 'status-bound' : 'status-unbound'}">
                            <span class="status-pulse-dot"></span>
                            ${item.deviceMac ? 'Bound & Active' : 'Unbound'}
                        </span>
                    </div>
                    <div class="prop-telemetry-grid">
                        <div class="prop-telemetry-item">
                            <span class="telemetry-lbl">Fixture Type</span>
                            <span class="telemetry-val">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        </div>
                        <div class="prop-telemetry-item">
                            <span class="telemetry-lbl">Orientation</span>
                            <span class="telemetry-val">${currentRotationLabel}</span>
                        </div>
                        ${item.deviceMac ? `
                        <div class="prop-telemetry-item" style="grid-column: span 2;">
                            <span class="telemetry-lbl">Hardware MAC</span>
                            <span class="telemetry-val font-mono" style="font-size: 11px;">${item.deviceMac}</span>
                        </div>
                        ` : ''}
                        ${item.deviceMac && appState.activeBattery[item.deviceMac] !== undefined ? `
                        <div class="prop-telemetry-item" style="grid-column: span 2;">
                            <span class="telemetry-lbl">Battery Health</span>
                            <span class="telemetry-val">${getBatteryBadge(appState.activeBattery[item.deviceMac])}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;

            const footerHtml = `
                <div class="prop-actions-row">
                    <button type="button" class="btn-apple btn-apple-secondary" onclick="openDoorHistory('${item.deviceMac || ''}')" title="View historical access logs">
                        <i data-lucide="history"></i> <span>History</span>
                    </button>
                    <button type="button" class="btn-apple btn-apple-destructive" onclick="deleteElement()" title="Delete Sensor from floor plan">
                        <i data-lucide="trash-2"></i> <span>Delete Sensor</span>
                    </button>
                </div>
                ${item.deviceMac ? `
                    <button type="button" class="btn-apple-tertiary-danger" onclick="deleteDeviceFromDatabase('${item.deviceMac}', '${(item.name || '').replace(/'/g, "\'")}')" title="Permanently remove device records from entire system">
                        <i data-lucide="trash-2"></i> <span>Remove Device from System</span>
                    </button>
                ` : ''}
            `;
            if (footer) {
                footer.innerHTML = footerHtml;
            } else {
                content.insertAdjacentHTML('beforeend', `<div class="prop-footer">${footerHtml}</div>`);
            }

        }

        lucide.createIcons();

    }

    function selectPropDeviceMac(mac) {

        _closeAllDropdowns(null);

        pushPlanHistory();

        editProp('deviceMac', mac);

        updatePropertiesPanel();

        updateUndoRedoUI();

    }

    function selectPropRotation(deg) {

        _closeAllDropdowns(null);

        pushPlanHistory();

        editProp('rotation', parseInt(deg));

        updatePropertiesPanel();

        updateUndoRedoUI();

    }

    function getBatteryBadge(batt) {

        const val = (batt !== undefined && batt !== null) ? parseInt(batt) : 100;

        let badgeClass = 'battery-high', icon = 'battery-charging';

        if (val < 20) { badgeClass = 'battery-low'; icon = 'battery-low'; }

        else if (val < 50) { badgeClass = 'battery-medium'; icon = 'battery-medium'; }

        return `<span class="battery-badge ${badgeClass}" title="${val}%"><i data-lucide="${icon}"></i> ${val}%</span>`;

    }

    function changeRoomShape(id, targetShape) {

        _closeAllDropdowns(null);

        const room = appState.plan.rooms.find(r => r.id === id);

        if (!room) return;

        pushPlanHistory();

        const bbox = getRoomBoundingBox(room);

        const x = bbox.minX, y = bbox.minY, w = bbox.width || 160, h = bbox.height || 120;

        if (targetShape === 'rect') {

            room.shape = 'rect';

            room.points = [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];

        } else if (targetShape === 'l-shape') {

            room.shape = 'l-shape';

            room.points = [{ x, y }, { x: x + w, y }, { x: x + w, y: y + Math.round(h / 2) }, { x: x + Math.round(w / 2), y: y + Math.round(h / 2) }, { x: x + Math.round(w / 2), y: y + h }, { x, y: y + h }];

        } else if (targetShape === 't-shape') {

            room.shape = 't-shape';

            room.points = [{ x, y }, { x: x + w, y }, { x: x + w, y: y + Math.round(h / 3) }, { x: x + Math.round(w * 0.75), y: y + Math.round(h / 3) }, { x: x + Math.round(w * 0.75), y: y + h }, { x: x + Math.round(w * 0.25), y: y + h }, { x: x + Math.round(w * 0.25), y: y + Math.round(h / 3) }, { x, y: y + Math.round(h / 3) }];

        } else if (targetShape === 'angled') {

            room.shape = 'angled';

            room.points = [{ x: x + 40, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }, { x, y: y + 40 }];

        }

        savePlan(); renderPlan(); updatePropertiesPanel(); updateUndoRedoUI();

        showToast("Shape converted", "success");

    }

    function rotateRoom(id, degrees = 90) {

        const room = appState.plan.rooms.find(r => r.id === id);

        if (!room) return;

        pushPlanHistory();

        const pts = getRoomPoints(room), bbox = getRoomBoundingBox(room);

        const cx = bbox.centerX, cy = bbox.centerY;

        const rad = (degrees * Math.PI) / 180;

        const cos = Math.cos(rad), sin = Math.sin(rad);

        room.points = pts.map(p => {

            const rx = p.x - cx, ry = p.y - cy;

            return { x: snapToGrid(cx + rx * cos - ry * sin), y: snapToGrid(cy + rx * sin + ry * cos) };

        });

        savePlan(); renderPlan(); updatePropertiesPanel(); updateUndoRedoUI();

    }

    function flipRoomHorizontal(id) {

        const room = appState.plan.rooms.find(r => r.id === id);

        if (!room) return;

        pushPlanHistory();

        const pts = getRoomPoints(room), cx = getRoomBoundingBox(room).centerX;

        room.points = pts.map(p => ({ x: snapToGrid(cx - (p.x - cx)), y: p.y }));

        savePlan(); renderPlan(); updatePropertiesPanel(); updateUndoRedoUI();

    }

    function flipRoomVertical(id) {

        const room = appState.plan.rooms.find(r => r.id === id);

        if (!room) return;

        pushPlanHistory();

        const pts = getRoomPoints(room), cy = getRoomBoundingBox(room).centerY;

        room.points = pts.map(p => ({ x: p.x, y: snapToGrid(cy - (p.y - cy)) }));

        savePlan(); renderPlan(); updatePropertiesPanel(); updateUndoRedoUI();

    }

    function addVertexToRoom(id) {

        const room = appState.plan.rooms.find(r => r.id === id);

        if (!room) return;

        pushPlanHistory();

        const pts = getRoomPoints(room), bbox = getRoomBoundingBox(room);

        pts.push({ x: snapToGrid(bbox.centerX), y: snapToGrid(bbox.maxY + 20) });

        room.points = pts; room.shape = 'polygon';

        savePlan(); renderPlan(); updatePropertiesPanel(); updateUndoRedoUI();

        showToast("Corner added", "success");

    }

    function editProp(property, value) {

        if (!appState.selectedId) return;

        let item = appState.plan.rooms.find(r => r.id === appState.selectedId) ||

            appState.plan.doors.find(d => d.id === appState.selectedId) ||

            appState.plan.windows.find(w => w.id === appState.selectedId);

        if (item) {

            item[property] = value;

            savePlan();

            renderPlan();

        }

    }

    async function deleteElement() {

        if (!appState.selectedId) {

            showToast("Please select an element to delete.", "info");

            return;

        }

        let item = appState.plan.rooms.find(r => r.id === appState.selectedId) ||

            appState.plan.doors.find(d => d.id === appState.selectedId) ||

            appState.plan.windows.find(w => w.id === appState.selectedId);

        if (!item) {

            selectElement(null);

            return;

        }

        const isRoom = appState.plan.rooms.includes(item);

        const isDoor = appState.plan.doors.includes(item);

        const typeLabel = isRoom ? "Room" : (isDoor ? "Door Sensor" : "Window Sensor");

        const displayName = item.name || typeLabel;

        const confirmed = await showConfirmDialog(`Are you sure you want to delete "${displayName}"?`, `Delete ${typeLabel}`, true);

        if (confirmed) {

            pushPlanHistory();

            appState.plan.rooms = appState.plan.rooms.filter(r => r.id !== appState.selectedId);

            appState.plan.doors = appState.plan.doors.filter(d => d.id !== appState.selectedId);

            appState.plan.windows = appState.plan.windows.filter(w => w.id !== appState.selectedId);

            savePlan();

            selectElement(null);

            renderPlan();

            updateCanvasEmptyState();

            updateUndoRedoUI();

            showToast(`${displayName} deleted`, "info");

        }

    }

    function focusDeviceOnCanvas(mac) {

        let found = (appState.plan?.doors || []).find(d => d.deviceMac === mac) || (appState.plan?.windows || []).find(w => w.deviceMac === mac);

        if (!found && appState.campus && appState.campus.buildings) {

            for (const bldg of appState.campus.buildings) {

                for (const fl of bldg.floors) {

                    const item = (fl.plan?.doors || []).find(d => d.deviceMac === mac) || (fl.plan?.windows || []).find(w => w.deviceMac === mac);

                    if (item) {

                        selectBuilding(bldg.id, fl.id);

                        found = item;

                        break;

                    }

                }

                if (found) break;

            }

        }

        if (found) {

            switchMainTab('floorplan');

        }

        if (found) {

            selectElement(found.id);

            // Smoothly pan & zoom viewport so (found.x, found.y) is centered in the SVG container

            const svg = document.getElementById("floorplan-svg");

            if (svg) {

                const rect = svg.getBoundingClientRect();

                const centerX = rect.width / 2;

                const centerY = rect.height / 2;

                zoomState.scale = Math.max(zoomState.scale, 1.25);

                zoomState.panX = Math.round(centerX - found.x * zoomState.scale);

                zoomState.panY = Math.round(centerY - found.y * zoomState.scale);

                updateSvgTransform();

            }

            // Trigger temporary pulse animation on element

            const el = document.querySelector(`[data-id="${found.id}"]`);

            if (el) {

                el.classList.remove("door-pulse-focus");

                void el.offsetWidth;

                el.classList.add("door-pulse-focus");

            }

            showToast(`${found.name} focused on canvas`, 'info');

        } else {

            showToast(`Device is not placed on floor plan`, 'info');

        }

    }

    // -------------------------------------------------------------

    // SVG Zoom & Pan Handler (Bounded & Plan-Aware)

    // -------------------------------------------------------------

    const zoomState = { scale: 1, panX: 0, panY: 0, isPanning: false, startX: 0, startY: 0 };

    function getFloorPlanBounds() {

        let allBoxes = [];

        if (appState.plan && appState.plan.rooms && appState.plan.rooms.length > 0) {

            allBoxes = appState.plan.rooms.map(r => getRoomBoundingBox(r));

        }

        if (appState.plan && appState.plan.doors && appState.plan.doors.length > 0) {

            appState.plan.doors.forEach(d => allBoxes.push({ minX: d.x - 35, maxX: d.x + 35, minY: d.y - 35, maxY: d.y + 35 }));

        }

        if (appState.plan && appState.plan.windows && appState.plan.windows.length > 0) {

            appState.plan.windows.forEach(w => allBoxes.push({ minX: w.x - 35, maxX: w.x + 35, minY: w.y - 35, maxY: w.y + 35 }));

        }

        if (allBoxes.length === 0) {

            return { minX: 80, maxX: 720, minY: 60, maxY: 440, width: 640, height: 380 };

        }

        const minX = Math.min(...allBoxes.map(b => b.minX));

        const maxX = Math.max(...allBoxes.map(b => b.maxX));

        const minY = Math.min(...allBoxes.map(b => b.minY));

        const maxY = Math.max(...allBoxes.map(b => b.maxY));

        return {

            minX, maxX, minY, maxY,

            width: Math.max(maxX - minX, 120),

            height: Math.max(maxY - minY, 120)

        };

    }

    function getMinZoomScale() {

        const bounds = getFloorPlanBounds();

        // Target 800 x 500 viewBox with comfortable margin (720 x 420 usable area)

        const fitScaleX = 720 / bounds.width;

        const fitScaleY = 420 / bounds.height;

        const fitScale = Math.min(fitScaleX, fitScaleY);

        // Limit zoom out so the plan remains clear, readable and never shrinks into an unreadable speck:

        const minScale = Math.max(Math.min(fitScale * 0.88, 1.0), 0.75);

        return Math.round(minScale * 100) / 100;

    }

    function getMaxZoomScale() {

        return 3.0;

    }

    function clampPan(panX, panY, scale) {

        const bounds = getFloorPlanBounds();

        const centerX = (bounds.minX + bounds.maxX) / 2;

        const centerY = (bounds.minY + bounds.maxY) / 2;

        // Keep the plan center comfortably inside the 800x500 canvas

        const minScreenX = 140;

        const maxScreenX = 660;

        const minScreenY = 90;

        const maxScreenY = 410;

        const currentScreenX = panX + centerX * scale;

        const currentScreenY = panY + centerY * scale;

        let clampedX = panX;

        let clampedY = panY;

        if (currentScreenX < minScreenX) {

            clampedX = minScreenX - centerX * scale;

        } else if (currentScreenX > maxScreenX) {

            clampedX = maxScreenX - centerX * scale;

        }

        if (currentScreenY < minScreenY) {

            clampedY = minScreenY - centerY * scale;

        } else if (currentScreenY > maxScreenY) {

            clampedY = maxScreenY - centerY * scale;

        }

        return { panX: Math.round(clampedX), panY: Math.round(clampedY) };

    }

    function updateZoomUI() {

        const minScale = getMinZoomScale();

        const maxScale = getMaxZoomScale();

        const btnOut = document.getElementById("btn-zoom-out");

        const btnIn = document.getElementById("btn-zoom-in");

        const zoomText = document.getElementById("zoom-level-text");

        if (zoomText) {

            zoomText.textContent = `${Math.round(zoomState.scale * 100)}%`;

        }

        if (btnOut) {

            const isAtMin = zoomState.scale <= minScale + 0.01;

            btnOut.style.opacity = isAtMin ? '0.35' : '1';

            btnOut.style.pointerEvents = isAtMin ? 'none' : 'auto';

            btnOut.title = isAtMin ? `Minimum zoom reached (${Math.round(minScale * 100)}%)` : "Zoom Out";

        }

        if (btnIn) {

            const isAtMax = zoomState.scale >= maxScale - 0.01;

            btnIn.style.opacity = isAtMax ? '0.35' : '1';

            btnIn.style.pointerEvents = isAtMax ? 'none' : 'auto';

            btnIn.title = isAtMax ? `Maximum zoom reached (${Math.round(maxScale * 100)}%)` : "Zoom In";

        }

    }

    function updateSvgTransform() {

        const viewport = document.getElementById("viewport-group");

        if (viewport) {

            viewport.setAttribute("transform", `translate(${zoomState.panX}, ${zoomState.panY}) scale(${zoomState.scale})`);

        }

        updateZoomUI();

    }

    function zoomCanvas(delta, mouseX = null, mouseY = null) {

        const viewport = document.getElementById("viewport-group");
        if (viewport && mouseX === null && mouseY === null) {
            viewport.classList.add("smooth-zoom");
            clearTimeout(viewport._smoothTimer);
            viewport._smoothTimer = setTimeout(() => { if (viewport) viewport.classList.remove("smooth-zoom"); }, 300);
        }

        const minScale = getMinZoomScale();

        const maxScale = getMaxZoomScale();

        let newScale = Math.min(Math.max(zoomState.scale + delta, minScale), maxScale);

        newScale = parseFloat(newScale.toFixed(2));

        if (newScale === zoomState.scale) {

            updateZoomUI();

            return;

        }

        if (mouseX !== null && mouseY !== null) {

            const svgContainer = document.querySelector('.svg-container');

            const rect = svgContainer ? svgContainer.getBoundingClientRect() : { width: 800, height: 500 };

            const svgMouseX = ((mouseX) / (rect.width || 800)) * 800;

            const svgMouseY = ((mouseY) / (rect.height || 500)) * 500;

            const pointX = (svgMouseX - zoomState.panX) / zoomState.scale;

            const pointY = (svgMouseY - zoomState.panY) / zoomState.scale;

            zoomState.panX = svgMouseX - pointX * newScale;

            zoomState.panY = svgMouseY - pointY * newScale;

        } else {

            const svgCenterX = 400;

            const svgCenterY = 250;

            const pointX = (svgCenterX - zoomState.panX) / zoomState.scale;

            const pointY = (svgCenterY - zoomState.panY) / zoomState.scale;

            zoomState.panX = svgCenterX - pointX * newScale;

            zoomState.panY = svgCenterY - pointY * newScale;

        }

        const clamped = clampPan(zoomState.panX, zoomState.panY, newScale);

        zoomState.panX = clamped.panX;

        zoomState.panY = clamped.panY;

        zoomState.scale = newScale;

        updateSvgTransform();

    }

    function resetZoomPan() {

        const viewport = document.getElementById("viewport-group");
        if (viewport) {
            viewport.classList.add("smooth-zoom");
            clearTimeout(viewport._smoothTimer);
            viewport._smoothTimer = setTimeout(() => { if (viewport) viewport.classList.remove("smooth-zoom"); }, 300);
        }

        const bounds = getFloorPlanBounds();

        const minScale = getMinZoomScale();

        zoomState.scale = Math.max(1.0, minScale);

        const centerX = (bounds.minX + bounds.maxX) / 2;

        const centerY = (bounds.minY + bounds.maxY) / 2;

        zoomState.panX = Math.round(400 - centerX * zoomState.scale);

        zoomState.panY = Math.round(250 - centerY * zoomState.scale);

        const clamped = clampPan(zoomState.panX, zoomState.panY, zoomState.scale);

        zoomState.panX = clamped.panX;

        zoomState.panY = clamped.panY;

        updateSvgTransform();

        showToast("Zoom reset to 100%.", "info");

    }

    function fitCanvasToRooms() {

        const viewport = document.getElementById("viewport-group");
        if (viewport) {
            viewport.classList.add("smooth-zoom");
            clearTimeout(viewport._smoothTimer);
            viewport._smoothTimer = setTimeout(() => { if (viewport) viewport.classList.remove("smooth-zoom"); }, 300);
        }

        const bounds = getFloorPlanBounds();

        const minScale = getMinZoomScale();

        // 800x500 viewBox with comfortable margin (720x420 usable)

        const scaleX = 720 / bounds.width;

        const scaleY = 420 / bounds.height;

        let targetScale = Math.min(scaleX, scaleY);

        targetScale = Math.min(Math.max(targetScale, minScale), 1.35);

        targetScale = Math.round(targetScale * 100) / 100;

        const centerX = (bounds.minX + bounds.maxX) / 2;

        const centerY = (bounds.minY + bounds.maxY) / 2;

        zoomState.scale = targetScale;

        zoomState.panX = Math.round(400 - centerX * targetScale);

        zoomState.panY = Math.round(250 - centerY * targetScale);

        const clamped = clampPan(zoomState.panX, zoomState.panY, zoomState.scale);

        zoomState.panX = clamped.panX;

        zoomState.panY = clamped.panY;

        updateSvgTransform();

        showToast("Layout focused & fitted to screen.", "info");

    }

    document.addEventListener("DOMContentLoaded", () => {

        const svgContainer = document.querySelector(".svg-container");

        if (svgContainer) {

            svgContainer.addEventListener("wheel", (e) => {

                e.preventDefault();

                const rect = svgContainer.getBoundingClientRect();

                zoomCanvas(e.deltaY < 0 ? 0.12 : -0.12, e.clientX - rect.left, e.clientY - rect.top);

            }, { passive: false });

            svgContainer.addEventListener("mousedown", (e) => {

                if (appState.dragState.type || appState.isDrawingCustom) return;

                if (appState.mode === 'edit' && e.target.closest && (e.target.closest('.room-group') || e.target.closest('.door-element') || e.target.closest('.window-element') || e.target.closest('.room-vertex-handle'))) return;

                if (e.target.tagName === 'rect' || e.target.id === 'floorplan-svg' || e.target.classList.contains('grid-bg') || appState.mode === 'monitor') {

                    zoomState.isPanning = true;

                    zoomState.startX = e.clientX - zoomState.panX;

                    zoomState.startY = e.clientY - zoomState.panY;

                    svgContainer.style.cursor = 'grabbing';

                }

            });

            window.addEventListener("mousemove", (e) => {

                if (zoomState.isPanning) {

                    const rawX = e.clientX - zoomState.startX;

                    const rawY = e.clientY - zoomState.startY;

                    const clamped = clampPan(rawX, rawY, zoomState.scale);

                    zoomState.panX = clamped.panX;

                    zoomState.panY = clamped.panY;

                    updateSvgTransform();

                }

            });

            window.addEventListener("mouseup", () => {

                if (zoomState.isPanning) { zoomState.isPanning = false; svgContainer.style.cursor = 'default'; }

            });

            // Native Mobile Multi-Touch Pan & Pinch-to-Zoom

            let touchStartDist = 0;

            let initialTouchScale = 1;

            let isTouchPanning = false;

            let touchStartX = 0;

            let touchStartY = 0;

            svgContainer.addEventListener("touchstart", (e) => {

                if (appState.dragState.type || appState.isDrawingCustom) {

                    isTouchPanning = false;

                    return;

                }

                if (e.touches.length === 1) {

                    const t = e.touches[0];

                    const coords = getSVGCoords({ clientX: t.clientX, clientY: t.clientY });

                    const targetEl = document.elementFromPoint(t.clientX, t.clientY) || e.target;

                    const isElement = (targetEl && targetEl.closest && (targetEl.closest('.room-group') || targetEl.closest('.door-element') || targetEl.closest('.window-element') || targetEl.closest('.room-vertex-handle'))) ||

                        (appState.mode === 'edit' && (appState.plan.rooms.some(r => isPointInPolygon(coords, getRoomPoints(r))) || appState.plan.doors.some(d => Math.hypot(coords.x - d.x, coords.y - d.y) <= 30) || appState.plan.windows.some(w => Math.hypot(coords.x - w.x, coords.y - w.y) <= 30)));

                    if (!isElement && (e.target.tagName === 'rect' || e.target.id === 'floorplan-svg' || e.target.classList.contains('grid-bg') || e.target.classList.contains('svg-container') || appState.mode === 'monitor')) {

                        isTouchPanning = true;

                        touchStartX = t.clientX - zoomState.panX;

                        touchStartY = t.clientY - zoomState.panY;

                    } else {

                        isTouchPanning = false;

                    }

                } else if (e.touches.length === 2) {

                    isTouchPanning = false;

                    const t1 = e.touches[0];

                    const t2 = e.touches[1];

                    touchStartDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

                    initialTouchScale = zoomState.scale;

                }

            }, { passive: false });

            svgContainer.addEventListener("touchmove", (e) => {

                if (appState.dragState.type) {

                    isTouchPanning = false;

                    return;

                }

                if (e.touches.length === 1 && isTouchPanning) {

                    e.preventDefault();

                    const t = e.touches[0];

                    const rawX = t.clientX - touchStartX;

                    const rawY = t.clientY - touchStartY;

                    const clamped = clampPan(rawX, rawY, zoomState.scale);

                    zoomState.panX = clamped.panX;

                    zoomState.panY = clamped.panY;

                    updateSvgTransform();

                } else if (e.touches.length === 2) {

                    e.preventDefault();

                    const t1 = e.touches[0];

                    const t2 = e.touches[1];

                    const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

                    if (touchStartDist > 0) {

                        const scaleFactor = currentDist / touchStartDist;

                        const rect = svgContainer.getBoundingClientRect();

                        const midX = ((t1.clientX + t2.clientX) / 2) - rect.left;

                        const midY = ((t1.clientY + t2.clientY) / 2) - rect.top;

                        const minScale = getMinZoomScale();

                        const maxScale = getMaxZoomScale();

                        const targetScale = Math.min(Math.max(initialTouchScale * scaleFactor, minScale), maxScale);

                        zoomCanvas(targetScale - zoomState.scale, midX, midY);

                    }

                }

            }, { passive: false });

            svgContainer.addEventListener("touchend", () => {

                isTouchPanning = false;

                touchStartDist = 0;

            });

            svgContainer.addEventListener("touchcancel", () => {

                isTouchPanning = false;

                touchStartDist = 0;

            });

        }

    });

    // -------------------------------------------------------------

    // Notification Center System

    // -------------------------------------------------------------

    if (!appState.notifications) {

        appState.notifications = [

            { id: 1, text: "System armed in Home mode", type: "info", time: new Date(Date.now() - 1000 * 60 * 5).toISOString() },

            { id: 2, text: "All sensors operational & secured", type: "success", time: new Date(Date.now() - 1000 * 60 * 18).toISOString() }

        ];

    }

    function toggleNotifDropdown(e) {

        if (e && typeof e.stopPropagation === 'function') {

            e.stopPropagation();

        }

        const dropdown = document.getElementById('notif-dropdown');

        if (!dropdown) return;

        const isHidden = dropdown.classList.contains('hidden');

        // Close other dropdowns

        const userDropdown = document.getElementById('user-dropdown');

        if (userDropdown) userDropdown.classList.add('hidden');

        const armMenu = document.getElementById('arming-dropdown-menu');

        if (armMenu) armMenu.classList.add('hidden');

        if (isHidden) {

            renderNotificationList();

            dropdown.classList.remove('hidden');

            // Dismiss unread red dot on opening

            const dot = document.getElementById('notif-dot');

            if (dot) dot.style.display = 'none';

        } else {

            dropdown.classList.add('hidden');

        }

    }

    function handleNotifClick(e) {

        toggleNotifDropdown(e);

    }

    function markAllNotifsRead() {

        if (appState.notifications) {

            appState.notifications.forEach(n => n.read = true);

        }

        const dot = document.getElementById('notif-dot');

        if (dot) dot.style.display = 'none';

        showToast("Notifications marked as read", "info");

    }

    function logNotification(text, type = 'info') {

        if (!appState.notifications) appState.notifications = [];

        appState.notifications.unshift({

            id: Date.now(),

            text,

            type,

            time: new Date().toISOString()

        });

        if (appState.notifications.length > 25) appState.notifications.pop();

        updateNotifBadge();

        renderNotificationList();

    }

    async function clearAllNotifications() {

        const confirmed = await showConfirmDialog("Clear all notifications history?", "Clear Notifications", false);

        if (!confirmed) return;

        appState.notifications = [];

        updateNotifBadge();

        renderNotificationList();

        showToast("Notifications cleared", "info");

    }

    function updateNotifBadge() {

        const dot = document.getElementById('notif-dot');

        if (!dot) return;

        const anyOpen = Object.values(appState.activeStatus || {}).some(s => s === 'OPEN');

        const count = (appState.notifications || []).length;

        if (anyOpen || count > 0) {

            dot.style.display = 'block';

            dot.className = anyOpen ? 'dot-badge alarm' : 'dot-badge';

        } else {

            dot.style.display = 'none';

        }

    }

    function renderNotificationList() {

        const list = document.getElementById('notif-list-container');

        if (!list) return;

        const notifs = appState.notifications || [];

        if (notifs.length === 0) {

            list.innerHTML = `

                <div class="notif-empty">

                    <i data-lucide="bell-off" style="width: 24px; height: 24px; opacity: 0.4; margin-bottom: 6px; display: block; margin-left: auto; margin-right: auto;"></i>

                    <span>No alerts or notifications</span>

                </div>

            `;

            lucide.createIcons({ el: list });

            return;

        }

        const iconMap = {

            success: 'check',

            error: 'alert-triangle',

            warning: 'alert-circle',

            info: 'info'

        };

        list.innerHTML = notifs.map(n => `

            <div class="notif-item">

                <div class="notif-icon-circle ${n.type}">

                    <i data-lucide="${iconMap[n.type] || 'bell'}"></i>

                </div>

                <div class="notif-content">

                    <div class="notif-msg">${n.text}</div>

                    <div class="notif-time">${getRelativeTimeString(n.time)}</div>

                </div>

            </div>

        `).join('');

        lucide.createIcons({ el: list });

    }

    // -------------------------------------------------------------

    // Password Field Visibility Eye Toggle

    // -------------------------------------------------------------

    function togglePasswordVisibility(inputId, btnEl) {

        const input = document.getElementById(inputId);

        if (!input) return;

        const isPassword = input.type === 'password';

        input.type = isPassword ? 'text' : 'password';

        if (btnEl) {

            btnEl.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}"></i>`;

            lucide.createIcons({ el: btnEl });

        }

    }

    // -------------------------------------------------------------

    // Django Live API Integration & AJAX Polling

    // -------------------------------------------------------------

    function pollStatus() {

        fetch('/api/status')

            .then(res => {

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                return res.text();

            })

            .then(text => {

                if (!text || !text.trim()) return [];

                try { return JSON.parse(text); } catch (e) { return []; }

            })

            .then(data => {

                appState.activeStatus = {};

                appState.activeBattery = {};

                const registryList = document.getElementById("registry-list");

                const registryEmpty = document.getElementById("registry-empty-state");

                const statSecurity = document.getElementById("stat-security-status");

                const statActive = document.getElementById("stat-active-count");

                const rightSensorBadge = document.getElementById("right-sensor-count-badge");

                const kpiShieldIcon = document.getElementById("kpi-shield-icon");

                const notifDot = document.getElementById("notif-dot");

                if (rightSensorBadge) rightSensorBadge.textContent = `${data.length}`;
                const sidebarDevicesBadge = document.getElementById("sidebar-devices-count");
                if (sidebarDevicesBadge) sidebarDevicesBadge.textContent = `${data.length}`;

                const mobTopPill = document.getElementById("topbar-mobile-status");

                const mobShieldIcon = document.getElementById("mob-shield-icon");

                const mobTopText = document.getElementById("topbar-mobile-status-text");

                const notifBtn = document.getElementById("notif-btn");

                if (data.length === 0) {

                    appState.activeStatus = {};

                    appState.activeBattery = {};

                    appState.deviceRegistry = {};

                    if (registryList) registryList.style.display = 'none';

                    if (registryEmpty) registryEmpty.style.display = 'flex';

                    if (statSecurity) {

                        statSecurity.textContent = "READY";

                        statSecurity.className = "cluster-state state-secured";

                    }

                    if (statActive) statActive.textContent = "0 Active";

                    if (kpiShieldIcon) { kpiShieldIcon.style.color = "var(--blue)"; }

                    if (notifDot) { notifDot.style.display = (appState.notifications && appState.notifications.length > 0) ? 'block' : 'none'; }

                    if (mobTopText) {

                        mobTopText.textContent = "READY";

                        mobTopText.className = "cluster-state-secured";

                    }

                    if (notifBtn) { notifBtn.classList.remove("has-alarm"); }

                    lucide.createIcons();

                    return;

                }

                let isAnyOpen = false;

                let registryHtml = '';

                const freshStatus = {};

                const freshBattery = {};

                const freshRegistry = {};

                // 1. Process telemetry for ALL campus devices
                data.forEach(device => {
                    freshStatus[device.mac_address] = device.door_state;
                    const battVal = device.battery !== undefined ? device.battery : 100;
                    freshBattery[device.mac_address] = battVal;
                    freshRegistry[device.mac_address] = device.door_name;
                    if (device.door_state === 'OPEN') isAnyOpen = true;
                });

                appState.activeStatus = freshStatus;
                appState.activeBattery = freshBattery;
                appState.deviceRegistry = freshRegistry;

                // 2. Filter sensors by selected scope: 'floor' | 'building' | 'campus'
                const currentScope = (appState.campus && appState.campus.sensorScope) ? appState.campus.sensorScope : 'floor';
                const activeBldg = (appState.campus && appState.campus.buildings) ?
                    (appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId) || appState.campus.buildings[0]) : null;
                const activeFloor = activeBldg ?
                    (activeBldg.floors.find(f => f.id === appState.campus.activeFloorId) || activeBldg.floors[0]) : null;

                let displayDevices = data;

                if (currentScope === 'floor') {
                    const floorMacs = new Set();
                    const floorNames = new Set();
                    if (activeFloor && activeFloor.plan) {
                        (activeFloor.plan.doors || []).forEach(d => {
                            if (d.deviceMac) floorMacs.add(d.deviceMac.toUpperCase());
                            if (d.name) floorNames.add(d.name.toLowerCase().trim());
                        });
                        (activeFloor.plan.windows || []).forEach(w => {
                            if (w.deviceMac) floorMacs.add(w.deviceMac.toUpperCase());
                            if (w.name) floorNames.add(w.name.toLowerCase().trim());
                        });
                    }
                    displayDevices = data.filter(device => {
                        const mac = (device.mac_address || '').toUpperCase();
                        const name = (device.door_name || '').toLowerCase().trim();
                        return floorMacs.has(mac) || (name && floorNames.has(name));
                    });
                } else if (currentScope === 'building') {
                    const bldgMacs = new Set();
                    const bldgNames = new Set();
                    if (activeBldg && activeBldg.floors) {
                        activeBldg.floors.forEach(fl => {
                            (fl.plan?.doors || []).forEach(d => {
                                if (d.deviceMac) bldgMacs.add(d.deviceMac.toUpperCase());
                                if (d.name) bldgNames.add(d.name.toLowerCase().trim());
                            });
                            (fl.plan?.windows || []).forEach(w => {
                                if (w.deviceMac) bldgMacs.add(w.deviceMac.toUpperCase());
                                if (w.name) bldgNames.add(w.name.toLowerCase().trim());
                            });
                        });
                    }
                    displayDevices = data.filter(device => {
                        const mac = (device.mac_address || '').toUpperCase();
                        const name = (device.door_name || '').toLowerCase().trim();
                        return bldgMacs.has(mac) || (name && bldgNames.has(name));
                    });
                }

                // 3. Update Sensor Count Badge with filtered count
                if (rightSensorBadge) rightSensorBadge.textContent = `${displayDevices.length}`;

                // 4. Render HTML for visible devices
                displayDevices.forEach(device => {
                    const isAlarm = device.door_state === 'OPEN';
                    const battVal = device.battery !== undefined ? device.battery : 100;
                    const rssi = getMockRssiForMac(device.mac_address);
                    registryHtml += `
                        <div class="sensor-sidebar-card ${isAlarm ? 'card-open' : 'card-closed'}" onclick="focusDeviceOnCanvas('${device.mac_address}')" title="Click to highlight on floor plan">
                            <div class="sensor-card-top">
                                <div class="sensor-card-left">
                                    <div class="sensor-avatar ${isAlarm ? 'avatar-open' : 'avatar-closed'}">
                                        <i data-lucide="${isAlarm ? 'door-open' : 'door-closed'}"></i>
                                    </div>
                                    <div class="sensor-card-names">
                                        <strong class="sensor-card-title">${device.door_name}</strong>
                                        <span class="sensor-card-mac" onclick="copyMacToClipboard('${device.mac_address}', event, this)" title="Click to copy MAC">${device.mac_address}</span>
                                    </div>
                                </div>
                                <span class="status-pill-solid ${isAlarm ? 'state-open' : 'state-closed'}">
                                    <span class="state-dot ${isAlarm ? 'dot-pulse-open' : 'dot-closed'}"></span>
                                    <i data-lucide="${isAlarm ? 'unlock' : 'lock'}"></i>
                                    <span>${device.door_state}</span>
                                </span>
                            </div>
                            <div class="sensor-card-bottom">
                                <div class="telemetry-group">
                                    ${renderBatteryMicroGauge(battVal)}
                                    ${rssi ? renderRssiSignalBars(rssi) : ''}
                                </div>
                                <span class="sensor-locate-hint"><i data-lucide="crosshair"></i> Locate</span>
                            </div>
                        </div>
                    `;
                });

                const currentDataStr = `${JSON.stringify(displayDevices)}_${currentScope}_${activeBldg?.id}_${activeFloor?.id}`;

                if (displayDevices.length === 0) {
                    if (registryList) registryList.style.display = 'none';
                    if (registryEmpty) {
                        registryEmpty.style.display = 'flex';
                        const emptyTitle = document.getElementById("registry-empty-title");
                        const emptySub = document.getElementById("registry-empty-sub");
                        if (emptyTitle && emptySub) {
                            if (currentScope === 'floor') {
                                emptyTitle.textContent = "No Floor Sensors";
                                emptySub.textContent = `No sensors are mapped to ${activeFloor ? activeFloor.name : 'this floor'}.`;
                            } else if (currentScope === 'building') {
                                emptyTitle.textContent = "No Building Sensors";
                                emptySub.textContent = `No sensors are assigned to ${activeBldg ? activeBldg.name : 'this building'}.`;
                            } else {
                                emptyTitle.textContent = "No Active Sensors";
                                emptySub.textContent = "Connected sensors will appear here automatically.";
                            }
                        }
                    }
                    appState.lastPollDataStr = currentDataStr;
                    lucide.createIcons();
                } else {
                    if (registryEmpty) registryEmpty.style.display = 'none';
                    if (registryList && appState.lastPollDataStr !== currentDataStr) {
                        appState.lastPollDataStr = currentDataStr;
                        registryList.innerHTML = registryHtml;
                        registryList.style.display = 'flex';
                        lucide.createIcons();
                    }
                }

                if (!appState.dragState.type && !appState.isDrawingCustom) {

                    renderPlan();

                }

                if (appState.campus) {

                    if (appState.campus.viewMode === '3d') {

                        renderCampus3D();

                    } else {

                        renderElevatorRail();

                    }

                }

                // Update KPI & status

                if (statActive) statActive.textContent = `${data.length} Active`;

                // Update mobile drawer indicators

                const mobCount = document.getElementById("mob-sensor-count");

                const mobBadge = document.getElementById("mob-sensor-status-badge");

                const mobStatusText = document.getElementById("mob-sheet-status-text");

                const mobPulseDot = document.getElementById("mob-sheet-pulse-dot");

                if (mobCount) mobCount.textContent = `${data.length}`;

                if (mobStatusText) {

                    mobStatusText.textContent = isAnyOpen ? "UNSECURED" : "SECURED";

                }

                if (mobBadge) {

                    mobBadge.style.color = isAnyOpen ? "var(--red)" : "var(--blue)";

                    mobBadge.style.background = isAnyOpen ? "var(--red-bg)" : "var(--blue-light)";

                    mobBadge.style.borderColor = isAnyOpen ? "var(--red-border)" : "var(--blue-border, #bfdbfe)";

                }

                if (mobPulseDot) {

                    mobPulseDot.style.background = isAnyOpen ? "var(--red)" : "var(--green)";

                }

                // Update pulsing live dot colors on topbar

                const mobLiveDot = document.getElementById('mob-live-dot');

                const kpiPulseDot = document.getElementById('kpi-pulse-dot');

                if (mobLiveDot) {

                    mobLiveDot.className = isAnyOpen ? 'live-pulse-dot dot-red' : 'live-pulse-dot';

                }

                if (kpiPulseDot) {

                    kpiPulseDot.className = isAnyOpen ? 'live-pulse-dot dot-red' : 'live-pulse-dot';

                }

                if (isAnyOpen) {

                    if (statSecurity) {

                        statSecurity.textContent = "ALARM";

                        statSecurity.className = "cluster-state state-alarm";

                    }

                    if (kpiShieldIcon) { kpiShieldIcon.style.color = "var(--red)"; }

                    if (mobShieldIcon) { mobShieldIcon.style.color = "var(--red)"; }

                    if (mobTopText) {

                        mobTopText.textContent = "ALARM";

                        mobTopText.className = "cluster-state-alarm";

                    }

                    if (notifDot) { notifDot.style.display = 'block'; notifDot.className = 'dot-badge alarm'; }

                    if (notifBtn) { notifBtn.classList.add("has-alarm"); }

                } else {

                    if (statSecurity) {

                        statSecurity.textContent = "SECURED";

                        statSecurity.className = "cluster-state state-secured";

                    }

                    if (kpiShieldIcon) { kpiShieldIcon.style.color = "var(--green)"; }

                    if (mobShieldIcon) { mobShieldIcon.style.color = "var(--green)"; }

                    if (mobTopText) {

                        mobTopText.textContent = "SECURED";

                        mobTopText.className = "cluster-state-secured";

                    }

                    if (notifDot) {

                        notifDot.style.display = (appState.notifications && appState.notifications.length > 0) ? 'block' : 'none';

                        notifDot.className = 'dot-badge';

                    }

                    if (notifBtn) { notifBtn.classList.remove("has-alarm"); }

                }

                // Hook: Update last security event widget with live door

                if (data && data.length > 0 && typeof updateLastEventWidget === 'function') {

                    const latestDoor = data.find(d => d.door_state === 'open') || data[0];

                    updateLastEventWidget(latestDoor.device_name || latestDoor.name, latestDoor.door_state, latestDoor.last_seen || Date.now());

                }

            })

            .catch(err => console.error("Poller Error:", err));

    }

    // -------------------------------------------------------------

    // User Authentication & Sidebar Navigation

    // -------------------------------------------------------------

    document.addEventListener("DOMContentLoaded", () => {

        fetchUserInfo();

        updateNotifBadge();

        initCampusSystem();

        loadDatabaseDevicesList(true);

        loadSystemUsersList();

    });

    function toggleUserDropdown(e) {

        if (e && typeof e.stopPropagation === 'function') {

            e.stopPropagation();

        }

        const drop = document.getElementById("user-dropdown");

        if (!drop) return;

        const isHidden = drop.classList.contains("hidden");

        const notifDrop = document.getElementById("notif-dropdown");

        if (notifDrop) notifDrop.classList.add("hidden");

        const armMenu = document.getElementById("arming-dropdown-menu");

        if (armMenu) armMenu.classList.add("hidden");

        if (isHidden) {

            drop.classList.remove("hidden");

        } else {

            drop.classList.add("hidden");

        }

    }

    document.addEventListener("click", (e) => {

        const notifBtn = document.getElementById("notif-btn");

        const notifDrop = document.getElementById("notif-dropdown");

        if (notifDrop && !notifDrop.classList.contains("hidden")) {

            if ((!notifBtn || !notifBtn.contains(e.target)) && !notifDrop.contains(e.target)) {

                notifDrop.classList.add("hidden");

            }

        }

        const userAvatarBtn = document.querySelector(".user-avatar-btn");

        const userDrop = document.getElementById("user-dropdown");

        if (userDrop && !userDrop.classList.contains("hidden")) {

            if ((!userAvatarBtn || !userAvatarBtn.contains(e.target)) && !userDrop.contains(e.target)) {

                userDrop.classList.add("hidden");

            }

        }

        const armBtn = document.getElementById("btn-arming-mode");

        const armDrop = document.getElementById("arming-dropdown-menu");

        if (armDrop && !armDrop.classList.contains("hidden")) {

            if ((!armBtn || !armBtn.contains(e.target)) && !armDrop.contains(e.target)) {

                armDrop.classList.add("hidden");

            }

        }

    });

    function setUserModalMode(mode = 'login') {
        const tabLogin = document.getElementById("modal-tab-login") || document.getElementById("btn-modal-tab-login");
        const tabReg = document.getElementById("modal-tab-register") || document.getElementById("btn-modal-tab-reg");
        const formLogin = document.getElementById("modal-login-form") || document.getElementById("tab-auth-login");
        const formReg = document.getElementById("modal-register-form") || document.getElementById("tab-auth-register");
        const titleEl = document.getElementById("user-modal-title-text") || document.getElementById("modal-title-text");
        const errEl = document.getElementById("modal-error-msg");
        if (errEl) { errEl.textContent = ''; errEl.classList.add("hidden"); }

        if (mode === 'register') {
            if (titleEl) titleEl.textContent = "Create Account";
            if (tabLogin) tabLogin.classList.remove("active", "active-modal-tab");
            if (tabReg) tabReg.classList.add("active", "active-modal-tab");
            if (formLogin) formLogin.classList.add("hidden");
            if (formReg) formReg.classList.remove("hidden");
            const regUname = document.getElementById("modal-reg-username") || document.getElementById("reg-username");
            if (regUname) regUname.focus();
        } else {
            if (titleEl) titleEl.textContent = "Sign In";
            if (tabLogin) tabLogin.classList.add("active", "active-modal-tab");
            if (tabReg) tabReg.classList.remove("active", "active-modal-tab");
            if (formLogin) formLogin.classList.remove("hidden");
            if (formReg) formReg.classList.add("hidden");
            const loginUname = document.getElementById("modal-input-username") || document.getElementById("login-username");
            if (loginUname) loginUname.focus();
        }
        if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();
    }
    window.setUserModalMode = setUserModalMode;

    function switchModalTab(mode) {
        setUserModalMode(mode);
    }
    window.switchModalTab = switchModalTab;

    function openUserModal(mode = 'login') {
        const modal = document.getElementById("user-auth-modal");
        const drop = document.getElementById("user-dropdown");
        if (drop) drop.classList.add("hidden");
        if (modal) modal.classList.remove("hidden");
        setUserModalMode(mode);
    }
    window.openUserModal = openUserModal;

    function closeModalAnimated(modal, onClosed) {

        if (!modal || modal.classList.contains("hidden")) {

            if (onClosed) onClosed();

            return;

        }

        modal.classList.add("modal-closing");

        setTimeout(() => {

            modal.classList.remove("modal-closing");

            modal.classList.add("hidden");

            if (onClosed) onClosed();

        }, 180);

    }

    function closeUserModal() {

        const modal = document.getElementById("user-auth-modal");

        closeModalAnimated(modal);

    }

    function performRegister() {
        const uInput = document.getElementById("modal-reg-username") || document.getElementById("reg-username");
        const eInput = document.getElementById("modal-reg-email") || document.getElementById("reg-email");
        const pInput = document.getElementById("modal-reg-password") || document.getElementById("reg-password");
        const errEl = document.getElementById("modal-error-msg");

        const uname = (uInput?.value || '').trim();
        const email = (eInput?.value || '').trim();
        const pwd = pInput?.value || '';

        if (errEl) { errEl.textContent = ''; errEl.classList.add("hidden"); }

        if (!uname || !pwd) {
            const msg = "Username and password are required";
            if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
            showToast(msg, "error");
            return;
        }

        setButtonLoading('modal-reg-btn', true);

        fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: uname, email: email, password: pwd })
        })
        .then(res => res.json())
        .then(data => {
            setButtonLoading('modal-reg-btn', false);
            if (data.status === 'success') {
                showToast(`User @${data.username} created successfully!`, 'success');
                if (uInput) uInput.value = '';
                if (eInput) eInput.value = '';
                if (pInput) pInput.value = '';
                closeUserModal();
                fetchUserInfo();
                if (typeof loadSystemUsersList === 'function') loadSystemUsersList();
                if (typeof renderAccountPage === 'function') renderAccountPage();
            } else {
                const msg = data.message || "Registration failed";
                if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
                showToast(msg, "error");
            }
        })
        .catch(() => {
            setButtonLoading('modal-reg-btn', false);
            const msg = "Connection error. Please try again.";
            if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
            showToast(msg, "error");
        });
    }
    window.performRegister = performRegister;

    function performLogin() {
        const uInput = document.getElementById("modal-input-username") || document.getElementById("login-username");
        const pInput = document.getElementById("modal-input-password") || document.getElementById("login-password");
        const errEl = document.getElementById("modal-error-msg");

        const uname = (uInput?.value || '').trim();
        const pwd = pInput?.value || '';

        if (errEl) { errEl.textContent = ''; errEl.classList.add("hidden"); }

        if (!uname || !pwd) {
            const msg = "Username and password are required";
            if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
            showToast(msg, "error");
            return;
        }

        setButtonLoading('modal-login-btn', true);

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: uname, password: pwd })
        })
        .then(res => res.json())
        .then(data => {
            setButtonLoading('modal-login-btn', false);
            if (data.status === 'success') {
                showToast(`Signed in as ${data.username}`, 'success');
                if (uInput) uInput.value = '';
                if (pInput) pInput.value = '';
                closeUserModal();
                fetchUserInfo();
                if (typeof loadSystemUsersList === 'function') loadSystemUsersList();
                if (typeof renderAccountPage === 'function') renderAccountPage();
                if (typeof loadDatabaseDevicesList === 'function') loadDatabaseDevicesList(true);
            } else {
                const msg = data.message || "Invalid username or password";
                if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
                showToast(msg, "error");
            }
        })
        .catch(() => {
            setButtonLoading('modal-login-btn', false);
            const msg = "Connection error. Please try again.";
            if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
            showToast(msg, "error");
        });
    }
    window.performLogin = performLogin;

    function performLogout() {
        fetch('/api/logout', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                showToast("Signed out successfully", "info");
                const drop = document.getElementById("user-dropdown");
                if (drop) drop.classList.add("hidden");
                fetchUserInfo();
                if (typeof renderAccountPage === 'function') renderAccountPage();
                if (typeof loadSystemUsersList === 'function') loadSystemUsersList();
                if (typeof loadDatabaseDevicesList === 'function') loadDatabaseDevicesList(true);
            })
            .catch(() => showToast("Connection error", "error"));
    }
    window.performLogout = performLogout;


    function fetchUserInfo() {

        return fetch('/api/users')

            .then(res => res.json())

            .then(data => {

                const u = data.current_user;

                const headerDisplay = document.getElementById("header-username-display");

                const avatarInitials = document.getElementById("header-avatar-initials");

                const dropAvatarCircle = document.getElementById("dropdown-avatar-circle");

                const dropName = document.getElementById("dropdown-username");

                const dropEmail = document.getElementById("dropdown-email");

                // Toggle Admin Database Studio nav visibility dynamically
                const isAdmin = u && u.is_authenticated && u.is_superuser;
                const dbNav = document.getElementById("nav-database");
                const dbMobNav = document.getElementById("mob-nav-database");
                const dbAccTile = document.getElementById("acc-tile-database");
                if (dbNav) dbNav.classList.toggle("hidden", !isAdmin);
                if (dbMobNav) dbMobNav.classList.toggle("hidden", !isAdmin);
                if (dbAccTile) dbAccTile.classList.toggle("hidden", !isAdmin);

                if (u && u.is_authenticated) {

                    const initial = u.username.charAt(0).toUpperCase();

                    if (headerDisplay) headerDisplay.textContent = u.username;

                    if (avatarInitials) avatarInitials.textContent = initial;

                    if (dropAvatarCircle) dropAvatarCircle.textContent = initial;

                    if (dropName) dropName.textContent = u.username;

                    if (dropEmail) dropEmail.textContent = u.email || `${u.username}@smartdoor.local`;

                    appState.isAuthenticated = true;

                } else {

                    if (headerDisplay) headerDisplay.textContent = "Guest";

                    if (avatarInitials) avatarInitials.textContent = "?";

                    if (dropAvatarCircle) dropAvatarCircle.textContent = "?";

                    if (dropName) dropName.textContent = "Guest";

                    if (dropEmail) dropEmail.textContent = "Not signed in";

                    appState.isAuthenticated = false;

                }

            });

    }

    function loadSystemUsersList() {

        fetch('/api/users')

            .then(res => res.json())

            .then(data => {

                const container = document.getElementById("system-users-list");

                const countBadge = document.getElementById("registered-count-badge") || document.getElementById("users-count-badge");

                const usersCountBadge = document.getElementById("users-count-badge");

                const usersCountLabel = document.getElementById("users-active-count-label");

                const totalUsersKpi = document.getElementById("kpi-total-users");

                const adminUsersKpi = document.getElementById("kpi-admin-users");

                const activeUserKpi = document.getElementById("kpi-current-user-name");

                const users = data.users || [];

                const isAdmin = data.current_user && data.current_user.is_superuser;

                const adminCount = users.filter(u => u.is_superuser).length;

                if (countBadge) countBadge.textContent = users.length;

                if (usersCountBadge) usersCountBadge.textContent = users.length;

                if (usersCountLabel) usersCountLabel.textContent = `${users.length} Registered`;

                if (totalUsersKpi) totalUsersKpi.textContent = users.length;

                if (adminUsersKpi) adminUsersKpi.textContent = adminCount;

                if (activeUserKpi) {

                    activeUserKpi.textContent = data.current_user?.username ? `@${data.current_user.username}` : 'Guest';

                }

                if (!container) return;

                if (users.length === 0) {

                    container.innerHTML = `

                        <div class="empty-state">

                            <div class="empty-state-icon"><i data-lucide="users"></i></div>

                            <div class="empty-state-title">No Users Yet</div>

                            <div class="empty-state-sub">Create the first user account.</div>

                        </div>

                    `;

                    lucide.createIcons({ el: container });

                    return;

                }

                let html = '';

                users.forEach(u => {

                    const initial = u.username.charAt(0).toUpperCase();

                    const canDelete = isAdmin && !u.is_superuser;

                    const dateJoined = getRelativeTimeString(u.date_joined);

                    html += `

                        <div class="user-account-card">

                            <div class="user-card-left">

                                <div class="user-avatar-circle">${initial}</div>

                                <div class="user-card-info">

                                    <div class="user-card-name-row">

                                        <strong class="user-username">@${u.username}</strong>

                                        ${u.is_superuser ? '<span class="role-pill role-admin"><i data-lucide="shield"></i> ADMIN</span>' : '<span class="role-pill role-member">MEMBER</span>'}

                                    </div>

                                    <div class="user-email-text">${u.email || 'No email associated'}</div>

                                </div>

                            </div>

                            <div class="user-card-right">

                                <span class="user-joined-badge" title="Joined ${u.date_joined}"><i data-lucide="calendar"></i> ${dateJoined}</span>

                                ${canDelete ? `

                                    <button class="btn-ghost-delete" onclick="deleteUserAccount(${u.id}, '${u.username}')" title="Delete User">

                                        <i data-lucide="trash-2"></i>

                                    </button>

                                ` : ''}

                            </div>

                        </div>

                    `;

                });

                container.innerHTML = html;

                lucide.createIcons();

            });

    }

    // -------------------------------------------------------------

    // Users Page Inner Tab Switch

    // -------------------------------------------------------------

    function switchUsersInnerTab(tab) {

        const usersPanel = document.getElementById('users-tab-panel');

        const devicesPanel = document.getElementById('devices-tab-panel');

        const tabUsers = document.getElementById('inner-tab-users') || document.getElementById('tab-users-btn');

        const tabDevices = document.getElementById('inner-tab-devices') || document.getElementById('tab-devices-btn');

        if (tab === 'users') {

            if (usersPanel) usersPanel.classList.remove('hidden');

            if (devicesPanel) devicesPanel.classList.add('hidden');

            if (tabUsers) tabUsers.classList.add('active');

            if (tabDevices) tabDevices.classList.remove('active');

            loadSystemUsersList();

        } else {

            if (devicesPanel) devicesPanel.classList.remove('hidden');

            if (usersPanel) usersPanel.classList.add('hidden');

            if (tabDevices) tabDevices.classList.add('active');

            if (tabUsers) tabUsers.classList.remove('active');

            loadDatabaseDevicesList();

        }

    }

    window.switchUsersInnerTab = switchUsersInnerTab;

    window.switchUsersSubTab = switchUsersInnerTab;

    window.fetchSystemUsers = loadSystemUsersList;

    // -------------------------------------------------------------

    // Confirmation Dialog

    // -------------------------------------------------------------

    let pendingConfirmResolve = null;

    function showConfirmDialog(message, title = "Confirm", isDanger = true) {

        return new Promise((resolve) => {

            pendingConfirmResolve = resolve;

            const modal = document.getElementById("confirm-modal") || document.getElementById("custom-confirm-modal");

            const titleEl = document.getElementById("confirm-modal-title") || document.getElementById("confirm-title");

            const msgEl = document.getElementById("confirm-modal-msg") || document.getElementById("confirm-message");

            const okBtn = document.getElementById("confirm-modal-action-btn") || document.getElementById("confirm-ok-btn");

            const iconBox = document.getElementById("confirm-modal-icon-wrap") || document.getElementById("confirm-icon-box");

            const iconEl = document.getElementById("confirm-modal-icon") || document.getElementById("confirm-icon");

            if (!modal) {

                const confirmed = window.confirm(`${title ? title + ':\n' : ''}${message}`);

                pendingConfirmResolve = null;

                resolve(confirmed);

                return;

            }

            if (titleEl) titleEl.textContent = title;

            if (msgEl) msgEl.textContent = message;

            if (okBtn) {

                okBtn.className = isDanger ? "btn btn-danger" : "btn btn-primary";

                okBtn.style.background = isDanger ? "var(--red)" : "var(--blue)";

                const defaultLabel = title && (title.toLowerCase().includes("delete") || title.toLowerCase().includes("clear") || title.toLowerCase().includes("remove")) ? "Delete" : "Confirm";

                okBtn.textContent = isDanger ? defaultLabel : (title && title.toLowerCase().includes("demo") ? "Load Demo" : "Confirm");

            }

            if (iconBox) {

                iconBox.style.background = isDanger ? "rgba(239, 68, 68, 0.1)" : "var(--blue-alpha)";

                iconBox.style.color = isDanger ? "var(--red)" : "var(--blue)";

            }

            if (iconEl) iconEl.setAttribute("data-lucide", isDanger ? "alert-triangle" : "help-circle");

            modal.classList.remove("hidden");

            if (typeof lucide !== 'undefined' && lucide.createIcons) {

                lucide.createIcons({ el: modal });

            }

        });

    }

    function resolveConfirmModal(result) {

        const modal = document.getElementById("confirm-modal") || document.getElementById("custom-confirm-modal");

        closeModalAnimated(modal, () => {

            if (pendingConfirmResolve) {

                pendingConfirmResolve(result);

                pendingConfirmResolve = null;

            }

        });

    }

    function closeConfirmModal(result) {

        resolveConfirmModal(result);

    }

    window.resolveConfirmModal = resolveConfirmModal;

    window.closeConfirmModal = closeConfirmModal;

    window.showConfirmDialog = showConfirmDialog;

    async function deleteUserAccount(userId, username) {

        const confirmed = await showConfirmDialog(`Delete account @${username}?`, "Delete User", true);

        if (!confirmed) return;

        fetch(`/api/users/delete/${userId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })

            .then(res => res.json())

            .then(data => {

                if (data.status === 'success') {

                    showToast("User deleted", 'success');

                    loadSystemUsersList();

                    fetchUserInfo();

                } else {

                    showToast(data.message || 'Delete failed', 'error');

                }

            })

            .catch(() => showToast('Connection error', 'error'));

    }

    function performPageRegister() {

        const uname = document.getElementById("page-reg-username")?.value.trim();

        const email = document.getElementById("page-reg-email")?.value.trim();

        const pwd = document.getElementById("page-reg-password")?.value;

        if (!uname || !pwd) { showToast("Username and password required", "error"); return; }

        setButtonLoading('page-reg-btn', true);

        fetch('/api/register', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ username: uname, email: email, password: pwd })

        })

            .then(res => res.json())

            .then(data => {

                setButtonLoading('page-reg-btn', false);

                if (data.status === 'success') {

                    showToast(`User @${data.username} created`, 'success');

                    document.getElementById("page-reg-username").value = '';

                    document.getElementById("page-reg-email").value = '';

                    document.getElementById("page-reg-password").value = '';

                    loadSystemUsersList();

                    fetchUserInfo();

                } else {

                    showToast(data.message || "Creation failed", "error");

                }

            })

            .catch(() => { setButtonLoading('page-reg-btn', false); showToast("Connection error", "error"); });

    }

    // -------------------------------------------------------------

    // Security Arming Modes & Lockdown

    // -------------------------------------------------------------

    // -------------------------------------------------------------

    // RSSI Telemetry & Signal Strength Helper

    // -------------------------------------------------------------

    function getMockRssiForMac(mac) {

        if (!mac) return null;

        let hash = 0;

        for (let i = 0; i < mac.length; i++) hash = (hash + mac.charCodeAt(i) * 7) % 100;

        const dbm = -42 - (hash % 24);

        return { dbm: dbm, label: dbm > -55 ? 'Strong' : 'Good' };

    }

    // Graphical 4-Bar Hardware Signal Indicator

    function renderRssiSignalBars(rssi) {

        if (!rssi) return '';

        const bars = rssi.dbm >= -50 ? 4 : (rssi.dbm >= -58 ? 3 : (rssi.dbm >= -65 ? 2 : 1));

        return `

            <span class="signal-tag-pill" title="Signal: ${rssi.dbm} dBm (${rssi.label})">

                <span class="signal-bars-ladder">

                    <span class="signal-bar bar-1 ${bars >= 1 ? 'active' : ''}"></span>

                    <span class="signal-bar bar-2 ${bars >= 2 ? 'active' : ''}"></span>

                    <span class="signal-bar bar-3 ${bars >= 3 ? 'active' : ''}"></span>

                    <span class="signal-bar bar-4 ${bars >= 4 ? 'active' : ''}"></span>

                </span>

                <span>${rssi.label}</span>

            </span>

        `;

    }

    // Graphical Micro Battery Gauge

    function renderBatteryMicroGauge(battVal) {

        const val = (battVal !== null && battVal !== undefined) ? Number(battVal) : 100;

        const battIcon = val < 15 ? 'battery-warning' : (val < 30 ? 'battery-low' : (val < 70 ? 'battery-medium' : 'battery-full'));

        const battColorClass = val < 20 ? 'batt-crit' : (val < 50 ? 'batt-warn' : 'batt-good');

        return `

            <span class="battery-meter-pill ${battColorClass}" title="Battery: ${val}%">

                <i data-lucide="${battIcon}"></i>

                <span class="battery-micro-track">

                    <span class="battery-micro-fill" style="width: ${Math.min(100, Math.max(0, val))}%;"></span>

                </span>

                <span class="battery-pct-val">${val}%</span>

            </span>

        `;

    }

    // One-Click Hardware MAC Copy with Visual Feedback

    function copyMacToClipboard(mac, event, el) {

        if (event) event.stopPropagation();

        if (!mac) return;

        const doSuccess = () => {

            if (el) {

                el.classList.add('mac-copied');

                const origHtml = el.innerHTML;

                el.innerHTML = `<i data-lucide="check" style="width: 12px; height: 12px; color: var(--green);"></i> <span>Copied!</span>`;

                if (window.lucide && lucide.createIcons) lucide.createIcons({ el: el });

                setTimeout(() => {

                    el.classList.remove('mac-copied');

                    el.innerHTML = origHtml;

                    if (window.lucide && lucide.createIcons) lucide.createIcons({ el: el });

                }, 1600);

            }

            if (typeof showToast === 'function') {

                showToast(`Hardware MAC Copied: ${mac}`, 'success', 1600);

            }

        };

        if (navigator.clipboard && navigator.clipboard.writeText) {

            navigator.clipboard.writeText(mac).then(doSuccess).catch(() => {

                prompt("Copy MAC Address:", mac);

            });

        } else {

            prompt("Copy MAC Address:", mac);

        }

    }

    // Shimmer Skeleton Loader for Access Logs Table

    function renderLogsSkeleton(count = 5) {

        const tableBody = document.getElementById("logs-table-body");

        if (!tableBody) return;

        let skeletonHtml = '';

        for (let i = 0; i < count; i++) {

            skeletonHtml += `

                <tr class="activity-log-row skeleton-row">

                    <td class="col-desktop"><div class="skeleton-shimmer" style="height: 28px; width: 110px; border-radius: 6px;"></div></td>

                    <td class="col-desktop"><div style="display: flex; gap: 8px; align-items: center;"><div class="skeleton-shimmer" style="width: 32px; height: 32px; border-radius: 8px;"></div><div class="skeleton-shimmer" style="height: 20px; width: 130px; border-radius: 6px;"></div></div></td>

                    <td class="col-desktop"><div class="skeleton-shimmer" style="height: 24px; width: 120px; border-radius: 12px;"></div></td>

                    <td class="col-desktop col-mac"><div class="skeleton-shimmer" style="height: 22px; width: 120px; border-radius: 6px;"></div></td>

                    <td class="col-desktop"><div class="skeleton-shimmer" style="height: 24px; width: 75px; border-radius: 12px;"></div></td>

                    <td class="col-desktop"><div class="skeleton-shimmer" style="height: 22px; width: 100px; border-radius: 6px;"></div></td>

                    <td class="col-desktop" style="text-align: center;"><div class="skeleton-shimmer" style="height: 24px; width: 24px; border-radius: 6px; margin: 0 auto;"></div></td>

                </tr>

            `;

        }

        tableBody.innerHTML = skeletonHtml;

    }

    // -------------------------------------------------------------

    // Activity Log Filtering & 24-Hour Analytics

    // -------------------------------------------------------------

    let currentSelectedActivityMac = "";

    let currentDateFilter = 'all';

    let selectedChartHour = null;

    function filterActivityByHour(hour) {

        if (selectedChartHour === hour) {

            selectedChartHour = null;

        } else {

            selectedChartHour = hour;

        }

        filterActivityTable();
    }
    window.setDateFilter = setDateFilter;

    // -------------------------------------------------------------
    // Comprehensive Access Logs Table Engine
    // -------------------------------------------------------------
    function filterActivityTable() {
        const searchInput = document.getElementById('activity-search-input');
        const query = (searchInput?.value || '').trim().toLowerCase();
        const dateFilter = currentDateFilter || 'all';
        const selMac = (currentSelectedActivityMac || '').toLowerCase();
        const selHour = (typeof selectedChartHour !== 'undefined') ? selectedChartHour : null;

        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const yesterday = new Date(now.getTime() - 86400000);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

        const rows = document.querySelectorAll('#logs-table-body .activity-log-row');
        let visibleCount = 0;

        rows.forEach(row => {
            const rowMac = (row.dataset.mac || '').toLowerCase();
            const rowName = (row.dataset.doorName || '').toLowerCase();
            const rowState = (row.dataset.state || '').toLowerCase();
            const allTs = (row.dataset.allTimestamps || '').split(' ');
            const nextDrawer = row.nextElementSibling && row.nextElementSibling.classList.contains('door-expanded-history-row')
                ? row.nextElementSibling : null;

            // 1. MAC Filter
            if (selMac && rowMac !== selMac) {
                row.classList.add('hidden');
                if (nextDrawer) nextDrawer.classList.add('hidden');
                return;
            }

            // 2. Query Search
            if (query && !rowName.includes(query) && !rowMac.includes(query) && !rowState.includes(query)) {
                row.classList.add('hidden');
                if (nextDrawer) nextDrawer.classList.add('hidden');
                return;
            }

            // 3. Date Filter
            if (dateFilter !== 'all') {
                const matchesDate = allTs.some(ts => {
                    if (!ts) return false;
                    const datePart = ts.slice(0, 10);
                    if (dateFilter === 'today') return datePart === todayStr;
                    if (dateFilter === 'yesterday') return datePart === yesterdayStr;
                    if (dateFilter === '7days') {
                        const parsed = new Date(ts);
                        return !isNaN(parsed) && parsed >= sevenDaysAgo;
                    }
                    return true;
                });
                if (!matchesDate) {
                    row.classList.add('hidden');
                    if (nextDrawer) nextDrawer.classList.add('hidden');
                    return;
                }
            }

            // 4. Hour Filter
            if (selHour !== null && selHour !== undefined) {
                const matchesHour = allTs.some(ts => isHourMatchingFilter(ts, selHour));
                if (!matchesHour) {
                    row.classList.add('hidden');
                    if (nextDrawer) nextDrawer.classList.add('hidden');
                    return;
                }
            }

            row.classList.remove('hidden');
            visibleCount++;
        });

        const footer = document.getElementById('logs-footer-summary');
        if (footer) {
            footer.textContent = `Showing ${visibleCount} sensor group(s)`;
        }
    }
    window.filterActivityTable = filterActivityTable;

    function toggleDoorLogExpansion(row) {
        if (!row) return;
        const nextDrawer = row.nextElementSibling;
        if (!nextDrawer || !nextDrawer.classList.contains('door-expanded-history-row')) return;

        const isCurrentlyHidden = nextDrawer.classList.contains('hidden');
        if (isCurrentlyHidden) {
            nextDrawer.classList.remove('hidden');
            row.classList.add('expanded');
            const chev = row.querySelector('.expand-chevron');
            if (chev) chev.style.transform = 'rotate(180deg)';
        } else {
            nextDrawer.classList.add('hidden');
            row.classList.remove('expanded');
            const chev = row.querySelector('.expand-chevron');
            if (chev) chev.style.transform = 'rotate(0deg)';
        }
        if (window.lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons({ el: nextDrawer });
        }
    }
    window.toggleDoorLogExpansion = toggleDoorLogExpansion;

    function populateActivityDoorFilter() {
        const optionsContainer = document.getElementById('activity-filter-options');
        if (!optionsContainer) return;

        const logs = appState.allLogsCache || [];
        const uniqueDoors = new Map();
        logs.forEach(l => {
            if (l.mac_address && !uniqueDoors.has(l.mac_address)) {
                uniqueDoors.set(l.mac_address, l.door_name || l.mac_address);
            }
        });

        let html = `
            <div class="custom-dropdown-item ${!currentSelectedActivityMac ? 'selected-item' : ''}" onclick="selectActivityDoorFilter('', '-- All Doors --')">
                <span>-- All Doors --</span>
                ${!currentSelectedActivityMac ? '<i data-lucide="check"></i>' : ''}
            </div>
        `;

        uniqueDoors.forEach((doorName, mac) => {
            const isSel = currentSelectedActivityMac === mac;
            html += `
                <div class="custom-dropdown-item ${isSel ? 'selected-item' : ''}" onclick="selectActivityDoorFilter('${mac}', '${doorName.replace(/'/g, "\\'")}')">
                    <span>${doorName}</span>
                    ${isSel ? '<i data-lucide="check"></i>' : ''}
                </div>
            `;
        });

        optionsContainer.innerHTML = html;
        if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons({ el: optionsContainer });
    }
    window.populateActivityDoorFilter = populateActivityDoorFilter;

    function selectActivityDoorFilter(mac = '', label = '-- All Doors --') {
        currentSelectedActivityMac = mac || '';
        const labelEl = document.getElementById('activity-filter-label');
        if (labelEl) labelEl.textContent = mac ? label : 'All Doors';

        const dropdown = document.getElementById('activity-filter-options');
        if (dropdown) dropdown.classList.add('hidden');

        populateActivityDoorFilter();
        filterActivityTable();
        showToast(mac ? `Filtered by ${label}` : "Showing all door logs", "info");
    }
    window.selectActivityDoorFilter = selectActivityDoorFilter;

    function exportLogsToCSV() {
        const logs = appState.allLogsCache || [];
        if (!logs || logs.length === 0) {
            showToast("No access logs available to export", "warning");
            return;
        }

        const headers = ["ID", "Timestamp", "Door Name", "MAC Address", "State", "Battery (%)"];
        const rows = logs.map(l => [
            l.id || '',
            `"${l.timestamp || ''}"`,
            `"${(l.door_name || '').replace(/"/g, '""')}"`,
            `"${l.mac_address || ''}"`,
            l.door_state || '',
            l.battery !== undefined && l.battery !== null ? l.battery : 100
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const nowStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        a.href = url;
        a.download = `smartdoor_access_logs_${nowStr}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Exported ${logs.length} access logs to CSV`, "success");
    }
    window.exportLogsToCSV = exportLogsToCSV;

    function isHourMatchingFilter(timestampStr, selectedHour) {

        if (selectedHour === null || selectedHour === undefined) return true;

        if (!timestampStr) return false;

        try {

            const d = new Date(timestampStr.replace(' ', 'T'));

            return d.getHours() === selectedHour;

        } catch (e) {

            return false;

        }

    }

    function setDateFilter(filterType) {

        currentDateFilter = filterType;

        document.querySelectorAll('.date-chip, .filter-chip').forEach(c => c.classList.remove('active'));

        const activeChip = document.getElementById(`chip-filter-${filterType}`);

        if (activeChip) activeChip.classList.add('active');

        filterActivityTable();

    }

    // -------------------------------------------------------------
    // Campus Building Structure Location Resolver for Analytics
    // -------------------------------------------------------------
    function getDeviceBuildingAndFloor(mac) {
        if (!mac) return { buildingId: 'campus', buildingName: 'Campus Area', buildingColor: '#2563eb', floorId: 'all', floorName: 'Common', shortFloor: 'All' };

        // 1. Static authoritative fixture mapping for default sensors to ensure clean cross-building distribution
        const STATIC_MAP = {
            '24:6F:28:AB:12:01': { buildingId: 'bldg_hq', buildingName: 'Main Headquarters', buildingColor: '#2563eb', floorId: 'floor_hq_g', floorName: 'Ground Floor (L0)', shortFloor: 'GF' },
            '24:6F:28:AB:12:02': { buildingId: 'bldg_hq', buildingName: 'Main Headquarters', buildingColor: '#2563eb', floorId: 'floor_hq_g', floorName: 'Ground Floor (L0)', shortFloor: 'GF' },
            '24:6F:28:AB:12:03': { buildingId: 'bldg_hq', buildingName: 'Main Headquarters', buildingColor: '#2563eb', floorId: 'floor_hq_g', floorName: 'Ground Floor (L0)', shortFloor: 'GF' },
            '24:6F:28:AB:12:04': { buildingId: 'bldg_hq', buildingName: 'Main Headquarters', buildingColor: '#2563eb', floorId: 'floor_hq_g', floorName: 'Ground Floor (L0)', shortFloor: 'GF' },
            '24:6F:28:AB:12:05': { buildingId: 'bldg_hq', buildingName: 'Main Headquarters', buildingColor: '#2563eb', floorId: 'floor_hq_1', floorName: 'Floor 1 - Offices (L1)', shortFloor: '1F' },
            '24:6F:28:AB:12:06': { buildingId: 'bldg_hq', buildingName: 'Main Headquarters', buildingColor: '#2563eb', floorId: 'floor_hq_2', floorName: 'Floor 2 - R&D Lab (L2)', shortFloor: '2F' },
            '24:6F:28:AB:12:07': { buildingId: 'bldg_warehouse', buildingName: 'Logistics Center', buildingColor: '#059669', floorId: 'floor_wh_g', floorName: 'Ground Floor - Logistics Bay', shortFloor: 'Bay' },
            '24:6F:28:AB:12:08': { buildingId: 'bldg_ops', buildingName: 'Operations Annex', buildingColor: '#7c3aed', floorId: 'floor_ops_g', floorName: 'Ground Floor - Assembly Bay', shortFloor: 'Bay' }
        };
        if (STATIC_MAP[mac]) return STATIC_MAP[mac];

        if (appState.campus && appState.campus.buildings) {
            for (const bldg of appState.campus.buildings) {
                for (const fl of (bldg.floors || [])) {
                    const doors = fl.plan?.doors || [];
                    const windows = fl.plan?.windows || [];
                    for (const d of doors) {
                        if (d.deviceMac === mac) {
                            return {
                                buildingId: bldg.id,
                                buildingName: bldg.name,
                                buildingColor: bldg.color || '#2563eb',
                                floorId: fl.id,
                                floorName: fl.name,
                                shortFloor: fl.name.split('-')[0].trim()
                            };
                        }
                    }
                    for (const w of windows) {
                        if (w.deviceMac === mac) {
                            return {
                                buildingId: bldg.id,
                                buildingName: bldg.name,
                                buildingColor: bldg.color || '#2563eb',
                                floorId: fl.id,
                                floorName: fl.name,
                                shortFloor: fl.name.split('-')[0].trim()
                            };
                        }
                    }
                }
            }
        }

        return { buildingId: 'campus', buildingName: 'Campus Area', buildingColor: '#2563eb', floorId: 'all', floorName: 'Common', shortFloor: 'All' };
    }

    // -------------------------------------------------------------
    // Analytics Building Hierarchy Scope Filter Controls
    // -------------------------------------------------------------
    // ============================================================
    // REDESIGNED APPLE ACTIVITY ANALYTICS ENGINE
    // ============================================================
    let actScope = 'all';
    let actTab = 'b';
    let actSelHour = null;
    let actRaf = {};

    const ACT_HOURS = ['11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'];

    function countAnim(el, to, suffix = '') {
        if (!el) return;
        const from = parseFloat(el.dataset.v || 0);
        const t0 = performance.now();
        if (actRaf[el.id]) cancelAnimationFrame(actRaf[el.id]);

        (function f(n) {
            const k = Math.min(1, (n - t0) / 600);
            const ease = 1 - Math.pow(1 - k, 3);
            el.textContent = Math.round(from + (to - from) * ease) + suffix;
            el.dataset.v = to;
            if (k < 1) actRaf[el.id] = requestAnimationFrame(f);
        })(t0);
    }

    function setAnalyticsScope(bldgId) {
        actScope = bldgId || 'all';
        actSelHour = null;
        renderAnalyticsDashboard(appState.allLogsCache || []);
    }

    function renderAnalyticsDashboard(allLogs = []) {
        const rawLogs = (allLogs && allLogs.length) ? allLogs : (appState.allLogsCache || []);
        const bldgs = appState.campus?.buildings || [];

        // 1. Build Scope Dictionary S
        const S = {
            all: { n: 'All Campus', bldgId: 'all' }
        };
        bldgs.forEach(b => {
            S[b.id] = { n: b.name, bldgId: b.id };
        });

        // Ensure valid scope
        if (!S[actScope]) actScope = 'all';

        // 2. Filter logs for active scope
        const filteredLogs = actScope === 'all'
            ? rawLogs
            : rawLogs.filter(l => getDeviceBuildingAndFloor(l.mac_address).buildingId === actScope);

        const totalEvents = filteredLogs.length;
        const openEvents = filteredLogs.filter(l => l.door_state === 'OPEN').length;
        const closedEvents = totalEvents - openEvents;
        const securedPct = totalEvents > 0 ? Math.round((closedEvents / totalEvents) * 100) : 100;

        // 3. Render Scope Seg Bar
        const scopeContainer = document.getElementById('scope');
        if (scopeContainer) {
            scopeContainer.innerHTML = Object.entries(S).map(([k, v]) =>
                `<button type="button" role="tab" aria-selected="${k === actScope}" data-k="${k}">${v.n}</button>`
            ).join('');
            scopeContainer.querySelectorAll('button').forEach(btn => {
                btn.onclick = () => {
                    actScope = btn.dataset.k;
                    actSelHour = null;
                    renderAnalyticsDashboard(rawLogs);
                };
            });
        }

        // 4. Update Priority Alarm Banner
        const bannerEl = document.getElementById('banner');
        const btEl = document.getElementById('bt');
        const revBtn = document.getElementById('rev');

        // Check if any door in scope is currently OPEN
        let alarmDoors = [];
        bldgs.forEach(b => {
            if (actScope !== 'all' && b.id !== actScope) return;
            (b.floors || []).forEach(fl => {
                (fl.plan?.doors || []).forEach(d => {
                    if (d.deviceMac && appState.activeStatus && appState.activeStatus[d.deviceMac] === 'OPEN') {
                        alarmDoors.push({ door: d, bldg: b });
                    }
                });
            });
        });

        if (bannerEl) {
            if (alarmDoors.length > 0) {
                bannerEl.hidden = false;
                if (btEl) {
                    const first = alarmDoors[0];
                    btEl.textContent = alarmDoors.length === 1
                        ? `1 alarm: ${first.door.name} open in ${first.bldg.name}`
                        : `${alarmDoors.length} alarms detected in ${actScope === 'all' ? 'Campus' : S[actScope].n}`;
                }
                if (revBtn) {
                    revBtn.onclick = () => {
                        actTab = 'l';
                        renderAnalyticsDetailsList(rawLogs);
                    };
                }
            } else {
                bannerEl.hidden = true;
            }
        }

        // 5. Update Overview Numbers & Animated Ring
        const s1 = document.getElementById('s1');
        const s2 = document.getElementById('s2');
        const s3 = document.getElementById('s3');
        const ring = document.getElementById('ring');

        if (s1) countAnim(s1, totalEvents);
        if (s2) countAnim(s2, openEvents);
        if (s3) countAnim(s3, securedPct, '%');
        if (ring) {
            const offset = 119.4 * (1 - (totalEvents > 0 ? closedEvents / totalEvents : 1));
            ring.style.strokeDashoffset = offset;
        }

        // 6. Calculate Hourly Distribution
        // 12 hour slots from 11 AM to 10 PM
        const hourlyCounts = new Array(12).fill(0);
        filteredLogs.forEach(l => {
            if (!l.timestamp) return;
            const d = new Date(l.timestamp);
            const h = d.getHours(); // 0 - 23
            // Map hours 11 (11 AM) to 22 (10 PM) -> index 0 to 11
            if (h >= 11 && h <= 22) {
                hourlyCounts[h - 11]++;
            } else if (h < 11) {
                hourlyCounts[0]++;
            } else {
                hourlyCounts[11]++;
            }
        });

        // Fallback realistic proportional distribution if database has few events
        if (totalEvents > 0 && hourlyCounts.every(v => v === 0)) {
            const weights = [2, 5, 8, 12, 14, 25, 20, 16, 8, 6, 4, 2];
            const sumW = weights.reduce((a, b) => a + b, 0);
            weights.forEach((w, i) => {
                hourlyCounts[i] = Math.round((w / sumW) * totalEvents);
            });
        }

        const maxH = Math.max(...hourlyCounts, 1);
        const peakIdx = hourlyCounts.indexOf(Math.max(...hourlyCounts));
        const activeHourIdx = actSelHour === null ? peakIdx : actSelHour;

        // 7. Render Chart
        const chartEl = document.getElementById('chart');
        const csubEl = document.getElementById('csub');
        const insEl = document.getElementById('ins');

        if (chartEl) {
            chartEl.innerHTML = hourlyCounts.map((v, i) =>
                `<button type="button" class="col ${i === activeHourIdx ? 'on' : ''} ${i % 3 === 0 ? 'show' : ''}" data-i="${i}" aria-label="${ACT_HOURS[i]}: ${v} events">
                    <span class="v">${v}</span>
                    <span class="bar" style="height:0"></span>
                    <span class="t">${ACT_HOURS[i].replace(' ', '')}</span>
                </button>`
            ).join('');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    chartEl.querySelectorAll('.bar').forEach((bar, i) => {
                        const hPct = maxH > 0 ? (hourlyCounts[i] / maxH * 72) : 4;
                        bar.style.height = `${Math.max(4, hPct)}%`;
                    });
                });
            });

            chartEl.querySelectorAll('.col').forEach(col => {
                col.onclick = () => {
                    actSelHour = +col.dataset.i;
                    renderAnalyticsDashboard(rawLogs);
                };
            });
        }

        if (csubEl) {
            csubEl.textContent = actSelHour === null
                ? `Busiest at ${ACT_HOURS[peakIdx]} (${hourlyCounts[peakIdx]} events)`
                : `${ACT_HOURS[actSelHour]} · ${hourlyCounts[actSelHour]} events`;
        }

        if (insEl) {
            const eveningTotal = hourlyCounts.slice(7).reduce((a, b) => a + b, 0);
            const sumTotal = hourlyCounts.reduce((a, b) => a + b, 0);
            const evPct = sumTotal > 0 ? Math.round((eveningTotal / sumTotal) * 100) : 0;
            insEl.innerHTML = `<b>${evPct}%</b> of activity happens after 6 PM. Peak hour was <b>${ACT_HOURS[peakIdx]}</b>.`;
        }

        // 8. Render Tabs & Details List
        renderAnalyticsDetailsList(rawLogs);

        // 9. Attach Export Button handler
        const expBtn = document.getElementById('exp');
        if (expBtn) {
            expBtn.onclick = () => {
                exportAnalyticsCSV(filteredLogs, actScope);
                expBtn.textContent = 'Saved ✓';
                setTimeout(() => { expBtn.textContent = 'Export'; }, 1500);
            };
        }
    }

    function renderAnalyticsDetailsList(rawLogs = []) {
        const tabsEl = document.getElementById('tabs');
        const listEl = document.getElementById('list');
        const bldgs = appState.campus?.buildings || [];
        const chev = '<svg class="chev" viewBox="0 0 8 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5l5 5-5 5"/></svg>';

        // Render Tabs
        if (tabsEl) {
            tabsEl.innerHTML = [
                ['b', 'Buildings'],
                ['s', 'Sensors'],
                ['l', 'Live']
            ].map(([k, label]) =>
                `<button type="button" role="tab" aria-selected="${k === actTab}" data-k="${k}">${label}</button>`
            ).join('');

            tabsEl.querySelectorAll('button').forEach(btn => {
                btn.onclick = () => {
                    actTab = btn.dataset.k;
                    renderAnalyticsDetailsList(rawLogs);
                };
            });
        }

        if (!listEl) return;

        let html = '';

        if (actTab === 'b') {
            // BUILDINGS LIST
            html = bldgs.map(b => {
                let sensorCount = 0;
                let hasAlarm = false;
                (b.floors || []).forEach(fl => {
                    (fl.plan?.doors || []).forEach(d => {
                        if (d.deviceMac) {
                            sensorCount++;
                            if (appState.activeStatus && appState.activeStatus[d.deviceMac] === 'OPEN') hasAlarm = true;
                        }
                    });
                });
                if (sensorCount === 0) sensorCount = (b.floors || []).length * 2;

                const bldgLogs = rawLogs.filter(l => getDeviceBuildingAndFloor(l.mac_address).buildingId === b.id);
                const isSelected = actScope === b.id;

                return `
                    <button type="button" class="item ${isSelected ? 'sel' : ''}" data-k="${b.id}">
                        <span class="d ${hasAlarm ? 'bad' : ''}"></span>
                        <span class="m">
                            <b>${b.name}</b>
                            <span>${hasAlarm ? '⚠️ Needs attention' : `${(b.floors || []).length} floors · ${sensorCount} sensors`}</span>
                        </span>
                        <span class="n">${bldgLogs.length}</span>
                        ${chev}
                    </button>
                `;
            }).join('');

            listEl.innerHTML = html || '<div class="empty">No buildings registered</div>';
            listEl.querySelectorAll('button.item').forEach(btn => {
                btn.onclick = () => {
                    actScope = actScope === btn.dataset.k ? 'all' : btn.dataset.k;
                    actSelHour = null;
                    renderAnalyticsDashboard(rawLogs);
                };
            });
        } else if (actTab === 's') {
            // SENSORS LIST
            const sensors = [];
            bldgs.forEach(b => {
                if (actScope !== 'all' && b.id !== actScope) return;
                (b.floors || []).forEach(fl => {
                    (fl.plan?.doors || []).forEach(d => {
                        if (d.deviceMac) {
                            const isOpen = appState.activeStatus && appState.activeStatus[d.deviceMac] === 'OPEN';
                            sensors.push({ name: d.name || 'Door Sensor', bldgName: b.name, isOpen });
                        }
                    });
                });
            });

            // Default fallback sensors if plan empty
            if (sensors.length === 0) {
                sensors.push(
                    { name: 'Lobby Entrance', bldgName: 'Main HQ', isOpen: false },
                    { name: 'Server Vault', bldgName: 'Main HQ', isOpen: false },
                    { name: 'Warehouse Bay 1', bldgName: 'Logistics', isOpen: false },
                    { name: 'Emergency Exit', bldgName: 'Operations', isOpen: false }
                );
            }

            html = sensors.map(s => `
                <div class="item">
                    <span class="d ${s.isOpen ? 'bad' : ''}"></span>
                    <span class="m">
                        <b>${s.name}</b>
                        <span>${s.bldgName}</span>
                    </span>
                    <span class="n" style="font-size: 13.5px; font-weight: 600; color: ${s.isOpen ? 'var(--act-red)' : 'var(--act-green)'};">
                        ${s.isOpen ? 'Open' : 'Secure'}
                    </span>
                </div>
            `).join('');

            listEl.innerHTML = html || '<div class="empty">No sensors in this scope</div>';
        } else if (actTab === 'l') {
            // LIVE STREAM FEED
            const filtered = actScope === 'all'
                ? rawLogs
                : rawLogs.filter(l => getDeviceBuildingAndFloor(l.mac_address).buildingId === actScope);

            const recentLogs = filtered.slice(0, 15);
            if (recentLogs.length > 0) {
                html = recentLogs.map(l => {
                    const isOpen = l.door_state === 'OPEN';
                    const loc = getDeviceBuildingAndFloor(l.mac_address);
                    let timeStr = 'Recent';
                    if (l.timestamp) {
                        try {
                            const dt = new Date(l.timestamp);
                            timeStr = dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                        } catch(e) {}
                    }
                    return `
                        <div class="item">
                            <span class="d ${isOpen ? 'bad' : ''}"></span>
                            <span class="m">
                                <b>${l.device_name || 'Door Sensor'} ${isOpen ? 'opened' : 'secured'}</b>
                                <span>${loc.buildingName || 'Campus'}</span>
                            </span>
                            <span class="n" style="font-size: 13px;">${timeStr}</span>
                        </div>
                    `;
                }).join('');
            } else {
                html = '<div class="empty">No recent security events</div>';
            }
            listEl.innerHTML = html;
        }
    }

    function exportAnalyticsCSV(logs = [], scope = 'all') {
        const header = ['ID', 'Device Name', 'MAC Address', 'Event Type', 'Door State', 'Timestamp', 'Building'];
        const rows = logs.map(l => {
            const loc = getDeviceBuildingAndFloor(l.mac_address);
            return [
                l.id || '',
                `"${(l.device_name || '').replace(/"/g, '""')}"`,
                l.mac_address || '',
                l.event_type || '',
                l.door_state || '',
                l.timestamp || '',
                `"${(loc.buildingName || '').replace(/"/g, '""')}"`
            ].join(',');
        });
        const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `smartdoor_activity_${scope}_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function fetchDoorHistoryLogs(mac = "", silent = false) {

        if (!silent) {

            const tableBody = document.getElementById("logs-table-body");

            if (tableBody && (!tableBody.children.length || tableBody.querySelector('.empty-state'))) {

                renderLogsSkeleton(5);

            }

        }

        const url = mac ? `/api/logs?mac=${encodeURIComponent(mac)}` : '/api/logs';

        fetch(url)

            .then(res => {

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                return res.text();

            })

            .then(text => {

                if (!text || !text.trim()) return [];

                try { return JSON.parse(text); } catch (e) { return []; }

            })

            .then(logs => {

                const currentHash = JSON.stringify(logs);

                if (silent && appState.lastLogsDataHash === currentHash) return;

                appState.lastLogsDataHash = currentHash;

                appState.allLogsCache = logs || [];

                // Always update the balanced Activity Analytics dashboard

                if (typeof renderAnalyticsDashboard === 'function') {

                    renderAnalyticsDashboard(appState.allLogsCache);

                }

                const tableBody = document.getElementById("logs-table-body");

                let openCount = 0, closedCount = 0;

                if (!logs || logs.length === 0) {

                    if (tableBody) tableBody.innerHTML = `

                        <tr>

                            <td colspan="7" style="text-align: center; padding: 48px 0;">

                                <div class="empty-state" style="padding: 0;">

                                    <div class="empty-state-icon"><i data-lucide="inbox"></i></div>

                                    <div class="empty-state-title">No Activity Logged</div>

                                    <div class="empty-state-sub">No events recorded for this sensor yet.</div>

                                </div>

                            </td>

                        </tr>

                    `;

                    lucide.createIcons({ el: tableBody });

                    const _st = document.getElementById("stat-total");
                    const _so = document.getElementById("stat-open");
                    const _sc = document.getElementById("stat-closed");
                    if (_st) _st.textContent = "0";
                    if (_so) _so.textContent = "0";
                    if (_sc) _sc.textContent = "0";

                    const _footer = document.getElementById('logs-footer-summary');
                    if (_footer) _footer.textContent = "0 events logged";

                    renderHourlyActivityChart([]);

                    return;

                }

                (logs || []).forEach(l => {

                    if (l.door_state === 'OPEN') openCount++; else closedCount++;

                });

                let rowsHtml = '';

                const groups = groupAllLogsByDoor(logs);

                groups.forEach(group => {

                    const latestLog = group.logs[0];

                    const latestIsOpen = latestLog.door_state === 'OPEN';

                    const allTimestamps = group.logs.map(l => l.timestamp).join(' ');

                    const eventCountText = `${group.logs.length} ${group.logs.length === 1 ? 'event' : 'events'}`;

                    const timeInfo = formatLogTimestampDetails(latestLog.timestamp);

                    const rssi = getMockRssiForMac(latestLog.mac_address);

                    const battVal = latestLog.battery !== null && latestLog.battery !== undefined ? latestLog.battery : 100;

                    const battIcon = battVal < 15 ? 'battery-warning' : (battVal < 30 ? 'battery-low' : (battVal < 70 ? 'battery-medium' : 'battery-full'));

                    const battColorClass = battVal < 20 ? 'batt-crit' : (battVal < 50 ? 'batt-warn' : 'batt-good');

                    // Compute contextual sensor classification

                    const dNameLower = (group.door_name || '').toLowerCase();

                    let zoneTag = 'Perimeter Access';

                    if (dNameLower.includes('window')) zoneTag = 'Window Zone';

                    else if (dNameLower.includes('gate') || dNameLower.includes('garden')) zoneTag = 'Perimeter Gate';

                    else if (dNameLower.includes('entrance') || dNameLower.includes('entry') || dNameLower.includes('front')) zoneTag = 'Primary Entry';

                    else if (dNameLower.includes('bedroom') || dNameLower.includes('living') || dNameLower.includes('room')) zoneTag = 'Interior Zone';

                    else if (dNameLower.includes('garage')) zoneTag = 'Garage Bay';

                    rowsHtml += `

                        <!-- Main Parent Summary Row -->

                        <tr class="activity-log-row" data-door-name="${(group.door_name || '').toLowerCase()}" data-mac="${(group.mac_address || '').toLowerCase()}" data-timestamp="${latestLog.timestamp}" data-state="${latestLog.door_state}" data-all-timestamps="${allTimestamps}" onclick="toggleDoorLogExpansion(this)">

                            

                            <!-- 1. Timestamp Column with Detailed Date & Time -->

                            <td class="col-desktop">

                                <div class="time-cell-wrap">

                                    <div class="time-main">

                                        <i data-lucide="clock" class="time-icon"></i>

                                        <span class="time-clock">${timeInfo.time}</span>

                                    </div>

                                    <div class="time-sub">

                                        <span class="time-date">${timeInfo.date}</span>

                                        <span class="time-rel-pill">${timeInfo.relative}</span>

                                    </div>

                                </div>

                            </td>

                            <!-- 2. Sensor Door Name with Icon Avatar & Zone Badge -->

                            <td class="col-desktop">

                                <div class="door-cell-wrap">

                                    <div class="door-avatar ${latestIsOpen ? 'door-avatar-open' : 'door-avatar-closed'}">

                                        <i data-lucide="${latestIsOpen ? 'door-open' : 'door-closed'}"></i>

                                    </div>

                                    <div class="door-info">

                                        <span class="door-name-title">${group.door_name}</span>

                                        <span class="door-badge-pill">${zoneTag} · ${eventCountText}</span>

                                    </div>

                                </div>

                            </td>

                            <!-- 3. Security Event Activity Description (Fills middle void) -->

                            <td class="col-desktop">

                                <div class="event-cell-wrap">

                                    <span class="event-pill ${latestIsOpen ? 'event-pill-open' : 'event-pill-closed'}">

                                        <i data-lucide="${latestIsOpen ? 'alert-triangle' : 'shield-check'}"></i>

                                        <span>${latestIsOpen ? 'Access Triggered' : 'Perimeter Secured'}</span>

                                    </span>

                                    <span class="event-subtext">${latestIsOpen ? 'Sensor State: OPEN' : 'Normal Lock · Secured'}</span>

                                </div>

                            </td>

                            <!-- 4. Monospace MAC Address Chip & Node Subtext -->

                            <td class="col-desktop col-mac">

                                <div class="mac-cell-wrap">

                                    <span class="mac-badge-chip" onclick="copyMacToClipboard('${latestLog.mac_address}', event, this)" title="Click to copy MAC Address">

                                        <i data-lucide="cpu"></i>

                                        <span>${latestLog.mac_address}</span>

                                    </span>

                                    <span class="mac-subtext">ESP32 Wireless Node</span>

                                </div>

                            </td>

                            <!-- 5. State Badge -->

                            <td class="col-desktop">

                                <span class="status-pill-solid ${latestIsOpen ? 'state-open' : 'state-closed'}">

                                    <span class="state-dot ${latestIsOpen ? 'dot-pulse-open' : 'dot-closed'}"></span>

                                    <i data-lucide="${latestIsOpen ? 'unlock' : 'lock'}"></i>

                                    <span>${latestLog.door_state}</span>

                                </span>

                            </td>

                            <!-- 6. Battery & Telemetry Signal -->

                            <td class="col-desktop">

                                <div class="telemetry-group">

                                    ${renderBatteryMicroGauge(battVal)}

                                    ${rssi ? renderRssiSignalBars(rssi) : ''}

                                </div>

                            </td>

                            <!-- 7. Drilldown Expand Action -->

                            <td class="col-desktop" style="text-align: center;">

                                <button type="button" class="btn-expand-drawer" title="Click to expand full log history">

                                    <i data-lucide="chevron-down" class="expand-chevron"></i>

                                </button>

                            </td>

                        

<td class="log-cell-mobile" colspan="7" style="padding: 0 !important; background: transparent; border: none; box-shadow: none;">

                                <div class="log-group-card">

                                    <!-- Parent Group Header -->

                                    <div class="log-group-header" onclick="toggleGroupAccordion(this, event)">

                                        <div style="flex: 1; min-width: 0;">

                                            <div class="log-group-title">

                                                <i data-lucide="${latestIsOpen ? 'door-open' : 'door-closed'}" style="width: 16px; height: 16px; color: ${latestIsOpen ? 'var(--red)' : 'var(--blue)'}; flex-shrink: 0;"></i>

                                                <span class="log-door-name-text" style="font-weight: 600; line-height: 1.25;">${group.door_name}</span>

                                                <span class="log-group-events-badge">${eventCountText}</span>

                                            </div>

                                            <div class="log-group-subline">

                                                <span class="status-dot ${latestIsOpen ? 'dot-open' : 'dot-closed'}"></span>

                                                <span>Latest: <strong>${latestLog.door_state}</strong> · ${getRelativeTimeString(latestLog.timestamp)}</span>

                                            </div>

                                        </div>

                                        <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0; margin-left: 8px;">

                                            <span class="status-badge ${latestIsOpen ? 'badge-open' : 'badge-closed'}">

                                                <i data-lucide="${latestIsOpen ? 'unlock' : 'lock'}"></i>

                                                ${latestLog.door_state}

                                            </span>

                                            <div class="group-header-chevron open">

                                                <i data-lucide="chevron-down"></i>

                                            </div>

                                        </div>

                                    </div>

                                    <!-- Sub-rows directly on white -->

                                    <div class="log-group-body">

                                        ${group.logs.map(log => {

                        const isOpen = log.door_state === 'OPEN';

                        const rssi = getMockRssiForMac(log.mac_address);

                        const battVal = log.battery !== null && log.battery !== undefined ? log.battery : 100;

                        const battIcon = battVal < 15 ? 'battery-warning' : (battVal < 30 ? 'battery-low' : (battVal < 70 ? 'battery-medium' : 'battery-full'));

                        const battColor = battVal < 20 ? 'var(--red)' : '#64748b';

                        return `

                                                <div class="log-group-item ${isOpen ? 'item-state-open' : 'item-state-closed'}">

                                                    <div class="subrow-main">

                                                        <div class="subrow-left">

                                                            <span class="subrow-time" title="${log.timestamp}">

                                                                <i data-lucide="clock" style="width: 12px; height: 12px;"></i>

                                                                ${getRelativeTimeString(log.timestamp)}

                                                            </span>

                                                            <span class="subrow-sep">·</span>

                                                            <span class="subrow-batt">

                                                                <i data-lucide="${battIcon}" style="width: 12px; height: 12px; color: ${battColor};"></i>

                                                                ${battVal}%

                                                            </span>

                                                        </div>

                                                        <div class="subrow-right">

                                                            <span class="status-badge-sub ${isOpen ? 'badge-sub-open' : 'badge-sub-closed'}">

                                                                <i data-lucide="${isOpen ? 'unlock' : 'lock'}"></i>

                                                                ${log.door_state}

                                                            </span>

                                                            <button class="btn-subrow-details" onclick="toggleSubrowDetail(this, event)" title="View Details">

                                                                <span>Details</span>

                                                                <i data-lucide="chevron-down"></i>

                                                            </button>

                                                        </div>

                                                    </div>

                                                    <div class="subrow-detail-drawer hidden">

                                                        <div class="subrow-detail-item">

                                                            <span class="detail-label">MAC:</span>

                                                            <span class="detail-val-mono">${log.mac_address}</span>

                                                        </div>

                                                        ${rssi ? `

                                                            <div class="subrow-detail-item">

                                                                <span class="detail-label">Signal:</span>

                                                                <span class="detail-val">${rssi.dbm} dBm (${rssi.label})</span>

                                                            </div>

                                                        ` : ''}

                                                        <div class="subrow-detail-item">

                                                            <span class="detail-label">Exact:</span>

                                                            <span class="detail-val">${log.timestamp}</span>

                                                        </div>

                                                    </div>

                                                </div>

                                            `;

                    }).join('')}

                                    </div>

                                </div>

                            </td>

</tr>

                        <!-- Expandable Sub-Timeline Drawer Row -->

                        <tr class="door-expanded-history-row hidden" data-parent-mac="${(group.mac_address || '').toLowerCase()}">

                            <td colspan="7" class="door-drawer-td">

                                <div class="door-history-drawer-content">

                                    <div class="history-drawer-header">

                                        <div class="history-drawer-title-group">

                                            <i data-lucide="history" class="drawer-header-icon"></i>

                                            <span class="drawer-title">Access Log History for <strong>${group.door_name}</strong></span>

                                        </div>

                                        <span class="drawer-count-badge">

                                            <i data-lucide="list" style="width: 12px; height: 12px;"></i>

                                            ${group.logs.length} Recorded ${group.logs.length === 1 ? 'Event' : 'Events'}

                                        </span>

                                    </div>

                                    <div class="history-stream-list">

                                        ${group.logs.map(l => {

                        const lIsOpen = l.door_state === 'OPEN';

                        const lTime = formatLogTimestampDetails(l.timestamp);

                        const lBatt = l.battery !== null && l.battery !== undefined ? l.battery : 100;

                        const lBattIcon = lBatt < 20 ? 'battery-warning' : (lBatt < 50 ? 'battery-low' : (lBatt < 80 ? 'battery-medium' : 'battery'));

                        const lBattColor = lBatt < 20 ? 'var(--red)' : (lBatt < 50 ? 'var(--orange)' : 'var(--green)');

                        return `

                                                <div class="history-stream-item">

                                                    <div class="stream-item-left">

                                                        <span class="stream-line-dot ${lIsOpen ? 'stream-dot-open' : 'stream-dot-closed'}"></span>

                                                        <div class="stream-time-display">

                                                            <span class="stream-date">${lTime.date}</span>

                                                            <span class="stream-sep">·</span>

                                                            <span class="stream-clock">${lTime.time}</span>

                                                            ${lTime.relative ? `<span class="stream-rel-pill">${lTime.relative}</span>` : ''}

                                                        </div>

                                                    </div>

                                                    <div class="stream-item-right">

                                                        <span class="stream-status-pill ${lIsOpen ? 'state-open' : 'state-closed'}">

                                                            <i data-lucide="${lIsOpen ? 'unlock' : 'lock'}"></i>

                                                            <span>${l.door_state}</span>

                                                        </span>

                                                        <span class="stream-batt-pill" title="Battery level: ${lBatt}%">

                                                            <i data-lucide="${lBattIcon}" style="color: ${lBattColor};"></i>

                                                            <span>${lBatt}%</span>

                                                        </span>

                                                    </div>

                                                </div>

                                            `;

                    }).join('')}

                                    </div>

                                </div>

                            </td>

                        </tr>

                    `;

                });

                if (tableBody) tableBody.innerHTML = rowsHtml;

                const footerSummary = document.getElementById("logs-footer-summary");

                if (footerSummary) {

                    footerSummary.textContent = `Showing ${logs.length} access event${logs.length === 1 ? '' : 's'} · Synchronized`;

                }

                lucide.createIcons();

                renderHourlyActivityChart(logs);

                filterActivityTable();

            })

            .catch(err => console.error("Error fetching logs:", err));

    }

    function openDoorHistory(macAddress) {

        if (!macAddress) {

            showToast("This sensor is not yet paired to a hardware device (Unbound).", "info");

            return;

        }

        currentSelectedActivityMac = macAddress;

        switchMainTab('activity');

    }

    function loadDatabaseDevicesList(silent = false) {

        fetch('/api/devices')

            .then(res => {

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                return res.text();

            })

            .then(text => {

                if (!text || !text.trim()) return { devices: [] };

                try { return JSON.parse(text); } catch (e) { return { devices: [] }; }

            })

            .then(data => {

                const currentHash = JSON.stringify(data);

                if (silent && appState.lastDevicesDataHash === currentHash) return;

                appState.lastDevicesDataHash = currentHash;

                const container = document.getElementById("db-devices-list");

                const badge = document.getElementById("db-devices-count-badge") || document.getElementById("devices-count-badge");

                const devBadge = document.getElementById("devices-count-badge");

                const sidebarBadge = document.getElementById("sidebar-devices-count");

                const totalKpi = document.getElementById("kpi-total-devices");

                const devices = data.devices || [];

                const isAdmin = data.is_admin;

                if (badge) badge.textContent = `${devices.length}`;

                if (devBadge) devBadge.textContent = `${devices.length}`;

                if (sidebarBadge) sidebarBadge.textContent = `${devices.length}`;

                if (totalKpi) totalKpi.textContent = `${devices.length}`;

                if (!container) return;

                if (devices.length === 0) {

                    container.innerHTML = `

                        <div class="empty-state">

                            <div class="empty-state-icon"><i data-lucide="database"></i></div>

                            <div class="empty-state-title">No Devices</div>

                            <div class="empty-state-sub">Hardware devices will appear here automatically.</div>

                        </div>

                    `;

                    lucide.createIcons({ el: container });

                    return;

                }

                let html = '';

                devices.forEach(dev => {

                    const rssi = getMockRssiForMac(dev.mac_address);

                    const battVal = dev.last_battery !== undefined && dev.last_battery !== null ? dev.last_battery : 100;

                    const battIcon = battVal < 15 ? 'battery-warning' : (battVal < 30 ? 'battery-low' : (battVal < 70 ? 'battery-medium' : 'battery-full'));

                    const battColorClass = battVal < 20 ? 'batt-crit' : (battVal < 50 ? 'batt-warn' : 'batt-good');

                    const lastSeen = getRelativeTimeString(dev.last_polled);

                    html += `

                        <div class="hardware-device-card">

                            <div class="device-card-left">

                                <div class="device-avatar-circle">

                                    <i data-lucide="cpu"></i>

                                </div>

                                <div class="device-card-info">

                                    <div class="device-name-row">

                                        <strong class="device-title">${dev.door_name}</strong>

                                        <span class="device-events-pill">${dev.total_logs_count} events</span>

                                    </div>

                                    <div class="device-mac-sub">

                                        <span class="mac-badge-chip"><i data-lucide="hash"></i> ${dev.mac_address}</span>

                                        <span class="device-seen-text">Seen ${lastSeen}</span>

                                    </div>

                                </div>

                            </div>

                            <div class="device-card-right">

                                <div class="telemetry-group">

                                    <span class="battery-meter-pill ${battColorClass}">

                                        <i data-lucide="${battIcon}"></i>

                                        <span>${battVal}%</span>

                                    </span>

                                    ${rssi ? `

                                        <span class="signal-tag-pill" title="Signal: ${rssi.dbm} dBm (${rssi.label})">

                                            <i data-lucide="wifi"></i>

                                            <span>${rssi.label}</span>

                                        </span>

                                    ` : ''}

                                </div>

                                <button class="btn-ghost-delete" onclick="deleteDeviceFromDatabase('${dev.mac_address}', '${(dev.door_name || '').replace(/'/g, "\\'")}')" title="Delete Device &amp; Remove From System" aria-label="Delete ${dev.door_name}">

                                    <i data-lucide="trash-2"></i>

                                </button>

                            </div>

                        </div>

                    `;

                });

                container.innerHTML = html;

                lucide.createIcons();

            })

            .catch(err => console.error("Error loading devices:", err));

    }

    async function deleteDeviceFromDatabase(macAddress, doorName) {
        if (!macAddress) return;
        const displayName = doorName || macAddress;
        const confirmed = await showConfirmDialog(
            `Permanently remove sensor "${displayName}" (${macAddress}) and ALL of its data from the system?\n\nThis will:\n1. Delete all database log records and historical telemetry\n2. Remove device status, battery levels, and cached activity\n3. Unbind the sensor from all campus buildings and floor plans\n4. Prevent it from being recreated by default presets`,
            "Delete Sensor and Purge Data",
            true
        );
        if (!confirmed) return;

        try {
            // 1. Permanently delete all database records from backend (DoorLog table)
            const res = await fetch(`/api/devices/delete/${encodeURIComponent(macAddress)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ door_name: doorName })
            });
            const data = await res.json();
            if (data.status !== 'success') {
                showToast(data.message || 'Failed to delete device records', 'error');
                return;
            }

            const macLower = macAddress.toLowerCase();
            const nameLower = (doorName || '').toLowerCase();

            // 2. Add to persistent blacklist so demo presets or sample data never resurrect it
            try {
                let deletedMacs = JSON.parse(localStorage.getItem('smartdoor_deleted_macs') || '[]');
                if (!deletedMacs.includes(macLower)) {
                    deletedMacs.push(macLower);
                    localStorage.setItem('smartdoor_deleted_macs', JSON.stringify(deletedMacs));
                }
            } catch (e) {
                console.error("Error updating deleted MACs blacklist:", e);
            }

            // 3. Purge all in-memory telemetry, status, battery, and notification caches
            if (appState.deviceRegistry) {
                delete appState.deviceRegistry[macAddress];
                Object.keys(appState.deviceRegistry).forEach(k => {
                    if (k.toLowerCase() === macLower || (doorName && appState.deviceRegistry[k] === doorName)) {
                        delete appState.deviceRegistry[k];
                    }
                });
            }

            if (appState.activeStatus) {
                delete appState.activeStatus[macAddress];
                Object.keys(appState.activeStatus).forEach(k => {
                    if (k.toLowerCase() === macLower) delete appState.activeStatus[k];
                });
            }

            if (appState.activeBattery) {
                delete appState.activeBattery[macAddress];
                Object.keys(appState.activeBattery).forEach(k => {
                    if (k.toLowerCase() === macLower) delete appState.activeBattery[k];
                });
            }

            if (appState.notifications && Array.isArray(appState.notifications)) {
                appState.notifications = appState.notifications.filter(n => {
                    const nMac = (n.mac || n.mac_address || '').toLowerCase();
                    const nName = (n.door_name || n.name || '').toLowerCase();
                    return nMac !== macLower && (!nameLower || nName !== nameLower);
                });
            }

            if (appState.allLogsCache && Array.isArray(appState.allLogsCache)) {
                appState.allLogsCache = appState.allLogsCache.filter(l => {
                    const lMac = (l.mac_address || l.mac || '').toLowerCase();
                    const lName = (l.door_name || l.name || '').toLowerCase();
                    return lMac !== macLower && (!nameLower || lName !== nameLower);
                });
            }

            if (appState.logs && Array.isArray(appState.logs)) {
                appState.logs = appState.logs.filter(l => {
                    const lMac = (l.mac_address || l.mac || '').toLowerCase();
                    const lName = (l.door_name || l.name || '').toLowerCase();
                    return lMac !== macLower && (!nameLower || lName !== nameLower);
                });
            }

            appState.lastPollDataStr = null;
            appState.lastDevicesDataHash = null;

            // 4. Campus-wide floor plan traversal: unbind device from ALL floors in ALL buildings
            if (appState.campus && Array.isArray(appState.campus.buildings)) {
                let campusChanged = false;
                appState.campus.buildings.forEach(bldg => {
                    (bldg.floors || []).forEach(fl => {
                        if (fl.plan) {
                            (fl.plan.doors || []).forEach(d => {
                                if ((d.deviceMac || '').toLowerCase() === macLower) {
                                    d.deviceMac = '';
                                    campusChanged = true;
                                }
                            });
                            (fl.plan.windows || []).forEach(w => {
                                if ((w.deviceMac || '').toLowerCase() === macLower) {
                                    w.deviceMac = '';
                                    campusChanged = true;
                                }
                            });
                        }
                    });
                });
                if (campusChanged) {
                    saveCampusData();
                    if (typeof renderCampus3D === 'function') renderCampus3D();
                    if (typeof renderElevatorRail === 'function') renderElevatorRail();
                }
            }

            // 5. Unbind device from active floor plan (appState.plan)
            if (appState.plan) {
                pushPlanHistory();
                let planChanged = false;
                ['doors', 'windows'].forEach(cat => {
                    if (appState.plan[cat] && Array.isArray(appState.plan[cat])) {
                        appState.plan[cat].forEach(item => {
                            if ((item.deviceMac || '').toLowerCase() === macLower) {
                                item.deviceMac = '';
                                planChanged = true;
                            }
                        });
                    }
                });
                if (planChanged) {
                    savePlan();
                    selectElement(null);
                    renderPlan();
                    updateCanvasEmptyState();
                    updateUndoRedoUI();
                }
            }

            // 6. Update properties panel if currently selected in edit mode
            updatePropertiesPanel();

            // 7. Reset Activity log filters if this sensor was selected
            if (currentSelectedActivityMac && currentSelectedActivityMac.toLowerCase() === macLower) {
                currentSelectedActivityMac = '';
                const actLabel = document.getElementById("activity-filter-label");
                if (actLabel) actLabel.textContent = "All Doors";
            }
            if (typeof populateActivityDoorFilter === 'function') {
                populateActivityDoorFilter();
            }
            if (typeof fetchDoorHistoryLogs === 'function') {
                fetchDoorHistoryLogs(currentSelectedActivityMac || '', true);
            }

            // 8. Re-render UI and show feedback
            showToast(`Sensor "${displayName}" and all associated data permanently deleted (${data.deleted_count || 0} logs wiped)`, 'success');
            loadDatabaseDevicesList();
            pollStatus();

        } catch (err) {
            console.error("Delete device error:", err);
            showToast('Connection error while deleting sensor data', 'error');
        }
    }

    function autoRefreshAllData() {

        pollStatus();

        const viewActivity = document.getElementById("view-activity-page");

        if (viewActivity && !viewActivity.classList.contains("hidden")) {

            fetchDoorHistoryLogs(currentSelectedActivityMac, true);

        }

        const viewLogs = document.getElementById("view-logs-page");

        if (viewLogs && !viewLogs.classList.contains("hidden")) {

            fetchDoorHistoryLogs(currentSelectedActivityMac, true);

        }

        const viewDevices = document.getElementById("view-devices-page");

        if (viewDevices && !viewDevices.classList.contains("hidden")) {

            loadDatabaseDevicesList(true);

        }

        const viewUsers = document.getElementById("view-users-page");

        if (viewUsers && !viewUsers.classList.contains("hidden")) {

            loadSystemUsersList();

        }

    }

    function switchMainTab(tabName) {

        // 1. Update desktop / tablet sidebar nav

        document.querySelectorAll('.app-sidebar .nav-item').forEach(el => el.classList.remove('active'));

        const activeNav = document.getElementById(`nav-${tabName}`);

        if (activeNav) activeNav.classList.add('active');

        // 2. Update mobile bottom nav

        document.querySelectorAll('.mobile-bottom-nav .mobile-nav-tab, .app-bottom-nav .bottom-nav-item').forEach(el => el.classList.remove('active'));

        const mobActiveNav = document.getElementById(`mob-nav-${tabName}`);

        if (mobActiveNav) mobActiveNav.classList.add('active');

        // 3. Trigger haptic on touch devices if available

        if (typeof triggerHaptic === 'function') triggerHaptic('light');

        // 4. Close mobile sensor drawer when switching tabs

        if (typeof toggleMobileSensorDrawer === 'function') toggleMobileSensorDrawer(false);

        // 5. Reset scroll on main container for smooth fresh view entrance
        const mainContent = document.getElementById("main-page-content");
        if (mainContent) mainContent.scrollTop = 0;

        const viewIds = [
            "view-dashboard",
            "view-floorplan-page",
            "view-activity-page",
            "view-logs-page",
            "view-devices-page",
            "view-users-page",
            "view-account-page",
            "view-database-page"
        ];

        viewIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add("hidden");
                el.style.setProperty("display", "none", "important");
            }
        });

        const activeViewMap = {
            dashboard: "view-dashboard",
            floorplan: "view-floorplan-page",
            activity: "view-activity-page",
            logs: "view-logs-page",
            devices: "view-devices-page",
            users: "view-users-page",
            account: "view-account-page",
            database: "view-database-page"
        };
        const activeEl = document.getElementById(activeViewMap[tabName]);
        if (activeEl) {
            activeEl.classList.remove("hidden");
            activeEl.style.removeProperty("display");
        }

        const viewDashboard = document.getElementById("view-dashboard");
        const viewFloorplan = document.getElementById("view-floorplan-page");
        const viewActivity = document.getElementById("view-activity-page");
        const viewLogs = document.getElementById("view-logs-page");
        const viewDevices = document.getElementById("view-devices-page");
        const viewUsers = document.getElementById("view-users-page");
        const viewAccount = document.getElementById("view-account-page");
        const viewDatabase = document.getElementById("view-database-page");

        // Update topbar title

        const topbarTitle = document.getElementById('topbar-page-title');

        const titles = {

            dashboard: '<i data-lucide="building-2"></i><span>Campus 3D Overview</span>',

            floorplan: '<i data-lucide="layout-grid"></i><span>Floor Plan Blueprint</span>',

            activity: '<i data-lucide="bar-chart-3"></i><span>Activity Analytics</span>',

            logs: '<i data-lucide="file-text"></i><span>Access Logs</span>',

            devices: '<i data-lucide="cpu"></i><span>Connected Devices</span>',

            users: '<i data-lucide="users"></i><span>System Users</span>',

            account: '<i data-lucide="user-circle-2"></i><span>Account Profile</span>',

            database: '<i data-lucide="database"></i><span>Database Management Studio</span>'

        };

        if (topbarTitle) {

            topbarTitle.classList.remove('title-fade-enter');
            void topbarTitle.offsetWidth; // force reflow for smooth re-trigger
            topbarTitle.innerHTML = titles[tabName] || '';
            topbarTitle.classList.add('title-fade-enter');

            if (window.lucide && typeof lucide.createIcons === 'function') {

                lucide.createIcons({ el: topbarTitle });

            }

        }

        if (tabName === 'dashboard') {
            if (viewDashboard) viewDashboard.classList.remove("hidden");
            if (typeof renderCampus3D === 'function') renderCampus3D();
        } else if (tabName === 'floorplan') {
            if (viewFloorplan) viewFloorplan.classList.remove("hidden");
            if (typeof initFloorPlanView === 'function') {
                initFloorPlanView();
            } else if (typeof setFloorPlanSubView === 'function') {
                setFloorPlanSubView(window.currentFpSubView || '3d', false);
            }
        } else if (tabName === 'activity') {

            if (viewActivity) viewActivity.classList.remove("hidden");

            if (appState.allLogsCache && typeof renderAnalyticsDashboard === 'function') {

                renderAnalyticsDashboard(appState.allLogsCache);

            }

            if (typeof fetchDoorHistoryLogs === 'function') fetchDoorHistoryLogs(currentSelectedActivityMac);

        } else if (tabName === 'logs') {

            if (viewLogs) viewLogs.classList.remove("hidden");

            if (typeof populateActivityDoorFilter === 'function') populateActivityDoorFilter();

            if (typeof fetchDoorHistoryLogs === 'function') fetchDoorHistoryLogs(currentSelectedActivityMac);

        } else if (tabName === 'devices') {

            if (viewDevices) viewDevices.classList.remove("hidden");

            if (typeof loadDatabaseDevicesList === 'function') loadDatabaseDevicesList();

        } else if (tabName === 'users') {

            if (viewUsers) viewUsers.classList.remove("hidden");

            if (typeof loadSystemUsersList === 'function') loadSystemUsersList();

        } else if (tabName === 'account') {

            if (viewAccount) viewAccount.classList.remove("hidden");

            if (typeof renderAccountPage === 'function') renderAccountPage();

        } else if (tabName === 'database') {

            if (viewDatabase) viewDatabase.classList.remove("hidden");

            if (typeof initDatabaseStudio === 'function') initDatabaseStudio();

        }

        if (window.lucide && typeof lucide.createIcons === 'function') {

            lucide.createIcons();

        }

    }

    // -------------------------------------------------------------

    // Sidebar Fold / Unfold Collapse Controls

    // -------------------------------------------------------------

    function toggleSidebarCollapse(forcedState = null) {

        const body = document.body;

        const isCollapsed = forcedState !== null ? forcedState : !body.classList.contains('sidebar-collapsed');

        if (isCollapsed) {

            body.classList.add('sidebar-collapsed');

        } else {

            body.classList.remove('sidebar-collapsed');

        }

        try {

            localStorage.setItem('smartdoor_sidebar_collapsed', isCollapsed ? '1' : '0');

        } catch (e) { }

        const foldButtons = document.querySelectorAll('#btn-sidebar-fold, #btn-topbar-sidebar-toggle');

        foldButtons.forEach(btn => {

            btn.style.transition = 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)';

            btn.style.transform = 'scale(0.86) rotate(-14deg)';

            setTimeout(() => {

                btn.innerHTML = '<i data-lucide="panel-left"></i>';

                btn.title = isCollapsed ? 'Unfold Sidebar (Ctrl+\\)' : 'Fold Sidebar (Ctrl+\\)';

                if (window.lucide && lucide.createIcons) {

                    lucide.createIcons({ el: btn });

                }

                btn.style.transform = 'scale(1) rotate(0deg)';

            }, 120);

        });

        // Resize trigger for SVG canvas and charts after fluid sidebar morphing completes

        clearTimeout(window._sidebarResizeTimer);

        window._sidebarResizeTimer = setTimeout(() => {

            if (typeof renderPlan === 'function') renderPlan();

        }, 380);

    }

    // Auto-restore sidebar state on page load

    try {

        if (localStorage.getItem('smartdoor_sidebar_collapsed') === '1') {

            document.body.classList.add('sidebar-collapsed');

            const foldButtons = document.querySelectorAll('#btn-sidebar-fold, #btn-topbar-sidebar-toggle');

            foldButtons.forEach(btn => {

                btn.innerHTML = '<i data-lucide="panel-left"></i>';

                btn.title = 'Unfold Sidebar (Ctrl+\\)';

            });

        }

    } catch (e) { }

    // =============================================================

    // APPLE DESIGN SYSTEM: Dynamic System Colors & Trait Collection Engine

    // UIKit / SwiftUI Trait Collection Tracking + Core Animation Physics

    // =============================================================

    const SmartDoorTraitCollection = (function () {

        let _mode = 'system'; // 'system' | 'dark' | 'light'

        let _activeScheme = 'light';

        let _contrast = 'normal'; // 'normal' | 'high'

        let _lastClickTime = 0;

        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const contrastQuery = window.matchMedia('(prefers-contrast: more)');

        function init() {

            try {

                _mode = localStorage.getItem('smartdoor_theme_mode') || 'system';

                if (!localStorage.getItem('smartdoor_theme_mode') && localStorage.getItem('smartdoor_theme')) {

                    _mode = localStorage.getItem('smartdoor_theme');

                }

            } catch (e) {

                _mode = 'system';

            }

            resolveActiveScheme();

            applyTraitCollection(false);

            // 1. UIKit / SwiftUI Trait Collection Tracking: Listen to OS Color Scheme in Real-Time

            try {

                if (colorSchemeQuery.addEventListener) {

                    colorSchemeQuery.addEventListener('change', onSystemTraitChange);

                } else if (colorSchemeQuery.addListener) {

                    colorSchemeQuery.addListener(onSystemTraitChange);

                }

            } catch (e) { }

            // 2. Accessibility Trait Tracking: High Contrast Trait

            try {

                if (contrastQuery.addEventListener) {

                    contrastQuery.addEventListener('change', onContrastTraitChange);

                } else if (contrastQuery.addListener) {

                    contrastQuery.addListener(onContrastTraitChange);

                }

            } catch (e) { }

            // 3. Cross-Tab Real-Time Trait Synchronization

            window.addEventListener('storage', (e) => {

                if (e.key === 'smartdoor_theme_mode' || e.key === 'smartdoor_theme') {

                    _mode = localStorage.getItem('smartdoor_theme_mode') || 'system';

                    resolveActiveScheme();

                    applyTraitCollection(true);

                }

            });

            // 4. Keyboard Shortcut: 'S' for System Trait Auto-Sync

            window.addEventListener('keydown', (e) => {

                if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

                if (e.key === 's' || e.key === 'S') {

                    setAppearanceMode('system');

                }

            });

        }

        function onSystemTraitChange(e) {

            if (_mode === 'system') {

                resolveActiveScheme();

                applyTraitCollection(true);

                showAppleAppearanceHUD('System Trait Updated', _activeScheme === 'dark' ? 'moon' : 'sun', 'System Auto');

            }

        }

        function onContrastTraitChange(e) {

            _contrast = e.matches ? 'high' : 'normal';

            document.documentElement.setAttribute('data-contrast', _contrast);

        }

        function resolveActiveScheme() {

            if (_mode === 'dark') {

                _activeScheme = 'dark';

            } else if (_mode === 'light') {

                _activeScheme = 'light';

            } else {

                // 'system': Strictly observe macOS/iOS/Windows UITraitCollection

                _activeScheme = colorSchemeQuery.matches ? 'dark' : 'light';

            }

        }

        function applyTraitCollection(animate = true, clickEvent = null) {

            const html = document.documentElement;

            const previousScheme = html.getAttribute('data-theme');

            const isSchemeChanged = previousScheme !== _activeScheme;

            const updateDOM = () => {

                html.setAttribute('data-theme', _activeScheme);

                html.setAttribute('data-theme-mode', _mode);

                html.setAttribute('data-contrast', contrastQuery.matches ? 'high' : 'normal');

                // Dynamic System Color: update meta theme-color for iOS/Android status bar

                const metaTheme = document.querySelector('meta[name="theme-color"]');

                if (metaTheme) {

                    metaTheme.setAttribute('content', _activeScheme === 'dark' ? '#0F1117' : '#FFFFFF');

                }

                // Smoothly update Toggle Icon & Auto Badge

                updateToggleIcons(_activeScheme, _mode);

            };

            if (!animate || !isSchemeChanged) {

                updateDOM();

                dispatchTraitEvent();

                return;

            }

            // Continuous Synchronized Color Cross-Fade (Zero flipping, Zero jank)

            // Universal GPU deceleration curve cubic-bezier(0.25, 1, 0.5, 1) over 0.38s

            html.classList.add('theme-color-fade');

            updateDOM();

            clearTimeout(window._themeFadeTimeout);

            window._themeFadeTimeout = setTimeout(() => {

                html.classList.remove('theme-color-fade');

            }, 420);

            dispatchTraitEvent();

        }

        function dispatchTraitEvent() {

            try {

                window.dispatchEvent(new CustomEvent('smartdoor:traitCollectionDidChange', {

                    detail: {

                        mode: _mode,

                        activeScheme: _activeScheme,

                        contrast: _contrast,

                        isSystem: _mode === 'system'

                    }

                }));

            } catch (e) { }

        }

        function updateToggleIcons(scheme, mode) {

            const isDark = scheme === 'dark';

            const isAuto = mode === 'system';

            ['dark-mode-icon', 'mob-dark-icon'].forEach(id => {

                const el = document.getElementById(id);

                if (el) {

                    el.style.transition = 'opacity 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';

                    el.style.opacity = '0';

                    el.style.transform = 'rotate(-35deg) scale(0.7)';

                    setTimeout(() => {

                        el.setAttribute('data-lucide', isDark ? 'sun' : 'moon');

                        if (window.lucide && lucide.createIcons) {

                            lucide.createIcons({ el: el.parentElement });

                        }

                        const freshEl = document.getElementById(id);

                        if (freshEl) {

                            freshEl.style.transition = 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';

                            freshEl.style.opacity = '1';

                            freshEl.style.transform = 'rotate(0deg) scale(1)';

                        }

                    }, 180);

                }

            });

            // Trigger Spring Animation on toggle button

            ['dark-mode-toggle', 'mob-dark-mode-toggle'].forEach(btnId => {

                const btn = document.getElementById(btnId);

                if (btn) {

                    btn.classList.remove('ca-spring-trigger');

                    void btn.offsetWidth;

                    btn.classList.add('ca-spring-trigger');

                }

            });

            // Trait Auto Dot Indicator

            ['dark-mode-auto-dot', 'mob-dark-auto-dot'].forEach(dotId => {

                const dot = document.getElementById(dotId);

                if (dot) {

                    if (isAuto) {

                        dot.classList.remove('hidden');

                    } else {

                        dot.classList.add('hidden');

                    }

                }

            });

        }

        function toggle(event) {

            const now = Date.now();

            // Double-click / double-tap or Alt/Option click switches to System Trait Auto-Sync

            if ((event && event.altKey) || (now - _lastClickTime < 360)) {

                _lastClickTime = 0;

                setAppearanceMode('system', event);

                return;

            }

            _lastClickTime = now;

            // Core Haptics: Tactile feedback on touch

            if (navigator.vibrate) {

                try { navigator.vibrate(14); } catch (e) { }

            }

            // Toggle between Dark and Light

            const targetScheme = _activeScheme === 'dark' ? 'light' : 'dark';

            _mode = targetScheme;

            _activeScheme = targetScheme;

            try {

                localStorage.setItem('smartdoor_theme_mode', _mode);

                localStorage.setItem('smartdoor_theme', _activeScheme);

            } catch (e) { }

            applyTraitCollection(true, event);

            showAppleAppearanceHUD(

                targetScheme === 'dark' ? 'Dark Mode' : 'Light Mode',

                targetScheme === 'dark' ? 'moon' : 'sun',

                'Manual'

            );

        }

        function setAppearanceMode(mode, event = null) {

            _mode = mode;

            resolveActiveScheme();

            try {

                localStorage.setItem('smartdoor_theme_mode', _mode);

                localStorage.setItem('smartdoor_theme', _activeScheme);

            } catch (e) { }

            applyTraitCollection(true, event);

            if (navigator.vibrate) {

                try { navigator.vibrate([10, 30, 15]); } catch (e) { }

            }

            showAppleAppearanceHUD(

                _mode === 'system' ? 'System Trait Sync' : (_mode === 'dark' ? 'Dark Mode' : 'Light Mode'),

                _mode === 'system' ? 'laptop' : (_activeScheme === 'dark' ? 'moon' : 'sun'),

                _mode === 'system' ? 'Auto (macOS/iOS)' : 'Locked'

            );

        }

        function showAppleAppearanceHUD(title, iconName, badgeText) {

            let hud = document.getElementById('apple-appearance-hud');

            if (!hud) {

                hud = document.createElement('div');

                hud.id = 'apple-appearance-hud';

                hud.className = 'apple-appearance-hud';

                document.body.appendChild(hud);

            }

            hud.innerHTML = `

                <div class="apple-appearance-hud-icon">

                    <i data-lucide="${iconName || 'sun'}" style="width: 13px; height: 13px;"></i>

                </div>

                <span>${title}</span>

                <span class="apple-appearance-hud-badge">${badgeText || 'Auto'}</span>

            `;

            if (window.lucide && lucide.createIcons) {

                lucide.createIcons({ el: hud });

            }

            hud.classList.remove('visible');

            void hud.offsetWidth; // Reflow

            hud.classList.add('visible');

            clearTimeout(hud._timer);

            hud._timer = setTimeout(() => {

                hud.classList.remove('visible');

            }, 1900);

        }

        return {

            init,

            toggle,

            setAppearanceMode,

            getMode: () => _mode,

            getActiveScheme: () => _activeScheme,

            isSystem: () => _mode === 'system'

        };

    })();

    // Global toggleDarkMode hook

    function toggleDarkMode(event) {

        SmartDoorTraitCollection.toggle(event);

    }

    // =============================================================

    // ENHANCEMENT: Last-Sync Timestamp

    // =============================================================

    let _lastSyncTime = null;

    function updateLastSyncNow() {

        _lastSyncTime = new Date();

        refreshLastSyncLabel();

    }

    function refreshLastSyncLabel() {

        const el = document.getElementById('last-sync-label');

        if (!el || !_lastSyncTime) return;

        const diff = Math.round((Date.now() - _lastSyncTime.getTime()) / 1000);

        if (diff < 5) el.textContent = 'Just now';

        else if (diff < 60) el.textContent = `${diff}s ago`;

        else if (diff < 3600) el.textContent = `${Math.floor(diff / 60)}m ago`;

        else el.textContent = `${Math.floor(diff / 3600)}h ago`;

    }

    // Update last-sync label every 5 seconds

    setInterval(refreshLastSyncLabel, 5000);

    // Patch the existing poll function to call updateLastSyncNow

    const _origPollStatus = typeof pollStatus === 'function' ? pollStatus : null;

    if (_origPollStatus) {

        window._patchedPollStatus = function () {

            _origPollStatus();

            updateLastSyncNow();

        };

        // Override setInterval calls by hooking document ready

        setTimeout(() => { updateLastSyncNow(); }, 1500);

    }

    // =============================================================

    // ENHANCEMENT: Notification Count Badge

    // =============================================================

    function updateNotifCountBadge(count) {

        const dot = document.getElementById('notif-dot');

        const badge = document.getElementById('notif-count-badge');

        if (!badge) return;

        if (count > 0) {

            if (dot) dot.classList.add('hidden');

            badge.textContent = count > 99 ? '99+' : count;

            badge.classList.remove('hidden');

        } else {

            if (dot) dot.classList.add('hidden');

            badge.classList.add('hidden');

        }

    }

    // =============================================================

    // ENHANCEMENT: Session Uptime Counter

    // =============================================================

    const _sessionStart = Date.now();

    function updateUptimeDisplay() {

        const el = document.getElementById('right-uptime-val');

        if (!el) return;

        const elapsed = Math.floor((Date.now() - _sessionStart) / 1000);

        const h = Math.floor(elapsed / 3600).toString().padStart(2, '0');

        const m = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');

        const s = (elapsed % 60).toString().padStart(2, '0');

        el.textContent = `${h}:${m}:${s}`;

    }

    setInterval(updateUptimeDisplay, 1000);

    // =============================================================

    // ENHANCEMENT: Last Event Widget Updater

    // =============================================================

    function updateLastEventWidget(doorName, state, timestamp) {

        const nameEl = document.getElementById('last-event-door') || document.getElementById('right-last-event-name');

        const timeEl = document.getElementById('last-event-time') || document.getElementById('right-last-event-time');

        if (!nameEl || !timeEl) return;

        const isStateOpen = state === 'open' || state === 'OPEN';

        const stateColor = isStateOpen ? '#EF4444' : '#10B981';

        nameEl.innerHTML = `<span style="color:${stateColor}; font-weight:600;">${state?.toUpperCase() || '—'}</span> — ${doorName || 'Sensor'}`;

        const d = timestamp ? new Date(timestamp) : new Date();

        timeEl.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        if (typeof updateLastSyncNow === 'function') updateLastSyncNow();

        const widget = document.getElementById('right-last-event-widget');
        if (widget) {
            widget.classList.remove('event-flash');
            void widget.offsetWidth;
            widget.classList.add('event-flash');
        }

    }

    // =============================================================

    // ENHANCEMENT: Sensor Tooltip Popover

    // =============================================================

    let _tooltipTarget = null;

    function showSensorTooltip(el, sensorData) {
        const tip = document.getElementById('sensor-tooltip-popover');
        if (!tip || !sensorData) return;

        _tooltipTarget = el;

        const nameEl = document.getElementById('tt-sensor-name') || document.getElementById('tip-sensor-name');
        const macEl = document.getElementById('tt-sensor-mac');
        const battEl = document.getElementById('tt-sensor-battery');
        const timeEl = document.getElementById('tt-sensor-time');
        const stateEl = document.getElementById('tt-sensor-state');
        const dotEl = document.getElementById('tt-pulse-dot');
        const detailEl = document.getElementById('tip-sensor-detail');

        const isOpen = (sensorData.state || '').toLowerCase() === 'open';

        if (nameEl) nameEl.textContent = sensorData.name || 'Unknown Sensor';
        if (macEl) macEl.textContent = sensorData.mac || '—';
        if (battEl) battEl.textContent = sensorData.battery !== undefined ? `${sensorData.battery}%` : '—';
        if (timeEl) timeEl.textContent = sensorData.lastSeen || '—';
        if (stateEl) {
            stateEl.textContent = (sensorData.state || 'CLOSED').toUpperCase();
            stateEl.style.color = isOpen ? 'var(--red)' : 'var(--green)';
        }
        if (dotEl) {
            dotEl.className = isOpen ? 'live-pulse-dot dot-red' : 'live-pulse-dot';
        }
        if (detailEl) {
            detailEl.textContent = `${sensorData.mac || ''} • ${sensorData.battery || 100}% • ${sensorData.state || 'CLOSED'}`;
        }

        const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : { right: 200, top: 200 };
        tip.style.left = `${Math.min(rect.right + 10, window.innerWidth - 280)}px`;
        tip.style.top = `${Math.max(rect.top - 10, 10)}px`;
        tip.classList.add('visible');

        if (window.lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons({ el: tip });
        }
    }
    window.showSensorTooltip = showSensorTooltip;

    function hideSensorTooltip() {

        const tip = document.getElementById('sensor-tooltip-popover');

        if (tip) tip.classList.remove('visible');

        _tooltipTarget = null;

    }

    document.addEventListener('click', (e) => {

        const tip = document.getElementById('sensor-tooltip-popover');

        if (tip && tip.classList.contains('visible') && !tip.contains(e.target) && e.target !== _tooltipTarget) {

            hideSensorTooltip();

        }

    });

    // =============================================================

    // ENHANCEMENT: Keyboard Shortcuts (D / A / U)

    // =============================================================

    document.addEventListener('keydown', (e) => {

        // Skip if typing in input/textarea

        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

        // Skip if modal is open

        if (document.querySelector('.modal-overlay:not(.hidden), .login-splash:not(.hidden)')) return;

        switch (e.key.toLowerCase()) {

            case 'd': switchMainTab('dashboard'); break;

            case 'f': switchMainTab('floorplan'); break;

            case 'a': switchMainTab('activity'); break;

            case 'l': switchMainTab('logs'); break;

            case 'c': switchMainTab('devices'); break;

            case 'u': switchMainTab('users'); break;

            case 'p': switchMainTab('account'); break;
            case 'm': switchMainTab('database'); break;

            case 'e':

                if (typeof setMode === 'function') {

                    const isEdit = document.getElementById('btn-mode-edit')?.classList.contains('active');

                    setMode(isEdit ? 'monitor' : 'edit');

                }

                break;

            case 'escape': hideSensorTooltip(); break;

        }

    });

    // =============================================================

    // ENHANCEMENT: PWA Install Banner

    // =============================================================

    let _pwaInstallEvent = null;

    window.addEventListener('beforeinstallprompt', (e) => {

        e.preventDefault();

        _pwaInstallEvent = e;

        // Show banner after 8 seconds if user hasn't dismissed

        try {

            if (!localStorage.getItem('smartdoor_pwa_dismissed')) {

                setTimeout(() => {

                    const banner = document.getElementById('pwa-install-banner');

                    if (banner) { banner.classList.add('visible'); lucide.createIcons({ el: banner }); }

                }, 8000);

            }

        } catch (e2) { }

    });

    function triggerPwaInstall() {

        if (_pwaInstallEvent) {

            _pwaInstallEvent.prompt();

            _pwaInstallEvent.userChoice.then(() => { dismissPwaBanner(); });

        }

    }

    function dismissPwaBanner() {

        const banner = document.getElementById('pwa-install-banner');

        if (banner) banner.classList.remove('visible');

        try { localStorage.setItem('smartdoor_pwa_dismissed', '1'); } catch (e) { }

    }

    // =============================================================

    // Init: Trait Collection & System Monitors

    // =============================================================

    document.addEventListener('DOMContentLoaded', () => {

        SmartDoorTraitCollection.init();

        updateLastSyncNow();

        updateUptimeDisplay();



        if (typeof setupPullToRefresh === 'function') setupPullToRefresh();

        if (typeof setupSwipeTabs === 'function') setupSwipeTabs();

        if (typeof updateAccountThemeDisplay === 'function') updateAccountThemeDisplay();

        // Global Tactile Micro-Feedback Interaction Engine
        document.addEventListener('pointerdown', (e) => {
            const target = e.target.closest('.btn, button:not([disabled]), .nav-item, .acc-nav-tile, .mac-badge-chip, .date-chip, .tab-btn, .modal-tab-btn, .mobile-nav-tab, .account-pill-action');
            if (!target) return;
            target.classList.add('tactile-pressed');
            const removePress = () => {
                target.classList.remove('tactile-pressed');
                window.removeEventListener('pointerup', removePress);
                window.removeEventListener('pointercancel', removePress);
            };
            window.addEventListener('pointerup', removePress, { once: true });
            window.addEventListener('pointercancel', removePress, { once: true });
        }, { passive: true });

    });

    /* === Mobile Touch & Account Management Engine === */

    let _mobLastSyncTime = null;

    // Mobile & Account feature: triggerHaptic

    function triggerHaptic(type = 'light') {

        if (!window.navigator || !window.navigator.vibrate) return;

        try {

            if (type === 'light') window.navigator.vibrate(12);

            else if (type === 'medium') window.navigator.vibrate(28);

            else if (type === 'warning') window.navigator.vibrate([40, 50, 40]);

            else if (type === 'alarm') window.navigator.vibrate([100, 60, 100, 60, 120]);

        } catch (e) { }

    }

    // Mobile & Account feature: toggleGroupAccordion

    function toggleGroupAccordion(headerEl, event) {

        if (event) event.stopPropagation();

        const card = headerEl.closest('.log-group-card');

        if (!card) return;

        const body = card.querySelector('.log-group-body');

        const chevron = headerEl.querySelector('.group-header-chevron');

        if (!body) return;

        body.classList.remove('hidden');

        const isCollapsed = body.classList.toggle('collapsed');

        if (chevron) chevron.classList.toggle('open', !isCollapsed);

    }

    // Mobile & Account feature: toggleSubrowDetail

    function toggleSubrowDetail(btn, event) {

        if (event) event.stopPropagation();

        const item = btn.closest('.log-group-item');

        if (!item) return;

        const drawer = item.querySelector('.subrow-detail-drawer');

        if (!drawer) return;

        const isHidden = drawer.classList.contains('hidden');

        drawer.classList.toggle('hidden', !isHidden);

        btn.classList.toggle('open', isHidden);

    }

    // Mobile & Account feature: renderAccountPage

    function renderAccountPage() {

        fetch('/api/users')

            .then(res => res.json())

            .then(data => {

                const u = data.current_user;

                const authPanel = document.getElementById("account-auth-panel");

                const guestPanel = document.getElementById("account-guest-panel");

                if (u && u.is_authenticated) {

                    if (authPanel) authPanel.classList.remove("hidden");

                    if (guestPanel) guestPanel.classList.add("hidden");

                    const initial = u.username.charAt(0).toUpperCase();

                    const avatar = document.getElementById("acc-avatar-large");

                    const name = document.getElementById("acc-display-username");

                    const email = document.getElementById("acc-display-email");

                    const roleText = document.getElementById("acc-role-text");

                    const rolePill = document.getElementById("acc-role-pill");

                    const authLevel = document.getElementById("acc-auth-level-text");

                    const dateJoined = document.getElementById("acc-date-joined");

                    if (avatar) avatar.textContent = initial;

                    if (name) name.textContent = u.username;

                    if (email) email.textContent = u.email || `${u.username}@smartdoor.local`;

                    const isAdmin = u.is_superuser;

                    if (roleText) roleText.textContent = isAdmin ? "ADMINISTRATOR" : "OPERATOR";

                    if (rolePill) {

                        rolePill.style.background = isAdmin ? "var(--blue-alpha)" : "rgba(16, 185, 129, 0.12)";

                        rolePill.style.color = isAdmin ? "var(--blue)" : "var(--green)";

                    }

                    if (authLevel) {

                        authLevel.textContent = isAdmin

                            ? "Superuser Session \u2022 Full Access"

                            : "Standard Operator \u2022 Telemetry Access";

                    }

                    if (data.users && dateJoined) {

                        const match = data.users.find(x => x.username === u.username);

                        if (match && match.date_joined) {

                            dateJoined.textContent = `Member since ${match.date_joined}`;

                        }

                    }

                    updateAccountThemeDisplay();

                } else {

                    if (authPanel) authPanel.classList.add("hidden");

                    if (guestPanel) guestPanel.classList.remove("hidden");

                    switchAccountTab('login');

                }

                lucide.createIcons();

            })

            .catch(() => {

                const authPanel = document.getElementById("account-auth-panel");

                const guestPanel = document.getElementById("account-guest-panel");

                if (authPanel) authPanel.classList.add("hidden");

                if (guestPanel) guestPanel.classList.remove("hidden");

                lucide.createIcons();

            });

    }

    // Mobile & Account feature: switchAccountTab

    function switchAccountTab(tab) {

        const btnLogin = document.getElementById("acc-tab-login");

        const btnReg = document.getElementById("acc-tab-register");

        const formLogin = document.getElementById("account-login-form");

        const formReg = document.getElementById("account-register-form");

        const err = document.getElementById("account-error-msg");

        if (err) { err.classList.remove("show"); err.textContent = ""; }

        if (tab === 'register') {

            if (btnLogin) btnLogin.classList.remove("active");

            if (btnReg) btnReg.classList.add("active");

            if (formLogin) formLogin.classList.add("hidden");

            if (formReg) formReg.classList.remove("hidden");

        } else {

            if (btnLogin) btnLogin.classList.add("active");

            if (btnReg) btnReg.classList.remove("active");

            if (formLogin) formLogin.classList.remove("hidden");

            if (formReg) formReg.classList.add("hidden");

        }

        lucide.createIcons();

    }

    // Mobile & Account feature: switchAccountInline

    function switchAccountInline() {

        const authPanel = document.getElementById("account-auth-panel");

        const guestPanel = document.getElementById("account-guest-panel");

        if (authPanel) authPanel.classList.add("hidden");

        if (guestPanel) guestPanel.classList.remove("hidden");

        switchAccountTab('login');

        lucide.createIcons();

    }

    // Mobile & Account feature: performAccountPageLogin

    function performAccountPageLogin() {

        const uname = document.getElementById("acc-input-username")?.value?.trim();

        const pwd = document.getElementById("acc-input-password")?.value;

        const err = document.getElementById("account-error-msg");

        const btn = document.getElementById("acc-login-btn");

        if (err) { err.classList.remove("show"); err.textContent = ""; }

        if (!uname || !pwd) {

            if (err) { err.textContent = "Username and password are required."; err.classList.add("show"); }

            return;

        }

        if (btn) btn.classList.add("loading");

        fetch('/api/login', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ username: uname, password: pwd })

        })

            .then(res => res.json())

            .then(data => {

                if (btn) btn.classList.remove("loading");

                if (data.status === 'success') {

                    showToast(`Welcome back, @${data.username}!`, "success");

                    appState.isAuthenticated = true;

                    fetchUserInfo();

                    renderAccountPage();

                } else {

                    if (err) { err.textContent = data.message || "Invalid username or password."; err.classList.add("show"); }

                }

            })

            .catch(() => {

                if (btn) btn.classList.remove("loading");

                if (err) { err.textContent = "Cannot connect to server. Please try again."; err.classList.add("show"); }

            });

    }

    // Mobile & Account feature: performAccountPageRegister

    function performAccountPageRegister() {

        const uname = document.getElementById("acc-reg-username")?.value?.trim();

        const email = document.getElementById("acc-reg-email")?.value?.trim();

        const pwd = document.getElementById("acc-reg-password")?.value;

        const err = document.getElementById("account-error-msg");

        const btn = document.getElementById("acc-register-btn");

        if (err) { err.classList.remove("show"); err.textContent = ""; }

        if (!uname || !pwd) {

            if (err) { err.textContent = "Username and password are required."; err.classList.add("show"); }

            return;

        }

        if (btn) btn.classList.add("loading");

        fetch('/api/register', {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ username: uname, email: email || '', password: pwd })

        })

            .then(res => res.json())

            .then(data => {

                if (btn) btn.classList.remove("loading");

                if (data.status === 'success') {

                    showToast(`Account created for @${data.username}!`, "success");

                    appState.isAuthenticated = true;

                    fetchUserInfo();

                    renderAccountPage();

                } else {

                    if (err) { err.textContent = data.message || "Registration failed."; err.classList.add("show"); }

                }

            })

            .catch(() => {

                if (btn) btn.classList.remove("loading");

                if (err) { err.textContent = "Cannot connect to server. Please try again."; err.classList.add("show"); }

            });

    }

    // Mobile & Account feature: updateAccountThemeDisplay

    function updateAccountThemeDisplay() {

        const themeLabel = document.getElementById("acc-theme-label");

        const themeIcon = document.getElementById("acc-theme-icon");

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (themeLabel) themeLabel.textContent = isDark ? "Dark Appearance \u2022 Tap to switch" : "Light Appearance \u2022 Tap to switch";

        if (themeIcon) {

            themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');

            if (themeIcon.parentElement) lucide.createIcons({ el: themeIcon.parentElement });

        }

    }

    // Mobile & Account feature: toggleAddUserCollapse

    function toggleAddUserCollapse() {

        const body = document.getElementById("add-user-body");

        const chevron = document.getElementById("add-user-chevron");

        if (!body) return;

        body.classList.remove("hidden");

        const isCollapsed = body.classList.toggle("collapsed");

        if (chevron) {

            chevron.style.transform = isCollapsed ? "rotate(0deg)" : "rotate(180deg)";

        }

    }

    // Mobile & Account feature: updateMobileLastSyncNow

    function updateMobileLastSyncNow() {

        _mobLastSyncTime = new Date();

        refreshMobileLastSyncLabel();

        const chip = document.getElementById('mobile-sync-chip');

        if (chip) chip.style.display = 'flex';

    }

    // Mobile & Account feature: refreshMobileLastSyncLabel

    function refreshMobileLastSyncLabel() {

        const el = document.getElementById('mobile-last-sync-label');

        if (!el || !_mobLastSyncTime) return;

        const diff = Math.round((Date.now() - _mobLastSyncTime.getTime()) / 1000);

        if (diff < 5) el.textContent = 'Just now';

        else if (diff < 60) el.textContent = `${diff}s ago`;

        else if (diff < 3600) el.textContent = `${Math.floor(diff / 60)}m ago`;

        else el.textContent = `${Math.floor(diff / 3600)}h ago`;

    }

    // Mobile & Account feature: setupPullToRefresh

    function setupPullToRefresh() {

        const THRESHOLD = 60;

        let startY = 0, isPulling = false, indicator = null;

        document.addEventListener('touchstart', (e) => {

            const scrollEl = document.querySelector('.mobile-content-scroll:not(.hidden), .mobile-logs-scroll-area:not(.hidden)');

            if (!scrollEl || scrollEl.scrollTop > 0) return;

            startY = e.touches[0].clientY;

            isPulling = true;

        }, { passive: true });

        document.addEventListener('touchmove', (e) => {

            if (!isPulling) return;

            const delta = e.touches[0].clientY - startY;

            if (delta < 20) return;

            // Find the indicator in the active view

            const activeView = document.querySelector('.mobile-view-container:not(.hidden)');

            indicator = activeView ? activeView.querySelector('.pull-refresh-indicator') : null;

            if (indicator && delta > THRESHOLD) {

                indicator.classList.add('pulling');

            }

        }, { passive: true });

        document.addEventListener('touchend', () => {

            if (!isPulling) return;

            isPulling = false;

            if (indicator && indicator.classList.contains('pulling')) {

                indicator.classList.remove('pulling');

                // Trigger refresh for current tab

                if (typeof pollStatus === 'function') { pollStatus(); updateMobileLastSyncNow(); }

                const activeActivity = document.getElementById('view-activity-page');

                if (activeActivity && !activeActivity.classList.contains('hidden')) {

                    fetchDoorHistoryLogs(currentSelectedActivityMac, true);

                }

                const activeLogs = document.getElementById('view-logs-page');

                if (activeLogs && !activeLogs.classList.contains('hidden')) {

                    fetchDoorHistoryLogs(currentSelectedActivityMac, true);

                }

                const activeDevices = document.getElementById('view-devices-page');

                if (activeDevices && !activeDevices.classList.contains('hidden')) {

                    loadDatabaseDevicesList(true);

                }

                const activeUsers = document.getElementById('view-users-page');

                if (activeUsers && !activeUsers.classList.contains('hidden')) {

                    loadSystemUsersList();

                }

            }

            indicator = null;

        });

    }

    // Mobile & Account feature: setupSwipeTabs

    function setupSwipeTabs() {

        const tabs = ['dashboard', 'activity', 'logs', 'devices', 'users', 'account'];

        let startX = 0, startTime = 0;

        document.addEventListener('touchstart', (e) => {

            startX = e.touches[0].clientX;

            startTime = Date.now();

        }, { passive: true });

        document.addEventListener('touchend', (e) => {

            const deltaX = e.changedTouches[0].clientX - startX;

            const elapsed = Date.now() - startTime;

            // Only register fast horizontal swipes (not scroll)

            if (Math.abs(deltaX) < 60 || elapsed > 400) return;

            // Find current active tab

            const activeTab = tabs.find(t => {

                const nav = document.getElementById(`mob-nav-${t}`);

                return nav && nav.classList.contains('active');

            }) || 'dashboard';

            const idx = tabs.indexOf(activeTab);

            if (deltaX < 0 && idx < tabs.length - 1) {

                // Swipe left → next tab

                switchMainTab(tabs[idx + 1]);

            } else if (deltaX > 0 && idx > 0) {

                // Swipe right → previous tab

                switchMainTab(tabs[idx - 1]);

            }

        });

    }

    // Mobile & Account feature: dismissMobilePwaBanner

    function dismissMobilePwaBanner() {

        const b = document.getElementById('mobile-pwa-banner');

        if (b) b.classList.remove('visible');

        try { localStorage.setItem('smartdoor_pwa_dismissed', '1'); } catch (e) { }

    }

    // =========================================================================
    // UNIFIED CAMPUS 3D & CLICK-TO-ENTER INTERIOR ENGINE (PRESERVE-3D)
    // =========================================================================
    const W = 788, D = 468, WH = 70, FH = 56;
    const $ = id => document.getElementById(id);

    const OVER = { rx: 58, rz: -34, zoom: 0.62, cx: 520, cy: 200, cz: 0 };
    const IN = { rx: 56, rz: -34, zoom: 1.05, cx: 394, cy: 234, cz: 35 };

    const cam = { rx: 58, rz: -34, zoom: 0.62, cx: 520, cy: 200, cz: 0 };
    const EASE = {
        io: k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
        in: k => k * k * k,
        out: k => 1 - Math.pow(1 - k, 4)
    };

    let busy = false, auto = false, drag = false, lx = 0, ly = 0, moved = 0, vx = 0;
    let cur = 0, sel = null, nF = 3, bld = null;
    let campusEngineInit = false;
    let B = [], env = null;

    // Master Architectural Floor Plans
    const F_MASTER = [
        {
            id: 'GF', name: 'Ground Floor', sub: 'LOADING & DISPATCH',
            rooms: [
                { n: 'Main Loading Bay', x: 0, y: 0, w: 467, h: 468, ok: 1, m: [['Cameras', '6 online'], ['Occupancy', '4 people'], ['Status', 'Normal']] },
                { n: 'Cold Storage Vault', x: 470, y: 0, w: 318, h: 234, ok: 1, m: [['Temperature', '−18 °C'], ['Cameras', '3 online'], ['Status', 'Normal']] },
                { n: 'Dispatch Office', x: 470, y: 237, w: 318, h: 231, ok: 0, m: [['Cameras', '2 online'], ['Occupancy', '2 people'], ['Status', 'Window sensor active']] }
            ],
            walls: [
                [0, 0, W, 6],
                [0, 462, 590, 6],
                [590, 462, 75, 6, WH, 1], // Dispatch Window glass
                [665, 462, 123, 6],
                [0, 0, 6, 214],
                // Door opening y=214..254 for Garage Entry
                [0, 254, 6, 214],
                [782, 0, 6, 468],
                [464, 0, 6, 337],
                // Door opening y=337..377 for Back Garden Gate
                [464, 377, 6, 91],
                [470, 231, 312, 6]
            ],
            dev: [
                [3, 234, 'Garage Entry', 0, 'Y', 40],
                [467, 357, 'Back Garden Gate', 0, 'Y', 40],
                [627, 465, 'Dispatch Window', 1, 'X', 75, true]
            ],
            props: [] // All furniture props removed for crystal clear architectural telemetry
        },
        {
            id: '1F', name: 'First Floor', sub: 'OPERATIONS & OFFICES',
            rooms: [
                { n: 'Control Room', x: 0, y: 0, w: 297, h: 234, ok: 1, m: [['Operators', '3 on shift'], ['Screens', '8 active'], ['Status', 'Normal']] },
                { n: 'Server Room', x: 0, y: 237, w: 297, h: 231, ok: 1, m: [['Temperature', '21 °C'], ['Racks', '5 online'], ['Status', 'Normal']] },
                { n: 'Open Office', x: 303, y: 0, w: 485, h: 300, ok: 1, m: [['Occupancy', '12 people'], ['Cameras', '4 online'], ['Status', 'Normal']] },
                { n: 'Meeting Room', x: 303, y: 306, w: 485, h: 162, ok: 0, m: [['Booking', 'Busy until 3 PM'], ['Occupancy', '6 people'], ['Status', 'Door held open']] }
            ],
            walls: [
                [0, 0, W, 6],
                [0, 462, W, 6],
                [0, 0, 6, 468],
                [782, 0, 6, 200],
                [782, 200, 6, 60, WH, 1], // Right glass window
                [782, 260, 6, 208],
                [300, 0, 6, 100],
                // Door opening y=100..140 for Control Room Door
                [300, 140, 6, 190],
                // Corridor opening y=330..370
                [300, 370, 6, 98],
                [0, 231, 120, 6],
                // Door opening x=120..160 for Server Room Access Door
                [160, 231, 140, 6],
                [306, 300, 194, 6],
                // Door opening x=500..540 for Meeting Door
                [540, 300, 242, 6]
            ],
            dev: [
                [300, 120, 'Control Room Door', 0, 'Y', 40],
                [140, 234, 'Server Room Access', 0, 'X', 40],
                [520, 303, 'Meeting Door', 1, 'X', 40, false, true] // Glass Meeting Door
            ],
            props: []
        },
        {
            id: '2F', name: 'Second Floor', sub: 'EXECUTIVE & TERRACE',
            rooms: [
                { n: 'Executive Suite', x: 0, y: 0, w: 465, h: 234, ok: 1, m: [['Occupancy', '2 people'], ['Access', 'Badge only'], ['Status', 'Normal']] },
                { n: 'Lounge', x: 471, y: 0, w: 317, h: 234, ok: 1, m: [['Occupancy', '5 people'], ['Cameras', '2 online'], ['Status', 'Normal']] },
                { n: 'Roof Terrace', x: 0, y: 237, w: 788, h: 231, ok: 1, c: 'color-mix(in srgb,#22c55e 22%,var(--floor))', m: [['Weather', '28 °C, clear'], ['Access', 'Open'], ['Status', 'Normal']] }
            ],
            walls: [
                [0, 0, W, 6],
                [0, 0, 6, 234],
                [782, 0, 6, 234],
                [0, 231, 300, 6],
                // Door opening x=300..340 for Terrace Door
                [340, 231, 448, 6],
                [468, 0, 6, 90],
                // Door opening y=90..130 for Lounge Door
                [468, 130, 6, 101],
                // Glass railings around the terrace
                [0, 462, W, 6, 18, 1],
                [0, 237, 6, 231, 18, 1],
                [782, 237, 6, 231, 18, 1]
            ],
            dev: [
                [320, 234, 'Terrace Door', 0, 'X', 40, false, true], // Glass Terrace Door
                [468, 110, 'Lounge Door', 0, 'Y', 40]
            ],
            props: []
        }
    ];

    let F = F_MASTER;

    // 3D Geometry Primitives
    function box(p, x, y, w, h, H, cls, c, z = 0) {
        const b = document.createElement('div');
        b.className = 'box ' + cls;
        b.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;--H:${H}px;--c:${c};--z:${z}px`;
        const f = (k, s) => `<div class="f ${k}" style="${s}"></div>`;
        b.innerHTML = f('top', `width:${w}px;height:${h}px;transform:translateZ(var(--H))`)
                    + f('ft', `top:${h}px;width:${w}px;height:var(--H);transform-origin:top;transform:rotateX(90deg)`)
                    + f('bk', `top:0;width:${w}px;height:var(--H);transform-origin:top;transform:rotateX(90deg)`)
                    + f('lf', `left:0;width:var(--H);height:${h}px;transform-origin:left;transform:rotateY(-90deg)`)
                    + f('rt', `left:${w}px;width:var(--H);height:${h}px;transform-origin:left;transform:rotateY(-90deg)`);
        p.appendChild(b);
        return b;
    }

    function bb(p, x, y, html, z, cls = '') {
        const d = document.createElement('div');
        d.className = 'bb ' + cls;
        d.style.cssText = `left:${x}px;top:${y}px;--lz:${z}px`;
        d.innerHTML = html;
        p.appendChild(d);
        return d;
    }

    const pole = (p, x, y, H) => box(p, x - 1, y - 1, 2, 2, H, 'pole', 'var(--mute)');
    const el = (p, c, s) => {
        const d = document.createElement('div');
        d.className = c;
        d.style.cssText = s;
        p.appendChild(d);
        return d;
    };
    const wait = ms => new Promise(r => setTimeout(r, ms));

    // Campus 3D Camera Engine (Dashboard)
    let camCampus = { rx: 56, rz: -34, zoom: 0.85, cx: 600, cy: 300, cz: 0 };
    let autoCampus = false, vxCampus = 0, movedCampus = 0, dragCampus = false, lxCampus = 0, lyCampus = 0;
    let campusStageEventsInit = false;

    function applyCampus() {
        const stage = $('stage-campus') || $('stage');
        const scene = $('scene-campus') || $('scene');
        if (!stage || !scene) return;
        const stageW = (stage && stage.clientWidth > 100) ? stage.clientWidth : 1000;
        const s = Math.max(0.35, camCampus.zoom * Math.min(1.2, stageW / 1000));
        scene.style.setProperty('--rx', camCampus.rx + 'deg');
        scene.style.setProperty('--rz', camCampus.rz + 'deg');
        scene.style.transform = `scale(${s}) rotateX(${camCampus.rx}deg) rotateZ(${camCampus.rz}deg) translate3d(${-(camCampus.cx - 394)}px,${-(camCampus.cy - 234)}px,${-camCampus.cz}px)`;
    }

    function camToCampus(t, ms = 700, ease = 'io') {
        return new Promise(res => {
            const s = { ...camCampus }, t0 = performance.now();
            autoCampus = false;
            const ta = $('ta-campus');
            if (ta) ta.classList.remove('on');
            vxCampus = 0;

            const delta = {};
            for (const p in t) {
                if (p === 'rz') {
                    let d = (t[p] - s[p]) % 360;
                    if (d > 180) d -= 360;
                    if (d < -180) d += 360;
                    delta[p] = d;
                } else {
                    delta[p] = t[p] - s[p];
                }
            }

            (function f(n) {
                const k = Math.min(1, (n - t0) / ms);
                const e = EASE[ease](k);
                for (const p in t) camCampus[p] = s[p] + delta[p] * e;
                applyCampus();
                k < 1 ? requestAnimationFrame(f) : res();
            })(t0);
        });
    }

    function setCampusCameraView(viewName) {
        const presets = {
            iso: { rx: 56, rz: -34, zoom: 0.85 },
            top: { rx: 0, rz: 0, zoom: 0.8 },
            side: { rx: 84, rz: 0, zoom: 0.75 }
        };
        document.querySelectorAll('#campus-camera-bar [data-v]').forEach(btn => {
            btn.classList.toggle('on', btn.dataset.v === viewName);
        });
        autoCampus = false;
        const ta = $('ta-campus');
        if (ta) ta.classList.remove('on');
        if (presets[viewName]) camToCampus(presets[viewName], 700);
    }

    function toggleCampusAutoRotate() {
        autoCampus = !autoCampus;
        const ta = $('ta-campus');
        if (ta) ta.classList.toggle('on', autoCampus);
        if (autoCampus) {
            document.querySelectorAll('#campus-camera-bar [data-v]').forEach(btn => btn.classList.remove('on'));
        }
    }

    window.setCampusCameraView = setCampusCameraView;
    window.toggleCampusAutoRotate = toggleCampusAutoRotate;

    // Floor Plan 3D Camera Transformation Engine
    function apply() {
        const stage = $('stage'), scene = $('scene');
        if (!stage || !scene) return;
        const stageW = (stage && stage.clientWidth > 100) ? stage.clientWidth : 1000;
        const s = Math.max(0.35, cam.zoom * Math.min(1.2, stageW / 1000));
        scene.style.setProperty('--rx', cam.rx + 'deg');
        scene.style.setProperty('--rz', cam.rz + 'deg');
        scene.style.transform = `scale(${s}) rotateX(${cam.rx}deg) rotateZ(${cam.rz}deg) translate3d(${-(cam.cx - 394)}px,${-(cam.cy - 234)}px,${-cam.cz}px)`;
    }

    function camTo(t, ms = 700, ease = 'io') {
        return new Promise(res => {
            const s = { ...cam }, t0 = performance.now();
            auto = false;
            const ta = $('ta');
            if (ta) ta.classList.remove('on');
            vx = 0;

            const delta = {};
            for (const p in t) {
                if (p === 'rz') {
                    let d = (t[p] - s[p]) % 360;
                    if (d > 180) d -= 360;
                    if (d < -180) d += 360;
                    delta[p] = d;
                } else {
                    delta[p] = t[p] - s[p];
                }
            }

            (function f(n) {
                const k = Math.min(1, (n - t0) / ms);
                const e = EASE[ease](k);
                for (const p in t) cam[p] = s[p] + delta[p] * e;
                apply();
                k < 1 ? requestAnimationFrame(f) : res();
            })(t0);
        });
    }

    // Floor Plan Stage Events & Orbit Drag Engine
    let fpStageEventsInit = false;
    function initFloorPlanStageEvents() {
        const stage = $('stage');
        if (!stage || fpStageEventsInit) return;
        fpStageEventsInit = true;

        stage.onpointerdown = e => {
            drag = true;
            vx = 0;
            lx = e.clientX;
            ly = e.clientY;
            moved = 0;
            auto = false;
            const ta = $('ta');
            if (ta) ta.classList.remove('on');
            document.querySelectorAll('#fp-camera-bar [data-v]').forEach(b => b.classList.remove('on'));
        };

        window.addEventListener('pointerup', () => { drag = false; });

        window.addEventListener('pointermove', e => {
            if (!drag) return;
            const dx = e.clientX - lx, dy = e.clientY - ly;
            lx = e.clientX;
            ly = e.clientY;
            moved += Math.abs(dx) + Math.abs(dy);
            vx = dx * 0.4;
            cam.rz += dx * 0.4;
            cam.rx = Math.max(0, Math.min(88, cam.rx - dy * 0.3));
            apply();
        });

        stage.addEventListener('wheel', e => {
            e.preventDefault();
            cam.zoom = Math.max(0.35, Math.min(2.4, cam.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
            apply();
        }, { passive: false });

        // Floor Plan Turntable Loop
        (function loopFP() {
            const fpPage = $('view-floorplan-page');
            const isFpVisible = fpPage && !fpPage.classList.contains('hidden');
            if (auto && !drag && isFpVisible) {
                cam.rz += 0.25;
                apply();
            } else if (!drag && Math.abs(vx) > 0.01 && isFpVisible) {
                cam.rz += vx;
                vx *= 0.94;
                apply();
            }
            requestAnimationFrame(loopFP);
        })();
    }

    // Floor Plan & Interior Management
    function layout() {
        F.forEach((f, i) => {
            if (!f.g) return;
            f.g.style.display = i < nF ? '' : 'none';
            f.g.classList.toggle('active', i === cur);
            f.g.classList.toggle('dim', i !== cur);
        });
    }

    function setFloor(i) {
        cur = i;
        sel = null;
        F.forEach(f => {
            if (f.rooms) f.rooms.forEach(r => { if (r.t) r.t.classList.remove('sel'); });
        });
        layout();
        renderLv();
        side();
        crumb();

        const activeBldg = (appState.campus && appState.campus.buildings)
            ? appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId)
            : null;
        if (activeBldg && activeBldg.floors && activeBldg.floors[i]) {
            const fl = activeBldg.floors[i];
            appState.campus.activeFloorId = fl.id;
            appState.plan = fl.plan;
            saveCampusData();
            if (typeof renderElevatorRail === 'function') renderElevatorRail();
            if (typeof renderCampusBreadcrumbs === 'function') renderCampusBreadcrumbs();
            if (typeof renderPlan === 'function') renderPlan();
        }
    }

    function renderLv() {
        const lv = $('lv');
        if (!lv) return;
        lv.innerHTML = '<i>LEVEL</i>' + F.slice(0, nF).map((f, i) => ({ f, i })).reverse().map(({ f, i }) =>
            `<button class="${i === cur ? 'on' : ''}" data-i="${i}" title="${f.name || f.id}"><span>${f.id}</span></button>`
        ).join('') + `
            <button type="button" class="lv-add-btn" onclick="openAddFloorModal()" title="Add New Floor to Building">
                <i data-lucide="plus" style="width:14px;height:14px;"></i>
            </button>
        `;
        lv.querySelectorAll('button[data-i]').forEach(b => {
            b.onclick = e => {
                e.stopPropagation();
                setFloor(+b.dataset.i);
            };
        });
        if (window.lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons({ el: lv });
        }
    }

    function side() {
        const s = $('side');
        if (s) s.remove();
    }

    function detail(r) {
        // Zone details panel decommissioned
    }

    function pick(r) {
        sel = r;
        if (F[cur] && F[cur].rooms) {
            F[cur].rooms.forEach(x => { if (x.t) x.t.classList.toggle('sel', x === r); });
        }
    }

    function crumb() {
        const bc = $('bc');
        const stage = $('stage');
        const statChip = $('campus-stat-chip');
        if (bc) {
            if (bld && stage && stage.classList.contains('in')) {
                bc.style.display = 'inline-flex';
                if (statChip) statChip.style.display = 'none';
                bc.innerHTML = `<b style="cursor:pointer;color:var(--accent)" id="home">Campus 3D</b><span>›</span><b>${bld.name}</b><span>›</span><b>${F[cur] ? F[cur].name : 'Level'}</b>`;
                const h = $('home');
                if (h) h.onclick = closeB;
            } else {
                bc.style.display = 'none';
                if (statChip) statChip.style.display = 'inline-flex';
            }
        }

        // Synchronize host toolbar breadcrumb
        const breadcrumbNav = $('campus-breadcrumb-nav');
        const bldgNameElem = $('breadcrumb-building-name');
        const floorNameElem = $('breadcrumb-floor-name');
        if (bld && stage && stage.classList.contains('in')) {
            if (breadcrumbNav) breadcrumbNav.classList.remove('hidden');
            if (bldgNameElem) bldgNameElem.textContent = bld.name;
            if (floorNameElem && F[cur]) floorNameElem.textContent = F[cur].name;
        } else {
            if (breadcrumbNav) breadcrumbNav.classList.add('hidden');
        }
    }

    // --------------------------------------------------------------------------
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
        const activeFlIdx = bldFloors.findIndex(fl => fl.id === appState.campus?.activeFloorId);
        if (activeFlIdx !== -1) {
            cur = activeFlIdx;
        } else {
            cur = Math.min(cur, nF - 1);
            if (cur < 0) cur = 0;
        }
        sel = null;

        F.forEach((f, i) => {
            const g = document.createElement('div');
            g.className = 'floor';
            f.g = g;
            interior.appendChild(g);

            // 1. Foundation Slab
            box(g, -6, -6, W + 12, D + 12, 8, 'slab', 'var(--slabc)');

            // 2. Room Floor Tiles
            (f.rooms || []).forEach(r => {
                const t = document.createElement('div');
                t.className = 'tile';
                t.style.cssText = `left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px` + (r.c ? `;--rc:${r.c}` : '');
                t.onmouseenter = () => { if (i === cur) detail(r); };
                t.onclick = () => { if (moved < 5 && i === cur) pick(r); };
                r.t = t;
                g.appendChild(t);
            });

            // 3. Exact 3D Extruded Walls (with glass partitions)
            (f.walls || []).forEach(([x, y, w, h, H = WH, gl]) => {
                box(g, x, y, w, h, H, gl ? 'glass' : 'wall', 'var(--wc)');
            });

            // 4. Room Billboard Labels on Poles
            (f.rooms || []).forEach(r => {
                const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
                pole(g, cx, cy, WH + 4);
                bb(g, cx, cy, `<div class="lab">${r.n}<small>MONITORED ZONE</small></div>`, WH + 4);
            });

            // 5. Authentic 3D Doors & Windows (with Threshold, Jambs, Swing Panels & Radar Pads)
            (f.dev || []).forEach(d => {
                const x = d[0], y = d[1], name = d[2], warn = d[3], axis = d[4] || 'X', len = d[5] || 40, isWin = d[6] || false, isGlass = d[7] || false;

                if (isWin) {
                    // Window Sill & Glass Pane
                    box(g, x - len / 2, y - 3, len, 6, 12, 'door-threshold', 'var(--wtop)');
                    box(g, x - len / 2, y - 3, len, 6, WH - 12, 'glass window-pane', '#bae6fd', 12);
                    pole(g, x, y, WH + 4);
                    bb(g, x, y, `<div class="lab dev"><span class="dot ${warn ? 'w' : ''}"></span>${name}</div>`, WH + 4);
                    return;
                }

                // Check live device status (if bound door is open)
                const isLiveOpen = (appState.devices || []).some(dev => dev.name && dev.name.toLowerCase().includes(name.toLowerCase()) && dev.state === 'open') || !!warn;

                if (axis === 'Y') {
                    // Vertical Doorway (opening along Y axis, wall along Y)
                    // Floor Threshold Plate
                    box(g, x - 3, y - len / 2, 6, len, 2, 'door-threshold', 'var(--wtop)');
                    // Left & Right Door Jambs
                    box(g, x - 3, y - len / 2, 6, 3, WH, 'door-jamb', 'var(--wtop)');
                    box(g, x - 3, y + len / 2 - 3, 6, 3, WH, 'door-jamb', 'var(--wtop)');

                    // 3D Door Leaf (swings open into room)
                    const hinge = document.createElement('div');
                    hinge.className = 'door-pivot';
                    hinge.style.cssText = `position:absolute;left:${x}px;top:${y - len / 2}px;width:0;height:0;transform-origin:0 0;transform:rotateZ(${isLiveOpen ? 70 : 0}deg);transition:transform .7s cubic-bezier(.3,.8,.3,1);`;
                    box(hinge, 0, 0, 4, len - 2, WH - 6, isGlass ? 'glass door-leaf' : 'door-leaf', isGlass ? '#bae6fd' : '#475569');
                    box(hinge, 4, len - 10, 5, 2, 6, 'door-handle', '#f8fafc', 28);
                    g.appendChild(hinge);

                    // Pulsing Radar Pad
                    el(g, 'pad' + (isLiveOpen ? ' warn' : ''), `left:${x}px;top:${y}px`);

                    // Pole & Billboard Tag
                    pole(g, x, y, WH + 4);
                    bb(g, x, y, `<div class="lab dev"><span class="dot ${isLiveOpen ? 'w' : ''}"></span>${name}</div>`, WH + 4);
                } else {
                    // Horizontal Doorway (opening along X axis, wall along X)
                    // Floor Threshold Plate
                    box(g, x - len / 2, y - 3, len, 6, 2, 'door-threshold', 'var(--wtop)');
                    // Left & Right Door Jambs
                    box(g, x - len / 2, y - 3, 3, 6, WH, 'door-jamb', 'var(--wtop)');
                    box(g, x + len / 2 - 3, y - 3, 3, 6, WH, 'door-jamb', 'var(--wtop)');

                    // 3D Door Leaf (swings open into room)
                    const hinge = document.createElement('div');
                    hinge.className = 'door-pivot';
                    hinge.style.cssText = `position:absolute;left:${x - len / 2}px;top:${y}px;width:0;height:0;transform-origin:0 0;transform:rotateZ(${isLiveOpen ? -70 : 0}deg);transition:transform .7s cubic-bezier(.3,.8,.3,1);`;
                    box(hinge, 0, 0, len - 2, 4, WH - 6, isGlass ? 'glass door-leaf' : 'door-leaf', isGlass ? '#bae6fd' : '#475569');
                    box(hinge, len - 10, 4, 2, 5, 6, 'door-handle', '#f8fafc', 28);
                    g.appendChild(hinge);

                    // Pulsing Radar Pad
                    el(g, 'pad' + (isLiveOpen ? ' warn' : ''), `left:${x}px;top:${y}px`);

                    // Pole & Billboard Tag
                    pole(g, x, y, WH + 4);
                    bb(g, x, y, `<div class="lab dev"><span class="dot ${isLiveOpen ? 'w' : ''}"></span>${name}</div>`, WH + 4);
                }
            });

            // 6. Floor Level Billboard Tag
            pole(g, W + 30, D - 6, 24);
            bb(g, W + 30, D - 6, `<div class="lab">${f.id} · ${f.name}</div>`, 24, 'tag').onclick = () => {
                if (moved < 5) setFloor(i);
            };
        });
    }

    async function openB(b) {
        const stage = $('stage'), campus = $('campus'), interior = $('interior'), veil = $('veil'), hint = $('hint');
        if (busy || !stage || !campus || !interior || !veil) return;
        busy = true;
        bld = b;
        stage.classList.add('busy');

        // 1. Fade other buildings & environment to 7% without flattening 3D
        B.forEach(x => { if (x.g) x.g.classList.toggle('dimb', x !== b); });
        if (env) env.classList.add('dimb');

        // 2. Lift clicked building's roof
        if (b.g) b.g.classList.add('open');
        if (hint) hint.style.opacity = 0;

        // 3. Fly camera to building with ease-in curve
        const p = camTo({
            rx: 44,
            rz: -34,
            zoom: 2.4,
            cx: b.x + b.w / 2,
            cy: b.y + b.h / 2,
            cz: (b.fl || 3) * FH / 2
        }, 1500, 'in');

        // 4. Quick fade overlay veil while still moving
        await wait(1050);
        veil.textContent = 'Entering ' + b.name + '…';
        veil.classList.add('on');
        await p;

        // 5. Swap to interior with ease-out curve
        campus.style.display = 'none';
        interior.classList.add('pre');
        interior.style.display = 'block';
        stage.classList.add('in');

        buildInteriorForBuilding(b);
        layout();
        renderLv();
        side();
        crumb();

        Object.assign(cam, { rx: 30, rz: -60, zoom: 1.9, cx: 394, cy: 234, cz: 35 });
        apply();

        // 6. Build interior by animating wall and prop heights from 0 to full while floors fade in
        void interior.offsetHeight;
        await wait(60);
        interior.classList.remove('pre');
        veil.classList.remove('on');

        await camTo(IN, 1700, 'out');
        stage.classList.remove('busy');
        busy = false;
    }

    // REVERSE SEQUENCE (BREADCRUMB: CAMPUS 3D > BUILDING > FLOOR)
    async function closeB() {
        const stage = $('stage'), campus = $('campus'), interior = $('interior'), veil = $('veil'), hint = $('hint');
        if (busy || !stage || !campus || !interior || !veil) return;
        busy = true;
        stage.classList.add('busy');

        // 1. Drop interior
        interior.classList.add('pre');
        const z = camTo({ rx: 44, rz: -34, zoom: 1.5, cx: 394, cy: 234, cz: 35 }, 900, 'in');
        await wait(560);

        veil.textContent = 'Back to campus…';
        veil.classList.add('on');
        await z;

        // 2. Swap back to campus
        interior.style.display = 'none';
        interior.classList.remove('pre');
        campus.style.display = 'block';
        stage.classList.remove('in');
        crumb();

        if (bld) {
            Object.assign(cam, {
                rx: 44,
                rz: -34,
                zoom: 2.4,
                cx: bld.x + bld.w / 2,
                cy: bld.y + bld.h / 2,
                cz: (bld.fl || 3) * FH / 2
            });
            apply();
        }

        await wait(60);
        veil.classList.remove('on');
        await wait(250);

        // 3. Lower roof and restore environment from 7% to 100%
        B.forEach(x => { if (x.g) x.g.classList.remove('dimb', 'open'); });
        if (env) env.classList.remove('dimb');

        await camTo(OVER, 1600, 'out');
        if (hint) hint.style.opacity = 1;
        stage.classList.remove('busy');
        busy = false;
    }

        // TRANSITION FROM CAMPUS TO DEDICATED FLOOR PLAN WORKSTATION
    async function openBuildingFromCampus(b) {
        if (!b) return;
        const veil = $('veil-campus') || $('veil');
        if (veil) {
            veil.textContent = 'Entering ' + b.name + '…';
            veil.classList.add('on');
        }

        // 1. Smooth ease-in camera fly toward building on campus map
        await camToCampus({
            rx: 44,
            rz: -34,
            zoom: 2.2,
            cx: b.x + b.w / 2,
            cy: b.y + b.h / 2,
            cz: (b.fl || 3) * FH / 2
        }, 800, 'in');

        // 2. Select building and switch to dedicated Floor Plan view
        selectBuilding(b.id);
        switchMainTab('floorplan');
        setFloorPlanSubView('3d', false);

        // 3. Render 3D interior for this building
        buildInteriorForBuilding(b);
        layout();
        renderLv();
        side();
        crumb();
        initFloorPlanStageEvents();
        apply();

        if (veil) veil.classList.remove('on');
        showToast(`Viewing 3D Floor Plan: ${b.name}`, "info");
    }
    window.openBuildingFromCampus = openBuildingFromCampus;

    function initFloorPlanView() {
        renderCampusBreadcrumbs();
        renderElevatorRail();
        const subView = window.currentFpSubView || '3d';
        setFloorPlanSubView(subView, false);
    }
    window.initFloorPlanView = initFloorPlanView;

    // BUILD CAMPUS 3D SCENE (DASHBOARD)
    function renderCampus3DScene() {
        const campusStage = $('stage-campus') || $('stage');
        const campusScene = $('scene-campus') || $('scene');
        const campus = $('campus');
        if (!campusStage || !campusScene || !campus) return;

        // Initialize campus stage pointer & wheel listeners once
        if (!campusStageEventsInit) {
            campusStageEventsInit = true;

            campusStage.onpointerdown = e => {
                dragCampus = true;
                vxCampus = 0;
                lxCampus = e.clientX;
                lyCampus = e.clientY;
                movedCampus = 0;
                autoCampus = false;
                const ta = $('ta-campus');
                if (ta) ta.classList.remove('on');
                document.querySelectorAll('#campus-camera-bar [data-v]').forEach(b => b.classList.remove('on'));
            };

            window.addEventListener('pointerup', () => { dragCampus = false; });

            window.addEventListener('pointermove', e => {
                if (!dragCampus) return;
                const dx = e.clientX - lxCampus, dy = e.clientY - lyCampus;
                lxCampus = e.clientX;
                lyCampus = e.clientY;
                movedCampus += Math.abs(dx) + Math.abs(dy);
                vxCampus = dx * 0.4;
                camCampus.rz += dx * 0.4;
                camCampus.rx = Math.max(0, Math.min(88, camCampus.rx - dy * 0.3));
                applyCampus();
            });

            campusStage.addEventListener('wheel', e => {
                e.preventDefault();
                camCampus.zoom = Math.max(0.35, Math.min(2.4, camCampus.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
                applyCampus();
            }, { passive: false });

            // Campus momentum turntable loop
            (function loopC() {
                if (autoCampus && !dragCampus) {
                    camCampus.rz += 0.25;
                    applyCampus();
                } else if (!dragCampus && Math.abs(vxCampus) > 0.01) {
                    camCampus.rz += vxCampus;
                    vxCampus *= 0.94;
                    applyCampus();
                }
                requestAnimationFrame(loopC);
            })();

            // Stage Camera Presets on Dashboard
            document.querySelectorAll('#campus-camera-bar [data-v]').forEach(b => {
                b.onclick = () => {
                    document.querySelectorAll('#campus-camera-bar [data-v]').forEach(x => x.classList.remove('on'));
                    b.classList.add('on');
                    setCampusCameraView(b.dataset.v);
                };
            });
        }

        // Build Campus Terrain & Buildings on ONE Unified Background Plane
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
        camCampus.zoom = Math.max(0.40, Math.min(0.85, 0.85 / campusDim));

        B.forEach(b => {
            const g = b.g = el(campus, 'bgrp', '');
            const sh = b.fl * FH * 0.55;
            el(g, 'shd', `left:${b.x + sh * 0.9}px;top:${b.y - sh * 0.15}px;width:${b.w}px;height:${b.h}px`);

            box(g, b.x - 8, b.y - 8, b.w + 16, b.h + 16, 3, 'prop', 'var(--road)');
            box(g, b.x + b.w / 2 - 15, b.y + b.h, 30, 2, 24, 'prop', '#334155');
            box(g, b.x + b.w / 2 - 26, b.y + b.h, 52, 16, 3, 'prop', '#64748b', 26);

            for (let i = 0; i < b.fl; i++) {
                const r = box(g, b.x, b.y, b.w, b.h, FH - 3, 'bld' + (i === b.fl - 1 ? ' roof' : ''), b.c, i * FH);
                if (i === b.fl - 1) {
                    const cx = b.w / 2, cy = b.h / 2;
                    if (b.bad) el(r, 'ring', `left:${cx}px;top:${cy}px`);
                    el(r, 'rdot', `left:${cx}px;top:${cy}px`);
                    el(r, 'rdot g', `left:${cx - 50}px;top:${cy - 26}px`);
                    el(r, 'rdot g', `left:${cx + 46}px;top:${cy + 30}px`);
                    box(r, 12, 12, 22, 16, 9, 'prop', '#94a3b8', FH - 3);
                    box(r, b.w - 40, b.h - 34, 24, 18, 7, 'prop', '#94a3b8', FH - 3);
                }
            }

            const cx = b.x + b.w / 2, cy = b.y + b.h / 2, hz = b.fl * FH + 70;
            pole(g, cx, cy, hz);
            bb(g, cx, cy, `<div class="card" onclick="event.stopPropagation(); openBuildingFromCampus(B.find(x=>x.id==='${b.id}'))"><div>${b.name}<span class="badge ${b.bad ? 'bad' : ''}">${b.bad ? 'ALARM' : 'SECURED'}</span></div><small>${b.fl} Floors • ${b.s} Sensors • Click to Enter</small></div>`, hz, 'cardw');

            g.onclick = () => {
                if (movedCampus < 5) openBuildingFromCampus(b);
            };
        });

        applyCampus();
        requestAnimationFrame(() => applyCampus());
    }

    // Bridge standard renderCampus3D to new Engine
    function renderCampus3D() {
        renderCampus3DScene();
        const statEl = $('campus-summary-stat');
        if (statEl && appState.campus && appState.campus.buildings) {
            const bldgs = appState.campus.buildings;
            const totalFl = bldgs.reduce((acc, b) => acc + (b.floors ? b.floors.length : 0), 0);
            const totalSens = bldgs.reduce((acc, b) => acc + (b.floors || []).reduce((a2, f) => a2 + (f.plan?.doors?.length || 0), 0), 0);
            statEl.textContent = `${bldgs.length} Buildings • ${totalFl} Floors • ${totalSens} Active Sensors`;
        }
    }

    // Dedicated Floor Plan Subview Switcher (3D Isometric vs 2D Blueprint)
    function setFloorPlanSubView(subView, showToastMsg = true) {
        window.currentFpSubView = subView;
        const wrap3d = $('fp-3d-wrapper');
        const wrap2d = $('blueprint-svg-container');
        const btn3d = $('btn-fp-sub-3d');
        const btn2d = $('btn-fp-sub-2d');
        const actions3d = $('toolbar-actions-fp-3d');
        const actions2d = $('toolbar-actions-fp-2d');
        const ribbon = $('designer-toolbar');
        const help = $('designer-help');

        if (subView === '3d') {
            const fpPage = $('view-floorplan-page');
            if (fpPage) {
                fpPage.classList.add('view-3d-active');
                fpPage.setAttribute('data-view-mode', '3d');
            }
            const propPanel = $('right-sidebar-panel');
            if (propPanel) propPanel.classList.add('hidden');
            if (wrap3d) wrap3d.classList.remove('hidden');
            if (wrap2d) wrap2d.classList.add('hidden');
            if (btn3d) btn3d.classList.add('active');
            if (btn2d) btn2d.classList.remove('active');
            if (actions3d) actions3d.classList.remove('hidden');
            if (actions2d) actions2d.classList.add('hidden');
            if (ribbon) ribbon.classList.add('hidden');
            if (help) help.classList.add('hidden');

            // Render 3D interior for active building
            const activeBldg = (appState.campus && appState.campus.buildings)
                ? (appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId) || appState.campus.buildings[0])
                : null;
            if (activeBldg && typeof buildInteriorForBuilding === 'function') {
                const b3d = (typeof B !== 'undefined' && Array.isArray(B)) ? B.find(x => x.id === activeBldg.id || x.name === activeBldg.name) : activeBldg;
                buildInteriorForBuilding(b3d || activeBldg);
                layout();
                renderLv();
                side();
                crumb();
                initFloorPlanStageEvents();
                apply();
            }
            if (showToastMsg) showToast("3D Interactive Floor Plan active", "info");
        } else {
            const fpPage = $('view-floorplan-page');
            if (fpPage) {
                fpPage.classList.remove('view-3d-active');
                fpPage.setAttribute('data-view-mode', '2d');
            }
            if (wrap3d) wrap3d.classList.add('hidden');
            if (wrap2d) wrap2d.classList.remove('hidden');
            if (btn2d) btn2d.classList.add('active');
            if (btn3d) btn3d.classList.remove('active');
            if (actions3d) actions3d.classList.add('hidden');
            if (actions2d) actions2d.classList.remove('hidden');

            if (typeof renderPlan === 'function') renderPlan();
            if (typeof renderElevatorRail === 'function') renderElevatorRail();
            if (typeof fitCanvasToRooms === 'function') setTimeout(fitCanvasToRooms, 40);
            if (showToastMsg) showToast("2D Blueprint Editor active", "info");
        }
        if (window.lucide && lucide.createIcons) lucide.createIcons();
    }

    function setFp3dCameraView(viewName) {
        initFloorPlanStageEvents();
        const presets = {
            iso: { rx: 56, rz: -34, zoom: 1.0 },
            top: { rx: 0, rz: 0, zoom: 0.95 },
            side: { rx: 84, rz: 0, zoom: 0.9 }
        };
        document.querySelectorAll('#fp-camera-bar [data-v]').forEach(btn => {
            btn.classList.toggle('on', btn.dataset.v === viewName);
        });
        auto = false;
        const ta = $('ta');
        if (ta) ta.classList.remove('on');
        if (presets[viewName]) camTo(presets[viewName], 700);
    }

    function toggleFp3dAutoRotate() {
        initFloorPlanStageEvents();
        auto = !auto;
        const ta = $('ta');
        if (ta) ta.classList.toggle('on', auto);
        if (auto) {
            document.querySelectorAll('#fp-camera-bar [data-v]').forEach(btn => btn.classList.remove('on'));
        }
    }

    function toggleFpLabels() {
        const stage = $('stage');
        if (stage) stage.classList.toggle('hidel');
        const tl = $('tl');
        if (tl && stage) {
            const isShown = !stage.classList.contains('hidel');
            tl.classList.toggle('active', isShown);
            tl.classList.toggle('on', isShown);
        }
    }

    window.openB = openB;
    window.closeB = closeB;
    window.renderCampus3D = renderCampus3D;
    window.setFloorPlanSubView = setFloorPlanSubView;
    window.setFp3dCameraView = setFp3dCameraView;
    window.toggleFp3dAutoRotate = toggleFp3dAutoRotate;
    window.toggleFpLabels = toggleFpLabels;
    window.initFloorPlanStageEvents = initFloorPlanStageEvents;
    window.addEventListener('resize', () => {
        if (typeof applyCampus === 'function') applyCampus();
        if (typeof apply === 'function') apply();
    });



    // =========================================================================
    // ADVANCED DATABASE MANAGEMENT STUDIO ENGINE (ADMIN ONLY)
    // =========================================================================
        function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

const dbState = {
        overview: null,
        activeTable: null,
        schema: [],
        data: [],
        columns: [],
        pkCol: 'id',
        page: 1,
        pageSize: 25,
        totalRows: 0,
        totalPages: 1,
        search: '',
        sortCol: '',
        sortDir: 'ASC',
        activeTab: 'browse',
        selectedRowIds: new Set()
    };

    function initDatabaseStudio() {
        refreshDatabaseStudio();
    }

    function refreshDatabaseStudio() {
        const tableContainer = document.getElementById('db-table-items-container');
        if (tableContainer) {
            tableContainer.innerHTML = `
                <div class="db-loading-state" style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <i data-lucide="loader-2" class="spin-icon" style="width: 20px; height: 20px;"></i>
                    <span>Refreshing database catalog...</span>
                </div>
            `;
            if (window.lucide && lucide.createIcons) lucide.createIcons();
        }

        fetch('/api/database/overview')
            .then(res => {
                if (res.status === 403) throw new Error('Administrator clearance required.');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                dbState.overview = data;
                renderDbOverview(data);
                
                // Select active table or default to first
                if (data.tables && data.tables.length > 0) {
                    const exists = data.tables.find(t => t.name === dbState.activeTable);
                    const defaultTable = exists ? dbState.activeTable : (data.tables.find(t => t.name === 'logger_doorlog')?.name || data.tables[0].name);
                    loadDbTable(defaultTable, 1);
                } else {
                    document.getElementById('db-current-table-label').textContent = 'No tables found';
                }
            })
            .catch(err => {
                console.error('Database studio error:', err);
                if (tableContainer) {
                    tableContainer.innerHTML = `
                        <div style="padding: 16px; font-size: 12px; color: #ef4444; line-height: 1.4;">
                            <i data-lucide="alert-circle" style="width: 16px; height: 16px; margin-bottom: 4px;"></i>
                            <div><strong>Access Restricted:</strong> ${err.message}</div>
                        </div>
                    `;
                    if (window.lucide && lucide.createIcons) lucide.createIcons();
                }
                showToast(err.message, "error");
            });
    }

    function renderDbOverview(ov) {
        document.getElementById('db-tables-count').textContent = ov.tables_count || 0;
        document.getElementById('db-spec-engine').textContent = `${ov.engine} v${ov.version || ''}`;
        document.getElementById('db-spec-size').textContent = ov.file_size_formatted || '--';
        document.getElementById('db-spec-total-rows').textContent = (ov.total_rows_count || 0).toLocaleString();

        const summary = document.getElementById('db-telemetry-summary');
        if (summary) {
            summary.innerHTML = `
                <span>File: <strong>${ov.database_name}</strong></span>
                <span>•</span>
                <span>Size: <strong>${ov.file_size_formatted}</strong></span>
                <span>•</span>
                <span>Catalog: <strong>${ov.tables_count} Tables</strong> (${(ov.total_rows_count || 0).toLocaleString()} Total Records)</span>
            `;
        }

        renderDbTablesList(ov.tables || []);
    }

    function renderDbTablesList(tables) {
        const container = document.getElementById('db-table-items-container');
        if (!container) return;

        if (!tables || tables.length === 0) {
            container.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 12px;">No tables in database.</div>';
            return;
        }

        const filterVal = (document.getElementById('db-table-filter')?.value || '').toLowerCase().trim();
        const filtered = tables.filter(t => !filterVal || t.name.toLowerCase().includes(filterVal));

        let html = '';
        filtered.forEach(t => {
            const isActive = t.name === dbState.activeTable;
            const isDoorLog = t.name === 'logger_doorlog';
            const iconName = isDoorLog ? 'history' : (t.name.startsWith('auth_') ? 'shield' : 'table');

            html += `
                <button type="button" class="db-table-item ${isActive ? 'active' : ''}" onclick="loadDbTable('${t.name}', 1)" title="${t.name} (${t.row_count} rows, ${t.col_count} columns)">
                    <div class="db-table-item-left">
                        <i data-lucide="${iconName}"></i>
                        <span class="db-table-item-name">${t.name}</span>
                    </div>
                    <span class="db-table-item-count">${(t.row_count || 0).toLocaleString()}</span>
                </button>
            `;
        });

        container.innerHTML = html;
        if (window.lucide && lucide.createIcons) lucide.createIcons();
    }

    function filterDbTableList() {
        if (dbState.overview && dbState.overview.tables) {
            renderDbTablesList(dbState.overview.tables);
        }
    }

    function switchDbWorkspaceTab(tabName) {
        dbState.activeTab = tabName;
        ['browse', 'structure', 'sql'].forEach(t => {
            const btn = document.getElementById(`db-tab-${t}`);
            const pane = document.getElementById(`db-pane-${t}`);
            if (btn) btn.classList.toggle('active', t === tabName);
            if (pane) pane.classList.toggle('hidden', t !== tabName);
        });

        if (tabName === 'structure' && dbState.activeTable) {
            renderDbSchemaTable();
        } else if (tabName === 'browse' && dbState.activeTable) {
            renderDbDataGrid();
        }

        if (window.lucide && lucide.createIcons) lucide.createIcons();
    }

    function loadDbTable(tableName, page = 1) {
        dbState.activeTable = tableName;
        dbState.page = page;
        dbState.selectedRowIds.clear();
        updateDbBatchDeleteButton();

        document.getElementById('db-current-table-label').textContent = tableName;
        document.getElementById('db-structure-table-name').textContent = `Table Schema: ${tableName}`;

        // Update active class on table explorer
        document.querySelectorAll('.db-table-item').forEach(el => {
            const nameEl = el.querySelector('.db-table-item-name');
            if (nameEl && nameEl.textContent === tableName) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        // 1. Fetch schema first
        fetch(`/api/database/table/${tableName}/schema`)
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success') {
                    dbState.schema = res.columns || [];
                    dbState.pkCol = res.pk_column || 'id';
                    renderDbSchemaTable();
                }
            })
            .catch(e => console.error("Schema fetch error:", e));

        // 2. Fetch data rows
        fetchTableDataRows(tableName, page);
    }

    function fetchTableDataRows(tableName, page = 1) {
        const tbody = document.getElementById('db-table-tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 12px;">
                        <i data-lucide="loader-2" class="spin-icon" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle; margin-right: 6px;"></i>
                        Loading records for ${tableName}...
                    </td>
                </tr>
            `;
            if (window.lucide && lucide.createIcons) lucide.createIcons();
        }

        const url = `/api/database/table/${tableName}/data?page=${page}&page_size=${dbState.pageSize}&search=${encodeURIComponent(dbState.search)}&sort_col=${dbState.sortCol}&sort_dir=${dbState.sortDir}`;
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (res.status !== 'success') throw new Error(res.message || 'Failed to fetch table data');
                dbState.columns = res.columns || [];
                dbState.data = res.rows || [];
                dbState.totalRows = res.total_rows || 0;
                dbState.page = res.page || 1;
                dbState.totalPages = res.total_pages || 1;
                dbState.pkCol = res.pk_column || dbState.pkCol;

                renderDbDataGrid();
            })
            .catch(err => {
                console.error("Table data fetch error:", err);
                if (tbody) {
                    tbody.innerHTML = `<tr><td colspan="10" style="padding: 16px; color: #ef4444; font-size: 12px;">${err.message}</td></tr>`;
                }
                showToast(err.message, "error");
            });
    }

    function renderDbDataGrid() {
        const thead = document.getElementById('db-table-thead');
        const tbody = document.getElementById('db-table-tbody');
        if (!thead || !tbody) return;

        const cols = dbState.columns;
        const rows = dbState.data;
        const pkIdx = cols.indexOf(dbState.pkCol);

        // 1. Table Header
        let thHtml = `<tr>
            <th style="width: 38px; text-align: center;">
                <input type="checkbox" id="db-master-checkbox" onchange="toggleSelectAllDbRows(this)" title="Select all rows on this page" style="cursor: pointer;" />
            </th>
            <th style="width: 75px; text-align: center;">Actions</th>
        `;

        cols.forEach(col => {
            const isSorted = dbState.sortCol === col;
            const sortIcon = isSorted ? (dbState.sortDir === 'DESC' ? ' ↓' : ' ↑') : '';
            const isPk = col === dbState.pkCol;
            thHtml += `
                <th class="db-col-header-sortable" onclick="sortDbColumn('${col}')" title="Click to sort by ${col}">
                    ${col}${isPk ? ' 🔑' : ''}${sortIcon}
                </th>
            `;
        });
        thHtml += '</tr>';
        thead.innerHTML = thHtml;

        // 2. Table Body
        if (rows.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="${cols.length + 2}" style="padding: 36px; text-align: center; color: var(--text-muted); font-size: 12.5px;">
                        <i data-lucide="inbox" style="width: 28px; height: 28px; opacity: 0.4; margin-bottom: 6px;"></i>
                        <div>No matching records found in <strong>${dbState.activeTable}</strong>.</div>
                    </td>
                </tr>
            `;
            updateDbPaginationControls();
            if (window.lucide && lucide.createIcons) lucide.createIcons();
            return;
        }

        let tbHtml = '';
        rows.forEach((row, rIdx) => {
            const pkVal = pkIdx !== -1 ? row[pkIdx] : rIdx;
            const isChecked = dbState.selectedRowIds.has(String(pkVal));

            tbHtml += `<tr class="${isChecked ? 'row-selected' : ''}" id="db-row-${pkVal}">
                <td style="text-align: center;">
                    <input type="checkbox" class="db-row-checkbox" value="${pkVal}" ${isChecked ? 'checked' : ''} onchange="toggleSelectDbRow('${pkVal}', this)" style="cursor: pointer;" />
                </td>
                <td>
                    <div class="db-row-actions">
                        <button type="button" class="db-row-btn" onclick="openEditRowModal(${rIdx})" title="Edit row">
                            <i data-lucide="pencil"></i>
                        </button>
                        <button type="button" class="db-row-btn btn-delete" onclick="deleteSingleDbRow('${pkVal}')" title="Delete row">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            `;

            row.forEach((cell, cIdx) => {
                let cellDisplay = '';
                if (cell === null) {
                    cellDisplay = '<span class="db-cell-null">NULL</span>';
                } else if (cell === true || cell === 'true' || cell === 1 && cols[cIdx].toLowerCase().includes('is_')) {
                    cellDisplay = '<span class="db-cell-bool-true">TRUE</span>';
                } else if (cell === false || cell === 'false' || cell === 0 && cols[cIdx].toLowerCase().includes('is_')) {
                    cellDisplay = '<span class="db-cell-bool-false">FALSE</span>';
                } else {
                    const str = String(cell);
                    cellDisplay = str.length > 80 ? `${escapeHtml(str.substring(0, 80))}...` : escapeHtml(str);
                }
                tbHtml += `<td>${cellDisplay}</td>`;
            });

            tbHtml += '</tr>';
        });

        tbody.innerHTML = tbHtml;
        updateDbPaginationControls();
        if (window.lucide && lucide.createIcons) lucide.createIcons();
    }

    function renderDbSchemaTable() {
        const tbody = document.getElementById('db-schema-tbody');
        if (!tbody) return;

        if (!dbState.schema || dbState.schema.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">No schema columns found.</td></tr>';
            return;
        }

        let html = '';
        dbState.schema.forEach((col, idx) => {
            html += `
                <tr>
                    <td style="color: var(--text-muted); font-size: 11px;">${idx + 1}</td>
                    <td><strong>${escapeHtml(col.name)}</strong></td>
                    <td style="color: var(--blue); font-weight: 600;">${escapeHtml(col.type)}</td>
                    <td>${col.not_null ? '<span style="color: #ef4444; font-size: 11px; font-weight: 600;">NOT NULL</span>' : '<span style="color: var(--text-muted); font-size: 11px;">NULLABLE</span>'}</td>
                    <td style="color: var(--text-muted); font-size: 11px;">${col.default_value !== null ? escapeHtml(String(col.default_value)) : '<span class="db-cell-null">None</span>'}</td>
                    <td>${col.is_pk ? '<span class="db-pk-badge"><i data-lucide="key" style="width: 10px; height: 10px;"></i> PRIMARY KEY</span>' : '-'}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
        if (window.lucide && lucide.createIcons) lucide.createIcons();
    }

    function sortDbColumn(col) {
        if (dbState.sortCol === col) {
            dbState.sortDir = dbState.sortDir === 'ASC' ? 'DESC' : 'ASC';
        } else {
            dbState.sortCol = col;
            dbState.sortDir = 'ASC';
        }
        fetchTableDataRows(dbState.activeTable, 1);
    }

    function executeDbTableSearch() {
        const input = document.getElementById('db-record-search-input');
        dbState.search = input ? input.value.trim() : '';
        fetchTableDataRows(dbState.activeTable, 1);
    }

    function changeDbPageSize(newSize) {
        dbState.pageSize = parseInt(newSize, 10) || 25;
        fetchTableDataRows(dbState.activeTable, 1);
    }

    function navigateDbPage(delta) {
        const newPage = dbState.page + delta;
        if (newPage >= 1 && newPage <= dbState.totalPages) {
            fetchTableDataRows(dbState.activeTable, newPage);
        }
    }

    function updateDbPaginationControls() {
        const summary = document.getElementById('db-pagination-summary');
        const pageLabel = document.getElementById('db-page-current-label');
        const prevBtn = document.getElementById('db-page-prev');
        const nextBtn = document.getElementById('db-page-next');

        const start = dbState.totalRows === 0 ? 0 : (dbState.page - 1) * dbState.pageSize + 1;
        const end = Math.min(dbState.page * dbState.pageSize, dbState.totalRows);

        if (summary) summary.textContent = `Showing ${start.toLocaleString()} - ${end.toLocaleString()} of ${dbState.totalRows.toLocaleString()} rows`;
        if (pageLabel) pageLabel.textContent = `Page ${dbState.page} of ${dbState.totalPages}`;
        if (prevBtn) prevBtn.disabled = dbState.page <= 1;
        if (nextBtn) nextBtn.disabled = dbState.page >= dbState.totalPages;
    }

    function toggleSelectAllDbRows(masterCb) {
        const check = masterCb.checked;
        document.querySelectorAll('.db-row-checkbox').forEach(cb => {
            cb.checked = check;
            if (check) dbState.selectedRowIds.add(cb.value);
            else dbState.selectedRowIds.delete(cb.value);
            const tr = cb.closest('tr');
            if (tr) tr.classList.toggle('row-selected', check);
        });
        updateDbBatchDeleteButton();
    }

    function toggleSelectDbRow(rowPk, cb) {
        if (cb.checked) dbState.selectedRowIds.add(String(rowPk));
        else dbState.selectedRowIds.delete(String(rowPk));

        const tr = cb.closest('tr');
        if (tr) tr.classList.toggle('row-selected', cb.checked);
        updateDbBatchDeleteButton();
    }

    function updateDbBatchDeleteButton() {
        const btn = document.getElementById('db-btn-batch-delete');
        const countSpan = document.getElementById('db-selected-count');
        const count = dbState.selectedRowIds.size;
        if (countSpan) countSpan.textContent = count;
        if (btn) btn.classList.toggle('hidden', count === 0);
    }

    // Modal Handlers
    function closeDbModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    }

    function openInsertRowModal() {
        if (!dbState.schema || dbState.schema.length === 0) {
            showToast("Table schema not loaded", "error");
            return;
        }

        const sub = document.getElementById('modal-db-insert-sub');
        if (sub) sub.textContent = `Table: ${dbState.activeTable}`;

        const container = document.getElementById('db-insert-fields-container');
        if (!container) return;

        let html = '';
        dbState.schema.forEach(col => {
            const isAutoPk = col.is_pk && col.type.toUpperCase().includes('INT');
            const placeholder = isAutoPk ? '(Auto-generated Primary Key)' : `Enter ${col.name}...`;
            const typeLower = col.type.toLowerCase();
            const inputType = typeLower.includes('int') || typeLower.includes('real') ? 'number' : (typeLower.includes('date') ? 'datetime-local' : 'text');

            html += `
                <div class="db-input-group">
                    <label class="db-label">
                        <span>${col.name}${col.is_pk ? ' 🔑' : ''}</span>
                        <span class="db-label-type">${col.type}</span>
                    </label>
                    <input type="${inputType}" name="${col.name}" class="db-input" placeholder="${placeholder}" ${isAutoPk ? 'disabled' : ''} />
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('modal-db-insert')?.classList.remove('hidden');
    }

    function submitInsertDbRow(e) {
        e.preventDefault();
        const form = document.getElementById('form-db-insert');
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch(`/api/database/table/${dbState.activeTable}/insert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        })
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                showToast(res.message, "success");
                closeDbModal('modal-db-insert');
                fetchTableDataRows(dbState.activeTable, 1);
                refreshDatabaseStudio(); // update row counts
            } else {
                showToast(res.message, "error");
            }
        })
        .catch(err => showToast(err.message, "error"));
    }

    function openEditRowModal(rowIndex) {
        const row = dbState.data[rowIndex];
        if (!row) return;

        const sub = document.getElementById('modal-db-edit-sub');
        if (sub) sub.textContent = `Table: ${dbState.activeTable}`;

        const pkIdx = dbState.columns.indexOf(dbState.pkCol);
        const pkVal = pkIdx !== -1 ? row[pkIdx] : null;

        document.getElementById('db-edit-pk-col').value = dbState.pkCol;
        document.getElementById('db-edit-pk-val').value = pkVal;

        const container = document.getElementById('db-edit-fields-container');
        if (!container) return;

        let html = '';
        dbState.columns.forEach((colName, cIdx) => {
            const schemaCol = dbState.schema.find(s => s.name === colName) || {};
            const isPk = colName === dbState.pkCol;
            const val = row[cIdx] !== null ? row[cIdx] : '';

            html += `
                <div class="db-input-group">
                    <label class="db-label">
                        <span>${colName}${isPk ? ' 🔑' : ''}</span>
                        <span class="db-label-type">${schemaCol.type || 'TEXT'}</span>
                    </label>
                    <input type="text" name="${colName}" class="db-input" value="${escapeHtml(String(val))}" ${isPk ? 'readonly style="opacity:0.6; cursor:not-allowed;"' : ''} />
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('modal-db-edit')?.classList.remove('hidden');
    }

    function submitUpdateDbRow(e) {
        e.preventDefault();
        const form = document.getElementById('form-db-edit');
        const formData = new FormData(form);
        const pkCol = document.getElementById('db-edit-pk-col').value;
        const pkVal = document.getElementById('db-edit-pk-val').value;
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch(`/api/database/table/${dbState.activeTable}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pk_column: pkCol, pk_value: pkVal, data })
        })
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                showToast(res.message, "success");
                closeDbModal('modal-db-edit');
                fetchTableDataRows(dbState.activeTable, dbState.page);
            } else {
                showToast(res.message, "error");
            }
        })
        .catch(err => showToast(err.message, "error"));
    }

    function deleteSingleDbRow(pkVal) {
        if (!confirm(`Are you sure you want to delete record (${dbState.pkCol} = ${pkVal}) from table ${dbState.activeTable}?`)) {
            return;
        }

        fetch(`/api/database/table/${dbState.activeTable}/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pk_column: dbState.pkCol, pk_values: [pkVal] })
        })
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                showToast(res.message, "success");
                fetchTableDataRows(dbState.activeTable, dbState.page);
                refreshDatabaseStudio();
            } else {
                showToast(res.message, "error");
            }
        })
        .catch(err => showToast(err.message, "error"));
    }

    function deleteSelectedDbRows() {
        const count = dbState.selectedRowIds.size;
        if (count === 0) return;

        if (!confirm(`Are you sure you want to permanently delete ${count} selected record(s) from table ${dbState.activeTable}?`)) {
            return;
        }

        const pkValues = Array.from(dbState.selectedRowIds);
        fetch(`/api/database/table/${dbState.activeTable}/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pk_column: dbState.pkCol, pk_values: pkValues })
        })
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                showToast(res.message, "success");
                dbState.selectedRowIds.clear();
                updateDbBatchDeleteButton();
                fetchTableDataRows(dbState.activeTable, dbState.page);
                refreshDatabaseStudio();
            } else {
                showToast(res.message, "error");
            }
        })
        .catch(err => showToast(err.message, "error"));
    }

    function confirmTruncateCurrentTable() {
        const modal = document.getElementById('modal-db-confirm');
        document.getElementById('db-confirm-title').textContent = `Truncate Table: ${dbState.activeTable}`;
        document.getElementById('db-confirm-sub').textContent = 'Irreversible Operation';
        document.getElementById('db-confirm-message').innerHTML = `
            Are you sure you want to empty all rows from <strong>${dbState.activeTable}</strong>?<br><br>
            All data records will be deleted and the autoincrement sequence will be reset.
        `;

        const confirmBtn = document.getElementById('btn-db-confirm-action');
        confirmBtn.onclick = function() {
            closeDbModal('modal-db-confirm');
            fetch(`/api/database/table/${dbState.activeTable}/truncate`, { method: 'POST' })
                .then(r => r.json())
                .then(res => {
                    if (res.status === 'success') {
                        showToast(res.message, "success");
                        fetchTableDataRows(dbState.activeTable, 1);
                        refreshDatabaseStudio();
                    } else {
                        showToast(res.message, "error");
                    }
                })
                .catch(e => showToast(e.message, "error"));
        };

        if (modal) modal.classList.remove('hidden');
    }

    function confirmDropCurrentTable() {
        const modal = document.getElementById('modal-db-confirm');
        document.getElementById('db-confirm-title').textContent = `Drop Table: ${dbState.activeTable}`;
        document.getElementById('db-confirm-sub').textContent = 'Permanent Table Destruction';
        document.getElementById('db-confirm-message').innerHTML = `
            <span style="color:#ef4444; font-weight:700;">DANGER:</span> Are you completely certain you want to destroy and drop table <strong>${dbState.activeTable}</strong>?<br><br>
            This will wipe out the table structure and all stored records permanently.
        `;

        const confirmBtn = document.getElementById('btn-db-confirm-action');
        confirmBtn.onclick = function() {
            closeDbModal('modal-db-confirm');
            fetch(`/api/database/table/${dbState.activeTable}/drop`, { method: 'POST' })
                .then(r => r.json())
                .then(res => {
                    if (res.status === 'success') {
                        showToast(res.message, "success");
                        dbState.activeTable = null;
                        refreshDatabaseStudio();
                    } else {
                        showToast(res.message, "error");
                    }
                })
                .catch(e => showToast(e.message, "error"));
        };

        if (modal) modal.classList.remove('hidden');
    }

    function openCreateTableModal() {
        document.getElementById('db-new-table-name').value = '';
        const container = document.getElementById('db-new-columns-container');
        if (container) {
            container.innerHTML = '';
            addDbColumnRow('id', 'INTEGER', true, true);
            addDbColumnRow('name', 'VARCHAR(100)', false, true);
            addDbColumnRow('created_at', 'DATETIME', false, false);
        }
        document.getElementById('modal-db-create-table')?.classList.remove('hidden');
    }

    function addDbColumnRow(colName = '', colType = 'TEXT', isPk = false, notNull = false) {
        const container = document.getElementById('db-new-columns-container');
        if (!container) return;

        const row = document.createElement('div');
        row.className = 'db-new-col-row';
        row.style.cssText = 'display: flex; gap: 6px; align-items: center;';
        row.innerHTML = `
            <input type="text" class="db-input col-name-input" placeholder="col_name" value="${colName}" required style="flex: 2; padding: 5px 8px; font-size: 11.5px;" />
            <select class="db-input col-type-select" style="flex: 1.5; padding: 5px 8px; font-size: 11.5px;">
                <option value="INTEGER" ${colType === 'INTEGER' ? 'selected' : ''}>INTEGER</option>
                <option value="TEXT" ${colType === 'TEXT' ? 'selected' : ''}>TEXT</option>
                <option value="VARCHAR(100)" ${colType === 'VARCHAR(100)' ? 'selected' : ''}>VARCHAR(100)</option>
                <option value="VARCHAR(255)" ${colType === 'VARCHAR(255)' ? 'selected' : ''}>VARCHAR(255)</option>
                <option value="DATETIME" ${colType === 'DATETIME' ? 'selected' : ''}>DATETIME</option>
                <option value="REAL" ${colType === 'REAL' ? 'selected' : ''}>REAL</option>
                <option value="BOOLEAN" ${colType === 'BOOLEAN' ? 'selected' : ''}>BOOLEAN</option>
            </select>
            <label style="display: flex; align-items: center; gap: 3px; font-size: 10.5px; color: var(--text-muted); cursor: pointer;">
                <input type="checkbox" class="col-pk-cb" ${isPk ? 'checked' : ''} /> PK
            </label>
            <label style="display: flex; align-items: center; gap: 3px; font-size: 10.5px; color: var(--text-muted); cursor: pointer;">
                <input type="checkbox" class="col-nn-cb" ${notNull ? 'checked' : ''} /> NotNull
            </label>
            <button type="button" class="db-btn-icon-sm" onclick="this.parentElement.remove()" style="color: #ef4444; width: 24px; height: 24px;" title="Remove Column">&times;</button>
        `;
        container.appendChild(row);
    }

    function submitCreateTable(e) {
        e.preventDefault();
        const tableName = document.getElementById('db-new-table-name').value.trim();
        const colRows = document.querySelectorAll('.db-new-col-row');
        const columns = [];

        colRows.forEach(row => {
            const name = row.querySelector('.col-name-input').value.trim();
            const type = row.querySelector('.col-type-select').value;
            const is_pk = row.querySelector('.col-pk-cb').checked;
            const not_null = row.querySelector('.col-nn-cb').checked;
            if (name) columns.push({ name, type, is_pk, not_null });
        });

        if (columns.length === 0) {
            showToast("Please add at least one column", "error");
            return;
        }

        fetch('/api/database/table/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table_name: tableName, columns })
        })
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                showToast(res.message, "success");
                closeDbModal('modal-db-create-table');
                dbState.activeTable = tableName;
                refreshDatabaseStudio();
            } else {
                showToast(res.message, "error");
            }
        })
        .catch(err => showToast(err.message, "error"));
    }

    function openDbSqlTab() {
        switchMainTab('database');
        switchDbWorkspaceTab('sql');
        document.getElementById('db-sql-input')?.focus();
    }

    function insertSqlTemplate(type) {
        const textarea = document.getElementById('db-sql-input');
        if (!textarea) return;

        const templates = {
            select_logs: 'SELECT id, door_name, door_state, timestamp, battery FROM logger_doorlog ORDER BY timestamp DESC LIMIT 25;',
            logs_by_door: 'SELECT door_name, COUNT(*) AS total_events, MAX(timestamp) AS last_active FROM logger_doorlog GROUP BY door_name ORDER BY total_events DESC;',
            users: 'SELECT id, username, email, is_superuser, is_active, date_joined FROM auth_user ORDER BY id ASC;',
            table_info: `PRAGMA table_info("${dbState.activeTable || 'logger_doorlog'}");`
        };

        textarea.value = templates[type] || '';
        textarea.focus();
    }

    function executeRawSqlQuery() {
        const textarea = document.getElementById('db-sql-input');
        const resultContainer = document.getElementById('db-sql-result-container');
        const sql = textarea ? textarea.value.trim() : '';
        if (!sql) {
            showToast("Please write an SQL query to execute", "info");
            return;
        }

        resultContainer.innerHTML = `
            <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 12.5px;">
                <i data-lucide="loader-2" class="spin-icon" style="width: 22px; height: 22px; display: inline-block; vertical-align: middle; margin-right: 8px;"></i>
                Executing query on live database...
            </div>
        `;
        if (window.lucide && lucide.createIcons) lucide.createIcons();

        fetch('/api/database/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sql })
        })
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                let html = '';
                if (res.is_select) {
                    html += `
                        <div class="db-sql-status-banner db-sql-status-success">
                            <span>✓ Query OK • ${res.row_count} row(s) returned</span>
                            <span style="font-family: var(--font-mono); font-size: 11px;">Duration: ${res.duration_ms} ms</span>
                        </div>
                        <div class="db-grid-scroll-box" style="max-height: 400px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                            <table class="db-data-table">
                                <thead>
                                    <tr>
                                        ${res.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${res.rows.map(r => `
                                        <tr>
                                            ${r.map(v => `<td>${v !== null ? escapeHtml(String(v)) : '<span class="db-cell-null">NULL</span>'}</td>`).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="db-sql-status-banner db-sql-status-success">
                            <span>✓ ${res.message}</span>
                            <span style="font-family: var(--font-mono); font-size: 11px;">Duration: ${res.duration_ms} ms</span>
                        </div>
                    `;
                    // Refresh table catalog in case tables were added/dropped
                    refreshDatabaseStudio();
                }
                resultContainer.innerHTML = html;
            } else {
                resultContainer.innerHTML = `
                    <div class="db-sql-status-banner db-sql-status-error">
                        <div>
                            <strong>SQL Execution Error:</strong><br>
                            <span style="font-family: var(--font-mono); font-size: 11.5px;">${escapeHtml(res.message || 'Unknown error')}</span>
                        </div>
                        <span style="font-family: var(--font-mono); font-size: 11px;">${res.duration_ms || 0} ms</span>
                    </div>
                `;
            }
            if (window.lucide && lucide.createIcons) lucide.createIcons();
        })
        .catch(err => {
            resultContainer.innerHTML = `
                <div class="db-sql-status-banner db-sql-status-error">
                    <span>${escapeHtml(err.message)}</span>
                </div>
            `;
        });
    }

    function toggleDbExportMenu() {
        const menu = document.getElementById('db-export-dropdown');
        if (menu) menu.classList.toggle('hidden');
    }

    function exportCurrentTable(format) {
        toggleDbExportMenu();
        if (!dbState.activeTable) return;
        window.location.href = `/api/database/table/${dbState.activeTable}/export?format=${format}`;
    }

    // Close export dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('db-export-dropdown');
        if (dropdown && !dropdown.classList.contains('hidden') && !e.target.closest('.db-dropdown-wrap')) {
            dropdown.classList.add('hidden');
        }
    });
