import re

# 1. Update view_floorplan.html
with open('logger/templates/logger/includes/view_floorplan.html', 'r', encoding='utf-8') as f:
    fp_text = f.read()

old_tooltip_html = """            <!-- Floating Sensor Tooltip Popover -->
            <div class="sensor-tooltip-popover" id="sensor-tooltip-popover">
                <div class="tooltip-sensor-name" id="tip-sensor-name">--</div>
                <div class="tooltip-sensor-detail" id="tip-sensor-detail">--</div>
            </div>"""

new_tooltip_html = """            <!-- Floating Sensor Tooltip Popover -->
            <div class="sensor-tooltip-popover" id="sensor-tooltip-popover">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
                    <span class="tooltip-sensor-name" id="tt-sensor-name" style="font-weight: 600;">Sensor</span>
                    <span class="live-pulse-dot" id="tt-pulse-dot"></span>
                </div>
                <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 4px;" id="tt-sensor-mac">--</div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; gap: 6px;">
                    <span id="tt-sensor-state" style="font-weight: 600;">--</span>
                    <span id="tt-sensor-battery" style="font-weight: 500;">--</span>
                </div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px;" id="tt-sensor-time">--</div>
            </div>"""

fp_norm = fp_text.replace('\r\n', '\n')
old_norm = old_tooltip_html.replace('\r\n', '\n')
if old_norm in fp_norm:
    fp_norm = fp_norm.replace(old_norm, new_tooltip_html.replace('\r\n', '\n'), 1)
    with open('logger/templates/logger/includes/view_floorplan.html', 'w', encoding='utf-8') as f:
        f.write(fp_norm)
    print("Updated tooltip in view_floorplan.html")
else:
    print("Could not match old_tooltip_html in view_floorplan.html")

# 2. Update showSensorTooltip in scripts.html
with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    sc_text = f.read()

pattern = r'function\s+showSensorTooltip\s*\([^)]*\)\s*\{[\s\S]*?lucide\.createIcons\(\{\s*el:\s*tip\s*\}\);[\s\S]*?\}'

new_tooltip_fn = """function showSensorTooltip(el, sensorData) {
        const tip = document.getElementById('sensor-tooltip-popover');
        if (!tip || !sensorData) return;

        _tooltipTarget = el;

        const nameEl = document.getElementById('tt-sensor-name') || document.getElementById('tip-sensor-name');
        const macEl = document.getElementById('tt-sensor-mac');
        const battEl = document.getElementById('tt-sensor-battery');
        const timeEl = document.getElementById('tt-sensor-time');
        const stateEl = document.getElementById('tt-sensor-state');
        const dotEl = document.getElementById('tt-pulse-dot');
        const detailEl = document.getElementById('tip-sensor-detail');

        const isOpen = (sensorData.state || '').toLowerCase() === 'open';

        if (nameEl) nameEl.textContent = sensorData.name || 'Unknown Sensor';
        if (macEl) macEl.textContent = sensorData.mac || '—';
        if (battEl) battEl.textContent = sensorData.battery !== undefined ? `${sensorData.battery}%` : '—';
        if (timeEl) timeEl.textContent = sensorData.lastSeen || '—';
        if (stateEl) {
            stateEl.textContent = (sensorData.state || 'CLOSED').toUpperCase();
            stateEl.style.color = isOpen ? 'var(--red)' : 'var(--green)';
        }
        if (dotEl) {
            dotEl.className = isOpen ? 'live-pulse-dot dot-red' : 'live-pulse-dot';
        }
        if (detailEl) {
            detailEl.textContent = `${sensorData.mac || ''} • ${sensorData.battery || 100}% • ${sensorData.state || 'CLOSED'}`;
        }

        const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : { right: 200, top: 200 };
        tip.style.left = `${Math.min(rect.right + 10, window.innerWidth - 280)}px`;
        tip.style.top = `${Math.max(rect.top - 10, 10)}px`;
        tip.classList.add('visible');

        if (window.lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons({ el: tip });
        }
    }
    window.showSensorTooltip = showSensorTooltip;"""

m = re.search(pattern, sc_text)
if m:
    sc_text = sc_text[:m.start()] + new_tooltip_fn + sc_text[m.end():]
    with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
        f.write(sc_text)
    print("Updated showSensorTooltip in scripts.html")
else:
    print("Could not match showSensorTooltip pattern in scripts.html")

