import sys

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        const toast = document.createElement('div');

        toast.className = `toast toast-${type}`;

        toast.dataset.rawMsg = message;"""

replacement = """        const toast = document.createElement('div');

        toast.className = `toast toast-${type}`;
        if (!toast.dataset) toast.dataset = {};

        toast.dataset.rawMsg = message;"""

if target in content:
    content = content.replace(target, replacement, 1)
    with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched toast.dataset null-safety")
else:
    print("Target not found")

