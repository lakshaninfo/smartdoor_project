import os

scripts_path = r'logger/templates/logger/includes/scripts.html'
with open(scripts_path, 'r', encoding='utf-8') as f:
    text = f.read()

old_block = '''        // Also merge any custom user-added campus buildings
        if (appState.campus && appState.campus.buildings) {
            appState.campus.buildings.forEach((cb, idx) => {
                if (!B.some(b => b.id === cb.id || b.name === cb.name)) {
                    B.push({
                        id: cb.id,
                        name: cb.name,
                        x: 150 + (idx % 3) * 320,
                        y: 350 + Math.floor(idx / 3) * 220,
                        w: 240,
                        h: 180,
                        fl: (cb.floors || []).length || 2,
                        bad: 0,
                        s: (cb.floors || []).reduce((acc, f) => acc + (f.plan?.doors?.length || 0), 0),
                        c: '#e6ecf6'
                    });
                }
            });
        }'''

new_block = '''        // Merge custom user buildings with generous non-overlapping coordinates
        if (appState.campus && appState.campus.buildings) {
            appState.campus.buildings.forEach((cb, idx) => {
                // If it's the default HQ, link it to Admin Block
                if (cb.id === 'bldg_hq' || cb.name.toLowerCase().includes('headquarter')) {
                    const adminB = B.find(b => b.id === 'bldg_admin');
                    if (adminB) {
                        adminB.id = cb.id;
                        adminB.name = cb.name;
                    }
                    return;
                }
                if (cb.id === 'bldg_warehouse' || cb.name.toLowerCase().includes('logistics')) {
                    const whB = B.find(b => b.id === 'bldg_warehouse');
                    if (whB) {
                        whB.id = cb.id;
                        whB.name = cb.name;
                    }
                    return;
                }
                if (!B.some(b => b.id === cb.id || b.name === cb.name)) {
                    const col = idx % 2;
                    const row = Math.floor(idx / 2);
                    B.push({
                        id: cb.id,
                        name: cb.name,
                        x: 1100 + col * 300,
                        y: 40 + row * 240,
                        w: 220,
                        h: 170,
                        fl: (cb.floors || []).length || 2,
                        bad: 0,
                        s: (cb.floors || []).reduce((acc, f) => acc + (f.plan?.doors?.length || 0), 0),
                        c: '#e6ecf6'
                    });
                }
            });
        }'''

if old_block in text:
    text = text.replace(old_block, new_block)
    with open(scripts_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated building coordinate logic successfully!')
else:
    print('Pattern not found!')

