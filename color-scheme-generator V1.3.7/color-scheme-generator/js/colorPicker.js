class ColorPicker {
    constructor(element) {
        this.element = element;
        this.colorInput = element.querySelector('input[type="color"]');
        this.callbacks = [];
        this.init();
    }

    init() {
        this.colorInput.addEventListener('input', () => this.notifyChange());
    }

    onChange(callback) {
        this.callbacks.push(callback);
    }

    notifyChange() {
        const color = this.colorInput.value;
        this.callbacks.forEach(callback => callback(color));
    }
}