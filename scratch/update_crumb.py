import os

scripts_path = r'logger/templates/logger/includes/scripts.html'
with open(scripts_path, 'r', encoding='utf-8') as f:
    text = f.read()

old_crumb = '''    function crumb() {
        const bc = $('bc');
        const stage = $('stage');
        if (bc) {
            bc.innerHTML = bld && stage && stage.classList.contains('in')
                ? `<b style="cursor:pointer;color:var(--accent)" id="home">Campus 3D</b><span>›</span><b>${bld.name}</b><span>›</span><b>${F[cur] ? F[cur].name : 'Level'}</b>`
                : '<b>Campus 3D</b>';
            const h = $('home');
            if (h) h.onclick = closeB;
        }

        // Also synchronize host toolbar breadcrumb
        const breadcrumbNav = $('campus-breadcrumb-nav');
        const bldgNameElem = $('breadcrumb-building-name');
        const floorNameElem = $('breadcrumb-floor-name');
        if (bld && stage && stage.classList.contains('in')) {
            if (breadcrumbNav) breadcrumbNav.classList.remove('hidden');
            if (bldgNameElem) bldgNameElem.textContent = bld.name;
            if (floorNameElem && F[cur]) floorNameElem.textContent = F[cur].name;
        } else {
            if (breadcrumbNav) breadcrumbNav.classList.add('hidden');
        }
    }'''

new_crumb = '''    function crumb() {
        const bc = $('bc');
        const stage = $('stage');
        const statChip = $('campus-stat-chip');
        if (bc) {
            if (bld && stage && stage.classList.contains('in')) {
                bc.style.display = 'inline-flex';
                if (statChip) statChip.style.display = 'none';
                bc.innerHTML = `<b style="cursor:pointer;color:var(--accent)" id="home">Campus 3D</b><span>›</span><b>${bld.name}</b><span>›</span><b>${F[cur] ? F[cur].name : 'Level'}</b>`;
                const h = $('home');
                if (h) h.onclick = closeB;
            } else {
                bc.style.display = 'none';
                if (statChip) statChip.style.display = 'inline-flex';
            }
        }

        // Synchronize host toolbar breadcrumb
        const breadcrumbNav = $('campus-breadcrumb-nav');
        const bldgNameElem = $('breadcrumb-building-name');
        const floorNameElem = $('breadcrumb-floor-name');
        if (bld && stage && stage.classList.contains('in')) {
            if (breadcrumbNav) breadcrumbNav.classList.remove('hidden');
            if (bldgNameElem) bldgNameElem.textContent = bld.name;
            if (floorNameElem && F[cur]) floorNameElem.textContent = F[cur].name;
        } else {
            if (breadcrumbNav) breadcrumbNav.classList.add('hidden');
        }
    }'''

if old_crumb in text:
    text = text.replace(old_crumb, new_crumb)
    with open(scripts_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print('Updated crumb() successfully!')
else:
    print('old_crumb not found!')

