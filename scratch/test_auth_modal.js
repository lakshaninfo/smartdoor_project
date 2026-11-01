const fs = require('fs');
const vm = require('vm');

const jsCode = fs.readFileSync('scratch/scripts_test.js', 'utf-8');

const domElements = {};
function getOrCreateEl(id) {
    if (!domElements[id]) {
        domElements[id] = {
            id,
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
            style: { setProperty() {}, removeProperty() {} },
            focus() {},
            value: '',
            textContent: '',
            innerHTML: ''
        };
    }
    return domElements[id];
}

const sandbox = {
    console: { log: console.log, warn: console.warn, error: console.error },
    window: {
        addEventListener: () => {},
        removeEventListener: () => {},
        requestAnimationFrame: (cb) => setTimeout(cb, 16),
        cancelAnimationFrame: () => {},
        matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
        innerWidth: 1200
    },
    document: {
        getElementById: (id) => getOrCreateEl(id),
        querySelector: () => getOrCreateEl('q'),
        querySelectorAll: () => [],
        createElement: (tag) => getOrCreateEl(tag),
        body: getOrCreateEl('body'),
        documentElement: getOrCreateEl('html'),
        addEventListener: () => {},
        removeEventListener: () => {}
    },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    fetch: (url, opts) => Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{"status":"success","username":"testuser"}'),
        json: () => Promise.resolve({ status: 'success', username: 'testuser' })
    }),
    lucide: { createIcons: () => {} },
    setTimeout, clearTimeout, setInterval, clearInterval,
    performance: { now: () => Date.now() },
    Math, JSON, Date, parseInt, parseFloat, isNaN, isFinite, encodeURIComponent, decodeURIComponent
};
sandbox.window.document = sandbox.document;
sandbox.window.window = sandbox.window;

vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);

console.log("Testing setUserModalMode('login')...");
sandbox.setUserModalMode('login');
console.log("  title text:", getOrCreateEl('user-modal-title-text').textContent);
console.log("  login tab active:", getOrCreateEl('modal-tab-login').classList.contains('active'));
console.log("  reg tab active:", getOrCreateEl('modal-tab-register').classList.contains('active'));
console.log("  login form hidden:", getOrCreateEl('modal-login-form').classList.contains('hidden'));
console.log("  reg form hidden:", getOrCreateEl('modal-register-form').classList.contains('hidden'));

console.log("\nTesting setUserModalMode('register')...");
sandbox.setUserModalMode('register');
console.log("  title text:", getOrCreateEl('user-modal-title-text').textContent);
console.log("  login tab active:", getOrCreateEl('modal-tab-login').classList.contains('active'));
console.log("  reg tab active:", getOrCreateEl('modal-tab-register').classList.contains('active'));
console.log("  login form hidden:", getOrCreateEl('modal-login-form').classList.contains('hidden'));
console.log("  reg form hidden:", getOrCreateEl('modal-register-form').classList.contains('hidden'));

console.log("\nTesting performLogin()...");
getOrCreateEl('modal-input-username').value = 'admin';
getOrCreateEl('modal-input-password').value = 'admin123';
sandbox.performLogin();
setTimeout(() => {
    console.log("  performLogin completed successfully!");
    process.exit(0);
}, 100);

