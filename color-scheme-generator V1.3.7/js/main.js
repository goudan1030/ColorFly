document.addEventListener('DOMContentLoaded', () => {
    const baseColorInput = document.getElementById('baseColor');
    const colorInput = document.getElementById('colorInput');
    const schemesContainer = document.getElementById('colorSchemes');

    function generateColorScheme(baseColor) {
        return {
            "Tints": generateTints(baseColor),
            "Shades": generateShades(baseColor),
            "Triadic": generateTriadic(baseColor),
            "Contrast": [generateContrastColor(baseColor)]
        };
    }

    function generateTints(baseColor) {
        const tints = [];
        for (let i = 0; i < 5; i++) {
            tints.push(tinycolor(baseColor).lighten(i * 10).toHexString());
        }
        return tints;
    }

    function generateShades(baseColor) {
        const shades = [];
        for (let i = 0; i < 5; i++) {
            shades.push(tinycolor(baseColor).darken(i * 10).toHexString());
        }
        return shades;
    }

    function generateTriadic(baseColor) {
        return tinycolor(baseColor).triad().map(t => t.toHexString());
    }

    function generateContrastColor(baseColor) {
        return tinycolor(baseColor).complement().toHexString();
    }

    function updateUI(scheme) {
        schemesContainer.innerHTML = '';
        
        for (const [name, colors] of Object.entries(scheme)) {
            const schemeElement = document.createElement('div');
            schemeElement.className = 'scheme';
            const title = document.createElement('h2');
            title.textContent = name;
            schemeElement.appendChild(title);
            
            const colorsContainer = document.createElement('div');
            colorsContainer.className = 'colors-container';
            
            colors.forEach(color => {
                const colorBox = document.createElement('div');
                colorBox.className = 'color-box';
                colorBox.style.backgroundColor = color;
                colorBox.textContent = color;
                colorsContainer.appendChild(colorBox);
            });
            
            schemeElement.appendChild(colorsContainer);
            schemesContainer.appendChild(schemeElement);
        }
    }

    function updateMetaTags(color) {
        document.querySelector('meta[property="og:title"]').setAttribute("content", `Color Scheme Generator - Palette for ${color.toUpperCase()}`);
        document.querySelector('meta[property="og:description"]').setAttribute("content", `Create beautiful color palettes based on ${color.toUpperCase()} with our easy-to-use color scheme generator.`);
    }

    function isValidHex(color) {
        return /^#[0-9A-F]{6}$/i.test(color);
    }

    function updateColorInfo(color) {
        const tc = tinycolor(color);
        
        document.getElementById('colorName').textContent = tc.toName() || 'Custom';
        document.getElementById('hexValue').textContent = tc.toHexString();
        document.getElementById('rgbValue').textContent = tc.toRgbString();
        document.getElementById('hslValue').textContent = tc.toHslString();
        
        // Calculate HWB
        const rgb = tc.toRgb();
        const w = Math.min(rgb.r, rgb.g, rgb.b) / 255 * 100;
        const bl = 100 - Math.max(rgb.r, rgb.g, rgb.b) / 255 * 100;
        const h = tc.toHsl().h;
        document.getElementById('hwbValue').textContent = `hwb(${Math.round(h)}, ${Math.round(w)}%, ${Math.round(bl)}%)`;
        
        document.getElementById('hsvValue').textContent = tc.toHsvString();
        
        // Calculate CMYK
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        const k = 1 - Math.max(r, g, b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;
        document.getElementById('cmykValue').textContent = `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
        
        // Calculate LAB
        const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
        document.getElementById('labValue').textContent = `lab(${lab.l.toFixed(2)}, ${lab.a.toFixed(2)}, ${lab.b.toFixed(2)})`;
        
        // Calculate LCH
        const lch = labToLch(lab.l, lab.a, lab.b);
        document.getElementById('lchValue').textContent = `lch(${lch.l.toFixed(2)}, ${lch.c.toFixed(2)}, ${lch.h.toFixed(2)})`;
        
        // Calculate XYZ
        const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
        document.getElementById('xyzValue').textContent = `xyz(${(xyz.x * 100).toFixed(2)}%, ${(xyz.y * 100).toFixed(2)}%, ${(xyz.z * 100).toFixed(2)}%)`;
        
        // Pantone值需要特殊处理，这里只是占位
        document.getElementById('pantoneValue').textContent = 'Not available';

        // Update color-values background and text color
        const colorValues = document.querySelector('.color-values');
        colorValues.style.backgroundColor = color;
        colorValues.style.color = tc.isLight() ? '#000' : '#fff';
    }

    // Helper functions for color conversions
    function rgbToXyz(r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;

        r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

        const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
        const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

        return {x, y, z};
    }

    function xyzToLab(x, y, z) {
        const ref = {x: 95.047, y: 100, z: 108.883};

        x = x / ref.x;
        y = y / ref.y;
        z = z / ref.z;

        x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
        y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
        z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

        const l = (116 * y) - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);

        return {l, a, b};
    }

    function rgbToLab(r, g, b) {
        const xyz = rgbToXyz(r, g, b);
        return xyzToLab(xyz.x, xyz.y, xyz.z);
    }

    function labToLch(l, a, b) {
        const c = Math.sqrt(a * a + b * b);
        let h = Math.atan2(b, a) * (180 / Math.PI);
        if (h < 0) {
            h += 360;
        }
        return {l, c, h};
    }

    // Initialize with the default color
    const initialColor = baseColorInput.value;
    const initialScheme = generateColorScheme(initialColor);
    updateUI(initialScheme);
    updateMetaTags(initialColor);
    updateColorInfo(initialColor);

    baseColorInput.addEventListener('input', () => {
        const color = baseColorInput.value;
        colorInput.value = color;
        const scheme = generateColorScheme(color);
        updateUI(scheme);
        updateMetaTags(color);
        updateColorInfo(color);
    });

    colorInput.addEventListener('input', () => {
        const color = colorInput.value;
        if (isValidHex(color)) {
            baseColorInput.value = color;
            const scheme = generateColorScheme(color);
            updateUI(scheme);
            updateMetaTags(color);
            updateColorInfo(color);
        }
    });

    colorInput.addEventListener('blur', () => {
        const color = colorInput.value;
        if (!isValidHex(color)) {
            colorInput.value = baseColorInput.value;
        }
    });
});