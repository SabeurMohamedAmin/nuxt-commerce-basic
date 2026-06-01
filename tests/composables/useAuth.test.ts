import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock useUserSession from nuxt-auth-utils
const mockSession = {
  loggedIn: ref(false),
  user: ref(null as any),
  clear: vi.fn(),
  fetch: vi.fn(),
}
vi.stubGlobal('useUserSession', () => mockSession)
vi.stubGlobal('$fetch', vi.fn())

import { useAuth } from '~/composables/useAuth'

describe('useAuth (server session based)', () => {
  beforeEach(() => {
    mockSession.loggedIn.value = false
    mockSession.user.value = null
    vi.mocked($fetch).mockReset()
    vi.mocked(mockSession.clear).mockReset()
    vi.mocked(mockSession.fetch).mockReset()
    vi.mocked(navigateTo).mockClear()
  })

  it('starts unauthenticated', () => {
    const { isAuthenticated } = useAuth()
    expect(isAuthenticated.value).toBe(false)
  })

  it('is authenticated when session exists', () => {
    mockSession.loggedIn.value = true
    mockSession.user.value = { id: 1, name: 'Test', email: 'test@example.com', role: 'customer' }

    const { isAuthenticated, user } = useAuth()
    expect(isAuthenticated.value).toBe(true)
    expect(user.value?.email).toBe('test@example.com')
  })

  it('login calls /auth/login and fetches session', async () => {
    vi.mocked($fetch).mockResolvedValueOnce({ id: 1, name: 'test', email: 'test@example.com' })
    vi.mocked(mockSession.fetch).mockImplementation(async () => {
      mockSession.loggedIn.value = true
      mockSession.user.value = { id: 1, name: 'test', email: 'test@example.com', role: 'customer' }
    })

    const { login } = useAuth()
    const result = await login('test@example.com', 'password123')

    expect(result).toBe(true)
    expect($fetch).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: { email: 'test@example.com', password: 'password123' },
    })
    expect(mockSession.fetch).toHaveBeenCalled()
  })

  it('login returns error for empty email', async () => {
    const { login } = useAuth()
    const result = await login('', 'password')
    expect(result).toBe('Email and password are required')
  })

  it('login returns error for empty password', async () => {
    const { login } = useAuth()
    const result = await login('test@example.com', '')
    expect(result).toBe('Email and password are required')
  })

  it('login returns API error message on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce({ data: { message: 'Invalid email or password.' } })

    const { login } = useAuth()
    const result = await login('wrong@example.com', 'badpass')

    expect(result).toBe('Invalid email or password.')
  })

  it('login trims and lowercases email', async () => {
    vi.mocked($fetch).mockResolvedValueOnce({ id: 1, name: 'test', email: 'test@example.com' })
    vi.mocked(mockSession.fetch).mockResolvedValueOnce(undefined)

    const { login } = useAuth()
    await login('  TEST@Example.COM  ', 'pass')

    expect($fetch).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: { email: 'test@example.com', password: 'pass' },
    })
  })

  it('register calls /auth/register and fetches session', async () => {
    vi.mocked($fetch).mockResolvedValueOnce({ id: 2, name: 'John', email: 'john@example.com' })
    vi.mocked(mockSession.fetch).mockResolvedValueOnce(undefined)

    const { register } = useAuth()
    const result = await register('John', 'john@example.com', 'pass123')

    expect(result).toBe(true)
    expect($fetch).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: { name: 'John', email: 'john@example.com', password: 'pass123' },
    })
  })

  it('register returns error for missing fields', async () => {
    const { register } = useAuth()
    expect(await register('', 'email@test.com', 'pass')).toBe('All fields are required')
    expect(await register('Name', '', 'pass')).toBe('All fields are required')
    expect(await register('Name', 'email@test.com', '')).toBe('All fields are required')
  })

  it('logout clears session and navigates home', async () => {
    const { logout } = useAuth()
    await logout()

    expect(mockSession.clear).toHaveBeenCalled()
    expect(navigateTo).toHaveBeenCalledWith('/')
  })
})
