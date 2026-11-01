import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_fn = 0
for idx, line in enumerate(lines):
    stripped = line.strip()
    if stripped.startswith('//') or not stripped:
        continue
    # Track simple braces
    # Check if this line looks like top-level statement
    # Let's check calls to renderCampus3D, initCampusSystem, etc.
    if 'renderCampus3D(' in stripped or 'initCampusSystem(' in stripped:
        print(f"Line {idx+1}: {stripped}")

