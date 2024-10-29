function generateColorScheme(baseColor) {
    const rgb = hexToRgb(baseColor);
    
    return {
        'Base Color': [baseColor],
        'Shades': generateShades(rgb),
        'Tints': generateTints(rgb),
        'Complementary': [generateComplementary(rgb)],
        'Analogous': generateAnalogous(rgb),
    };
}

function generateShades(rgb) {
    return [0.8, 0.6, 0.4, 0.2].map(factor => 
        rgb.map(c => Math.round(c * factor))
    ).map(shade => rgbToHex(...shade));
}

function generateTints(rgb) {
    return [0.8, 0.6, 0.4, 0.2].map(factor => 
        rgb.map(c => Math.round(c + (255 - c) * factor))
    ).map(tint => rgbToHex(...tint));
}

function generateComplementary(rgb) {
    return rgbToHex(...rgb.map(c => 255 - c));
}

function generateAnalogous(rgb) {
    const hsl = rgbToHsl(...rgb);
    const h = hsl[0];
    return [
        hslToRgb((h + 30) % 360, hsl[1], hsl[2]),
        hslToRgb((h + 60) % 360, hsl[1], hsl[2])
    ].map(color => rgbToHex(...color));
}