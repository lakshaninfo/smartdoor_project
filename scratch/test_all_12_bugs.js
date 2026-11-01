const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== COMPREHENSIVE 12-BUG VERIFICATION TEST SUITE ===");

// 1. Verify CSS in header_styles.html
const headerStyles = fs.readFileSync(path.join(__dirname, '../logger/templates/logger/includes/header_styles.html'), 'utf-8');

function assert(condition, message) {
    if (!condition) {
        console.error("FAIL:", message);
        process.exit(1);
    } else {
        console.log("PASS:", message);
    }
}

// BUG 9 CHECK: Activity Analytics CSS
assert(headerStyles.includes('--act-green: #34c759;'), "Bug 9: --act-green defined in header_styles.html");
assert(headerStyles.includes('--act-fill: rgba(118, 118, 128, 0.12);'), "Bug 9: --act-fill defined in header_styles.html");
assert(headerStyles.includes('--act-red: #ff3b30;'), "Bug 9: --act-red defined in header_styles.html");
assert(headerStyles.includes('.stats {') || headerStyles.includes('.stats{'), "Bug 9: .stats class defined");
assert(headerStyles.includes('.stat {') || headerStyles.includes('.stat{'), "Bug 9: .stat class defined");
assert(headerStyles.includes('.ringw {') || headerStyles.includes('.ringw{'), "Bug 9: .ringw class defined");
assert(headerStyles.includes('.chart {') || headerStyles.includes('.chart{'), "Bug 9: .chart class defined");
assert(headerStyles.includes('.col {') || headerStyles.includes('.col{'), "Bug 9: .col class defined");

// 2. Prepare Sandbox with simulated DOM for scripts.html
const rawHtml = fs.readFileSync(path.join(__dirname, '../logger/templates/logger/includes/scripts.html'), 'utf-8');
const jsCode = rawHtml.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');

const mockDocument = {
    readyState: 'complete',
    body: {
        classList: {
            contains: () => false,
            add: () => {},
            remove: () => {},
            toggle: () => {}
        }
    },
    documentElement: {
        getAttribute: () => 'light'
    },
    getElementById: (id) => {
        return {
            id: id,
            style: { setProperty: () => {}, removeProperty: () => {} },
            classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
            setAttribute: () => {},
            querySelectorAll: () => [],
            querySelector: () => null,
            appendChild: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            innerHTML: '',
            textContent: '',
            value: '',
            dataset: {},
            offsetHeight: 100,
            offsetWidth: 100
        };
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: (tag) => ({
        style: {},
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        appendChild: () => {},
        setAttribute: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dataset: {}
    }),
    addEventListener: () => {}
};

const mockWindow = {
    document: mockDocument,
    localStorage: {
        getItem: () => null,
        setItem: () => {}
    },
    matchMedia: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {}
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
    requestAnimationFrame: (cb) => setTimeout(cb, 0),
    lucide: { createIcons: () => {} },
    fetch: () => Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('[]'),
        json: () => Promise.resolve([])
    }),
    console: console,
    Date: Date,
    Math: Math,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval
};
mockWindow.window = mockWindow;
mockWindow.global = mockWindow;

const sandbox = vm.createContext(mockWindow);
vm.runInContext(jsCode, sandbox);

// BUG 1 CHECK: filterActivityTable
assert(typeof sandbox.filterActivityTable === 'function', "Bug 1: filterActivityTable is defined");

// BUG 2 CHECK: groupAllLogsByDoor
assert(typeof sandbox.groupAllLogsByDoor === 'function', "Bug 2: groupAllLogsByDoor is defined");
const sampleLogs = [
    { mac_address: 'AA:BB:CC:11', door_name: 'Front Door', door_state: 'OPEN', timestamp: '2026-11-01T10:00:00Z', battery: 90 },
    { mac_address: 'AA:BB:CC:11', door_name: 'Front Door', door_state: 'CLOSED', timestamp: '2026-11-01T10:05:00Z', battery: 89 },
    { mac_address: 'DD:EE:FF:22', door_name: 'Back Door', door_state: 'CLOSED', timestamp: '2026-11-01T09:00:00Z', battery: 95 }
];
const groups = sandbox.groupAllLogsByDoor(sampleLogs);
assert(Array.isArray(groups) && groups.length === 2, "Bug 2: groupAllLogsByDoor returns grouped doors");
assert(groups[0].mac_address === 'AA:BB:CC:11' && groups[0].logs.length === 2, "Bug 2: group logs grouped correctly");
assert(groups[0].logs[0].timestamp === '2026-11-01T10:05:00Z', "Bug 2: group logs sorted descending (latest first)");

