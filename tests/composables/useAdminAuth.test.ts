import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock useUserSession
const mockSession = {
  loggedIn: ref(false),
  user: ref(null as any),
  clear: vi.fn(),
  fetch: vi.fn(),
}
vi.stubGlobal('useUserSession', () => mockSession)
vi.stubGlobal('$fetch', vi.fn())

import { useAdminAuth } from '~/composables/useAdminAuth'

describe('useAdminAuth (server session based)', () => {
  beforeEach(() => {
    mockSession.loggedIn.value = false
    mockSession.user.value = null
    vi.mocked($fetch).mockReset()
    vi.mocked(mockSession.clear).mockReset()
    vi.mocked(mockSession.fetch).mockReset()
    vi.mocked(navigateTo).mockClear()
  })

  it('starts unauthenticated', () => {
    const { isAdminAuthenticated } = useAdminAuth()
    expect(isAdminAuthenticated.value).toBe(false)
  })

  it('is authenticated when session has admin role', () => {
    mockSession.loggedIn.value = true
    mockSession.user.value = { id: 1, name: 'Admin', email: 'admin@store.com', role: 'admin' }

    const { isAdminAuthenticated, admin } = useAdminAuth()
    expect(isAdminAuthenticated.value).toBe(true)
    expect(admin.value?.email).toBe('admin@store.com')
  })

  it('is NOT authenticated when session has customer role', () => {
    mockSession.loggedIn.value = true
    mockSession.user.value = { id: 2, name: 'User', email: 'user@test.com', role: 'customer' }

    const { isAdminAuthenticated, admin } = useAdminAuth()
    expect(isAdminAuthenticated.value).toBe(false)
    expect(admin.value).toBeNull()
  })

  it('adminLogin calls /auth/admin-login and fetches session', async () => {
    vi.mocked($fetch).mockResolvedValueOnce({ id: 1, name: 'Admin', email: 'admin@store.com', role: 'admin' })
    vi.mocked(mockSession.fetch).mockImplementation(async () => {
      mockSession.loggedIn.value = true
      mockSession.user.value = { id: 1, name: 'Admin', email: 'admin@store.com', role: 'admin' }
    })

    const { adminLogin } = useAdminAuth()
    const result = await adminLogin('admin@store.com', '123456')

    expect(result).toBe(true)
    expect($fetch).toHaveBeenCalledWith('/auth/admin-login', {
      method: 'POST',
      body: { email: 'admin@store.com', password: '123456' },
    })
  })

  it('adminLogin returns error for empty fields', async () => {
    const { adminLogin } = useAdminAuth()
    expect(await adminLogin('', '123456')).toBe('Email and password are required')
    expect(await adminLogin('admin@store.com', '')).toBe('Email and password are required')
  })

  it('adminLogin returns API error on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce({ data: { message: 'Invalid admin credentials.' } })

    const { adminLogin } = useAdminAuth()
    const result = await adminLogin('wrong@email.com', 'badpass')

    expect(result).toBe('Invalid admin credentials.')
  })

  it('adminLogout clears session and navigates to admin login', async () => {
    const { adminLogout } = useAdminAuth()
    await adminLogout()

    expect(mockSession.clear).toHaveBeenCalled()
    expect(navigateTo).toHaveBeenCalledWith('/admin/login')
  })

  it('trims and lowercases email on login', async () => {
    vi.mocked($fetch).mockResolvedValueOnce({ id: 1, name: 'Admin', email: 'admin@store.com', role: 'admin' })
    vi.mocked(mockSession.fetch).mockResolvedValueOnce(undefined)

    const { adminLogin } = useAdminAuth()
    await adminLogin('  ADMIN@Store.COM  ', '123456')

    expect($fetch).toHaveBeenCalledWith('/auth/admin-login', {
      method: 'POST',
      body: { email: 'admin@store.com', password: '123456' },
    })
  })
})
