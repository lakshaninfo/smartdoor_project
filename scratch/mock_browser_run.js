// Test running scripts_test.js in a mocked browser context to detect runtime crashes
const fs = require('fs');
const vm = require('vm');

const jsCode = fs.readFileSync('scratch/scripts_test.js', 'utf-8');

const mockElement = (id = '') => ({
    id,
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
    style: { setProperty: () => {}, removeProperty: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    removeAttribute: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    appendChild: () => {},
    innerHTML: '',
    textContent: '',
    value: '',
    dataset: {}
});

const sandbox = {
    console: { log: () => {}, warn: () => {}, error: console.error },
    window: {
        addEventListener: () => {},
        removeEventListener: () => {},
        requestAnimationFrame: (cb) => setTimeout(cb, 16),
        cancelAnimationFrame: () => {},
        location: { href: '', reload: () => {} },
        matchMedia: (query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
        innerWidth: 1200,
        innerHeight: 800
    },
    document: {
        getElementById: (id) => mockElement(id),
        querySelector: () => mockElement(),
        querySelectorAll: () => [mockElement()],
        createElement: (tag) => mockElement(tag),
        body: mockElement('body'),
        documentElement: mockElement('html'),
        addEventListener: () => {},
        removeEventListener: () => {}
    },
    localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
    },
    sessionStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
    },
    fetch: () => Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('[]'),
        json: () => Promise.resolve([])
    }),
    lucide: {
        createIcons: () => {}
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    performance: { now: () => Date.now() },
    Math,
    JSON,
    Date,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    encodeURIComponent,
    decodeURIComponent
};

sandbox.window.document = sandbox.document;
sandbox.window.window = sandbox.window;
sandbox.window.localStorage = sandbox.localStorage;

try {
    vm.createContext(sandbox);
    vm.runInContext(jsCode, sandbox);
    console.log("Mock execution SUCCESSFUL: No top-level errors or undeclared variable crashes.");
} catch (err) {
    console.error("Runtime Crash detected in scripts_test.js:", err);
}
