import type { CartItem } from '~/types'
import { STORAGE_KEYS } from '~/constants'
import { getStoredItem, setStoredItem, removeStoredItem } from '~/utils/storage'

const cartItems = ref<CartItem[]>([])
const cartOpen = ref(false)

function hydrateCart() {
  if (import.meta.client && cartItems.value.length === 0) {
    const stored = getStoredItem<CartItem[]>(STORAGE_KEYS.CART)
    if (stored) cartItems.value = stored
  }
}

function persistCart() {
  if (cartItems.value.length > 0) {
    setStoredItem(STORAGE_KEYS.CART, cartItems.value)
  } else {
    removeStoredItem(STORAGE_KEYS.CART)
  }
}

export function useCart() {
  hydrateCart()

  const cartCount = computed(() => cartItems.value.length)
  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price, 0)
  )

  function addToCart(item: CartItem) {
    const exists = cartItems.value.some(i => i.id === item.id)
    if (!exists) {
      cartItems.value.push(item)
      persistCart()
    }
  }

  function removeFromCart(id: number) {
    cartItems.value = cartItems.value.filter(i => i.id !== id)
    persistCart()
  }

  function clearCart() {
    cartItems.value = []
    persistCart()
  }

  function toggleCart() {
    cartOpen.value = !cartOpen.value
  }

  return {
    cartItems: readonly(cartItems),
    cartOpen,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
  }
}
