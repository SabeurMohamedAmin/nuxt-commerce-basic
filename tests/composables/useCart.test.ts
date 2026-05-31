import { describe, it, expect, beforeEach } from 'vitest'
import { useCart } from '~/composables/useCart'

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset cart state by clearing and re-importing
    const { clearCart } = useCart()
    clearCart()
  })

  it('starts with an empty cart', () => {
    const { cartItems, cartCount, cartTotal } = useCart()
    expect(cartItems.value).toHaveLength(0)
    expect(cartCount.value).toBe(0)
    expect(cartTotal.value).toBe(0)
  })

  it('adds an item to the cart', () => {
    const { addToCart, cartItems, cartCount } = useCart()

    addToCart({ id: 1, title: 'Test Product', price: 2.49, image: '/img.jpg' })

    expect(cartItems.value).toHaveLength(1)
    expect(cartCount.value).toBe(1)
    expect(cartItems.value[0].title).toBe('Test Product')
  })

  it('does not add duplicate items', () => {
    const { addToCart, cartItems } = useCart()
    const item = { id: 1, title: 'Test', price: 2.49, image: '/img.jpg' }

    addToCart(item)
    addToCart(item)

    expect(cartItems.value).toHaveLength(1)
  })

  it('adds multiple different items', () => {
    const { addToCart, cartItems, cartCount } = useCart()

    addToCart({ id: 1, title: 'Product A', price: 2.49, image: '/a.jpg' })
    addToCart({ id: 2, title: 'Product B', price: 3.99, image: '/b.jpg' })

    expect(cartItems.value).toHaveLength(2)
    expect(cartCount.value).toBe(2)
  })

  it('calculates total correctly', () => {
    const { addToCart, cartTotal } = useCart()

    addToCart({ id: 1, title: 'A', price: 2.49, image: '' })
    addToCart({ id: 2, title: 'B', price: 3.51, image: '' })

    expect(cartTotal.value).toBeCloseTo(6.0)
  })

  it('removes an item from the cart', () => {
    const { addToCart, removeFromCart, cartItems } = useCart()

    addToCart({ id: 1, title: 'A', price: 2.49, image: '' })
    addToCart({ id: 2, title: 'B', price: 3.99, image: '' })
    removeFromCart(1)

    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0].id).toBe(2)
  })

  it('clears the cart', () => {
    const { addToCart, clearCart, cartItems, cartCount } = useCart()

    addToCart({ id: 1, title: 'A', price: 2.49, image: '' })
    addToCart({ id: 2, title: 'B', price: 3.99, image: '' })
    clearCart()

    expect(cartItems.value).toHaveLength(0)
    expect(cartCount.value).toBe(0)
  })

  it('toggles cart open state', () => {
    const { cartOpen, toggleCart } = useCart()

    expect(cartOpen.value).toBe(false)
    toggleCart()
    expect(cartOpen.value).toBe(true)
    toggleCart()
    expect(cartOpen.value).toBe(false)
  })
})
