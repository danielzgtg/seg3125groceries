/*
 * This file is modeled after the controller pattern.
 * This controlling components when they can't control each other such as in a dependency cycle.
 */

import { State, stateMachine } from './_state';
import components from './_components';

/**
 * Binds buttons to state transitions, and other init
 */
export function init(): void {
    // Bind
    components.cartBar.onClick = () => stateMachine.changeState(State.CHECKOUT);
    components.settings.onClose = () => stateMachine.changeState(State.SALES_FLOOR);
    components.salesFloor.onSettingsClick = () => stateMachine.changeState(State.SETTINGS);
    components.checkout.onClose = () => stateMachine.changeState(State.SALES_FLOOR);
    components.checkout.onPurchase = () => stateMachine.changeState(State.PROCESSING);
    components.processing.onClose = () => stateMachine.changeState(State.SALES_FLOOR);
    // Initial Tick
    components.warehouse.refresh();
}
