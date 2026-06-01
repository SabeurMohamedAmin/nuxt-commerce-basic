declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    email: string
    role: string
    avatar?: string | null
    oauthProvider?: string | null
    oauthId?: string | null
  }

  interface UserSession {}
}

export {}
