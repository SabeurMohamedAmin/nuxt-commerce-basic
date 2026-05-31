import type { CartItem } from '~/types'

export function useStripeCheckout() {
  const loading = ref(false)
  const error = ref('')

  async function checkout(items: readonly CartItem[], customerEmail?: string) {
    if (!items.length) {
      error.value = 'Cart is empty'
      return
    }

    loading.value = true
    error.value = ''

    try {
      const payload = items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
      }))

      const { url } = await $fetch('/api/checkout/create-session', {
        method: 'POST',
        body: { items: payload, customerEmail },
      })

      if (url) {
        await navigateTo(url, { external: true })
      }
    } catch (err: any) {
      error.value = err?.data?.message || 'Payment failed. Please try again.'
    } finally {
      loading.value = false
    }
  }

  return {
    checkout,
    loading,
    error,
  }
}
