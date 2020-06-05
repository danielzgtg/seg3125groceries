import type { Merchandise, Qualities } from '../models';
import loadData from './_dataset';

/**
 * A warehouse, to contain the data about the merchandise on sale.
 */
export default class Warehouse {
    /**
     * The backing storage.
     *
     * This is a map of IDs to details.
     */
    private data: { readonly [id: string]: Merchandise };

    constructor() {
        this.data = {};
    }

    /**
     * Fetches the latest sale information.
     *
     * This would call a server in a real app. but just loads static values in this demo.
     */
    refresh(): void {
        const data = {};
        loadData(data);
        this.data = data;
        // eslint-disable-next-line no-unused-expressions -- TODO ESLint bug
        this.onChange?.();
    }

    /**
     * Gets data about the item being sold.
     *
     * @param id The ID to specify an item.
     */
    getItem(id: string): Merchandise {
        const details = this.data[id];
        if (!details) {
            throw TypeError;
        }
        return details;
    }

    /**
     * Gets applicable items being sold as a list of IDs sorted by price.
     */
    getListing(filter: Qualities): string[] {
        const { data } = this;
        return Object.keys(data)
            .filter((x) => {
                for (const key of Object.keys(filter)) {
                    if (filter[key as keyof Qualities] && !data[x][key as keyof Qualities]) {
                        return false;
                    }
                }
                return true;
            })
            .sort((a, b) => data[a].cents - data[b].cents)
        ;
    }

    /**
     * Callback when the listing changes.
     */
    onChange?: () => void;
}