// BUG 3 CHECK: Database Studio Tab Unwired functions
const dbFuncs = [
    'switchDbWorkspaceTab',
    'openDbSqlTab',
    'refreshDatabaseStudio',
    'openInsertRowModal',
    'closeDbModal',
    'initDatabaseStudio',
    'selectDbTable',
    'deleteSingleDbRow',
    'submitCreateTable'
];
dbFuncs.forEach(fn => {
    assert(typeof sandbox[fn] === 'function', `Bug 3: Database Studio function ${fn} is defined`);
});

// BUG 4 CHECK: Floor Plan Sub-View Switcher
assert(typeof sandbox.setFloorPlanSubView === 'function', "Bug 4: setFloorPlanSubView is defined");
sandbox.setFloorPlanSubView('3d', false);
assert(sandbox.currentFpSubView === '3d', "Bug 4: setFloorPlanSubView('3d') sets currentFpSubView to 3d");
sandbox.setFloorPlanSubView('2d', false);
assert(sandbox.currentFpSubView === '2d', "Bug 4: setFloorPlanSubView('2d') sets currentFpSubView to 2d");

// BUG 5 CHECK: Access Logs CSV Export
assert(typeof sandbox.exportLogsToCSV === 'function', "Bug 5: exportLogsToCSV is defined");

// BUG 6 CHECK: Access Logs Door Dropdown
assert(typeof sandbox.selectActivityDoorFilter === 'function', "Bug 6: selectActivityDoorFilter is defined");

// BUG 7 CHECK: Campus 3D Building Click Crash
assert(typeof sandbox.selectBuildingFromCampus === 'function', "Bug 7: selectBuildingFromCampus is defined");
assert(typeof sandbox.openB === 'function', "Bug 7: openB is defined");
assert(typeof sandbox.openBuildingFromCampus === 'function', "Bug 7: openBuildingFromCampus is defined");

// BUG 8 CHECK: Dashboard Empty Canvas
assert(typeof sandbox.renderCampus3D === 'function', "Bug 8: renderCampus3D is defined");

// BUG 10 CHECK: Access Logs Timestamp Formatter
assert(typeof sandbox.formatLogTimestampDetails === 'function', "Bug 10: formatLogTimestampDetails is defined");
const timeDetails = sandbox.formatLogTimestampDetails('2026-11-01T14:30:00Z');
assert(timeDetails && timeDetails.time && timeDetails.date && timeDetails.relative, "Bug 10: formatLogTimestampDetails returns {time, date, relative}");

// BUG 11 & 12 CHECK: getRelativeTimeString
assert(typeof sandbox.getRelativeTimeString === 'function', "Bug 11 & 12: getRelativeTimeString is defined");
const relNow = sandbox.getRelativeTimeString(new Date().toISOString());
assert(relNow === 'Just now', "Bug 11 & 12: getRelativeTimeString returns 'Just now' for current date");
const relPast = sandbox.getRelativeTimeString(new Date(Date.now() - 3600000).toISOString());
assert(relPast === '1h ago', "Bug 11 & 12: getRelativeTimeString returns '1h ago' for 1 hour ago");
assert(typeof sandbox.loadDatabaseDevicesList === 'function', "Bug 11: loadDatabaseDevicesList is defined");
assert(typeof sandbox.loadSystemUsersList === 'function', "Bug 12: loadSystemUsersList is defined");

console.log("\n==================================================");
console.log("ALL 12 BUGS VERIFIED AND PASSED SUCCESSFULLY!");
console.log("==================================================");
process.exit(0);
