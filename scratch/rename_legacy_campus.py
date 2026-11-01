with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("function renderCampus3D() {\n        const svg = document.getElementById(\"campus-3d-svg\");", "function renderCampus3DLegacySVG() {\n        const svg = document.getElementById(\"campus-3d-svg\");")
text = text.replace("function renderCampus3D() {\r\n        const svg = document.getElementById(\"campus-3d-svg\");", "function renderCampus3DLegacySVG() {\r\n        const svg = document.getElementById(\"campus-3d-svg\");")

with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Renamed legacy renderCampus3D to renderCampus3DLegacySVG.")

