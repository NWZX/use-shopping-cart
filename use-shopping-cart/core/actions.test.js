import { actions } from './slice'

let counter = 0
function mockProduct(overrides) {
  return {
    id: `sku_abc${counter++}`,
    name: 'blah bleh bloo',
    price: Math.floor(Math.random() * 1000 + 1),
    image: 'https://blah.com/bleh',
    alt: 'a bleh glowing under a soft sunrise',
    currency: 'usd',
    ...overrides
  }
}

function mockCartDetails(overrides) {
  return {
    [`sku_abc${counter}`]: {
      sku: `sku_abc${counter++}`,
      name: 'Bananas',
      image: 'https://blah.com/banana.avif',
      price: 400,
      currency: 'USD',
      value: 800,
      quantity: 2,
      formattedValue: '$8.00',
      ...overrides
    },
    [`sku_efg${counter}`]: {
      sku: `sku_efg${counter++}`,
      name: 'Oranges',
      image: 'https://blah.com/orange.avif',
      currency: 'USD',
      price: 250,
      value: 1000,
      quantity: 4,
      formattedValue: '$10.00',
      ...overrides
    }
  }
}

describe('actions', () => {
  it('should create an action to add item to cart', () => {
    const product = mockProduct()

    const expectedAction = {
      type: 'cart/addItem',
      payload: {
        product,
        options: { count: 1, price_metadata: {}, product_metadata: {} }
      }
    }

    expect(actions.addItem(product)).toEqual(expectedAction)
  })

  it('should create an action to incrementItem', () => {
    const product = mockProduct()
    const expectedAction = {
      type: 'cart/incrementItem',
      payload: { id: product.id, options: { count: 1 } }
    }

    expect(actions.incrementItem(product.id)).toEqual(expectedAction)
  })

  it('should create an action to decrementItem', () => {
    const product = mockProduct()
    const expectedAction = {
      type: 'cart/decrementItem',
      payload: { id: product.id, options: { count: 1 } }
    }

    expect(actions.decrementItem(product.id)).toEqual(expectedAction)
  })

  it('should create an action to clear the cart', () => {
    const expectedAction = {
      type: 'cart/clearCart',
      payload: undefined
    }

    expect(actions.clearCart()).toEqual(expectedAction)
  })

  it('should create an action to setItemQuantity', () => {
    const product = mockProduct()
    const expectedAction = {
      type: 'cart/setItemQuantity',
      payload: { id: product.id, quantity: 1 }
    }

    expect(actions.setItemQuantity(product.id, 1)).toEqual(expectedAction)
  })

  it('should create an action to removeItem', () => {
    const product = mockProduct()
    const expectedAction = {
      type: 'cart/removeItem',
      payload: product.id
    }

    expect(actions.removeItem(product.id)).toEqual(expectedAction)
  })

  it('should create an action to setItemQuantity', () => {
    const product = mockProduct()
    const expectedAction = {
      type: 'cart/setItemQuantity',
      payload: { id: product.id, quantity: 4 }
    }

    expect(actions.setItemQuantity(product.id, 4)).toEqual(expectedAction)
  })

  it('should create an action to loadCart', () => {
    const mockDetails = mockCartDetails()
    const expectedAction = {
      type: 'cart/loadCart',
      payload: { cartDetails: mockDetails, shouldMerge: true }
    }

    expect(actions.loadCart(mockDetails)).toEqual(expectedAction)
  })

  it('should create an action for handleCartClick', () => {
    const expectedAction = {
      type: 'cart/handleCartClick',
      payload: undefined
    }

    expect(actions.handleCartClick()).toEqual(expectedAction)
  })

  it('should create an action for redirectToCheckout', () => {
    const expectedAction = {
      type: 'cart/redirectToCheckout',
      payload: undefined
    }

    expect(actions.redirectToCheckout()).toEqual(expectedAction)
  })

  it('should create an action for checkoutSingleItem', () => {
    const expectedAction = {
      type: 'cart/checkoutSingleItem',
      payload: undefined
    }

    expect(actions.checkoutSingleItem()).toEqual(expectedAction)
  })

  it('should create an action for handleCloseCart', () => {
    const expectedAction = {
      type: 'cart/handleCloseCart',
      payload: undefined
    }

    expect(actions.handleCloseCart()).toEqual(expectedAction)
  })

  it('should create an action for handleCartClick', () => {
    const expectedAction = {
      type: 'cart/handleCartClick',
      payload: undefined
    }

    expect(actions.handleCartClick()).toEqual(expectedAction)
  })
})
