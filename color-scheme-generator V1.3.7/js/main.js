console.log('main.js file loaded');
document.addEventListener('DOMContentLoaded', () => {
    const baseColorInput = document.getElementById('baseColor');
    const colorInput = document.getElementById('colorInput');
    const schemesContainer = document.getElementById('colorSchemes');

    console.log('DOM content loaded');

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
        const lightnessStep = (1 - hsl.l) / 7;  // 将剩余亮度范围均分为7份

        for (let i = 0; i < 7; i++) {
            const newLightness = hsl.l + lightnessStep * i;
            tints.push(tinycolor({h: hsl.h, s: hsl.s, l: Math.min(newLightness, 1)}).toHexString());
        }
        tints.push('#ffffff');
        return tints;
    }

    function generateShades(baseColor) {
        const shades = [];
        const baseShade = tinycolor(baseColor);
        const hsl = baseShade.toHsl();
        const lightnessStep = hsl.l / 7;  // 将亮度范围均分为7份

        for (let i = 0; i < 7; i++) {
            const newLightness = hsl.l - lightnessStep * i;
            shades.push(tinycolor({h: hsl.h, s: hsl.s, l: Math.max(newLightness, 0)}).toHexString());
        }
        shades.push('#000000');
        return shades;
    }

    function generateTones(baseColor) {
        const tones = [];
        const baseTone = tinycolor(baseColor);
        const hsl = baseTone.toHsl();
        const saturationStep = hsl.s / 7;  // 将饱和度范围均分为7份

        for (let i = 0; i < 7; i++) {
            const newSaturation = hsl.s - saturationStep * i;
            tones.push(tinycolor({h: hsl.h, s: Math.max(newSaturation, 0), l: hsl.l}).toHexString());
        }
        tones.push('#808080');
        return tones;
    }

    function generateTriadic(baseColor) {
        const color = tinycolor(baseColor);
        const triadic = color.triad();
        return triadic.map(c => c.toHexString());
    }

    function generateContrast(baseColor) {
        const color = tinycolor(baseColor);
        const complement = color.complement();
        return [color.toHexString(), complement.toHexString()];
    }

    function updateUI(scheme) {
        schemesContainer.innerHTML = ''; // 清空现有的颜色方案

        // 添加 "Mixing colors" 标题
        const mixingColorsTitle = document.createElement('h2');
        mixingColorsTitle.className = 'mixing-colors-title';
        mixingColorsTitle.textContent = 'Mixing colors';
        schemesContainer.appendChild(mixingColorsTitle);

        const descriptions = {
            'Tints': 'The color tints scheme is a group of colors that are variations of a single hue, with added white to create a lighter and more delicate look.',
            'Shades': 'The color shades scheme is a group of colors that are variations of a single hue, with different levels of lightness and darkness. This scheme creates a cohesive and subtle look.',
            'Tones': 'The color tones scheme is a group of colors that are variations of a single hue, with added gray to create a muted and softer look.',
            'Triadic': 'The triadic color scheme uses three colors equally spaced around the color wheel. This scheme offers strong visual contrast while retaining balance, and creates a vibrant and harmonious palette.',
            'Contrast': 'The contrast color scheme pairs the base color with its complement (opposite on the color wheel). This creates a bold, dynamic look with maximum contrast, ideal for designs that need to "pop".'
        };

        // 调换 Shades 和 Tones 的位置
        const orderedSchemes = ['Tints', 'Tones', 'Shades', 'Triadic', 'Contrast'];

        for (const schemeName of orderedSchemes) {
            const colors = scheme[schemeName];
            if (!Array.isArray(colors)) {
                console.error(`Colors for ${schemeName} is not an array:`, colors);
                continue;
            }
            const schemeElement = document.createElement('div');
            schemeElement.className = 'color-scheme';
            schemeElement.innerHTML = `<h3>${schemeName} of ${colors[0].toUpperCase()}</h3>`;

            if (descriptions[schemeName]) {
                const descriptionElement = document.createElement('p');
                descriptionElement.className = 'description-text';
                descriptionElement.textContent = descriptions[schemeName];
                schemeElement.appendChild(descriptionElement);
            }

            const colorsElement = document.createElement('div');
            colorsElement.className = 'colors';

            colors.forEach(color => {
                const colorElement = document.createElement('div');
                colorElement.className = 'color';
                colorElement.style.backgroundColor = color;
                const textColor = tinycolor(color).isLight() ? '#000000' : '#ffffff';
                const span = document.createElement('span');
                span.style.setProperty('--text-color', textColor);
                span.textContent = color;
                span.onclick = function() {
                    copyToClipboard(color);
                };
                colorElement.appendChild(span);
                colorsElement.appendChild(colorElement);
            });

            schemeElement.appendChild(colorsElement);
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
        
        // 更新URL链接
        const url = `${window.location.origin}${window.location.pathname}?color=${tc.toHex()}`;
        window.history.replaceState(null, null, url);

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
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        document.getElementById('cmykValue').textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
        
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

        // 生成新的颜色方案
        const scheme = generateColorScheme(color);
        updateUI(scheme);
        updateMetaTags(color);
    }

    function rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);
        
        c = ((c - k) / (1 - k)) * 100;
        m = ((m - k) / (1 - k)) * 100;
        y = ((y - k) / (1 - k)) * 100;
        k = k * 100;
        
        return {c: Math.round(c), m: Math.round(m), y: Math.round(y), k: Math.round(k)};
    }

    function rgbToLab(r, g, b) {
        // Simplified conversion, not color-space accurate
        const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const a = (r - g) * 0.5;
        const bValue = (b - g) * 0.5;
        return {l: l / 2.55, a: a, b: bValue};
    }

    function labToLch(l, a, b) {
        const c = Math.sqrt(a * a + b * b);
        let h = Math.atan2(b, a) * (180 / Math.PI);
        if (h < 0) {
            h += 360;
        }
        return {l, c, h};
    }

    function rgbToXyz(r, g, b) {
        // Simplified conversion, not color-space accurate
        const x = 0.4124 * r + 0.3576 * g + 0.1805 * b;
        const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
        return {x: x / 2.55, y: y / 2.55, z: z / 2.55};
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification(text);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    function showCopyNotification(text) {
        const notification = document.getElementById('copyNotification');
        const copyValue = document.getElementById('copyValue');
        copyValue.textContent = text;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // 初始化
    console.log('Initializing with color:', baseColorInput.value);
    const initialColor = baseColorInput.value;
    const initialScheme = generateColorScheme(initialColor);
    updateUI(initialScheme);
    updateMetaTags(initialColor);
    updateColorInfo(initialColor);
    colorInput.value = initialColor; // 确保初始值同步

    baseColorInput.addEventListener('input', (event) => {
        const color = event.target.value;
        console.log(`Base color input changed: ${color}`);
        colorInput.value = color;
        console.log(`Color input updated to: ${colorInput.value}`);
        const scheme = generateColorScheme(color);
        updateUI(scheme);
        updateMetaTags(color);
        updateColorInfo(color);
    });

    baseColorInput.addEventListener('change', (event) => {
        console.log(`Base color change event: ${event.target.value}`);
    });

    colorInput.addEventListener('input', (event) => {
        const color = event.target.value;
        console.log(`Color input changed: ${color}`);
        if (isValidHex(color)) {
            baseColorInput.value = color;
            console.log(`Base color input updated to: ${baseColorInput.value}`);
            const scheme = generateColorScheme(color);
            updateUI(scheme);
            updateMetaTags(color);
            updateColorInfo(color);
        }
    });

    colorInput.addEventListener('blur', (event) => {
        const color = event.target.value;
        console.log(`Color input blur event: ${color}`);
        if (!isValidHex(color)) {
            colorInput.value = baseColorInput.value;
            console.log(`Color input reset to: ${colorInput.value}`);
        }
    });

    // 添加点击事件监听器到每个 .color-value p 标签
    document.querySelectorAll('.color-value p').forEach(p => {
        p.addEventListener('click', function() {
            copyToClipboard(this.textContent);
        });
    });

    // 添加空格键生成随机颜色的功能
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            const randomColor = tinycolor.random().toHexString();
            baseColorInput.value = randomColor;
            colorInput.value = randomColor;
            updateColorInfo(randomColor);
        }
    });
});
