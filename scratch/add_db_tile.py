with open('logger/templates/logger/includes/view_account.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = """                                <!-- Dashboard -->
                                <div class="acc-nav-tile" onclick="switchMainTab('dashboard')" role="button" tabindex="0" title="Open Campus Dashboard">
                                    <div class="acc-tile-top">
                                        <div class="account-icon-wrap bg-teal"><i data-lucide="building-2"></i></div>
                                        <i data-lucide="arrow-up-right" class="acc-tile-arrow"></i>
                                    </div>
                                    <div class="acc-tile-info">
                                        <div class="acc-tile-title">Campus Dashboard</div>
                                        <div class="acc-tile-desc">Live 3D & 2D floor plan telemetry overview</div>
                                    </div>
                                </div>"""

replacement = """                                <!-- Dashboard -->
                                <div class="acc-nav-tile" onclick="switchMainTab('dashboard')" role="button" tabindex="0" title="Open Campus Dashboard">
                                    <div class="acc-tile-top">
                                        <div class="account-icon-wrap bg-teal"><i data-lucide="building-2"></i></div>
                                        <i data-lucide="arrow-up-right" class="acc-tile-arrow"></i>
                                    </div>
                                    <div class="acc-tile-info">
                                        <div class="acc-tile-title">Campus Dashboard</div>
                                        <div class="acc-tile-desc">Live 3D & 2D floor plan telemetry overview</div>
                                    </div>
                                </div>

                                <!-- Database Studio (Superuser) -->
                                <div class="acc-nav-tile {% if not user.is_superuser %}hidden{% endif %}" id="acc-tile-database" onclick="switchMainTab('database')" role="button" tabindex="0" title="Open Database Management Studio">
                                    <div class="acc-tile-top">
                                        <div class="account-icon-wrap" style="background: rgba(99, 102, 241, 0.12); color: #6366f1;"><i data-lucide="database"></i></div>
                                        <i data-lucide="arrow-up-right" class="acc-tile-arrow"></i>
                                    </div>
                                    <div class="acc-tile-info">
                                        <div class="acc-tile-title">Database Studio</div>
                                        <div class="acc-tile-desc">Direct SQLite schema & query console</div>
                                    </div>
                                </div>"""

text_norm = text.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')

if target_norm in text_norm:
    text_norm = text_norm.replace(target_norm, replacement.replace('\r\n', '\n'), 1)
    # Also update count badge text
    text_norm = text_norm.replace('<span class="acc-badge-count">4 Consoles</span>', '<span class="acc-badge-count">Quick Access</span>')
    with open('logger/templates/logger/includes/view_account.html', 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print("Added acc-tile-database to view_account.html successfully!")
else:
    print("Could not match target in view_account.html")

