import authMiddleware from "../middleware/auth.middleware";
export default defineEventHandler(async (event) => {
  // ✅ This is sufficient. It throws a 401 if the user is not authenticated.
  const userSession = await requireUserSession(event);
  authMiddleware(event);
  
  return {
    id: userSession.id,
    secure: userSession.secure, // Fixed typo: 'scure' -> 'secure'
    user: {
      id: userSession.user.id,
      name: userSession.user.name,
      email: userSession.user.email,
    }
  }
})
