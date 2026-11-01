with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Guard calls to renderHourlyActivityChart
text = text.replace('renderHourlyActivityChart([]);', 'if (typeof renderHourlyActivityChart === "function") renderHourlyActivityChart([]);')
text = text.replace('renderHourlyActivityChart(logs);', 'if (typeof renderHourlyActivityChart === "function") renderHourlyActivityChart(logs);')

# Also add fallback definition
def_code = '''
    function renderHourlyActivityChart(logs) {
        if (typeof renderAnalyticsDashboard === 'function') {
            renderAnalyticsDashboard(logs || (appState && appState.allLogsCache) || []);
        }
    }
    window.renderHourlyActivityChart = renderHourlyActivityChart;
'''
if 'function renderHourlyActivityChart' not in text:
    target = 'function renderAnalyticsDashboard'
    if target in text:
        text = text.replace(target, def_code + '\n    ' + target)
        print("Successfully defined renderHourlyActivityChart!")

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated scripts.html successfully!")

