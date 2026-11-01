with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if any(k in line for k in ['fetchDoorHistoryLogs', 'filterActivityTable', 'populateActivityDoorFilter', 'setDateFilter']):
        print(f"{idx+1}: {line.strip()[:100]}")

