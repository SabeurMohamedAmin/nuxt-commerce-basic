// Augments the types for nuxt-auth-utils to provide type safety for user sessions
declare module '#auth-utils' {
  // Defines the structure of the User object in sessions (e.g., after login)
  interface User {
    id: string | number     // Unique user identifier (string or number)
    name: string            // User's full name
    email: string           // User's email address
    login: string           // User's login username or handle
    // Add any other fields you want in the session (e.g., avatar, role)
  }

  // Optional: Extends the session with additional fields if needed
  interface UserSession {
    // extended session fields if needed
  }
}

// Ensures this is treated as a module for TypeScript declarations
export {}