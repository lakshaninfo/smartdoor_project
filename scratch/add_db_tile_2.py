with open('logger/templates/logger/includes/view_account.html', 'r', encoding='utf-8') as f:
    text = f.read()

needle = '<div class="acc-tile-title">Campus Dashboard</div>'
idx = text.find(needle)
if idx != -1:
    end_tile = text.find('</div>\n                                </div>', idx)
    if end_tile == -1:
        end_tile = text.find('</div>\r\n                                </div>', idx)
    end_tile = text.find('</div>', end_tile + 10) + 6
    print("Found Campus Dashboard tile, ends at:", end_tile)
    db_tile = """

                                <!-- Database Studio (Superuser) -->
                                <div class="acc-nav-tile {% if not user.is_superuser %}hidden{% endif %}" id="acc-tile-database" onclick="switchMainTab('database')" role="button" tabindex="0" title="Open Database Management Studio">
                                    <div class="acc-tile-top">
                                        <div class="account-icon-wrap" style="background: rgba(99, 102, 241, 0.12); color: #6366f1;"><i data-lucide="database"></i></div>
                                        <i data-lucide="arrow-up-right" class="acc-tile-arrow"></i>
                                    </div>
                                    <div class="acc-tile-info">
                                        <div class="acc-tile-title">Database Studio</div>
                                        <div class="acc-tile-desc">Direct SQLite schema &amp; query console</div>
                                    </div>
                                </div>"""
    text = text[:end_tile] + db_tile + text[end_tile:]
    text = text.replace('4 Consoles', 'Quick Access')
    with open('logger/templates/logger/includes/view_account.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Inserted Database Studio tile!")
else:
    print("Could not find Campus Dashboard needle")

