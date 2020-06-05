/**
 * Always returns the element with the specified ID and type.
 *
 * If none can be found, a TypeError is thrown.
 */
function findOrThrow<T>(id: string, type: new () => T): T {
    const result = document.getElementById(id);
    if (result instanceof type) {
        return result;
    }
    throw TypeError;
}

/**
 * A registry of all HTML elements important to the controller.
 */
export default new class Elements {
    readonly salesFloor: HTMLDivElement;
    readonly cartBar: HTMLDivElement;
    readonly settings: HTMLDivElement;
    readonly checkout: HTMLDivElement;
    readonly processing: HTMLDivElement;

    constructor() {
        this.salesFloor = findOrThrow('sales-floor', HTMLDivElement);
        this.cartBar = findOrThrow('cart-bar', HTMLDivElement);
        this.settings = findOrThrow('settings', HTMLDivElement);
        this.checkout = findOrThrow('checkout', HTMLDivElement);
        this.processing = findOrThrow('processing', HTMLDivElement);
    }
};

