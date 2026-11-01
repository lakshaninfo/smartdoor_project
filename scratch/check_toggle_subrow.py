with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    scripts = f.read()

print("toggleSubrowDetail exists?", "toggleSubrowDetail" in scripts)

