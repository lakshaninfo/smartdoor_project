import re

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix undeclared statTotal, statOpen, statClosed
old_stat_block = """                    lucide.createIcons({ el: tableBody });

                    if (statTotal) statTotal.textContent = "0";

                    if (statOpen) statOpen.textContent = "0";

                    if (statClosed) statClosed.textContent = "0";

                    renderHourlyActivityChart([]);"""

new_stat_block = """                    lucide.createIcons({ el: tableBody });

                    const _st = document.getElementById("stat-total");
                    const _so = document.getElementById("stat-open");
                    const _sc = document.getElementById("stat-closed");
                    if (_st) _st.textContent = "0";
                    if (_so) _so.textContent = "0";
                    if (_sc) _sc.textContent = "0";

                    const _footer = document.getElementById('logs-footer-summary');
                    if (_footer) _footer.textContent = "0 events logged";

                    renderHourlyActivityChart([]);"""

if old_stat_block in text:
    text = text.replace(old_stat_block, new_stat_block, 1)
    print("Fixed statTotal/statOpen/statClosed undeclared block.")
else:
    # Try normalized
    text_norm = text.replace('\r\n', '\n')
    old_stat_norm = old_stat_block.replace('\r\n', '\n')
    if old_stat_norm in text_norm:
        text = text_norm.replace(old_stat_norm, new_stat_block.replace('\r\n', '\n'), 1)
        print("Fixed statTotal undeclared block via normalized text.")
    else:
        print("Warning: stat block not matched directly!")

# 2. Add filterActivityTable, exportLogsToCSV, toggleDoorLogExpansion, populateActivityDoorFilter, selectActivityDoorFilter
date_filter_needle = "        filterActivityTable();\n\n    }"
if date_filter_needle not in text:
    date_filter_needle = "        filterActivityTable();\r\n\r\n    }"

