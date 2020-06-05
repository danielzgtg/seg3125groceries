import type { Qualities } from '../models';

/**
 * A menu to configure personal preferences.
 */
export default class Settings {
    /**
     * The outermost element
     */
    private readonly outermost: HTMLElement;

    /**
     * The user's preferences
     */
    private data: Qualities;

    /**
     * The vegetarian checkbox
     */
    private vegetarian: HTMLInputElement;

    /**
     * The gluten-free checkbox
     */
    private glutenFree: HTMLInputElement;

    /**
     * The organic checkbox
     */
    private organic: HTMLInputElement;

    constructor(outermost: HTMLElement) {
        this.outermost = outermost;
        this.data = {};
        // Wire the close button
        const button = outermost.querySelector('[aria-label]');
        if (!(button instanceof HTMLElement)) {
            throw TypeError;
        }
        button.onclick = () => this.onClose?.();
        // Find the checkboxes
        const vegetarian = document.getElementById('vegetarian');
        const glutenFree = document.getElementById('gluten-free');
        const organic = document.getElementById('organic');
        if (!(vegetarian instanceof HTMLInputElement) ||
            !(glutenFree instanceof HTMLInputElement) ||
            !(organic instanceof HTMLInputElement)) {
            throw TypeError;
        }
        // TODO bind the other two
        this.vegetarian = vegetarian;
        this.glutenFree = glutenFree;
        this.organic = organic;
        // Wire them
        const doRefresh = this.doRefresh.bind(this);
        vegetarian.onchange = doRefresh;
        glutenFree.onchange = doRefresh;
        organic.onchange = doRefresh;
    }

    /**
     * Returns the user's preferences.
     */
    getData(): Qualities {
        return this.data;
    }

    /**
     * Pulls in new data from the checkboxes.
     */
    private doRefresh(): void {
        // This is a complete refresh, but the performance implications don't matter with just three
        this.data = {
            vegetarian: this.vegetarian.checked,
            glutenFree: this.glutenFree.checked,
            organic: this.organic.checked,
        };
        // eslint-disable-next-line no-unused-expressions -- TODO ESLint bug
        this.onChange?.();
    }

    /**
     * Handles clicks to close the dialog
     */
    onClose?: () => void;

    /**
     * Handles changes in filter preferences
     */
    onChange?: () => void;
}
