import type Cart from '../cart';

/**
 * A payment processor.
 */
export default class Processing {
    /**
     * The element which acts as a switch
     */
    private readonly control: HTMLElement;

    /**
     * The cart used to make this purchase, and to make empty after.
     */
    private readonly cart: Cart;

    constructor(outermost: HTMLElement, cart: Cart) {
        this.cart = cart;
        // Find the element used as an switch switch
        const control = outermost.querySelector('section');
        if (!control) {
            throw TypeError;
        }
        this.control = control;
        // Wire the cart back to the controls (needs to be lazy)
        this.cart.onCheckout = () => this.onClose?.();
    }

    /**
     * Shows this intermission.
     */
    show(): void {
        // Reset
        this.control.hidden = false;
        // Wire some timers
        setTimeout(() => {
            this.control.hidden = true;
            // Setup next phase
            const { onClose } = this;
            if (!onClose) {
                throw TypeError;
            }
            setTimeout(() => {
                this.cart.checkout();
            }, 1000);
        }, 2000);
    }

    /**
     * Handles when the payment finishes
     */
    onClose?: () => void;
}
