import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAdminAuth } from '~/composables/useAdminAuth'

describe('useAdminAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(navigateTo).mockClear()
    const { adminLogout } = useAdminAuth()
    adminLogout()
  })

  it('starts unauthenticated', () => {
    const { isAdminAuthenticated, admin } = useAdminAuth()
    expect(isAdminAuthenticated.value).toBe(false)
    expect(admin.value).toBeNull()
  })

  it('logs in with correct admin credentials', () => {
    const { adminLogin, isAdminAuthenticated, admin } = useAdminAuth()

    const result = adminLogin('aminsab@outlook.fr', '123456')

    expect(result).toBe(true)
    expect(isAdminAuthenticated.value).toBe(true)
    expect(admin.value?.email).toBe('aminsab@outlook.fr')
  })

  it('rejects wrong email', () => {
    const { adminLogin, isAdminAuthenticated } = useAdminAuth()

    const result = adminLogin('wrong@email.com', '123456')

    expect(result).toBe('Invalid admin credentials')
    expect(isAdminAuthenticated.value).toBe(false)
  })

  it('rejects wrong password', () => {
    const { adminLogin, isAdminAuthenticated } = useAdminAuth()

    const result = adminLogin('aminsab@outlook.fr', 'wrongpass')

    expect(result).toBe('Invalid admin credentials')
    expect(isAdminAuthenticated.value).toBe(false)
  })

  it('logs out and clears admin', () => {
    const { adminLogin, adminLogout, isAdminAuthenticated } = useAdminAuth()

    adminLogin('aminsab@outlook.fr', '123456')
    adminLogout()

    expect(isAdminAuthenticated.value).toBe(false)
  })

  it('persists admin session to localStorage', () => {
    const { adminLogin } = useAdminAuth()

    adminLogin('aminsab@outlook.fr', '123456')

    const stored = JSON.parse(localStorage.getItem('admin_session')!)
    expect(stored.email).toBe('aminsab@outlook.fr')
  })

  it('clears localStorage on logout', () => {
    const { adminLogin, adminLogout } = useAdminAuth()

    adminLogin('aminsab@outlook.fr', '123456')
    adminLogout()

    expect(localStorage.getItem('admin_session')).toBeNull()
  })

  it('navigates to /admin/login on logout', () => {
    const { adminLogin, adminLogout } = useAdminAuth()

    adminLogin('aminsab@outlook.fr', '123456')
    adminLogout()

    expect(navigateTo).toHaveBeenCalledWith('/admin/login')
  })
})
