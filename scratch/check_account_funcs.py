with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

funcs = [
    'switchAccountInline',
    'performLogout',
    'switchAccountTab',
    'performAccountPageLogin',
    'performAccountPageRegister',
    'renderAccountPage',
    'fetchUserInfo'
]

for fn in funcs:
    matches = [line.strip() for line in text.split('\n') if f'function {fn}' in line or f'{fn} =' in line]
    print(f"{fn}: found {len(matches)} -> {matches}")

