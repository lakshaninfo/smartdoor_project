with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if any(k in line for k in ['groupAllLogsByDoor', 'formatLogTimestampDetails', 'getRelativeTimeString']):
        print(f"Line {idx+1}: {line.strip()[:100]}")

