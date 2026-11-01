filepath = 'logger/templates/logger/includes/scripts.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Target lines 6185 to 6286
old_chunk = """                const freshRegistry = {};

                data.forEach(device => {

                    freshStatus[device.mac_address] = device.door_state;

                    const battVal = device.battery !== undefined ? device.battery : 100;

                    freshBattery[device.mac_address] = battVal;

                    freshRegistry[device.mac_address] = device.door_name;

                    const isAlarm = device.door_state === 'OPEN';

                    if (isAlarm) isAnyOpen = true;

                    const rssi = getMockRssiForMac(device.mac_address);

                    const battIcon = battVal < 15 ? 'battery-warning' : (battVal < 30 ? 'battery-low' : (battVal < 70 ? 'battery-medium' : 'battery-full'));

                    const battColorClass = battVal < 20 ? 'batt-crit' : (battVal < 50 ? 'batt-warn' : 'batt-good');

                    registryHtml += `

                        <div class="sensor-sidebar-card ${isAlarm ? 'card-open' : 'card-closed'}" onclick="focusDeviceOnCanvas('${device.mac_address}')" title="Click to highlight on floor plan">

                            <div class="sensor-card-top">

                                <div class="sensor-card-left">

                                    <div class="sensor-avatar ${isAlarm ? 'avatar-open' : 'avatar-closed'}">

                                        <i data-lucide="${isAlarm ? 'door-open' : 'door-closed'}"></i>

                                    </div>

                                    <div class="sensor-card-names">

                                        <strong class="sensor-card-title">${device.door_name}</strong>

                                        <span class="sensor-card-mac" onclick="copyMacToClipboard('${device.mac_address}', event, this)" title="Click to copy MAC">${device.mac_address}</span>

                                    </div>

                                </div>

                                <span class="status-pill-solid ${isAlarm ? 'state-open' : 'state-closed'}">

                                    <span class="state-dot ${isAlarm ? 'dot-pulse-open' : 'dot-closed'}"></span>

                                    <i data-lucide="${isAlarm ? 'unlock' : 'lock'}"></i>

                                    <span>${device.door_state}</span>

                                </span>

                            </div>

                            <div class="sensor-card-bottom">

                                <div class="telemetry-group">

                                    ${renderBatteryMicroGauge(battVal)}

                                    ${rssi ? renderRssiSignalBars(rssi) : ''}

                                </div>

                                <span class="sensor-locate-hint"><i data-lucide="crosshair"></i> Locate</span>

                            </div>

                        </div>

                    `;

                });

                appState.activeStatus = freshStatus;

                appState.activeBattery = freshBattery;

                appState.deviceRegistry = freshRegistry;

                const currentDataStr = JSON.stringify(data);

                if (registryList && appState.lastPollDataStr !== currentDataStr) {

                    appState.lastPollDataStr = currentDataStr;

                    registryList.innerHTML = registryHtml;

                    registryList.style.display = 'flex';

                    if (registryEmpty) registryEmpty.style.display = 'none';

                    lucide.createIcons();

                }"""

