with open('logger/templates/logger/includes/header_styles.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''.m b {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: var(--ink, var(--text-primary));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.m span {
    font-size: 13px;
    color: var(--ink2, var(--text-secondary));
}'''

replacement = '''.m b, .row .m b, .lh .m b {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: var(--ink, var(--text-primary));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left !important;
}
.m span, .row .m span, .lh .m span {
    display: block;
    font-size: 13px;
    color: var(--ink2, var(--text-secondary));
    text-align: left !important;
}'''

if target in text:
    text = text.replace(target, replacement)
    with open('logger/templates/logger/includes/header_styles.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully updated .m b and .m span styles!")
else:
    print("Target not found!")

