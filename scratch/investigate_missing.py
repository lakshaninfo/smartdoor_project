import os, re

templates_dir = 'logger/templates/logger'
targets = ['exportLogsToCSV', 'selectActivityDoorFilter', 'toggleDoorLogExpansion', 'setUserModalMode']

for root, dirs, files in os.walk(templates_dir):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fh:
                lines = fh.readlines()
            for idx, line in enumerate(lines, 1):
                for t in targets:
                    if t in line:
                        print(f"{f}:{idx}: {line.strip()}")
                if 'onclick=' in line and 'if' in line:
                    print(f"[onclick if] {f}:{idx}: {line.strip()}")

