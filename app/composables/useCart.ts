export interface CartItem {
  id: number
  title: string
  price: number
  image: string
}

const cartItems = ref<CartItem[]>([])
const cartOpen = ref(false)

export function useCart() {
  function addToCart(item: CartItem) {
    if (!cartItems.value.find(i => i.id === item.id)) {
      cartItems.value.push(item)
    }
  }

  function removeFromCart(id: number) {
    cartItems.value = cartItems.value.filter(i => i.id !== id)
  }

  function clearCart() {
    cartItems.value = []
  }

  const cartCount = computed(() => cartItems.value.length)
  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price, 0)
  )

  function toggleCart() {
    cartOpen.value = !cartOpen.value
  }

  return {
    cartItems,
    cartOpen,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
  }
}