new_chunk = """                const freshRegistry = {};

                // 1. Process telemetry for ALL campus devices
                data.forEach(device => {
                    freshStatus[device.mac_address] = device.door_state;
                    const battVal = device.battery !== undefined ? device.battery : 100;
                    freshBattery[device.mac_address] = battVal;
                    freshRegistry[device.mac_address] = device.door_name;
                    if (device.door_state === 'OPEN') isAnyOpen = true;
                });

                appState.activeStatus = freshStatus;
                appState.activeBattery = freshBattery;
                appState.deviceRegistry = freshRegistry;

                // 2. Filter sensors by selected scope: 'floor' | 'building' | 'campus'
                const currentScope = (appState.campus && appState.campus.sensorScope) ? appState.campus.sensorScope : 'floor';
                const activeBldg = (appState.campus && appState.campus.buildings) ?
                    (appState.campus.buildings.find(b => b.id === appState.campus.activeBuildingId) || appState.campus.buildings[0]) : null;
                const activeFloor = activeBldg ?
                    (activeBldg.floors.find(f => f.id === appState.campus.activeFloorId) || activeBldg.floors[0]) : null;

                let displayDevices = data;

                if (currentScope === 'floor') {
                    const floorMacs = new Set();
                    const floorNames = new Set();
                    if (activeFloor && activeFloor.plan) {
                        (activeFloor.plan.doors || []).forEach(d => {
                            if (d.deviceMac) floorMacs.add(d.deviceMac.toUpperCase());
                            if (d.name) floorNames.add(d.name.toLowerCase().trim());
                        });
                        (activeFloor.plan.windows || []).forEach(w => {
                            if (w.deviceMac) floorMacs.add(w.deviceMac.toUpperCase());
                            if (w.name) floorNames.add(w.name.toLowerCase().trim());
                        });
                    }
                    displayDevices = data.filter(device => {
                        const mac = (device.mac_address || '').toUpperCase();
                        const name = (device.door_name || '').toLowerCase().trim();
                        return floorMacs.has(mac) || (name && floorNames.has(name));
                    });
                } else if (currentScope === 'building') {
                    const bldgMacs = new Set();
                    const bldgNames = new Set();
                    if (activeBldg && activeBldg.floors) {
                        activeBldg.floors.forEach(fl => {
                            (fl.plan?.doors || []).forEach(d => {
                                if (d.deviceMac) bldgMacs.add(d.deviceMac.toUpperCase());
                                if (d.name) bldgNames.add(d.name.toLowerCase().trim());
                            });
                            (fl.plan?.windows || []).forEach(w => {
                                if (w.deviceMac) bldgMacs.add(w.deviceMac.toUpperCase());
                                if (w.name) bldgNames.add(w.name.toLowerCase().trim());
                            });
                        });
                    }
                    displayDevices = data.filter(device => {
                        const mac = (device.mac_address || '').toUpperCase();
                        const name = (device.door_name || '').toLowerCase().trim();
                        return bldgMacs.has(mac) || (name && bldgNames.has(name));
                    });
                }

                // 3. Update Sensor Count Badge with filtered count
                if (rightSensorBadge) rightSensorBadge.textContent = `${displayDevices.length}`;

                // 4. Render HTML for visible devices
                displayDevices.forEach(device => {
                    const isAlarm = device.door_state === 'OPEN';
                    const battVal = device.battery !== undefined ? device.battery : 100;
                    const rssi = getMockRssiForMac(device.mac_address);
                    registryHtml += `
                        <div class="sensor-sidebar-card ${isAlarm ? 'card-open' : 'card-closed'}" onclick="focusDeviceOnCanvas('${device.mac_address}')" title="Click to highlight on floor plan">
                            <div class="sensor-card-top">
                                <div class="sensor-card-left">
                                    <div class="sensor-avatar ${isAlarm ? 'avatar-open' : 'avatar-closed'}">
                                        <i data-lucide="${isAlarm ? 'door-open' : 'door-closed'}"></i>
                                    </div>
                                    <div class="sensor-card-names">
                                        <strong class="sensor-card-title">${device.door_name}</strong>
                                        <span class="sensor-card-mac" onclick="copyMacToClipboard('${device.mac_address}', event, this)" title="Click to copy MAC">${device.mac_address}</span>
                                    </div>
                                </div>
                                <span class="status-pill-solid ${isAlarm ? 'state-open' : 'state-closed'}">
                                    <span class="state-dot ${isAlarm ? 'dot-pulse-open' : 'dot-closed'}"></span>
                                    <i data-lucide="${isAlarm ? 'unlock' : 'lock'}"></i>
                                    <span>${device.door_state}</span>
                                </span>
                            </div>
                            <div class="sensor-card-bottom">
                                <div class="telemetry-group">
                                    ${renderBatteryMicroGauge(battVal)}
                                    ${rssi ? renderRssiSignalBars(rssi) : ''}
                                </div>
                                <span class="sensor-locate-hint"><i data-lucide="crosshair"></i> Locate</span>
                            </div>
                        </div>
                    `;
                });

                const currentDataStr = `${JSON.stringify(displayDevices)}_${currentScope}_${activeBldg?.id}_${activeFloor?.id}`;

                if (displayDevices.length === 0) {
                    if (registryList) registryList.style.display = 'none';
                    if (registryEmpty) {
                        registryEmpty.style.display = 'flex';
                        const emptyTitle = document.getElementById("registry-empty-title");
                        const emptySub = document.getElementById("registry-empty-sub");
                        if (emptyTitle && emptySub) {
                            if (currentScope === 'floor') {
                                emptyTitle.textContent = "No Floor Sensors";
                                emptySub.textContent = `No sensors are mapped to ${activeFloor ? activeFloor.name : 'this floor'}.`;
                            } else if (currentScope === 'building') {
                                emptyTitle.textContent = "No Building Sensors";
                                emptySub.textContent = `No sensors are assigned to ${activeBldg ? activeBldg.name : 'this building'}.`;
                            } else {
                                emptyTitle.textContent = "No Active Sensors";
                                emptySub.textContent = "Connected sensors will appear here automatically.";
                            }
                        }
                    }
                    appState.lastPollDataStr = currentDataStr;
                    lucide.createIcons();
                } else {
                    if (registryEmpty) registryEmpty.style.display = 'none';
                    if (registryList && appState.lastPollDataStr !== currentDataStr) {
                        appState.lastPollDataStr = currentDataStr;
                        registryList.innerHTML = registryHtml;
                        registryList.style.display = 'flex';
                        lucide.createIcons();
                    }
                }"""

if old_chunk in content:
    content = content.replace(old_chunk, new_chunk)
    print("Replaced pollStatus chunk successfully!")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
else:
    print("old_chunk not found directly!")

