with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

funcs_to_check = [
    'groupAllLogsByDoor',
    'formatLogTimestampDetails',
    'getRelativeTimeString',
    'selectBuildingFromCampus',
    'openB',
    'setFloorPlanSubView',
    'exportLogsToCSV',
    'selectActivityDoorFilter',
    'filterActivityTable',
    'switchDbWorkspaceTab',
    'openDbSqlTab',
    'refreshDatabaseStudio',
    'openInsertRowModal',
    'closeDbModal'
]

for fn in funcs_to_check:
    count_def = len([l for l in text.split('\n') if f'function {fn}' in l or f'const {fn} =' in l or f'let {fn} =' in l or f'window.{fn} =' in l])
    count_call = len([l for l in text.split('\n') if fn in l])
    print(f"{fn}: defined={count_def}, total occurrences={count_call}")

