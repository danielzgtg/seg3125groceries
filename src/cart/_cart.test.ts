import Cart from './index';

it('constructs', () => {
    const c = new Cart;
    expect(c).toBeTruthy();
});

it('registers items going in', () => {
    const c = new Cart;
    expect(c.getItemQuantity('test')).toEqual(0);
    c.addItem('test');
    expect(c.getItemQuantity('test')).toEqual(1);
    c.addItem('test');
    expect(c.getItemQuantity('test')).toEqual(2);
    c.addItem('test');
    expect(c.getItemQuantity('test')).toEqual(3);
});

test('is completely emptied', () => {
    const c = new Cart;
    expect(c.getItemQuantity('test')).toEqual(0);
    c.addItem('test');
    expect(c.getItemQuantity('test')).toEqual(1);
    c.addItem('test');
    expect(c.getItemQuantity('test')).toEqual(2);
    c.removeItem('test');
    expect(c.getItemQuantity('test')).toEqual(0);
});

test('single item total', () => {
    const c = new Cart;
    expect(c.getTotalCount()).toEqual(0);
    c.addItem('test');
    expect(c.getTotalCount()).toEqual(1);
    c.addItem('test');
    expect(c.getTotalCount()).toEqual(2);
    c.addItem('test');
    expect(c.getTotalCount()).toEqual(3);
});

test('multi item total', () => {
    const c = new Cart;
    expect(c.getTotalCount()).toEqual(0);
    c.addItem('foo');
    expect(c.getTotalCount()).toEqual(1);
    c.addItem('bar');
    expect(c.getTotalCount()).toEqual(2);
    c.addItem('bar');
    expect(c.getTotalCount()).toEqual(3);
    c.addItem('biz');
    expect(c.getTotalCount()).toEqual(4);
});

test('multi item isolation', () => {
    const c = new Cart;
    expect(c.getItemQuantity('foo')).toEqual(0);
    expect(c.getItemQuantity('bar')).toEqual(0);
    expect(c.getItemQuantity('biz')).toEqual(0);
    c.addItem('foo');
    c.addItem('foo');
    c.addItem('foo');
    expect(c.getItemQuantity('foo')).toEqual(3);
    expect(c.getItemQuantity('bar')).toEqual(0);
    expect(c.getItemQuantity('biz')).toEqual(0);
    c.addItem('bar');
    expect(c.getItemQuantity('foo')).toEqual(3);
    expect(c.getItemQuantity('bar')).toEqual(1);
    expect(c.getItemQuantity('biz')).toEqual(0);
    c.addItem('biz');
    c.addItem('biz');
    expect(c.getItemQuantity('foo')).toEqual(3);
    expect(c.getItemQuantity('bar')).toEqual(1);
    expect(c.getItemQuantity('biz')).toEqual(2);
});

it('triggers insertion callback', () => {
    const c = new Cart;
    const m = jest.fn();
    c.onItemQuantityChanged = m;
    expect(m).toHaveBeenCalledTimes(0);
    c.addItem('test');
    expect(m).toHaveBeenNthCalledWith(1, 'test');
    c.addItem('test');
    expect(m).toHaveBeenNthCalledWith(2, 'test');
    c.addItem('test');
    expect(m).toHaveBeenNthCalledWith(3, 'test');
    expect(m).toHaveBeenCalledTimes(3);
});

it('triggers removal callback', () => {
    const c = new Cart;
    c.addItem('test');
    c.addItem('test');
    c.addItem('test');
    const m = jest.fn();
    c.onItemQuantityChanged = m;
    expect(m).toHaveBeenCalledTimes(0);
    c.removeItem('test');
    expect(m).toHaveBeenNthCalledWith(1, 'test');
    expect(m).toHaveBeenCalledTimes(1);
});

it('triggers total insertion callback', () => {
    const c = new Cart;
    const m = jest.fn();
    c.onTotalChanged = m;
    expect(m).toHaveBeenCalledTimes(0);
    c.addItem('foo');
    expect(m).toHaveBeenCalledTimes(1);
    c.addItem('bar');
    expect(m).toHaveBeenCalledTimes(2);
    c.addItem('bar');
    expect(m).toHaveBeenCalledTimes(3);
    c.addItem('bar');
    expect(m).toHaveBeenCalledTimes(4);
    c.addItem('biz');
    expect(m).toHaveBeenCalledTimes(5);
});

it('triggers total removal callback', () => {
    const c = new Cart;
    const m = jest.fn();
    c.addItem('foo');
    c.addItem('foo');
    c.addItem('biz');
    c.addItem('bar');
    c.addItem('bar');
    c.addItem('bar');
    c.onTotalChanged = m;
    expect(m).toHaveBeenCalledTimes(0);
    c.removeItem('bar');
    expect(m).toHaveBeenCalledTimes(1);
});

test('empty callback', () => {
    const c = new Cart;
    const s = jest.fn();
    const e = jest.fn();
    c.onEmptyCart = s;
    c.onCheckout = e;
    c.addItem('foo');
    expect(s).toHaveBeenCalledTimes(0);
    expect(e).toHaveBeenCalledTimes(0);
    c.emptyCart();
    expect(s).toHaveBeenCalledTimes(1);
    expect(e).toHaveBeenCalledTimes(0);
});

test('checkout callback', () => {
    const c = new Cart;
    const s = jest.fn();
    const e = jest.fn();
    c.onCheckout = s;
    c.onEmptyCart = e;
    c.addItem('foo');
    expect(s).toHaveBeenCalledTimes(0);
    expect(e).toHaveBeenCalledTimes(0);
    c.checkout();
    expect(s).toHaveBeenCalledTimes(1);
    expect(e).toHaveBeenCalledTimes(0);
});

it('empties', () => {
    const c = new Cart;
    c.addItem('test');
    expect(c.getTotalCount()).toEqual(1);
    c.emptyCart();
    expect(c.getTotalCount()).toEqual(0);
});

it('checks out', () => {
    const c = new Cart;
    c.addItem('test');
    expect(c.getTotalCount()).toEqual(1);
    c.checkout();
    expect(c.getTotalCount()).toEqual(0);
});
