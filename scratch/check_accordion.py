with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

for term in ['toggleGroupAccordion', 'toggleSubrowDetail', 'toggleDoorLogExpansion']:
    matches = [line.strip() for line in text.split('\n') if term in line]
    print(f"=== {term} ===")
    for m in matches:
        print("  ", m[:100])

