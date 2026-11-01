import os

scripts_path = r'logger/templates/logger/includes/scripts.html'
with open(scripts_path, 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = '// =========================================================================\n    // ANTIGRAVITY 3D INTERACTIVE BUILDING FLOOR PLAN ENGINE (PRESERVE-3D)'
if start_marker not in text:
    start_marker = 'ANTIGRAVITY 3D INTERACTIVE BUILDING FLOOR PLAN ENGINE'

s = text.find(start_marker)
# Find the start of the comment line
s = text.rfind('//', 0, s)

end_marker = 'window.renderCampus3D = renderCampus3D;'
e = text.find(end_marker) + len(end_marker)

print('Start:', s, 'End:', e)

new_js = '''// =========================================================================
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
    const F_WAREHOUSE = [
        {
            id: 'GF', name: 'Ground Floor', sub: 'LOADING & DISPATCH',
            rooms: [
                { n: 'Main Loading Bay', x: 0, y: 0, w: 467, h: 468, ok: 1, m: [['Cameras', '6 online'], ['Occupancy', '4 people'], ['Status', 'Normal']] },
                { n: 'Cold Storage Vault', x: 470, y: 0, w: 318, h: 234, ok: 1, m: [['Temperature', '−18 °C'], ['Cameras', '3 online'], ['Status', 'Normal']] },
                { n: 'Dispatch Office', x: 470, y: 237, w: 318, h: 231, ok: 0, m: [['Cameras', '2 online'], ['Occupancy', '2 people'], ['Status', 'Window sensor active']] }
            ],
            walls: [
                [0, 0, W, 6], [0, 462, 590, 6], [665, 462, 123, 6], [0, 0, 6, 214], [0, 254, 6, 214],
                [782, 0, 6, 468], [464, 0, 6, 337], [464, 377, 6, 91], [470, 231, 312, 6], [590, 462, 75, 6, WH, 1]
            ],
            dev: [
                [3, 234, 'Garage Entry'], [467, 357, 'Back Garden Gate'], [627, 465, 'Dispatch Window', 1]
            ],
            props: [
                [40, 30, 300, 22, 60, '#ea580c'], [40, 80, 300, 22, 60, '#ea580c'], [40, 380, 300, 22, 60, '#ea580c'], [40, 430, 300, 22, 60, '#ea580c'],
                [90, 196, 150, 76, 52, '#f1f5f9'], [240, 206, 46, 56, 40, '#2563eb'],
                [340, 120, 52, 52, 14, '#92400e'], [346, 126, 40, 40, 26, '#d6a46c'], [410, 120, 52, 52, 14, '#92400e'], [416, 126, 40, 40, 26, '#d6a46c'],
                [340, 310, 52, 52, 14, '#92400e'], [346, 316, 40, 40, 26, '#d6a46c'], [410, 310, 52, 52, 14, '#92400e'], [416, 316, 40, 40, 26, '#d6a46c'],
                [490, 24, 70, 40, 52, '#bae6fd'], [570, 24, 70, 40, 52, '#bae6fd'], [650, 24, 70, 40, 52, '#bae6fd'], [490, 170, 70, 40, 52, '#bae6fd'], [740, 90, 30, 90, 40, '#e0f2fe'],
                [520, 300, 90, 40, 22, '#92400e'], [520, 380, 90, 40, 22, '#92400e'], [550, 345, 16, 16, 14, '#1e293b'], [590, 432, 75, 22, 26, '#475569']
            ]
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
                [0, 0, W, 6], [0, 462, W, 6], [0, 0, 6, 468], [782, 0, 6, 200], [782, 260, 6, 208],
                [300, 0, 6, 100], [300, 140, 6, 190], [300, 370, 6, 98], [0, 231, 120, 6], [160, 231, 140, 6],
                [306, 300, 194, 6], [540, 300, 242, 6], [782, 200, 6, 60, WH, 1]
            ],
            dev: [
                [300, 120, 'Control Room Door'], [140, 234, 'Server Room Access'], [520, 303, 'Meeting Door', 1]
            ],
            props: [
                [20, 40, 240, 40, 20, '#475569'], [20, 32, 240, 6, 40, '#0f172a'], [20, 130, 240, 40, 20, '#475569'], [20, 122, 240, 6, 40, '#0f172a'],
                [30, 262, 26, 180, 70, '#1e293b'], [85, 262, 26, 180, 70, '#1e293b'], [140, 262, 26, 180, 70, '#1e293b'], [195, 262, 26, 180, 70, '#1e293b'], [250, 262, 26, 180, 70, '#1e293b'],
                [340, 40, 110, 50, 18, '#a3865a'], [490, 40, 110, 50, 18, '#a3865a'], [640, 40, 110, 50, 18, '#a3865a'],
                [340, 170, 110, 50, 18, '#a3865a'], [490, 170, 110, 50, 18, '#a3865a'], [640, 170, 110, 50, 18, '#a3865a'],
                [420, 350, 260, 70, 20, '#7c5a3a']
            ]
        },
        {
            id: '2F', name: 'Second Floor', sub: 'EXECUTIVE & TERRACE',
            rooms: [
                { n: 'Executive Suite', x: 0, y: 0, w: 465, h: 234, ok: 1, m: [['Occupancy', '2 people'], ['Access', 'Badge only'], ['Status', 'Normal']] },
                { n: 'Lounge', x: 471, y: 0, w: 317, h: 234, ok: 1, m: [['Occupancy', '5 people'], ['Cameras', '2 online'], ['Status', 'Normal']] },
                { n: 'Roof Terrace', x: 0, y: 237, w: 788, h: 231, ok: 1, c: 'color-mix(in srgb,#22c55e 22%,var(--floor))', m: [['Weather', '28 °C, clear'], ['Access', 'Open'], ['Status', 'Normal']] }
            ],
            walls: [
                [0, 0, W, 6], [0, 0, 6, 234], [782, 0, 6, 234], [0, 231, 300, 6], [340, 231, 448, 6],
                [468, 0, 6, 231], [0, 462, W, 6, 18, 1], [0, 237, 6, 231, 18, 1], [782, 237, 6, 231, 18, 1]
            ],
            dev: [
                [320, 234, 'Terrace Door'], [468, 110, 'Lounge Door']
            ],
            props: [
                [60, 60, 140, 60, 20, '#7c5a3a'], [260, 150, 120, 40, 24, '#64748b'],
                [500, 40, 120, 44, 24, '#0d9488'], [500, 150, 120, 44, 24, '#0d9488'], [660, 90, 80, 50, 14, '#7c5a3a'],
                [30, 270, 200, 24, 22, '#15803d'], [560, 270, 200, 24, 22, '#15803d'],
                [30, 420, 200, 24, 22, '#15803d'], [560, 420, 200, 24, 22, '#15803d'], [330, 340, 130, 30, 16, '#a16207']
            ]
        }
    ];

    let F = F_WAREHOUSE;

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

    // Camera Transformation Engine
    function apply() {
        const stage = $('stage'), scene = $('scene');
        if (!stage || !scene) return;
        const s = cam.zoom * Math.min(1, stage.clientWidth / 1000);
        scene.style.setProperty('--rx', cam.rx + 'deg');
        scene.style.setProperty('--rz', cam.rz + 'deg');
        scene.style.transform = `scale(${s}) rotateX(${cam.rx}deg) rotateZ(${cam.rz}deg) translate3d(${-(cam.cx - 394)}px,${-(cam.cy - 234)}px,${-cam.cz}px)`;
    }

    function camTo(t, ms = 900, ease = 'io') {
        return new Promise(res => {
            const s = { ...cam }, t0 = performance.now();
            auto = false;
            const ta = $('ta');
            if (ta) ta.classList.remove('on');
            vx = 0;
            (function f(n) {
                const k = Math.min(1, (n - t0) / ms);
                const e = EASE[ease](k);
                for (const p in t) cam[p] = s[p] + (t[p] - s[p]) * e;
                apply();
                k < 1 ? requestAnimationFrame(f) : res();
            })(t0);
        });
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
    }

    function renderLv() {
        const lv = $('lv');
        if (!lv) return;
        lv.innerHTML = '<i>LEVEL</i>' + F.slice(0, nF).map((f, i) => ({ f, i })).reverse().map(({ f, i }) =>
            `<button class="${i === cur ? 'on' : ''}" data-i="${i}">${f.id}</button>`
        ).join('');
        lv.querySelectorAll('button').forEach(b => {
            b.onclick = e => {
                e.stopPropagation();
                setFloor(+b.dataset.i);
            };
        });
    }

    function side() {
        const s = $('side');
        if (!s || !F[cur]) return;
        const f = F[cur];
        s.innerHTML = `<h2>${f.name}</h2><div class="sub">${f.sub}</div>`
            + (f.rooms || []).map((r, i) =>
                `<button class="zone ${sel === r ? 'on' : ''}" data-r="${i}"><span class="dot ${r.ok ? '' : 'w'}"></span>${r.n}</button>`
            ).join('')
            + '<div class="zh">ZONE DETAILS</div><div id="zd"><div class="row"><span>Hover or click a zone.</span></div></div><div class="note">Live sensor status synced.</div>';
        s.querySelectorAll('.zone').forEach(b => {
            b.onclick = () => pick(f.rooms[+b.dataset.r]);
        });
        if (sel) detail(sel);
    }

    function detail(r) {
        const z = $('zd');
        if (!z || !r) return;
        z.innerHTML = `<div class="row"><b>${r.n}</b></div>`
            + (r.m || []).map(m => `<div class="row"><span>${m[0]}</span><b>${m[1]}</b></div>`).join('');
    }

    function pick(r) {
        sel = r;
        if (F[cur] && F[cur].rooms) {
            F[cur].rooms.forEach(x => { if (x.t) x.t.classList.toggle('sel', x === r); });
        }
        side();
    }

    function crumb() {
        const bc = $('bc');
        const stage = $('stage');
        if (bc) {
            bc.innerHTML = bld && stage && stage.classList.contains('in')
                ? `<b style="cursor:pointer;color:var(--accent)" id="home">Campus 3D</b><span>›</span><b>${bld.name}</b><span>›</span><b>${F[cur] ? F[cur].name : 'Level'}</b>`
                : '<b>Campus 3D</b>';
            const h = $('home');
            if (h) h.onclick = closeB;
        }

        // Also synchronize host toolbar breadcrumb
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

    // Build Interior DOM
    function buildInteriorForBuilding(building) {
        const interior = $('interior');
        if (!interior) return;
        interior.innerHTML = '';

        el(interior, 'ground', 'left:-260px;top:-240px;width:1308px;height:948px;transform:translateZ(-6px)');
        el(interior, 'grid', 'left:-300px;top:-300px;width:1388px;height:1068px;transform:translateZ(-7px)');

        // Pick floor dataset
        const isLogistics = building.id === 'bldg_warehouse' || building.name.toLowerCase().includes('logistics') || building.name.toLowerCase().includes('warehouse');
        F = isLogistics ? F_WAREHOUSE : [
            {
                id: 'GF', name: 'Ground Floor', sub: 'LOBBY & SECURITY',
                rooms: [
                    { n: 'Welcome Lobby', x: 0, y: 0, w: 467, h: 468, ok: 1, m: [['Access', 'Open'], ['Visitors', '8 checked in'], ['Status', 'Normal']] },
                    { n: 'Security Command', x: 470, y: 0, w: 318, h: 234, ok: 1, m: [['Officers', '2 active'], ['Cameras', '12 feeds'], ['Status', 'Normal']] },
                    { n: 'Operations Hub', x: 470, y: 237, w: 318, h: 231, ok: 1, m: [['Telemetry', 'Realtime'], ['Status', 'Secured']] }
                ],
                walls: [
                    [0, 0, W, 6], [0, 462, 590, 6], [665, 462, 123, 6], [0, 0, 6, 214], [0, 254, 6, 214],
                    [782, 0, 6, 468], [464, 0, 6, 337], [464, 377, 6, 91], [470, 231, 312, 6], [590, 462, 75, 6, WH, 1]
                ],
                dev: [
                    [3, 234, 'Main Turnstile'], [467, 357, 'Command Door'], [627, 465, 'Emergency Exit', 0]
                ],
                props: [
                    [120, 160, 200, 60, 24, '#334155'], [160, 80, 120, 30, 16, '#94a3b8'],
                    [520, 60, 180, 40, 22, '#475569'], [520, 300, 180, 50, 22, '#475569']
                ]
            },
            {
                id: '1F', name: 'First Floor', sub: 'EXECUTIVE & SUITES',
                rooms: [
                    { n: 'Conference Center', x: 0, y: 0, w: 380, h: 468, ok: 1, m: [['Capacity', '24 people'], ['AV System', 'Active'], ['Status', 'Normal']] },
                    { n: 'Boardroom', x: 384, y: 0, w: 404, h: 468, ok: 1, m: [['Meeting', 'In Session'], ['Status', 'Secured']] }
                ],
                walls: [
                    [0, 0, W, 6], [0, 462, W, 6], [0, 0, 6, 468], [782, 0, 6, 468], [380, 0, 6, 380], [380, 420, 6, 48]
                ],
                dev: [
                    [380, 400, 'Boardroom Double Door']
                ],
                props: [
                    [60, 160, 260, 100, 20, '#7c5a3a'], [440, 150, 280, 120, 20, '#1e293b']
                ]
            }
        ];

        nF = Math.min(F.length, building.fl || 3);
        cur = 0;
        sel = null;

        F.forEach((f, i) => {
            const g = document.createElement('div');
            g.className = 'floor';
            f.g = g;
            interior.appendChild(g);

            box(g, -6, -6, W + 12, D + 12, 8, 'slab', 'var(--slabc)');

            (f.rooms || []).forEach(r => {
                const t = document.createElement('div');
                t.className = 'tile';
                t.style.cssText = `left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px` + (r.c ? `;--rc:${r.c}` : '');
                t.onmouseenter = () => { if (i === cur) detail(r); };
                t.onclick = () => { if (moved < 5 && i === cur) pick(r); };
                r.t = t;
                g.appendChild(t);
            });

            (f.walls || []).forEach(([x, y, w, h, H = WH, gl]) => box(g, x, y, w, h, H, gl ? 'glass' : 'wall', 'var(--wc)'));
            (f.props || []).forEach(([x, y, w, h, H, c]) => box(g, x, y, w, h, H, 'prop', c));

            (f.rooms || []).forEach(r => {
                const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
                pole(g, cx, cy, WH + 4);
                bb(g, cx, cy, `<div class="lab">${r.n}<small>MONITORED ZONE</small></div>`, WH + 4);
            });

            (f.dev || []).forEach(([x, y, n, w]) => {
                if (!w) el(g, 'pad', `left:${x}px;top:${y}px`);
                pole(g, x, y, WH + 4);
                bb(g, x, y, `<div class="lab dev"><span class="dot ${w ? 'w' : ''}"></span>${n}</div>`, WH + 4);
            });

            pole(g, W + 30, D - 6, 24);
            bb(g, W + 30, D - 6, `<div class="lab">${f.id} · ${f.name}</div>`, 24, 'tag').onclick = () => {
                if (moved < 5) setFloor(i);
            };
        });
    }

    // CLICK-TO-ENTER TRANSITION
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

    // BUILD CAMPUS 3D SCENE
    function renderCampus3DScene() {
        const stage = $('stage'), scene = $('scene'), campus = $('campus');
        if (!stage || !scene || !campus) return;

        // Initialize stage event listeners once
        if (!campusEngineInit) {
            campusEngineInit = true;

            stage.onpointerdown = e => {
                if (busy) return;
                drag = true;
                vx = 0;
                lx = e.clientX;
                ly = e.clientY;
                moved = 0;
                auto = false;
                const ta = $('ta');
                if (ta) ta.classList.remove('on');
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
                if (busy) return;
                const lo = stage.classList.contains('in') ? 0.6 : 0.35;
                cam.zoom = Math.max(lo, Math.min(2.4, cam.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
                apply();
            }, { passive: false });

            window.addEventListener('resize', apply);

            // 60FPS Turntable & Momentum Loop
            (function loop() {
                if (auto && !drag && !busy) {
                    cam.rz += 0.25;
                    apply();
                } else if (!drag && !busy && Math.abs(vx) > 0.01) {
                    cam.rz += vx;
                    vx *= 0.94;
                    apply();
                }
                requestAnimationFrame(loop);
            })();

            // Camera Presets
            document.querySelectorAll('[data-v]').forEach(b => {
                b.onclick = () => {
                    if (busy) return;
                    document.querySelectorAll('[data-v]').forEach(x => x.classList.remove('on'));
                    b.classList.add('on');
                    const presets = { iso: { rx: 56, rz: -34 }, top: { rx: 0, rz: 0 }, side: { rx: 84, rz: 0 } };
                    if (presets[b.dataset.v]) camTo(presets[b.dataset.v], 700);
                };
            });

            const ta = $('ta');
            if (ta) {
                ta.onclick = () => {
                    auto = !auto;
                    ta.classList.toggle('on', auto);
                };
            }
        }

        // Build Campus Terrain & Buildings
        campus.innerHTML = '';

        el(campus, 'ground', 'left:-200px;top:-200px;width:1500px;height:1000px;transform:translateZ(-8px)');
        box(campus, -70, -120, 1160, 640, 10, 'slab', 'var(--gnd)', -10);

        env = el(campus, 'bgrp', '');
        box(env, -40, 255, 1100, 16, 2, 'road', 'var(--road)');
        box(env, 200, 222, 8, 34, 2, 'road', 'var(--road)');
        box(env, 560, 170, 8, 86, 2, 'road', 'var(--road)');
        box(env, -40, 40, 60, 160, 2, 'grass', 'var(--gnd)');
        box(env, 1010, 60, 60, 180, 2, 'grass', 'var(--gnd)');

        const cr = el(env, 'car', 'animation-delay:-6s');
        box(cr, 0, 256, 34, 6, 8, 'prop', '#f97316', 2);
        box(cr, 8, 256, 17, 6, 6, 'prop', '#e2e8f0', 10);

        const cr2 = el(env, 'car', 'animation-duration:30s;animation-delay:-18s;animation-direction:reverse');
        box(cr2, 0, 264, 34, 6, 8, 'prop', '#8b5cf6', 2);
        box(cr2, 8, 264, 17, 6, 6, 'prop', '#e2e8f0', 10);

        box(env, 780, 300, 230, 170, 2, 'lot', 'var(--road)');
        [
            [800, 315, '#ef4444'], [800, 350, '#06b6d4'], [800, 385, '#f8fafc'],
            [800, 420, '#eab308'], [900, 315, '#3b82f6'], [900, 385, '#ef4444']
        ].forEach(([x, y, c]) => {
            box(env, x, y, 34, 16, 8, 'prop', c, 2);
            box(env, x + 8, y + 2, 17, 12, 6, 'prop', '#e2e8f0', 10);
        });

        [
            [90, 262], [415, 235], [775, 250], [1030, 250], [700, 240], [60, 40], [90, 200]
        ].forEach(([x, y]) => {
            box(env, x - 2, y - 2, 4, 4, 10, 'prop', '#92400e', 2);
            box(env, x - 8, y - 8, 16, 16, 18, 'prop', '#22c55e', 12);
        });

        // Buildings Collection B
        const hasLiveAlarm = (appState.devices || []).some(d => d.state === 'open' || d.state === 'alarm');
        B = [
            { id: 'bldg_warehouse', name: 'Logistics Center', x: 120, y: 20, w: 280, h: 200, fl: 3, bad: 0, s: 3, c: '#e6ecf6' },
            { id: 'bldg_admin', name: 'Admin Block', x: 470, y: 0, w: 220, h: 170, fl: 3, bad: hasLiveAlarm ? 1 : 0, s: 1, c: '#eaeef7' },
            { id: 'bldg_lab', name: 'Research Lab', x: 120, y: 300, w: 230, h: 160, fl: 2, bad: 0, s: 0, c: '#e3eaf5' },
            { id: 'bldg_d1', name: 'Warehouse D1', x: 420, y: 280, w: 330, h: 180, fl: 1, bad: 0, s: 0, c: '#e8ecf4' },
            { id: 'bldg_annex', name: 'Annex', x: 800, y: 60, w: 200, h: 170, fl: 2, bad: 0, s: 0, c: '#e5ebf6' }
        ];

        // Also merge any custom user-added campus buildings
        if (appState.campus && appState.campus.buildings) {
            appState.campus.buildings.forEach((cb, idx) => {
                if (!B.some(b => b.id === cb.id || b.name === cb.name)) {
                    B.push({
                        id: cb.id,
                        name: cb.name,
                        x: 150 + (idx % 3) * 320,
                        y: 350 + Math.floor(idx / 3) * 220,
                        w: 240,
                        h: 180,
                        fl: (cb.floors || []).length || 2,
                        bad: 0,
                        s: (cb.floors || []).reduce((acc, f) => acc + (f.plan?.doors?.length || 0), 0),
                        c: '#e6ecf6'
                    });
                }
            });
        }

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
            bb(g, cx, cy, `<div class="card"><div>${b.name}<span class="badge ${b.bad ? 'bad' : ''}">${b.bad ? 'ALARM' : 'SECURED'}</span></div><small>${b.fl} Floors • ${b.s} Sensors</small></div>`, hz, 'cardw');

            g.onclick = () => {
                if (moved < 5) openB(b);
            };
        });

        crumb();
        apply();
    }

    // Bridge standard renderCampus3D to new Engine
    function renderCampus3D() {
        renderCampus3DScene();
    }

    // Exported global controls
    function setFloorPlanSubView(subView) {
        const wrap3d = $('campus-3d-wrapper');
        const wrap2d = $('blueprint-svg-container');
        const btn3d = $('btn-fp-sub-3d');
        const btn2d = $('btn-fp-sub-2d');

        if (subView === '3d') {
            if (wrap3d) wrap3d.classList.remove('hidden');
            if (wrap2d) wrap2d.classList.add('hidden');
            if (btn3d) btn3d.classList.add('active');
            if (btn2d) btn2d.classList.remove('active');
            if (!bld && B.length > 0) openB(B[0]);
        } else {
            if (wrap3d) wrap3d.classList.add('hidden');
            if (wrap2d) wrap2d.classList.remove('hidden');
            if (btn2d) btn2d.classList.add('active');
            if (btn3d) btn3d.classList.remove('active');
            if (typeof renderPlan === 'function') renderPlan();
            if (typeof fitCanvasToRooms === 'function') setTimeout(fitCanvasToRooms, 40);
        }
    }

    function setFp3dCameraView(viewName) {
        const presets = { iso: { rx: 56, rz: -34 }, top: { rx: 0, rz: 0 }, side: { rx: 84, rz: 0 } };
        if (presets[viewName]) camTo(presets[viewName], 700);
    }

    function toggleFp3dAutoRotate() {
        auto = !auto;
        const ta = $('ta');
        if (ta) ta.classList.toggle('on', auto);
    }

    window.openB = openB;
    window.closeB = closeB;
    window.renderCampus3D = renderCampus3D;
    window.setFloorPlanSubView = setFloorPlanSubView;
    window.setFp3dCameraView = setFp3dCameraView;
    window.toggleFp3dAutoRotate = toggleFp3dAutoRotate;
'''

new_text = text[:s] + new_js + '\n' + text[e:]
with open(scripts_path, 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated scripts.html successfully!')

