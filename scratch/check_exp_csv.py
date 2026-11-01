with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [line.strip() for line in text.split('\n') if 'exportAnalyticsCSV' in line]
print("Found exportAnalyticsCSV:", matches)

