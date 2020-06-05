import elements from './_elements';
// eslint-disable-next-line sort-imports
import Cart from '../cart';
import Warehouse from '../warehouse';
// eslint-disable-next-line sort-imports
import CartBar from '../cartBar';
import Checkout from '../checkout';
import Processing from '../processing';
import SalesFloor from '../salesFloor';
import Settings from '../settings';

/**
 * A registry of all components of the application;
 */
export default new class Components {
    readonly warehouse: Warehouse;
    readonly cart: Cart;

    readonly cartBar: CartBar;
    readonly settings: Settings;
    readonly salesFloor: SalesFloor;
    readonly checkout: Checkout;
    readonly processing: Processing;

    constructor() {
        // Data model
        this.warehouse = new Warehouse;
        this.cart = new Cart;
        // UI binding
        this.cartBar = new CartBar(elements.cartBar, this.cart);
        this.settings = new Settings(elements.settings);
        this.salesFloor = new SalesFloor(elements.salesFloor, this.warehouse, this.cart, this.settings);
        this.checkout = new Checkout(elements.checkout, this.warehouse, this.cart);
        this.processing = new Processing(elements.processing, this.cart);
    }
};
