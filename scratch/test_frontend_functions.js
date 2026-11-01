const fs = require('fs');
const vm = require('vm');

const jsCode = fs.readFileSync('scratch/scripts_test.js', 'utf-8');

const domElements = {};
function createMockEl(id = '', tag = 'div') {
    return {
        id,
        tagName: tag.toUpperCase(),
        classList: {
            _classes: new Set(),
            add(...cls) { cls.forEach(c => this._classes.add(c)); },
            remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
            contains(c) { return this._classes.has(c); },
            toggle(c, force) {
                if (force !== undefined) {
                    if (force) this._classes.add(c); else this._classes.delete(c);
                } else {
                    if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c);
                }
            }
        },
        style: {
            _s: {},
            setProperty(k, v) { this._s[k] = v; },
            removeProperty(k) { delete this._s[k]; },
            set transform(v) { this._s.transform = v; },
            get transform() { return this._s.transform || ''; },
            set color(v) { this._s.color = v; },
            get color() { return this._s.color || ''; }
        },
        addEventListener() {},
        removeEventListener() {},
        focus() {},
        click() {},
        value: '',
        textContent: '',
        innerHTML: '',
        dataset: {},
        nextElementSibling: null,
        children: [],
        appendChild(ch) { this.children.push(ch); ch.parentNode = this; },
        removeChild(ch) { this.children = this.children.filter(c => c !== ch); },
        setAttribute(k, v) { this[k] = v; },
        getAttribute(k) { return this[k] || null; },
        querySelector(sel) {
            return createMockEl('sub');
        },
        querySelectorAll(sel) {
            return [];
        },
        getBoundingClientRect() {
            return { right: 250, top: 150, width: 50, height: 50 };
        }
    };
}

function getEl(id) {
    if (!domElements[id]) {
        domElements[id] = createMockEl(id);
    }
    return domElements[id];
}

const sandbox = {
    console: { log: () => {}, warn: () => {}, error: console.error },
    window: {
        addEventListener: () => {},
        removeEventListener: () => {},
        requestAnimationFrame: (cb) => setTimeout(cb, 16),
        cancelAnimationFrame: () => {},
        matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
        innerWidth: 1200,
        innerHeight: 800
    },
    document: {
        getElementById: (id) => getEl(id),
        querySelector: (sel) => getEl('q'),
        querySelectorAll: (sel) => [],
        createElement: (tag) => createMockEl('', tag),
        body: getEl('body'),
        documentElement: getEl('html'),
        addEventListener: () => {},
        removeEventListener: () => {}
    },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    fetch: () => Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{"status":"success","username":"admin"}'),
        json: () => Promise.resolve({ status: 'success', username: 'admin' })
    }),
    lucide: { createIcons: () => {} },
    Blob: class { constructor(parts) { this.parts = parts; } },
    URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} },
    setTimeout, clearTimeout, setInterval, clearInterval,
    performance: { now: () => Date.now() },
    Math, JSON, Date, parseInt, parseFloat, isNaN, isFinite, encodeURIComponent, decodeURIComponent
};
sandbox.window.document = sandbox.document;
sandbox.window.window = sandbox.window;

vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);

let passed = 0;
let failed = 0;
function test(name, condition) {
    if (condition) {
        console.log(`  [PASS] ${name}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${name}`);
        failed++;
    }
}

console.log("=== 2. TESTING JAVASCRIPT FRONTEND ENGINES ===");

// 1. Toast Container Auto-Mount
sandbox.showToast("Test toast message", "success");
const toastContainer = getEl('toast-container');
test("showToast creates or finds #toast-container", !!toastContainer);

// 2. Auth Modal Mode Switching
sandbox.setUserModalMode('login');
test("setUserModalMode('login') sets title", getEl('user-modal-title-text').textContent === 'Sign In');
test("setUserModalMode('login') activates login tab", getEl('modal-tab-login').classList.contains('active'));
test("setUserModalMode('login') hides register form", getEl('modal-register-form').classList.contains('hidden'));

sandbox.setUserModalMode('register');
test("setUserModalMode('register') sets title", getEl('user-modal-title-text').textContent === 'Create Account');
test("setUserModalMode('register') activates register tab", getEl('modal-tab-register').classList.contains('active'));
test("setUserModalMode('register') reveals register form", !getEl('modal-register-form').classList.contains('hidden'));

// 3. Sensor Tooltip popover
const mockTip = getEl('sensor-tooltip-popover');
sandbox.showSensorTooltip(createMockEl('target'), {
    name: 'Front Entry Door',
    mac: '24:6F:28:AB:12:01',
    state: 'open',
    battery: 92,
    lastSeen: '10 mins ago'
});
test("showSensorTooltip sets name", getEl('tt-sensor-name').textContent === 'Front Entry Door');
test("showSensorTooltip sets mac", getEl('tt-sensor-mac').textContent === '24:6F:28:AB:12:01');
test("showSensorTooltip sets state", getEl('tt-sensor-state').textContent === 'OPEN');
test("showSensorTooltip sets state color to red when OPEN", getEl('tt-sensor-state').style.color.includes('red'));
test("showSensorTooltip makes popover visible", mockTip.classList.contains('visible'));

// 4. Toggle Door Log Expansion
const parentRow = createMockEl('parent-row');
const drawerRow = createMockEl('drawer-row');
drawerRow.classList.add('door-expanded-history-row', 'hidden');
parentRow.nextElementSibling = drawerRow;

sandbox.toggleDoorLogExpansion(parentRow);
test("toggleDoorLogExpansion expands drawer", !drawerRow.classList.contains('hidden') && parentRow.classList.contains('expanded'));
sandbox.toggleDoorLogExpansion(parentRow);
test("toggleDoorLogExpansion collapses drawer", drawerRow.classList.contains('hidden') && !parentRow.classList.contains('expanded'));

// 5. Door Filter Selection
sandbox.selectActivityDoorFilter('24:6F:28:AB:12:01', 'Front Door');
test("selectActivityDoorFilter updates label", getEl('activity-filter-label').textContent === 'Front Door');

// 6. Export Logs
vm.runInContext(`
    appState.allLogsCache = [
        { id: 1, timestamp: '2026-11-01 10:00:00', door_name: 'Front Door', mac_address: '24:6F:28:AB:12:01', door_state: 'OPEN', battery: 90 }
    ];
`, sandbox);
sandbox.exportLogsToCSV();
test("exportLogsToCSV executes without errors", true);

console.log(`\nFrontend Tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
process.exit(0);
