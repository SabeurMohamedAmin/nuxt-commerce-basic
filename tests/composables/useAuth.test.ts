import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuth } from '~/composables/useAuth'

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset auth state
    const { logout } = useAuth()
    vi.mocked(navigateTo).mockClear()
    logout()
  })

  it('starts unauthenticated', () => {
    const { isAuthenticated, user } = useAuth()
    expect(isAuthenticated.value).toBe(false)
    expect(user.value).toBeNull()
  })

  it('logs in with valid credentials', () => {
    const { login, isAuthenticated, user } = useAuth()

    const result = login('test@example.com', 'password123')

    expect(result).toBe(true)
    expect(isAuthenticated.value).toBe(true)
    expect(user.value?.email).toBe('test@example.com')
  })

  it('returns error for empty email', () => {
    const { login } = useAuth()

    const result = login('', 'password')

    expect(result).toBe('Email and password are required')
  })

  it('returns error for empty password', () => {
    const { login } = useAuth()

    const result = login('test@example.com', '')

    expect(result).toBe('Email and password are required')
  })

  it('sets user name from email prefix', () => {
    const { login, user } = useAuth()

    login('john.doe@example.com', 'pass')

    expect(user.value?.name).toBe('john.doe')
  })

  it('logs out and clears user', () => {
    const { login, logout, isAuthenticated, user } = useAuth()

    login('test@example.com', 'pass')
    logout()

    expect(isAuthenticated.value).toBe(false)
    expect(user.value).toBeNull()
  })

  it('registers a new user', () => {
    const { register, isAuthenticated, user } = useAuth()

    const result = register('John', 'john@example.com', 'pass123')

    expect(result).toBe(true)
    expect(isAuthenticated.value).toBe(true)
    expect(user.value?.name).toBe('John')
    expect(user.value?.email).toBe('john@example.com')
  })

  it('register returns error for missing fields', () => {
    const { register } = useAuth()

    expect(register('', 'email@test.com', 'pass')).toBe('All fields are required')
    expect(register('Name', '', 'pass')).toBe('All fields are required')
    expect(register('Name', 'email@test.com', '')).toBe('All fields are required')
  })

  it('adds purchased products', () => {
    const { login, addPurchasedProducts, hasPurchased } = useAuth()

    login('test@example.com', 'pass')
    addPurchasedProducts([1, 2, 3])

    expect(hasPurchased(1)).toBe(true)
    expect(hasPurchased(2)).toBe(true)
    expect(hasPurchased(3)).toBe(true)
    expect(hasPurchased(4)).toBe(false)
  })

  it('does not duplicate purchased products', () => {
    const { login, addPurchasedProducts, user } = useAuth()

    login('test@example.com', 'pass')
    addPurchasedProducts([1, 2])
    addPurchasedProducts([2, 3])

    expect(user.value?.purchasedProducts).toEqual([1, 2, 3])
  })

  it('hasPurchased returns false when not logged in', () => {
    const { hasPurchased } = useAuth()
    expect(hasPurchased(1)).toBe(false)
  })

  it('persists session to localStorage', () => {
    const { login } = useAuth()

    login('persist@example.com', 'pass')

    const stored = JSON.parse(localStorage.getItem('user_session')!)
    expect(stored.email).toBe('persist@example.com')
  })

  it('removes session from localStorage on logout', () => {
    const { login, logout } = useAuth()

    login('test@example.com', 'pass')
    logout()

    expect(localStorage.getItem('user_session')).toBeNull()
  })
})
