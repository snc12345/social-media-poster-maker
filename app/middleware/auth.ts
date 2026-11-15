export default defineNuxtRouteMiddleware(async (to) => {
  // Firebase Authentication runs in the browser.
  if (import.meta.server) {
    return
  }

  const {
    currentUser,
    initializeAuth,
  } = useAuth()

  const publicRoutes = [
    '/login',
    '/register',
  ]

  const isPublicRoute = publicRoutes.includes(to.path)

  try {
    // Wait until Firebase confirms whether the user is logged in.
    await initializeAuth()
  } catch (error) {
    console.error('Authentication error:', error)

    if (!isPublicRoute) {
      return navigateTo('/login')
    }

    return
  }

  const isAuthenticated = !!currentUser.value

  // Logged-out visitors can only access Login and Register.
  if (!isAuthenticated && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Logged-in users should not return to Login or Register.
  if (isAuthenticated && isPublicRoute) {
    return navigateTo('/')
  }
})