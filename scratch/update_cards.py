import os

filepath = 'logger/templates/logger/includes/scripts.html'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace cardW = 180 with cardW = 215 and adjust positions
old_block = """            const cardW = 180, cardH = 48;

            if (bldg.id === 'bldg_warehouse' || bx < 150) {
                // Route UP & LEFT into the open lawn/sky area
                cardLeft = 40;
                cardTop  = 90;
                leaderEndX   = cardLeft + cardW;
                leaderEndY   = cardTop + cardH / 2;
                leaderElbowX = cardLeft + cardW + 35;
                leaderElbowY = leaderEndY + 20;
            } else if (bldg.id === 'bldg_ops' || bx > 280) {
                // Route UP & RIGHT into the open right margin
                cardLeft = 715;
                cardTop  = 235;
                leaderEndX   = cardLeft;
                leaderEndY   = cardTop + cardH / 2;
                leaderElbowX = cardLeft - 35;
                leaderElbowY = leaderEndY + 25;
            } else {
                // Route STRAIGHT UP into the open top sky above HQ
                cardLeft = roofCx - cardW / 2;
                cardTop  = 16;
                leaderEndX   = roofCx;
                leaderEndY   = cardTop + cardH;
                leaderElbowX = roofCx;
                leaderElbowY = leaderEndY + 25;
            }"""

new_block = """            const cardW = 215, cardH = 50;

            if (bldg.id === 'bldg_warehouse' || bx < 150) {
                // Route UP & LEFT into the open lawn/sky area
                cardLeft = 24;
                cardTop  = 80;
                leaderEndX   = cardLeft + cardW;
                leaderEndY   = cardTop + cardH / 2;
                leaderElbowX = cardLeft + cardW + 35;
                leaderElbowY = leaderEndY + 20;
            } else if (bldg.id === 'bldg_ops' || bx > 280) {
                // Route UP & RIGHT into the open right margin
                cardLeft = 705;
                cardTop  = 230;
                leaderEndX   = cardLeft;
                leaderEndY   = cardTop + cardH / 2;
                leaderElbowX = cardLeft - 35;
                leaderElbowY = leaderEndY + 20;
            } else {
                // Route STRAIGHT UP into the open top sky above HQ
                cardLeft = Math.round(roofCx - cardW / 2);
                cardTop  = 14;
                leaderEndX   = roofCx;
                leaderEndY   = cardTop + cardH;
                leaderElbowX = roofCx;
                leaderElbowY = leaderEndY + 20;
            }"""

if old_block in c:
    c = c.replace(old_block, new_block)
    print("Replaced card positions and cardW successfully!")
else:
    print("Old block not found!")

old_title = '<span class="campus-callout-title" style="font-size: 11.5px;">${bldg.name}</span>'
new_title = '<span class="campus-callout-title" style="font-size: 11px; letter-spacing: -0.2px;">${bldg.name}</span>'
if old_title in c:
    c = c.replace(old_title, new_title)
    print("Replaced title style successfully!")

# Also fix Ops Annex roof ordering
old_ops = """                // Dual Rooftop HVAC Chillers
                const chCenter1 = projectIso(bx + bw * 0.35, by + bd * 0.35, dynamicHeight + 6);
                const chCenter2 = projectIso(bx + bw * 0.55, by + bd * 0.35, dynamicHeight + 6);
                buildingSpecificSvg += `
                    <circle cx="${chCenter1.x}" cy="${chCenter1.y}" r="5" fill="${isDark ? '#475569' : '#94a3b8'}" stroke="${strokeCol}" stroke-width="1" />
                    <circle cx="${chCenter2.x}" cy="${chCenter2.y}" r="5" fill="${isDark ? '#475569' : '#94a3b8'}" stroke="${strokeCol}" stroke-width="1" />
                `;

                buildingSpecificSvg += `
                    <polygon points="${t0.x},${t0.y} ${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}" fill="${isDark ? '#334155' : '#cbd5e1'}" stroke="${baseColor}" stroke-width="1.8" class="iso-roof" />
                `;"""

new_ops = """                // Roof Surface Base
                buildingSpecificSvg += `
                    <polygon points="${t0.x},${t0.y} ${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}" fill="${isDark ? '#334155' : '#cbd5e1'}" stroke="${baseColor}" stroke-width="1.8" class="iso-roof" />
                `;

                // Dual Rooftop HVAC Chillers
                const chCenter1 = projectIso(bx + bw * 0.35, by + bd * 0.35, dynamicHeight + 6);
                const chCenter2 = projectIso(bx + bw * 0.55, by + bd * 0.35, dynamicHeight + 6);
                buildingSpecificSvg += `
                    <circle cx="${chCenter1.x}" cy="${chCenter1.y}" r="5" fill="${isDark ? '#475569' : '#94a3b8'}" stroke="${strokeCol}" stroke-width="1" />
                    <circle cx="${chCenter2.x}" cy="${chCenter2.y}" r="5" fill="${isDark ? '#475569' : '#94a3b8'}" stroke="${strokeCol}" stroke-width="1" />
                `;"""

if old_ops in c:
    c = c.replace(old_ops, new_ops)
    print("Fixed Ops Annex roof order successfully!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)

print("Saved updated scripts.html")

