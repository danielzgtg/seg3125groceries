import type Cart from '../cart';
import { renderPrice } from '../utils';
import type Warehouse from '../warehouse';

/**
 * A cached reference to the HTML elements that describe, in the form of a row, a cart item type.
 */
interface RowReference {
    /**
     * The row for adding to the DOM.
     *
     * This is destroyed once at the end.
     */
    readonly row: HTMLElement,

    /**
     * The cell to display the quantity in.
     */
    readonly quantityCell: HTMLElement,

    /**
     * The unit price, useful for calculating the total price on update.
     */
    readonly unitCents: number,

    /**
     * The total price, useful for calculating the gross total.
     */
    totalCents: number,

    /**
     * The cell to display the total price in.
     */
    readonly totalCentsCell: HTMLElement,
}

/**
 * Creates a checkout row.
 */
function createRow(displayName: string, unitCents: number, onDelete: () => void): RowReference {
    const result = document.createElement('tr');

    const quantityCell = document.createElement('td');
    result.appendChild(quantityCell);

    const nameCell = document.createElement('td');
    nameCell.innerText = displayName;
    result.appendChild(nameCell);

    const unitPriceCell = document.createElement('td');
    unitPriceCell.innerText = renderPrice(unitCents);
    result.appendChild(unitPriceCell);

    const totalCentsCell = document.createElement('td');
    result.appendChild(totalCentsCell);

    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('div');
    deleteButton.setAttribute('aria-label', 'Remove');
    deleteButton.onclick = onDelete;
    deleteCell.appendChild(deleteButton);
    result.appendChild(deleteCell);

    return {
        row: result,
        quantityCell,
        unitCents,
        totalCents: NaN,
        totalCentsCell,
    };
}

/**
 * Brings a displayed role up to date with the cart.
 */
function doUpdateItem(ref: RowReference, quantity: number): void {
    ref.quantityCell.innerText = String(quantity);
    const totalCents = ref.totalCents = ref.unitCents * quantity;
    ref.totalCentsCell.innerText = renderPrice(totalCents);
}

// Let's just assume for now that the warehouse never changes
// Handling changes is too troublesome for now
// TODO

/**
 * The checkout counter, where the customer confirms things before making the purchase.
 */
export default class Checkout {
    /**
     * The outermost element
     */
    private readonly outermost: HTMLElement;

    /**
     * The tbody
     */
    private readonly tbody: HTMLElement;

    /**
     * A reference to the Warehouse component
     */
    private warehouse: Warehouse;

    /**
     * A reference to the Cart component
     */
    private cart: Cart;

    /**
     * The cell to display the gross total in
     */
    private grossCell: HTMLElement;

    /**
     * The cell to display the HST in
     */
    private hstCell: HTMLElement;

    /**
     * The cell to display the net total in
     */
    private netCell: HTMLElement;

    // This is kind of acting more than just a cache because the full rebuild logic has been omitted.
    // This also allows for stability
    /**
     * A cached map of cart items to rows
     */
    private readonly cache: { [id: string]: RowReference }

    constructor(outermost: HTMLElement, warehouse: Warehouse, cart: Cart) {
        this.outermost = outermost;
        this.warehouse = warehouse;
        this.cart = cart;
        this.cache = {};
        // Wire the close button
        const back = outermost.querySelector('[aria-label]');
        if (!(back instanceof HTMLElement)) {
            throw TypeError;
        }
        back.onclick = () => this.onClose?.();
        // Wire the empty button
        const empty = document.getElementById('empty');
        if (!empty) {
            throw TypeError;
        }
        empty.onclick = () => this.cart.emptyCart();
        this.cart.onEmptyCart = () => this.onClose?.();
        // Wire the purchase button
        const purchase = document.getElementById('purchase');
        if (!purchase) {
            throw TypeError;
        }
        purchase.onclick = () => this.onPurchase?.();
        // Find the tbody
        const tbody = outermost.querySelector('tbody');
        if (!tbody) {
            throw TypeError;
        }
        this.tbody = tbody;
        // Find the total cells
        const grossCell = document.getElementById('gross-total');
        const hstCell = document.getElementById('hst');
        const netCell = document.getElementById('net-total');
        if (!grossCell || !hstCell || !netCell) {
            throw TypeError;
        }
        this.grossCell = grossCell;
        this.hstCell = hstCell;
        this.netCell = netCell;
        // TODO wire buttons towards the cart and back
        // Wire updates from cart
        cart.onItemQuantityChanged = this.doUpdate.bind(this);
    }

    /**
     * Ensures that when an item is removed from the cart, it gets removed from the table as well.
     */
    private doForgetItem(id: string): void {
        // Simply remove rows when the item leaves the cart
        const outdated = this.cache[id];
        if (outdated) {
            outdated.row.remove();
        }
        delete this.cache[id];
    }

    /**
     * Returns data referring to the displayed row.
     *
     * This uses the cached row iff possible, else inserts a new cache entry.
     * Membership in the cache should change at and only at the transition between quantities 0 and 1.
     */
    private getOrCreateCache(id: string): RowReference {
        // Must get the existing one if possible
        const existing = this.cache[id];
        if (existing) {
            return existing;
        }
        // No existing one means just added to cart
        // Need to create a new row
        const details = this.warehouse.getItem(id);
        const created = this.cache[id] = createRow(details.displayName, details.cents, () => this.cart.removeItem(id));
        this.tbody.appendChild(created.row);
        return created;
    }

    /**
     * Calculates the totals.
     */
    private updateTotals(): void {
        // Again, this is slower but more intuitive
        const rows = Object.values(this.cache);
        const gross = rows.map(x => x.totalCents).reduce((a, b) => a + b, 0);
        const hst = gross * 0.13;
        const net = gross * 1.13;
        this.grossCell.innerText = renderPrice(gross);
        this.hstCell.innerText = renderPrice(hst);
        this.netCell.innerText = renderPrice(net);
    }

    /**
     * Updates the row associated with the ID
     */
    private doUpdate(id: string): void {
        const quantity = this.cart.getItemQuantity(id);
        // Main branches: presence and absence
        if (quantity) {
            doUpdateItem(this.getOrCreateCache(id), quantity);
        } else {
            this.doForgetItem(id);
        }
        // Simply recalculate shared values at the end
        this.updateTotals();
    }

    /**
     * Handles any situation where the checkout process comes to a stop
     */
    onClose?: () => void;

    /**
     * Handles clicks to purchase
     */
    onPurchase?: () => void;
}
