import os

scripts_path = r'logger/templates/logger/includes/scripts.html'
with open(scripts_path, 'r', encoding='utf-8') as f:
    text = f.read()

old_func = '''    function selectBuildingFromCampus(buildingId) {

        selectBuilding(buildingId);

        switchMainTab('floorplan');

        showToast("Entered building floor plan", "success");

    }'''

new_func = '''    function selectBuildingFromCampus(buildingId) {
        selectBuilding(buildingId);
        const target = (typeof B !== 'undefined' && Array.isArray(B)) ? B.find(b => b.id === buildingId || b.name === buildingId) : null;
        if (target && typeof openB === 'function') {
            openB(target);
        } else {
            switchMainTab('floorplan');
            showToast("Entered building floor plan", "success");
        }
    }'''

if old_func in text:
    text = text.replace(old_func, new_func)
    with open(scripts_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated selectBuildingFromCampus successfully!')
else:
    print('old_func not found!')

