import type Cart from '../cart';
import { renderPrice } from '../utils';
import type Settings from '../settings';
import toss from '../basketball';
import type Warehouse from '../warehouse';

/**
 * The result of createCard.
 */
interface CreateCardResult {
    /**
     * The card for adding to the DOM
     */
    readonly card: HTMLElement,

    /**
     * The image for making a copy of to animate
     */
    readonly img: HTMLDivElement,
}

/**
 * Creates a deal card with the specified data
 */
function createCard(displayName: string, cents: number, imageURL: string): CreateCardResult {
    const result = document.createElement('article');
    // Image on top
    const img = document.createElement('div');
    img.style.backgroundImage = `url(${imageURL})`;
    result.appendChild(img);
    // Followed by label below with text
    const label = document.createElement('label');
    // Name comes first
    const nameElement = document.createElement('span');
    nameElement.innerText = displayName;
    label.appendChild(nameElement);
    // Then price
    const priceElement = document.createElement('span');
    priceElement.innerText = renderPrice(cents);
    label.appendChild(priceElement);
    // Commit
    result.appendChild(label);
    return { card: result, img };
}

/**
 * The place where trading is done.
 */
export default class SalesFloor {
    /**
     * The outermost element
     */
    private readonly outermost: HTMLElement;

    /**
     * The element to attach the container to
     */
    private readonly containerParent: HTMLElement;

    /**
     * The previous container for all the deal cards
     */
    private container?: HTMLElement;

    /**
     * A reference to the Warehouse component
     */
    private warehouse: Warehouse;

    /**
     * A reference to the Cart component
     */
    private cart: Cart;

    /**
     * A reference to the Settings component
     */
    private settings: Settings;

    constructor(outermost: HTMLElement, warehouse: Warehouse, cart: Cart, settings: Settings) {
        this.outermost = outermost;
        this.warehouse = warehouse;
        this.cart = cart;
        this.settings = settings;
        // Wire the filter button
        const button = outermost.querySelector('[aria-label]');
        if (!(button instanceof HTMLElement)) {
            throw TypeError;
        }
        button.onclick = () => this.onSettingsClick?.();
        // Find the container
        const containerParent = outermost.querySelector('main');
        if (!containerParent) {
            throw TypeError;
        }
        this.containerParent = containerParent;
        // Wire refreshes from other component
        const doRefresh = this.doRefresh.bind(this);
        warehouse.onChange = doRefresh;
        settings.onChange = doRefresh;
    }

    /**
     * Refreshes the data upon learning that there might be something new.
     */
    private doRefresh(): void {
        // Even recreate the parent for simplicity
        // eslint-disable-next-line no-unused-expressions -- TODO ESLint bug
        this.container?.remove();
        const container = document.createElement('section');
        this.container = container;
        // Readd the cards
        const { warehouse } = this;
        for (const id of warehouse.getListing(this.settings.getData())) {
            // Create each card
            const product = warehouse.getItem(id);
            const { card, img } = createCard(product.displayName, product.cents, product.imageURL);
            // Wire the card
            card.onclick = () => {
                toss(img);
                this.cart.addItem(id);
            };
            // Commit
            container.appendChild(card);
        }
        this.containerParent.appendChild(container);
    }

    /**
     * Handles clicks to open the settings
     */
    onSettingsClick?: () => void;
}
