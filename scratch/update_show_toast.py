with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = """    function showToast(message, type = 'info', customDuration = null) {

        const container = document.getElementById('toast-container');

        if (!container) return;"""

replacement = """    function showToast(message, type = 'info', customDuration = null) {

        let container = document.getElementById('toast-container');

        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(container);
        }"""

if target in text:
    text = text.replace(target, replacement, 1)
    with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated showToast successfully in scripts.html")
else:
    print("Target not found directly, let's search flexibly")
    import re
    m = re.search(r'function\s+showToast\s*\([^)]*\)\s*\{[\s\r\n]*const\s+container\s*=\s*document\.getElementById\([\'\"]toast-container[\'\"]\);[\s\r\n]*if\s*\(!container\)\s*return;', text)
    if m:
        text = text[:m.start()] + replacement + text[m.end():]
        with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
            f.write(text)
        print("Updated showToast via regex in scripts.html")
    else:
        print("Regex also did not match")

