/**
 * Food characteristics.
 *
 * This is used both by the food listing and the user filters.
 */
export interface Qualities {
    // The falsy defaults are picked for security.

    /**
     * Whether the product is free from meat.
     *
     * This is vegetarian, not vegan.
     * This means that bread containing milk is still considered to fall in this category.
     */
    readonly vegetarian?: boolean,

    /**
     * Whether the product is free from all grains with gluten
     */
    readonly glutenFree?: boolean,

    /**
     * Whether the product is legally certified organic
     */
    readonly organic?: boolean,
}

/**
 * An item type sold by the store.
 */
export interface Merchandise extends Qualities {
    /**
     * Price of the product in cents.
     *
     * Shall be in the range [0..999_99].
     * Even though JS only has floats, it's a good habit to think in integers for money.
     */
    readonly cents: number,

    /**
     * The English name shown on the UI.
     *
     * This is different from the database ID, which is separate from this object.
     */
    readonly displayName: string,

    /**
     * The URL of an image depicting the product
     */
    readonly imageURL: string,
}
