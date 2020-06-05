/**
 * An online shopping cart.
 */
export default class Cart {
    /**
     * The backing storage.
     *
     * This is a map of IDs to quantities.
     * No present item shall be zero.
     */
    private readonly quantities: { [id: string]: number };

    /**
     * The total number of items in the cart
     */
    private totalCount: number;

    constructor() {
        this.quantities = {};
        this.totalCount = 0;
    }

    /**
     * Adds a copy of an item to the cart by its ID.
     */
    addItem(id: string): void {
        this.quantities[id] = (this.quantities[id] || 0) + 1;
        // eslint-disable-next-line no-unused-expressions -- TODO ESLint bug
        this.onItemQuantityChanged?.(id);
        this.updateTotals();
    }

    /**
     * Removes all copies of an item from the cart by its ID.
     */
    removeItem(id: string): void {
        delete this.quantities[id];
        // eslint-disable-next-line no-unused-expressions -- TODO ESLint bug
        this.onItemQuantityChanged?.(id);
        this.updateTotals();
    }

    /**
     * Recalculates totalCount.
     */
    private updateTotals(): void {
        // This implementation is not the most efficient, but it's the most visibly safe.
        this.totalCount = Object.values(this.quantities).reduce((a, b) => a + b, 0);
        // eslint-disable-next-line no-unused-expressions -- TODO ESLint bug
        this.onTotalChanged?.();
    }

    /**
     * Returns the total number of items in the cart.
     */
    getTotalCount(): number {
        return this.totalCount;
    }

    /**
     * Returns the number of items in the cart with that ID.
     */
    getItemQuantity(id: string): number {
        return this.quantities[id] || 0;
    }

    /**
     * Removes all items from the cart.
     */
    private doEmpty(): void {
        // Avoid "in" to copy
        for (const id of Object.keys(this.quantities)) {
            this.removeItem(id);
        }
    }

    // ### Cart-emptying behavior ###

    /**
     * Empties the cart to cancel any plans to purchase.
     */
    emptyCart(): void {
        this.doEmpty();
        // eslint-disable-next-line no-unused-expressions -- TODO ESLint bug
        this.onEmptyCart?.();
    }

    /**
     * Makes the purchase, causing the items to leave the cart.
     */
    checkout(): void {
        this.doEmpty();
        // eslint-disable-next-line no-unused-expressions -- TODO ESLint bug
        this.onCheckout?.();
    }

    /*
     * ### Callbacks ###
     * These are called on changes to this object's state
     * All these callbacks must be idempotent
     */

    /**
     * Callback for a change is a quantity
     */
    onItemQuantityChanged?: (id: string) => void;

    /**
     * Callback for cart emptying success
     */
    onEmptyCart?: () => void;

    /**
     * Callback for successful checkout
     */
    onCheckout?: () => void;

    /**
     * Callback when items enter or leave the cart
     */
    onTotalChanged?: () => void;
}
