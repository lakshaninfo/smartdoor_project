import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx_start = content.find('function populateActivityDoorFilter() {')
idx_end = content.find('window.populateActivityDoorFilter = populateActivityDoorFilter;', idx_start)

assert idx_start != -1 and idx_end != -1, "populateActivityDoorFilter bounds not found"

new_fn = """function populateActivityDoorFilter() {
        const optionsContainer = document.getElementById('activity-filter-options');
        const selectEl = document.getElementById('door-filter-select');

        const logs = appState.allLogsCache || [];
        const uniqueDoors = new Map();
        logs.forEach(l => {
            if (l.mac_address && !uniqueDoors.has(l.mac_address)) {
                uniqueDoors.set(l.mac_address, l.door_name || l.mac_address);
            }
        });

        if (optionsContainer) {
            let html = `
                <div class="custom-dropdown-item ${!currentSelectedActivityMac ? 'selected-item' : ''}" onclick="selectActivityDoorFilter('', '-- All Doors --')">
                    <span>-- All Doors --</span>
                    ${!currentSelectedActivityMac ? '<i data-lucide="check"></i>' : ''}
                </div>
            `;
            uniqueDoors.forEach((doorName, mac) => {
                const isSel = currentSelectedActivityMac === mac;
                html += `
                    <div class="custom-dropdown-item ${isSel ? 'selected-item' : ''}" onclick="selectActivityDoorFilter('${mac}', '${doorName.replace(/'/g, "\\\\'")}')">
                        <span>${doorName}</span>
                        ${isSel ? '<i data-lucide="check"></i>' : ''}
                    </div>
                `;
            });
            optionsContainer.innerHTML = html;
            if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons({ el: optionsContainer });
        }

        if (selectEl) {
            let selHtml = '<option value="">All doors</option>';
            uniqueDoors.forEach((doorName, mac) => {
                selHtml += `<option value="${mac}" ${currentSelectedActivityMac === mac ? 'selected' : ''}>${doorName}</option>`;
            });
            selectEl.innerHTML = selHtml;
        }
    }
    """

content = content[:idx_start] + new_fn + content[idx_end:]

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched populateActivityDoorFilter cleanly!")

