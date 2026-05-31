const isAppReady = ref(false)

export function useAppReady() {
  function markReady() {
    isAppReady.value = true
  }

  return {
    isAppReady: readonly(isAppReady),
    markReady,
  }
}
