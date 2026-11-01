with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    scripts = f.read()

import re

db_fns = [
    'switchDbWorkspaceTab',
    'openDbSqlTab',
    'refreshDatabaseStudio',
    'openInsertRowModal',
    'closeDbModal',
    'deleteSelectedDbRows',
    'executeDbTableSearch',
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
    'filterDbTableList',
    'toggleDbExportMenu',
    'openCreateTableModal'
]

for fn in db_fns:
    decl = f"function {fn}" in scripts
    win = f"window.{fn}" in scripts
    print(f"{fn}: function={decl}, window={win}")

