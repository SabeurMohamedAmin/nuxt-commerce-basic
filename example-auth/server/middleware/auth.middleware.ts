/**
 * useless Server Middleware (demonstration of backend middleware).
 * 
 * DOCUMENTATION FOR FUTURE ME:
 * This is a global server middleware. It runs on EVERY request to the server.
 * Its primary job is to act as a gatekeeper/guard for specific routes 
 * before they reach their actual route handlers.
 */
export default defineEventHandler(async(event) => {

  /**
   * requireUserSession throw 401 error incasse user not authenticated.
   * return object of user session (id, name,...) if the use is auth.
   */

   // -----------------------------------------------------------------------
   // 1. Route Filtering / Scoping
   // -----------------------------------------------------------------------
   // We don't want to block the login page or public assets, so we strictly
   // limit this check to specific paths.
   //
   // NOTE: The comment below says "api", but the code restricts "/admin".
   // This means only routes like /admin/dashboard, /admin/users will trigger this.
   
   // Only run on /api/ routes
  if (!event.path.startsWith('/admin')) {
    // If the path doesn't match, we return immediately. 
    // This passes control to the next middleware or the actual route handler.
    return
  }

  // -----------------------------------------------------------------------
  // 2. Authentication Enforcement
  // -----------------------------------------------------------------------
  // If we are in the /admin section, we FORCE the user to be logged in.
  // 
  // - If Session Exists: The function resolves, populates `event.context.user`,
  //   and the code proceeds to the `return` statement below.
  // - If No Session: This function THROWS a 401 Error immediately. 
  //   Execution stops here, and Nuxt returns the error to the client.
  await requireUserSession(event);

  // -----------------------------------------------------------------------
  // 3. Allow Access
  // -----------------------------------------------------------------------
  // If we reached this line, the user is definitely authenticated.
  // We return (void), which signals Nuxt to proceed to the actual 
  // API handler (e.g., server/api/admin/data.get.ts).
  return;
});