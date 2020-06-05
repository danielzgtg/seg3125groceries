jest.mock('./_images.ts', () => new Proxy({}, {
    get() {
        return '';
    },
}));

import Warehouse from './index';

it('starts empty', () => {
    const w = new Warehouse;
    expect(w.getListing({})).toMatchObject({});
});

it('refresh works', () => {
    const w = new Warehouse;
    w.refresh();
});

it('all prices are valid', () => {
    const w = new Warehouse;
    w.refresh();
    for (const id of w.getListing({})) {
        expect(w.getItem(id)).toBeTruthy();
    }
});

it('plain prices in ascending order', () => {
    const w = new Warehouse;
    w.refresh();
    let min = 0;
    for (const id of w.getListing({})) {
        const cur = w.getItem(id);
        expect(cur.cents).toBeGreaterThanOrEqual(min);
        min = cur.cents;
    }
});
