import re

filepath = 'logger/templates/logger/includes/scripts.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update setSensorScope
old_set_scope = """    function setSensorScope(scope) {

        if (!appState.campus) initCampusSystem();

        appState.campus.sensorScope = scope;

        ['floor', 'bldg', 'campus'].forEach(s => {

            const btn = document.getElementById(`btn-scope-${s}`);

            if (btn) {

                if ((scope === 'building' && s === 'bldg') || scope === s) {

                    btn.classList.add("active");

                } else {

                    btn.classList.remove("active");

                }

            }

        });

        if (typeof pollStatus === 'function') pollStatus();

    }"""

new_set_scope = """    function setSensorScope(scope) {
        if (!appState.campus) initCampusSystem();
        appState.campus.sensorScope = scope;
        saveCampusData();
        ['floor', 'bldg', 'campus'].forEach(s => {
            const btn = document.getElementById(`btn-scope-${s}`);
            if (btn) {
                if ((scope === 'building' && s === 'bldg') || scope === s) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            }
        });
        appState.lastPollDataStr = null;
        if (typeof pollStatus === 'function') pollStatus();
    }"""

# 2. In selectBuilding and selectFloor, ensure appState.lastPollDataStr = null
old_select_bldg = """        if (typeof pollStatus === 'function') pollStatus();

    }

    function selectFloor(floorId) {"""

new_select_bldg = """        appState.lastPollDataStr = null;
        if (typeof pollStatus === 'function') pollStatus();
    }

    function selectFloor(floorId) {"""

old_select_flr = """        showToast(`Floor: ${fl.name}`, "info");

        if (typeof pollStatus === 'function') pollStatus();"""

new_select_flr = """        showToast(`Floor: ${fl.name}`, "info");
        appState.lastPollDataStr = null;
        if (typeof pollStatus === 'function') pollStatus();"""

# 3. In pollStatus, implement the sensorScope filter
# Let's locate the rendering of devices in pollStatus
print("Checking patterns...")
if old_set_scope in content:
    content = content.replace(old_set_scope, new_set_scope)
    print("Updated setSensorScope!")
else:
    print("old_set_scope not found directly, checking normalized...")

if old_select_bldg in content:
    content = content.replace(old_select_bldg, new_select_bldg)
    print("Updated selectBuilding cache clear!")
else:
    print("old_select_bldg not found directly")

if old_select_flr in content:
    content = content.replace(old_select_flr, new_select_flr)
    print("Updated selectFloor cache clear!")
else:
    print("old_select_flr not found directly")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