new_log_functions = """        filterActivityTable();
    }
    window.setDateFilter = setDateFilter;

    // -------------------------------------------------------------
    // Comprehensive Access Logs Table Engine
    // -------------------------------------------------------------
    function filterActivityTable() {
        const searchInput = document.getElementById('activity-search-input');
        const query = (searchInput?.value || '').trim().toLowerCase();
        const dateFilter = currentDateFilter || 'all';
        const selMac = (currentSelectedActivityMac || '').toLowerCase();
        const selHour = (typeof selectedChartHour !== 'undefined') ? selectedChartHour : null;

        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const yesterday = new Date(now.getTime() - 86400000);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

        const rows = document.querySelectorAll('#logs-table-body .activity-log-row');
        let visibleCount = 0;

        rows.forEach(row => {
            const rowMac = (row.dataset.mac || '').toLowerCase();
            const rowName = (row.dataset.doorName || '').toLowerCase();
            const rowState = (row.dataset.state || '').toLowerCase();
            const allTs = (row.dataset.allTimestamps || '').split(' ');
            const nextDrawer = row.nextElementSibling && row.nextElementSibling.classList.contains('door-expanded-history-row')
                ? row.nextElementSibling : null;

            // 1. MAC Filter
            if (selMac && rowMac !== selMac) {
                row.classList.add('hidden');
                if (nextDrawer) nextDrawer.classList.add('hidden');
                return;
            }

            // 2. Query Search
            if (query && !rowName.includes(query) && !rowMac.includes(query) && !rowState.includes(query)) {
                row.classList.add('hidden');
                if (nextDrawer) nextDrawer.classList.add('hidden');
                return;
            }

            // 3. Date Filter
            if (dateFilter !== 'all') {
                const matchesDate = allTs.some(ts => {
                    if (!ts) return false;
                    const datePart = ts.slice(0, 10);
                    if (dateFilter === 'today') return datePart === todayStr;
                    if (dateFilter === 'yesterday') return datePart === yesterdayStr;
                    if (dateFilter === '7days') {
                        const parsed = new Date(ts);
                        return !isNaN(parsed) && parsed >= sevenDaysAgo;
                    }
                    return true;
                });
                if (!matchesDate) {
                    row.classList.add('hidden');
                    if (nextDrawer) nextDrawer.classList.add('hidden');
                    return;
                }
            }

            // 4. Hour Filter
            if (selHour !== null && selHour !== undefined) {
                const matchesHour = allTs.some(ts => isHourMatchingFilter(ts, selHour));
                if (!matchesHour) {
                    row.classList.add('hidden');
                    if (nextDrawer) nextDrawer.classList.add('hidden');
                    return;
                }
            }

            row.classList.remove('hidden');
            visibleCount++;
        });

        const footer = document.getElementById('logs-footer-summary');
        if (footer) {
            footer.textContent = `Showing ${visibleCount} sensor group(s)`;
        }
    }
    window.filterActivityTable = filterActivityTable;

    function toggleDoorLogExpansion(row) {
        if (!row) return;
        const nextDrawer = row.nextElementSibling;
        if (!nextDrawer || !nextDrawer.classList.contains('door-expanded-history-row')) return;

        const isCurrentlyHidden = nextDrawer.classList.contains('hidden');
        if (isCurrentlyHidden) {
            nextDrawer.classList.remove('hidden');
            row.classList.add('expanded');
            const chev = row.querySelector('.expand-chevron');
            if (chev) chev.style.transform = 'rotate(180deg)';
        } else {
            nextDrawer.classList.add('hidden');
            row.classList.remove('expanded');
            const chev = row.querySelector('.expand-chevron');
            if (chev) chev.style.transform = 'rotate(0deg)';
        }
        if (window.lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons({ el: nextDrawer });
        }
    }
    window.toggleDoorLogExpansion = toggleDoorLogExpansion;

    function populateActivityDoorFilter() {
        const optionsContainer = document.getElementById('activity-filter-options');
        if (!optionsContainer) return;

        const logs = appState.allLogsCache || [];
        const uniqueDoors = new Map();
        logs.forEach(l => {
            if (l.mac_address && !uniqueDoors.has(l.mac_address)) {
                uniqueDoors.set(l.mac_address, l.door_name || l.mac_address);
            }
        });

        let html = `
            <div class="custom-dropdown-item ${!currentSelectedActivityMac ? 'selected-item' : ''}" onclick="selectActivityDoorFilter('', '-- All Doors --')">
                <span>-- All Doors --</span>
                ${!currentSelectedActivityMac ? '<i data-lucide=\"check\"></i>' : ''}
            </div>
        `;

        uniqueDoors.forEach((doorName, mac) => {
            const isSel = currentSelectedActivityMac === mac;
            html += `
                <div class="custom-dropdown-item ${isSel ? 'selected-item' : ''}" onclick="selectActivityDoorFilter('${mac}', '${doorName.replace(/'/g, "\\\\'")}')">
                    <span>${doorName}</span>
                    ${isSel ? '<i data-lucide=\"check\"></i>' : ''}
                </div>
            `;
        });

        optionsContainer.innerHTML = html;
        if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons({ el: optionsContainer });
    }
    window.populateActivityDoorFilter = populateActivityDoorFilter;

    function selectActivityDoorFilter(mac = '', label = '-- All Doors --') {
        currentSelectedActivityMac = mac || '';
        const labelEl = document.getElementById('activity-filter-label');
        if (labelEl) labelEl.textContent = mac ? label : 'All Doors';

        const dropdown = document.getElementById('activity-filter-options');
        if (dropdown) dropdown.classList.add('hidden');

        populateActivityDoorFilter();
        filterActivityTable();
        showToast(mac ? `Filtered by ${label}` : "Showing all door logs", "info");
    }
    window.selectActivityDoorFilter = selectActivityDoorFilter;

    function exportLogsToCSV() {
        const logs = appState.allLogsCache || [];
        if (!logs || logs.length === 0) {
            showToast("No access logs available to export", "warning");
            return;
        }

        const headers = ["ID", "Timestamp", "Door Name", "MAC Address", "State", "Battery (%)"];
        const rows = logs.map(l => [
            l.id || '',
            `"${l.timestamp || ''}"`,
            `"${(l.door_name || '').replace(/"/g, '""')}"`,
            `"${l.mac_address || ''}"`,
            l.door_state || '',
            l.battery !== undefined && l.battery !== null ? l.battery : 100
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\\r\\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const nowStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        a.href = url;
        a.download = `smartdoor_access_logs_${nowStr}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Exported ${logs.length} access logs to CSV`, "success");
    }
    window.exportLogsToCSV = exportLogsToCSV;"""

if date_filter_needle in text:
    text = text.replace(date_filter_needle, new_log_functions, 1)
    with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Inserted log functions successfully.")
else:
    # Try normalized
    text_norm = text.replace('\r\n', '\n')
    dfn_norm = date_filter_needle.replace('\r\n', '\n')
    if dfn_norm in text_norm:
        text_norm = text_norm.replace(dfn_norm, new_log_functions.replace('\r\n', '\n'), 1)
        with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
            f.write(text_norm)
        print("Inserted log functions via normalized text.")
    else:
        print("Warning: date_filter_needle not found!")

