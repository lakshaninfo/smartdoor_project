import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add getRelativeTimeString, formatLogTimestampDetails, groupAllLogsByDoor before renderNotificationList
missing_utils = """
    // -------------------------------------------------------------
    // Comprehensive Relative Time & Log Grouping Utilities
    // -------------------------------------------------------------

    function getRelativeTimeString(dateInput) {
        if (!dateInput) return 'Never';
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return String(dateInput);
        const now = new Date();
        const diffSec = Math.floor((now - d) / 1000);
        if (diffSec < 0) return 'Just now';
        if (diffSec < 45) return 'Just now';
        if (diffSec < 90) return '1m ago';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr}h ago`;
        const diffDays = Math.floor(diffHr / 24);
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    window.getRelativeTimeString = getRelativeTimeString;

    function formatLogTimestampDetails(timestampStr) {
        if (!timestampStr) {
            return { time: '--:--', date: '----/--/--', relative: '--' };
        }
        const d = new Date(timestampStr);
        if (isNaN(d.getTime())) {
            return { time: String(timestampStr), date: '', relative: '' };
        }
        const hours = d.getHours();
        const mins = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
        const time = `${formattedHours}:${mins} ${ampm}`;
        const date = d.toISOString().split('T')[0];
        const relative = getRelativeTimeString(timestampStr);
        return { time, date, relative };
    }
    window.formatLogTimestampDetails = formatLogTimestampDetails;

    function groupAllLogsByDoor(logs) {
        if (!Array.isArray(logs) || logs.length === 0) return [];
        const groupMap = new Map();
        logs.forEach(log => {
            const macKey = (log.mac_address || log.door_name || 'UNKNOWN').toUpperCase();
            if (!groupMap.has(macKey)) {
                groupMap.set(macKey, {
                    mac_address: log.mac_address || 'UNKNOWN',
                    door_name: log.door_name || 'Unnamed Sensor',
                    logs: []
                });
            }
            groupMap.get(macKey).logs.push(log);
        });

        const groups = Array.from(groupMap.values());
        groups.forEach(g => {
            g.logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            if (g.logs[0] && g.logs[0].door_name) {
                g.door_name = g.logs[0].door_name;
            }
        });

        groups.sort((a, b) => {
            const timeA = a.logs[0] ? new Date(a.logs[0].timestamp).getTime() : 0;
            const timeB = b.logs[0] ? new Date(b.logs[0].timestamp).getTime() : 0;
            return timeB - timeA;
        });

        return groups;
    }
    window.groupAllLogsByDoor = groupAllLogsByDoor;

    function renderNotificationList() {
"""

if 'function getRelativeTimeString' not in content:
    assert 'function renderNotificationList() {' in content
    content = content.replace('    function renderNotificationList() {', missing_utils, 1)
    print("Added getRelativeTimeString, formatLogTimestampDetails, and groupAllLogsByDoor")
else:
    print("getRelativeTimeString already present")

# 2. Update selectBuildingFromCampus
old_select_bldg = """    function selectBuildingFromCampus(buildingId) {
        selectBuilding(buildingId);
        const target = (typeof B !== 'undefined' && Array.isArray(B)) ? B.find(b => b.id === buildingId || b.name === buildingId) : null;
        if (target && typeof openB === 'function') {
            openB(target);
        } else {
            switchMainTab('floorplan');
            showToast("Entered building floor plan", "success");
        }
    }"""

new_select_bldg = """    function selectBuildingFromCampus(buildingId) {
        selectBuilding(buildingId);
        const target = (typeof B !== 'undefined' && Array.isArray(B)) ? B.find(b => b.id === buildingId || b.name === buildingId) : null;
        if (typeof openBuildingFromCampus === 'function' && target) {
            openBuildingFromCampus(target);
        } else if (typeof openB === 'function') {
            openB(target || buildingId);
        } else {
            switchMainTab('floorplan');
            showToast("Entered building floor plan", "success");
        }
    }
    window.selectBuildingFromCampus = selectBuildingFromCampus;"""

if old_select_bldg in content:
    content = content.replace(old_select_bldg, new_select_bldg, 1)
    print("Updated selectBuildingFromCampus")
