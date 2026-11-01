import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace groups.forEach in fetchDoorHistoryLogs
idx_g_start = content.find('groups.forEach(group =>')
idx_g_end = content.find('if (tableBody) tableBody.innerHTML = rowsHtml;', idx_g_start)

assert idx_g_start != -1 and idx_g_end != -1, "groups.forEach not found"

new_groups_code = """groups.forEach(group => {
                    const latestLog = group.logs[0];
                    const latestIsOpen = latestLog.door_state === 'OPEN';
                    const allTimestamps = group.logs.map(l => l.timestamp).join(' ');
                    const eventCountText = `${group.logs.length} ${group.logs.length === 1 ? 'event' : 'events'}`;
                    const timeInfo = formatLogTimestampDetails(latestLog.timestamp);
                    const rssi = typeof getMockRssiForMac === 'function' ? getMockRssiForMac(latestLog.mac_address) : { quality: 'Good' };
                    const battVal = latestLog.battery !== null && latestLog.battery !== undefined ? latestLog.battery : 100;
                    const battClass = battVal >= 50 ? 'b-ok' : (battVal >= 25 ? 'b-mid' : 'b-low');

                    const dNameLower = (group.door_name || '').toLowerCase();
                    let zoneTag = 'Perimeter Access';
                    if (dNameLower.includes('window')) zoneTag = 'Window Zone';
                    else if (dNameLower.includes('gate') || dNameLower.includes('garden')) zoneTag = 'Perimeter Gate';
                    else if (dNameLower.includes('entrance') || dNameLower.includes('entry') || dNameLower.includes('front')) zoneTag = 'Primary Entry';
                    else if (dNameLower.includes('bedroom') || dNameLower.includes('living') || dNameLower.includes('room')) zoneTag = 'Interior Zone';
                    else if (dNameLower.includes('garage')) zoneTag = 'Garage Bay';

                    const isWindow = dNameLower.includes('window');

                    rowsHtml += `
                        <div class="lr activity-log-row" data-door-name="${(group.door_name || '').toLowerCase()}" data-mac="${(group.mac_address || '').toLowerCase()}" data-timestamp="${latestLog.timestamp}" data-state="${latestLog.door_state}" data-all-timestamps="${allTimestamps}">
                            <button type="button" class="lh" onclick="toggleDoorLogGroup(this)" aria-expanded="false">
                                <span class="ico ${latestIsOpen ? 'bad' : ''}">
                                    <i data-lucide="${isWindow ? 'maximize' : 'door-closed'}" class="ic"></i>
                                </span>
                                <span class="m">
                                    <b>${group.door_name}</b>
                                    <span>${zoneTag} · ${eventCountText}</span>
                                </span>
                                <span class="pill ${latestIsOpen ? 'bad' : ''}">
                                    <i></i>${latestIsOpen ? 'Open' : 'Closed'}
                                </span>
                                <span class="t">
                                    <b>${timeInfo.time}</b>
                                    ${timeInfo.date} · ${timeInfo.relative}
                                </span>
                                <i data-lucide="chevron-right" class="ch"></i>
                            </button>
                            <div class="det hidden">
                                <div class="facts">
                                    <div class="fact">
                                        <small>Device</small>
                                        <b class="mono">${latestLog.mac_address} <button type="button" class="link" onclick="copyMacToClipboard('${latestLog.mac_address}')" title="Copy MAC"><i data-lucide="copy" class="ic" style="width:13px;height:13px;display:inline;"></i></button></b>
                                    </div>
                                    <div class="fact">
                                        <small>Battery</small>
                                        <span class="bat ${battClass}"><span class="bt"><i style="width:${battVal}%"></i></span>${battVal}%</span>
                                    </div>
                                    <div class="fact">
                                        <small>Signal</small>
                                        <b><span class="sg" title="Signal"><i class="on"></i><i class="on"></i><i class="${rssi.quality === 'Excellent' ? 'on' : ''}"></i></span> ${rssi.quality || 'Good'}</b>
                                    </div>
                                </div>
                                <p class="hl">History</p>
                                <div class="evs">
                                    ${group.logs.slice(0, 10).map(l => {
                                        const lIsOpen = l.door_state === 'OPEN';
                                        const lt = formatLogTimestampDetails(l.timestamp);
                                        return `
                                            <div class="ev">
                                                <span class="d ${lIsOpen ? 'bad' : ''}"></span>
                                                <span>${lt.date} · ${lt.time}</span>
                                                <span class="pill ${lIsOpen ? 'bad' : ''}">${lIsOpen ? 'Open' : 'Closed'}</span>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                });

                """

