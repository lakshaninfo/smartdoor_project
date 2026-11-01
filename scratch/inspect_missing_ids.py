import re

with open('scratch/scripts_test.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('scratch/audit_system.py', 'r', encoding='utf-8') as f:
    pass

# We have the list of missing IDs from before

# Let's inspect where these IDs are used
missing_ids = [
    'acc-tile-database', 'apple-appearance-hud', 'arming-dropdown-menu', 'btn-arming-mode',
    'btn-modal-tab-login', 'btn-modal-tab-reg', 'btn-redo-float', 'btn-undo-float',
    'btn-view-2d', 'btn-view-3d', 'campus-3d-pins-overlay', 'campus-3d-svg',
    'campus-breadcrumb-nav', 'confirm-icon', 'confirm-icon-box', 'confirm-message',
    'confirm-ok-btn', 'confirm-title', 'custom-confirm-modal', 'db-devices-count-badge',
    'devices-tab-panel', 'float-undo-sep', 'inner-tab-devices', 'inner-tab-users',
    'login-password', 'login-splash', 'login-username', 'mobile-last-sync-label',
    'mobile-pwa-banner', 'mobile-sync-chip', 'modal-title-text', 'reg-email',
    'reg-password', 'reg-username', 'registered-count-badge', 'right-last-event-name',
    'right-last-event-time', 'splash-error-msg', 'splash-login-form', 'splash-password',
    'splash-reg-email', 'splash-reg-password', 'splash-reg-username', 'splash-register-form',
    'splash-tab-login', 'splash-tab-register', 'splash-username', 'tab-auth-login',
    'tab-auth-register', 'tab-devices-btn', 'tab-users-btn', 'toast-container',
    'toolbar-actions-2d', 'toolbar-actions-3d', 'tt-pulse-dot', 'tt-sensor-battery',
    'tt-sensor-mac', 'tt-sensor-name', 'tt-sensor-state', 'tt-sensor-time',
    'users-tab-panel', 'view-mode-selector'
]

results = {}
for idx, line in enumerate(lines):
    for mid in missing_ids:
        if f"'{mid}'" in line or f'"{mid}"' in line:
            results.setdefault(mid, []).append((idx + 1, line.strip()))

for mid, occurrences in sorted(results.items()):
    print(f"\nID: {mid} ({len(occurrences)} occurrences):")
    for line_no, text in occurrences[:3]:
        print(f"  Line {line_no}: {text[:100]}")
