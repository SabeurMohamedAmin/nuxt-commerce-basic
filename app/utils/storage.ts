/**
 * Check if we're running on the client side.
 */
function isClient(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Client-safe localStorage wrapper.
 * Returns null on server or when storage is unavailable.
 */
export function getStoredItem<T>(key: string): T | null {
  if (!isClient()) return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredItem<T>(key: string, value: T): void {
  if (!isClient()) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function removeStoredItem(key: string): void {
  if (!isClient()) return
  try {
    localStorage.removeItem(key)
  } catch {}
}
