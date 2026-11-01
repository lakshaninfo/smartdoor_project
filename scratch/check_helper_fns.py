import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    scripts = f.read()

for fn in ['renderBatteryMicroGauge', 'getMockRssiForMac', 'renderRssiSignalBars', 'copyMacToClipboard', 'toggleGroupAccordion']:
    print(f"{fn}: {'FOUND' if fn in scripts else 'MISSING'}")

