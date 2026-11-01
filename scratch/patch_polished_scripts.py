import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    content = f.read()

polished_functions = """
    // =========================================================================
    // POLISHED ACCESS CONTROL LOGS, DEVICES & ACCOUNT CONTROLS
    // =========================================================================
    function toggleDoorLogGroup(btn) {
        const lr = btn.closest('.lr');
        if (!lr) return;
        const wasOpen = lr.classList.contains('open');
        lr.classList.toggle('open');
        btn.setAttribute('aria-expanded', !wasOpen);
        const det = lr.querySelector('.det');
        if (det) det.classList.toggle('hidden', wasOpen);
        if (window.lucide && lucide.createIcons) lucide.createIcons({ el: lr });
    }

    function copyMacToClipboard(mac) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(mac).catch(() => {});
        }
        if (typeof showToast === 'function') {
            showToast("Device MAC copied: " + mac, "info");
        }
    }

    function resetAllActivityFilters() {
        const searchInput = document.getElementById("activity-search-input");
        if (searchInput) searchInput.value = "";
        const select = document.getElementById("door-filter-select");
        if (select) select.value = "";
        setDateFilter('all');
    }

    function setAppTheme(theme) {
        const mode = theme === 'auto' ? 'system' : theme;
        if (typeof SmartDoorTraitCollection !== 'undefined' && SmartDoorTraitCollection.setAppearanceMode) {
            SmartDoorTraitCollection.setAppearanceMode(mode);
        } else {
            if (theme === 'auto') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', theme);
            }
        }
        ['light', 'dark', 'auto'].forEach(t => {
            const btn = document.getElementById(`theme-btn-${t}`);
            if (btn) {
                btn.setAttribute('aria-selected', t === theme);
                btn.classList.toggle('active', t === theme);
            }
        });
        if (typeof showToast === 'function') {
            showToast("Appearance set to " + (theme.charAt(0).toUpperCase() + theme.slice(1)), "info");
        }
    }

    function openSwitchAccountModal() {
        if (typeof openUserModal === 'function') {
            openUserModal('login');
        } else {
            const modal = document.getElementById('user-auth-modal');
            if (modal) modal.classList.remove('hidden');
        }
    }

    function filterDevicesView(type) {
        const btnAll = document.getElementById("dev-filter-all");
        const btnLow = document.getElementById("dev-filter-low");
        if (btnAll) {
            btnAll.setAttribute("aria-selected", type === 'all');
            btnAll.classList.toggle("active", type === 'all');
        }
        if (btnLow) {
            btnLow.setAttribute("aria-selected", type === 'low');
            btnLow.classList.toggle("active", type === 'low');
        }
        const container = document.getElementById("db-devices-list");
        if (!container) return;
        const rows = container.querySelectorAll(".row");
        let visible = 0;
        rows.forEach(r => {
            if (type === 'low') {
                const isLow = r.getAttribute("data-low-batt") === '1';
                r.style.display = isLow ? "" : "none";
                if (isLow) visible++;
            } else {
                r.style.display = "";
                visible++;
            }
        });
    }

    function openDeviceDetailModal(mac) {
        const overlay = document.getElementById("device-sheet-overlay");
        const content = document.getElementById("device-sheet-content");
        if (!overlay || !content) return;

        const dev = ((appState && appState.devices) ? appState.devices : []).find(d => (d.mac_address === mac || d.mac === mac)) || {
            name: 'Door Sensor',
            mac_address: mac,
            last_battery: 85,
            door_state: 'CLOSED',
            last_polled: new Date().toISOString()
        };

        const isWindow = (dev.name || '').toLowerCase().includes('window');
        const battVal = dev.last_battery !== undefined && dev.last_battery !== null ? dev.last_battery : 85;
        const battClass = battVal >= 50 ? 'b-ok' : (battVal >= 25 ? 'b-mid' : 'b-low');
        const isOpen = (dev.door_state || dev.state || '').toUpperCase() === 'OPEN';
        const lastSeen = typeof getRelativeTimeString === 'function' ? getRelativeTimeString(dev.last_polled) : 'Recently';

        content.innerHTML = `
            <div class="grab" style="width: 36px; height: 5px; border-radius: 3px; background: var(--sep); margin: 0 auto 16px;"></div>
            <div class="sh" style="display: flex; gap: 14px; align-items: center; margin-bottom: 18px;">
                <span class="ico ${battVal < 25 ? 'bad' : (battVal < 50 ? 'warn' : '')}" style="width: 48px; height: 48px; border-radius: 14px;">
                    <i data-lucide="${isWindow ? 'maximize' : 'door-closed'}" class="ic" style="width: 24px; height: 24px;"></i>
                </span>
                <div>
                    <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: var(--ink);">${dev.name || 'Door Sensor'}</h3>
                    <p style="margin: 2px 0 0; color: var(--ink2); font-size: 14px;">Hardware Telemetry & Node Details</p>
                </div>
            </div>
            <div class="inset" style="margin-bottom: 16px; background: var(--bg);">
                <div class="row" style="min-height: 48px; padding: 10px 14px;">
                    <span class="m"><b>Status</b></span>
                    <span class="pill ${isOpen ? 'bad' : ''}"><i></i>${isOpen ? 'Open' : 'Closed'}</span>
                </div>
                <div class="row" style="min-height: 48px; padding: 10px 14px;">
                    <span class="m"><b>Battery</b></span>
                    <span class="bat ${battClass}"><span class="bt"><i style="width:${battVal}%"></i></span>${battVal}%</span>
                </div>
                <div class="row" style="min-height: 48px; padding: 10px 14px;">
                    <span class="m"><b>Device MAC</b></span>
                    <span class="t mono">${dev.mac_address || mac} <button type="button" class="link" onclick="copyMacToClipboard('${dev.mac_address || mac}')" title="Copy"><i data-lucide="copy" class="ic" style="width:13px;height:13px;display:inline;"></i></button></span>
                </div>
                <div class="row" style="min-height: 48px; padding: 10px 14px;">
                    <span class="m"><b>Last Seen</b></span>
                    <span class="t">${lastSeen}</span>
                </div>
            </div>
            <button type="button" class="btn soft full" style="margin-bottom: 8px;" onclick="closeDeviceDetailSheet(); switchMainTab('logs'); selectActivityDoorFilter('${dev.mac_address || mac}');">View in logs</button>
            <button type="button" class="btn bad full" onclick="closeDeviceDetailSheet();">Close</button>
        `;

        overlay.classList.remove("hidden");
        if (window.lucide && lucide.createIcons) lucide.createIcons({ el: content });
    }

    function closeDeviceDetailSheet() {
        const overlay = document.getElementById("device-sheet-overlay");
        if (overlay) overlay.classList.add("hidden");
    }

    window.toggleDoorLogGroup = toggleDoorLogGroup;
    window.copyMacToClipboard = copyMacToClipboard;
    window.resetAllActivityFilters = resetAllActivityFilters;
    window.setAppTheme = setAppTheme;
    window.openSwitchAccountModal = openSwitchAccountModal;
    window.filterDevicesView = filterDevicesView;
    window.openDeviceDetailModal = openDeviceDetailModal;
    window.closeDeviceDetailSheet = closeDeviceDetailSheet;
"""

marker = "window.updateFp3DZoomUI = updateFp3DZoomUI;"
if marker in content:
    content = content.replace(marker, marker + polished_functions, 1)
    print("Inserted polished functions into scripts.html")
else:
    print("Warning: marker not found, appending before </script>")
    content = content.replace("</script>", polished_functions + "\n</script>", 1)

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved scripts.html successfully!")

