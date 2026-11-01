import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Patch renderElevatorRail
old_rail = """    function renderElevatorRail() {

        const container = document.getElementById("elevator-buttons-list");

        if (!container) return;

        const bldg = appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId);

        if (!bldg || !bldg.floors) return;"""

new_rail = """    function renderElevatorRail() {

        const container = document.getElementById("elevator-buttons-list");

        if (!container) return;

        if (!appState.campus || !appState.campus.buildings) {
            if (typeof initCampusSystem === 'function') initCampusSystem();
        }
        const bldg = (appState.campus && appState.campus.buildings)
            ? (appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId) || appState.campus.buildings[0])
            : null;

        if (!bldg || !bldg.floors) return;"""

if old_rail in content:
    content = content.replace(old_rail, new_rail, 1)
    print("Patched renderElevatorRail")
else:
    content = re.sub(
        r'function renderElevatorRail\(\)\s*\{[\s\S]*?const bldg = appState\.campus\.buildings\.find\(b => b\.id === appState\.campus\.activeBuildingId\);[\s\S]*?if \(!bldg \|\| !bldg\.floors\) return;',
        new_rail.strip(),
        content
    )
    print("Patched renderElevatorRail via regex")

# 2. Patch renderCampusBreadcrumbs
old_crumbs = """    function renderCampusBreadcrumbs() {

        const bldg = appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId) || appState.campus.buildings[0];"""

new_crumbs = """    function renderCampusBreadcrumbs() {

        if (!appState.campus || !appState.campus.buildings) {
            if (typeof initCampusSystem === 'function') initCampusSystem();
        }
        const bldg = (appState.campus && appState.campus.buildings)
            ? (appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId) || appState.campus.buildings[0])
            : null;"""

if old_crumbs in content:
    content = content.replace(old_crumbs, new_crumbs, 1)
    print("Patched renderCampusBreadcrumbs")
else:
    content = re.sub(
        r'function renderCampusBreadcrumbs\(\)\s*\{[\s\S]*?const bldg = appState\.campus\.buildings\.find\(b => b\.id === appState\.campus\.activeBuildingId\) \|\| appState\.campus\.buildings\[0\];',
        new_crumbs.strip(),
        content
    )
    print("Patched renderCampusBreadcrumbs via regex")

# 3. Patch selectFloor
old_selfloor = """    function selectFloor(floorId) {
        const bldg = appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId);"""

new_selfloor = """    function selectFloor(floorId) {
        if (!appState.campus || !appState.campus.buildings) {
            if (typeof initCampusSystem === 'function') initCampusSystem();
        }
        const bldg = (appState.campus && appState.campus.buildings)
            ? (appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId) || appState.campus.buildings[0])
            : null;"""

if old_selfloor in content:
    content = content.replace(old_selfloor, new_selfloor, 1)
    print("Patched selectFloor")
else:
    content = re.sub(
        r'function selectFloor\(floorId\)\s*\{[\s\S]*?const bldg = appState\.campus\.buildings\.find\(b => b\.id === appState\.campus\.activeBuildingId\);',
        new_selfloor.strip(),
        content
    )
    print("Patched selectFloor via regex")

# 4. Patch selectBuilding
old_selbldg = """    function selectBuilding(buildingId, floorId = null) {

        const bldg = appState.campus.buildings.find(b => b.id === buildingId);"""

new_selbldg = """    function selectBuilding(buildingId, floorId = null) {

        if (!appState.campus || !appState.campus.buildings) {
            if (typeof initCampusSystem === 'function') initCampusSystem();
        }
        const bldg = (appState.campus && appState.campus.buildings)
            ? appState.campus.buildings.find(b => b.id === buildingId)
            : null;"""

if old_selbldg in content:
    content = content.replace(old_selbldg, new_selbldg, 1)
    print("Patched selectBuilding")
else:
    content = re.sub(
        r'function selectBuilding\(buildingId, floorId = null\)\s*\{[\s\S]*?const bldg = appState\.campus\.buildings\.find\(b => b\.id === buildingId\);',
        new_selbldg.strip(),
        content
    )
    print("Patched selectBuilding via regex")

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved updated scripts.html with campus null-safety")

