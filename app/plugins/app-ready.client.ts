export default defineNuxtPlugin(() => {
  const { markReady } = useAppReady()

  // Hydrate auth & cart from storage, then mark app as ready
  useAuth()
  useAdminAuth()
  useCart()

  // Small delay to let Vue reactivity settle after hydration
  setTimeout(() => {
    markReady()
  }, 100)
})
