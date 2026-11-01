with open('logger/views.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("=== dashboard ===")
print("".join(lines[70:93]))

print("=== live_status_api ===")
print("".join(lines[93:107]))

print("=== full_logs_api ===")
print("".join(lines[107:131]))

print("=== database_devices_api ===")
print("".join(lines[211:237]))

