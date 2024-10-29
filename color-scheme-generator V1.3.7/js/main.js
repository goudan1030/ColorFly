console.log('main.js file loaded');

document.addEventListener('DOMContentLoaded', () => {
    const baseColorInput = document.getElementById('baseColor');
    const colorInput = document.getElementById('colorInput');
    const schemesContainer = document.getElementById('colorSchemes');

    console.log('DOM content loaded');

    if (!baseColorInput || !colorInput) {
        console.error("Base color input or color input element not found.");
        return;
    }

    function generateColorScheme(baseColor) {
        return {
            "Tints": generateTints(baseColor),
            "Shades": generateShades(baseColor),
            "Tones": generateTones(baseColor),
            "Triadic": generateTriadic(baseColor),
            "Contrast": generateContrast(baseColor)
        };
    }

    function generateTints(baseColor) {
        const tints = [];
        const baseTint = tinycolor(baseColor);
        const hsl = baseTint.toHsl();
        const lightnessStep = (1 - hsl.l) / 7;

        for (let i = 0; i < 7; i++) {
            const newLightness = hsl.l + lightnessStep * i;
            tints.push(tinycolor({ h: hsl.h, s: hsl.s, l: Math.min(newLightness, 1) }).toHexString());
        }
        tints.push('#ffffff');
        return tints;
    }

    function generateShades(baseColor) {
        const shades = [];
        const baseShade = tinycolor(baseColor);
        const hsl = baseShade.toHsl();
        const lightnessStep = hsl.l / 7;

        for (let i = 0; i < 7; i++) {
            const newLightness = hsl.l - lightnessStep * i;
            shades.push(tinycolor({ h: hsl.h, s: hsl.s, l: Math.max(newLightness, 0) }).toHexString());
        }
        shades.push('#000000');
        return shades;
    }

    function updateColorInfo(color) {
        const scheme = generateColorScheme(color);
        updateUI(scheme);
    }

    function updateUI(scheme) {
        schemesContainer.innerHTML = '';
        for (const [schemeName, colors] of Object.entries(scheme)) {
            const schemeElement = document.createElement('div');
            schemeElement.className = 'color-scheme';
            schemeElement.innerHTML = `<h3>${schemeName}</h3>`;
            
            const colorsElement = document.createElement('div');
            colorsElement.className = 'colors';

            colors.forEach(color => {
                const colorElement = document.createElement('div');
                colorElement.className = 'color';
                colorElement.style.backgroundColor = color;
                colorElement.textContent = color;
                colorsElement.appendChild(colorElement);
            });

            schemeElement.appendChild(colorsElement);
            schemesContainer.appendChild(schemeElement);
        }
    }

    baseColorInput.addEventListener('input', (event) => {
        const color = event.target.value;
        colorInput.value = color;
        updateColorInfo(color);
    });

    colorInput.addEventListener('input', (event) => {
        const color = event.target.value;
        baseColorInput.value = color;
        updateColorInfo(color);
    });
});
