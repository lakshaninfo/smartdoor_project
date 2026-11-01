function renderAnalyticsDashboard(logs = []) {

        const totalCount = logs.length;

        let openCount = 0, closedCount = 0;

        const hourCounts = new Array(24).fill(0);

        const periodCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 };

        const doorCounts = {};

        logs.forEach(log => {

            if (log.door_state === 'OPEN') openCount++;

            else closedCount++;

            const doorKey = log.door_name || log.mac_address || 'Sensor';

            if (!doorCounts[doorKey]) {

                doorCounts[doorKey] = {

                    name: log.door_name || 'Door Sensor',

                    mac: log.mac_address || '',

                    count: 0,

                    latestState: log.door_state,

                    latestBattery: log.battery

                };

            }

            doorCounts[doorKey].count++;

            if (log.timestamp) {

                try {

                    const d = new Date(log.timestamp.replace(' ', 'T'));

                    const h = d.getHours();

                    if (!isNaN(h)) {

                        hourCounts[h]++;

                        if (h >= 6 && h < 12) periodCounts.morning++;

                        else if (h >= 12 && h < 18) periodCounts.afternoon++;

                        else if (h >= 18 && h < 24) periodCounts.evening++;

                        else periodCounts.night++;

                    }

                } catch(e) {}

            }

        });

        // 1. KPI Cards

        const statTotal = document.getElementById("stat-door-total-events");

        const statOpen = document.getElementById("stat-door-open-events");

        const statClosed = document.getElementById("stat-door-closed-events");

        const statPeakVal = document.getElementById("stat-peak-hour-val");

        const statPeakSub = document.getElementById("stat-peak-count-label");

        const statOpenSub = document.getElementById("stat-open-rate-label");

        const statClosedSub = document.getElementById("stat-closed-rate-label");

        if (statTotal) statTotal.textContent = `${totalCount}`;

        if (statOpen) statOpen.textContent = `${openCount}`;

        if (statClosed) statClosed.textContent = `${closedCount}`;

        if (totalCount > 0) {

            const openPct = Math.round((openCount / totalCount) * 100);

            const closedPct = Math.round((closedCount / totalCount) * 100);

            if (statOpenSub) statOpenSub.textContent = `${openPct}% of total triggers`;

            if (statClosedSub) statClosedSub.textContent = `${closedPct}% secured rate`;

        }

        const maxHourCount = Math.max(...hourCounts, 0);

        const peakH = hourCounts.indexOf(maxHourCount);

        if (statPeakVal) {

            if (maxHourCount > 0) {

                const hrs = peakH % 12 || 12;

                const ampm = peakH >= 12 ? 'PM' : 'AM';

                statPeakVal.textContent = `${hrs}:00 ${ampm}`;

                if (statPeakSub) statPeakSub.textContent = `${maxHourCount} events logged`;

            } else {

                statPeakVal.textContent = `--:--`;

                if (statPeakSub) statPeakSub.textContent = `No events recorded`;

            }

        }

        // 2. Time Periods & Shift Telemetry

        const maxPeriod = Math.max(periodCounts.morning, periodCounts.afternoon, periodCounts.evening, periodCounts.night, 1);

        const setPeriod = (key, count) => {

            const el = document.getElementById(`period-${key}-val`);

            const bar = document.getElementById(`period-${key}-bar`);

            if (el) el.textContent = `${count}`;

            if (bar) bar.style.width = `${Math.round((count / maxPeriod) * 100)}%`;

        };

        setPeriod('morning', periodCounts.morning);

        setPeriod('afternoon', periodCounts.afternoon);

        setPeriod('evening', periodCounts.evening);

        setPeriod('night', periodCounts.night);

        // Populate Perimeter Security & Shift Telemetry

        let peakShiftName = 'Evening';

        let peakShiftCount = periodCounts.evening;

        let peakShiftHours = '6:00 PM – 12:00 AM';

        if (periodCounts.morning >= peakShiftCount) {

            peakShiftName = 'Morning';

            peakShiftCount = periodCounts.morning;

            peakShiftHours = '6:00 AM – 12:00 PM';

        }

        if (periodCounts.afternoon > peakShiftCount) {

            peakShiftName = 'Afternoon';

            peakShiftCount = periodCounts.afternoon;

            peakShiftHours = '12:00 PM – 6:00 PM';

        }

        if (periodCounts.evening >= peakShiftCount) {

            peakShiftName = 'Evening';

            peakShiftCount = periodCounts.evening;

            peakShiftHours = '6:00 PM – 12:00 AM';

        }

        if (periodCounts.night > peakShiftCount) {

            peakShiftName = 'Night';

            peakShiftCount = periodCounts.night;

            peakShiftHours = '12:00 AM – 6:00 AM';

        }

        const shiftPeakEl = document.getElementById("shift-telemetry-peak");

        const shiftPeakSub = document.getElementById("shift-telemetry-peak-sub");

        if (shiftPeakEl) {

            if (peakShiftCount > 0) {

                const shiftPct = Math.round((peakShiftCount / Math.max(totalCount, 1)) * 100);

                shiftPeakEl.textContent = `${peakShiftHours}`;

                if (shiftPeakSub) shiftPeakSub.textContent = `${peakShiftName} (${shiftPct}% of daily triggers)`;

            } else {

                shiftPeakEl.textContent = `--:--`;

                if (shiftPeakSub) shiftPeakSub.textContent = `No recorded triggers`;

            }

        }

        const shiftNightEl = document.getElementById("shift-telemetry-night");

        const shiftNightSub = document.getElementById("shift-telemetry-night-sub");

        if (shiftNightEl) {

            if (periodCounts.night === 0) {

                shiftNightEl.textContent = `0 Triggers`;

                if (shiftNightSub) shiftNightSub.textContent = `Night shift perimeter secured`;

            } else {

                shiftNightEl.textContent = `${periodCounts.night} Triggers`;

                if (shiftNightSub) shiftNightSub.textContent = `Off-hours access recorded`;

            }

        }

        const shiftVelEl = document.getElementById("shift-telemetry-velocity");

        const shiftVelSub = document.getElementById("shift-telemetry-velocity-sub");

        if (shiftVelEl) {

            const vel = (totalCount / 24).toFixed(1);

            shiftVelEl.textContent = `${vel} Events / Hr`;

            if (shiftVelSub) shiftVelSub.textContent = totalCount > 0 ? `24-hour average velocity` : `Normal operational flow`;

        }

        // 3. Door Breakdown List

        const doorListEl = document.getElementById("analytics-door-breakdown");

        const doorsCountBadge = document.getElementById("analytics-doors-count");

        const doorArray = Object.values(doorCounts).sort((a, b) => b.count - a.count);

        if (doorsCountBadge) doorsCountBadge.textContent = `${doorArray.length}`;

        if (doorListEl) {

            if (doorArray.length === 0) {

                doorListEl.innerHTML = `

                    <div class="empty-state" style="padding: 24px 0;">

                        <div class="empty-state-icon"><i data-lucide="inbox"></i></div>

                        <div class="empty-state-sub">No door activity logged yet.</div>

                    </div>

                `;

            } else {

                let dHtml = '';

                doorArray.forEach(d => {

                    const pct = totalCount > 0 ? Math.round((d.count / totalCount) * 100) : 0;

                    const isOpen = d.latestState === 'OPEN';

                    dHtml += `

                        <div class="door-breakdown-item" onclick="selectActivityDoorFilter('${d.mac}', '${d.name}'); switchMainTab('logs');" title="Click to view ${d.name} in Access Logs">

                            <div class="door-breakdown-top">

                                <div class="door-breakdown-name-wrap">

                                    <i data-lucide="${isOpen ? 'door-open' : 'door-closed'}" style="width: 15px; height: 15px; color: ${isOpen ? 'var(--red)' : 'var(--blue)'};"></i>

                                    <span class="door-breakdown-name">${d.name}</span>

                                </div>

                                <span class="door-breakdown-pct">${d.count} events (${pct}%)</span>

                            </div>

                            <div class="door-breakdown-bar-track">

                                <div class="door-breakdown-bar-fill" style="width: ${pct}%;"></div>

                            </div>

                            <div class="door-breakdown-meta">

                                <span class="mac-stream-chip"><i data-lucide="cpu" style="width: 11px; height: 11px;"></i> ${d.mac || 'N/A'}</span>

                                <span class="status-pill-solid ${isOpen ? 'state-open' : 'state-closed'}" style="padding: 2px 7px; font-size: 10px;">

                                    <span class="state-dot ${isOpen ? 'dot-pulse-open' : 'dot-closed'}"></span>

                                    ${d.latestState || 'CLOSED'}

                                </span>

                            </div>

                        </div>

                    `;

                });

                doorListEl.innerHTML = dHtml;

            }

        }

        // 4. Recent Events Stream (up to 10 logs for full workstation height)

        const recentStreamEl = document.getElementById("analytics-recent-stream");

        if (recentStreamEl) {

            const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp.replace(' ', 'T')) - new Date(a.timestamp.replace(' ', 'T'))).slice(0, 10);

            if (sortedLogs.length === 0) {

                recentStreamEl.innerHTML = `

                    <div class="empty-state" style="padding: 20px 0;">

                        <div class="empty-state-sub">No recent security events.</div>

                    </div>

                `;

            } else {

                let rHtml = '';

                sortedLogs.forEach(l => {

                    const isOpen = l.door_state === 'OPEN';

                    const timeInfo = formatLogTimestampDetails(l.timestamp);

                    rHtml += `

                        <div class="analytics-recent-item" onclick="switchMainTab('logs')" style="cursor: pointer;" title="View in Access Logs">

                            <div class="analytics-recent-left">

                                <span class="state-dot ${isOpen ? 'dot-pulse-open' : 'dot-closed'}"></span>

                                <span class="recent-item-title">${l.door_name || 'Door'}</span>

                                <span class="recent-item-meta">· ${timeInfo.time} (${timeInfo.relative || timeInfo.date})</span>

                            </div>

                            <span class="status-pill-solid ${isOpen ? 'state-open' : 'state-closed'}">

                                ${l.door_state}

                            </span>

                        </div>

                    `;

                });

                recentStreamEl.innerHTML = rHtml;

            }

        }

        // 5. Render SVG Chart

        renderHourlyActivityChart(logs);

        if (window.lucide && typeof lucide.createIcons === 'function') {

            lucide.createIcons({ el: document.getElementById('view-activity-page') });

        }

    }

    function switchAnalyticsIntelTab(tab) {

        const btnSensors = document.getElementById('btn-intel-sensors');

        const btnStream = document.getElementById('btn-intel-stream');

        const panelSensors = document.getElementById('intel-panel-sensors');

        const panelStream = document.getElementById('intel-panel-stream');

        if (!btnSensors || !btnStream || !panelSensors || !panelStream) return;

        if (tab === 'sensors') {

            btnSensors.classList.add('active');

            btnStream.classList.remove('active');

            panelSensors.classList.remove('hidden');

            panelStream.classList.add('hidden');

        } else {

            btnSensors.classList.remove('active');

            btnStream.classList.add('active');

            panelSensors.classList.add('hidden');

            panelStream.classList.remove('hidden');

        }

        if (window.lucide && typeof lucide.createIcons === 'function') {

            lucide.createIcons({ el: document.getElementById('view-activity-page') });

        }

    }

    function renderHourlyActivityChart(logs = []) {

        const chartSvg = document.getElementById("hourly-activity-chart");

        if (!chartSvg) return;

        const hourCounts = new Array(24).fill(0);

        let latestActiveHour = null;

        (logs || []).forEach(log => {

            if (!log.timestamp) return;

            try {

                const d = new Date(log.timestamp.replace(' ', 'T'));

        