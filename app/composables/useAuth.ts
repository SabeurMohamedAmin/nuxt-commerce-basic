export interface User {
  id: number
  name: string
  email: string
  subscription: 'none' | 'monthly' | 'annual'
}

const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!user.value)

export function useAuth() {
  function login(email: string, _password: string) {
    // Mock login
    user.value = {
      id: 1,
      name: email.split('@')[0],
      email,
      subscription: 'annual',
    }
    return true
  }

  function logout() {
    user.value = null
    navigateTo('/')
  }

  function register(name: string, email: string, _password: string) {
    user.value = {
      id: 1,
      name,
      email,
      subscription: 'none',
    }
    return true
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register,
  }
}