else:
    print("selectBuildingFromCampus pattern not matched directly, checking normalized...")
    content = re.sub(
        r'function selectBuildingFromCampus\(buildingId\)\s*\{[\s\S]*?showToast\("Entered building floor plan", "success"\);\s*\}\s*\}',
        new_select_bldg.strip(),
        content
    )
    print("Replaced selectBuildingFromCampus via regex")

# 3. Update openB to be resilient and handle missing elements by redirecting to openBuildingFromCampus
old_openb_head = """    async function openB(b) {
        const stage = $('stage'), campus = $('campus'), interior = $('interior'), veil = $('veil'), hint = $('hint');
        if (busy || !stage || !campus || !interior || !veil) return;"""

new_openb_head = """    async function openB(b) {
        if (!b) return;
        const bldgObj = (typeof b === 'string')
            ? ((typeof B !== 'undefined' && Array.isArray(B)) ? B.find(x => x.id === b || x.name === b) : { id: b, name: b })
            : b;
        if (!bldgObj) return;

        const stage = $('stage'), campus = $('campus'), interior = $('interior'), veil = $('veil'), hint = $('hint');
        if (!stage || !interior || !veil || interior.offsetParent === null) {
            if (typeof openBuildingFromCampus === 'function') {
                return openBuildingFromCampus(bldgObj);
            }
        }
        if (busy || !stage || !campus || !interior || !veil) return;"""

if old_openb_head in content:
    content = content.replace(old_openb_head, new_openb_head, 1)
    print("Updated openB")
else:
    print("openB pattern not matched directly, checking normalized...")
    content = re.sub(
        r'async function openB\(b\)\s*\{\s*const stage = \$\(\'stage\'\)[\s\S]*?if \(busy \|\| !stage \|\| !campus \|\| !interior \|\| !veil\) return;',
        new_openb_head.strip(),
        content
    )
    print("Replaced openB via regex")

# 4. Database Studio window exports & aliases
db_exports = """
    // Database Studio Global Aliases & Window API Bindings
    function selectDbTable(tableName) {
        if (typeof loadDbTable === 'function') {
            loadDbTable(tableName, 1);
        }
    }
    window.selectDbTable = selectDbTable;

    function editDbRowModal(rowId) {
        if (typeof openEditRowModal === 'function') {
            openEditRowModal(rowId);
        }
    }
    window.editDbRowModal = editDbRowModal;

    window.initDatabaseStudio = initDatabaseStudio;
    window.refreshDatabaseStudio = refreshDatabaseStudio;
    window.renderDbOverview = renderDbOverview;
    window.renderDbTablesList = renderDbTablesList;
    window.filterDbTableList = filterDbTableList;
    window.loadDbTable = loadDbTable;
    window.switchDbWorkspaceTab = switchDbWorkspaceTab;
    window.openDbSqlTab = openDbSqlTab;
    window.openInsertRowModal = openInsertRowModal;
    window.openEditRowModal = openEditRowModal;
    window.closeDbModal = closeDbModal;
    window.openCreateTableModal = openCreateTableModal;
    window.addDbColumnRow = addDbColumnRow;
    window.deleteSingleDbRow = deleteSingleDbRow;
    window.deleteSelectedDbRows = deleteSelectedDbRows;
    window.executeDbTableSearch = executeDbTableSearch;
    window.toggleDbExportMenu = toggleDbExportMenu;
    window.exportCurrentTable = exportCurrentTable;
    window.confirmTruncateCurrentTable = confirmTruncateCurrentTable;
    window.confirmDropCurrentTable = confirmDropCurrentTable;
    window.changeDbPageSize = changeDbPageSize;
    window.navigateDbPage = navigateDbPage;
    window.insertSqlTemplate = insertSqlTemplate;
    window.executeRawSqlQuery = executeRawSqlQuery;
    window.submitInsertDbRow = submitInsertDbRow;
    window.submitUpdateDbRow = submitUpdateDbRow;
    window.submitCreateTable = submitCreateTable;
</script>"""

if 'window.initDatabaseStudio = initDatabaseStudio;' not in content:
    assert '</script>' in content
    # Replace last </script>
    last_idx = content.rfind('</script>')
    content = content[:last_idx] + db_exports + content[last_idx + len('</script>'):]
    print("Added Database Studio window bindings and aliases")

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved updated scripts.html")

