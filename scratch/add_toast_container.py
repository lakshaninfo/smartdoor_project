with open('logger/templates/logger/includes/modals.html', 'r', encoding='utf-8') as f:
    text = f.read()

if 'id="toast-container"' not in text:
    text = text.rstrip() + '\n\n<!-- 4. Global Toast Notifications Mount Point -->\n<div id="toast-container" class="toast-container" aria-live="polite" aria-atomic="true"></div>\n'
    with open('logger/templates/logger/includes/modals.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Added toast-container to modals.html")
else:
    print("toast-container already present")

