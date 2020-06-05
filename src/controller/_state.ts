// The state machine file

import components from './_components';
import elements from './_elements';

/**
 * The possible states.
 *
 * Basically pages.
 */
export const enum State {
    /**
     * Browsing the "salesFloor" component at a glance with a huge list of products.
     */
    SALES_FLOOR = 0,

    /**
     * Checking out and reviewing before making a purchase in "checkout".
     */
    CHECKOUT = 1,

    /**
     * Setting search filters in "settings" to see their effect in the listing.
     */
    SETTINGS = 2,

    /**
     * Waiting for payment to complete.
     */
    PROCESSING = 3,
}

/**
 * The state machine.
 *
 * On each transition, the rest of the app is brought in line.
 * Available transitions are constrained to design for soundness.
 */
export class StateMachine {
    private current: State;

    constructor() {
        this.current = State.SALES_FLOOR;
    }

    changeState(next: State): void {
        const { current } = this;
        if (current === next) {
            throw TypeError;
        }
        switch (current) {
        case State.SALES_FLOOR:
            switch (next) {
            case State.CHECKOUT:
                elements.salesFloor.hidden = true;
                elements.checkout.hidden = false;
                break;
            case State.SETTINGS:
                elements.salesFloor.hidden = true;
                elements.settings.hidden = false;
                break;
            default:
                throw TypeError;
            }
            break;
        case State.SETTINGS:
            if (next !== State.SALES_FLOOR) {
                throw TypeError;
            }
            elements.settings.hidden = true;
            elements.salesFloor.hidden = false;
            break;
        case State.CHECKOUT:
            switch (next) {
            case State.SALES_FLOOR:
                elements.checkout.hidden = true;
                elements.salesFloor.hidden = false;
                break;
            case State.PROCESSING:
                elements.checkout.hidden = true;
                elements.processing.hidden = false;
                components.processing.show();
                break;
            default:
                throw TypeError;
            }
            break;
        case State.PROCESSING:
            if (next !== State.SALES_FLOOR) {
                throw TypeError;
            }
            elements.processing.hidden = true;
            elements.salesFloor.hidden = false;
            break;
        }
        this.current = next;
    }
}

export const stateMachine = new StateMachine;
