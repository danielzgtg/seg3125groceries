/**
 * Renders a price in cents so that it can be displayed as a dollar.
 */
export function renderPrice(cents: number): string {
    return (cents / 100).toFixed(2);
}
