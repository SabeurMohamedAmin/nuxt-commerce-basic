export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn, user } = useUserSession();
  // This block executes if the user IS logged in.
  if(loggedIn.value && user.value){
    // By returning nothing (or undefined), you are telling Nuxt
    // that navigation is approved and it should proceed to the page.
    // This is why logged-in users can still see the registration page.
    if(from.path === to.path){
      return navigateTo('/', {replace: true})
    }
    return navigateTo(from.path, {replace: true})
  }
  return;
});