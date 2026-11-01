with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fns_to_find = [
    'openDbSqlTab',
    'switchDbWorkspaceTab',
    'refreshDatabaseStudio',
    'openInsertRowModal',
    'closeDbModal',
    'openCreateTableModal',
    'filterDbTableList',
    'deleteSelectedDbRows',
    'executeDbTableSearch',
    'toggleDbExportMenu',
    'exportCurrentTable',
    'confirmTruncateCurrentTable',
    'confirmDropCurrentTable',
    'changeDbPageSize',
    'navigateDbPage',
    'insertSqlTemplate',
    'executeRawSqlQuery',
    'submitInsertDbRow',
    'submitUpdateDbRow',
    'submitCreateTable',
    'addDbColumnRow',
    'deleteSingleDbRow',
    'openEditRowModal',
    'editDbRowModal',
    'selectDbTable'
]

for fn in fns_to_find:
    found = False
    for idx, line in enumerate(lines):
        if f'function {fn}' in line:
            print(f"{fn} found at line {idx+1}")
            found = True
            break
    if not found:
        print(f"!!! {fn} NOT FOUND AS FUNCTION !!!")