content = content[:idx_g_start] + new_groups_code + content[idx_g_end:]
print("Replaced groups.forEach with polished Apple Inset items")

# 2. Update populateActivityDoorFilter to also populate door-filter-select
idx_pop = content.find("const optionsContainer = document.getElementById('activity-filter-options');")
assert idx_pop != -1, "populateActivityDoorFilter optionsContainer not found"

old_pop_end = "if (optionsContainer) optionsContainer.innerHTML = html;"
new_pop_end = """if (optionsContainer) optionsContainer.innerHTML = html;
        const selectEl = document.getElementById('door-filter-select');
        if (selectEl) {
            let selHtml = '<option value="">All doors</option>';
            uniqueDoors.forEach((name, mac) => {
                selHtml += `<option value="${mac}" ${currentSelectedActivityMac === mac ? 'selected' : ''}>${name}</option>`;
            });
            selectEl.innerHTML = selHtml;
        }"""

if old_pop_end in content:
    content = content.replace(old_pop_end, new_pop_end, 1)
    print("Updated populateActivityDoorFilter for door-filter-select")
else:
    print("Warning: old_pop_end not found")

# 3. Replace devices.forEach in loadDatabaseDevicesList
idx_d_start = content.find('devices.forEach(dev => {')
idx_d_end = content.find('container.innerHTML = html;', idx_d_start)

assert idx_d_start != -1 and idx_d_end != -1, "devices.forEach not found"

new_devices_code = """// Update header subtitle
                const devSub = document.getElementById("devices-count-sub");
                if (devSub) devSub.textContent = `${devices.length} sensors connected.`;

                // Update low battery banner
                let lowCount = 0;
                devices.forEach(d => {
                    const b = d.last_battery !== undefined && d.last_battery !== null ? d.last_battery : 100;
                    if (b < 50) lowCount++;
                });
                const banner = document.getElementById("devices-low-battery-banner");
                const bannerText = document.getElementById("low-battery-count-text");
                if (banner) {
                    if (lowCount > 0) {
                        banner.classList.remove("hidden");
                        if (bannerText) bannerText.textContent = `${lowCount} sensor${lowCount > 1 ? 's' : ''} with low battery`;
                    } else {
                        banner.classList.add("hidden");
                    }
                }

                devices.forEach(dev => {
                    const rssi = typeof getMockRssiForMac === 'function' ? getMockRssiForMac(dev.mac_address) : { quality: 'Good' };
                    const battVal = dev.last_battery !== undefined && dev.last_battery !== null ? dev.last_battery : 100;
                    const battClass = battVal >= 50 ? 'b-ok' : (battVal >= 25 ? 'b-mid' : 'b-low');
                    const lastSeen = typeof getRelativeTimeString === 'function' ? getRelativeTimeString(dev.last_polled) : 'Recently';
                    const isWindow = (dev.door_name || dev.name || '').toLowerCase().includes('window');

                    html += `
                        <button type="button" class="row" data-mac="${dev.mac_address}" data-low-batt="${battVal < 50 ? '1' : '0'}" onclick="openDeviceDetailModal('${dev.mac_address}')">
                            <span class="ico ${battVal < 25 ? 'bad' : (battVal < 50 ? 'warn' : '')}">
                                <i data-lucide="${isWindow ? 'maximize' : 'door-closed'}" class="ic"></i>
                            </span>
                            <span class="m">
                                <b>${dev.door_name || dev.name || 'Door Sensor'}</b>
                                <span>Seen ${lastSeen} · <span class="mono">${dev.mac_address}</span></span>
                            </span>
                            <span class="bat ${battClass}"><span class="bt"><i style="width:${battVal}%"></i></span>${battVal}%</span>
                            <span class="sg" title="Signal"><i class="on"></i><i class="on"></i><i class="${rssi.quality === 'Excellent' ? 'on' : ''}"></i></span>
                            <i data-lucide="chevron-right" class="ch"></i>
                        </button>
                    `;
                });

                """

content = content[:idx_d_start] + new_devices_code + content[idx_d_end:]
print("Replaced devices.forEach with polished Apple Inset rows")

# 4. Save updated scripts.html
with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved scripts.html successfully!")

