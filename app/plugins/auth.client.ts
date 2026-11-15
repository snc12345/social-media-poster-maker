export default defineNuxtPlugin(async () => {
  const {
    initializeAuth,
  } = useAuth()

  try {
    await initializeAuth()
  } catch (error) {
    console.error(
      'Firebase authentication initialization failed:',
      error,
    )
  }
})