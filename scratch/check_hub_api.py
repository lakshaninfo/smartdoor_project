with open('Main_Hub_Unit/Main_Hub_Unit.ino', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

print(f"Total lines in Main_Hub_Unit.ino: {len(lines)}")
import re
for idx, line in enumerate(lines):
    if any(k in line.lower() for k in ['http', 'api', 'django', 'esp32_api', 'server', 'url', 'key', 'post']):
        if not line.strip().startswith('//') and not line.strip().startswith('/*'):
            print(f"{idx+1}: {line.strip()[:100]}")

