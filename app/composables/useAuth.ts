
import {
  initializeApp,
  getApps,
  type FirebaseApp,
} from 'firebase/app'

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Auth,
  type User,
} from 'firebase/auth'

// ==========================================
// USER INTERFACE
// ==========================================

export interface AppUser {
  uid: string
  name: string
  email: string
  photoURL: string | null
}

// ==========================================
// FIREBASE INSTANCES
// ==========================================

let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null

let authListenerStarted = false
let initializationPromise: Promise<void> | null = null

// ==========================================
// CONVERT FIREBASE USER
// ==========================================

function mapUser(user: User): AppUser {
  return {
    uid: user.uid,
    name:
      user.displayName ||
      user.email?.split('@')[0] ||
      'User',
    email: user.email || '',
    photoURL: user.photoURL,
  }
}

// ==========================================
// AUTHENTICATION COMPOSABLE
// ==========================================

export function useAuth() {
  const currentUser = useState<AppUser | null>(
    'firebase-current-user',
    () => null,
  )

  const authInitialized = useState<boolean>(
    'firebase-auth-initialized',
    () => false,
  )

  const config = useRuntimeConfig()

  // ========================================
  // INITIALIZE FIREBASE
  // ========================================

  function getFirebaseAuth(): Auth {
    if (import.meta.server) {
      throw new Error(
        'Firebase Authentication is only available in the browser.',
      )
    }

    if (firebaseAuth) {
      return firebaseAuth
    }

    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey as string,
      authDomain: config.public.firebaseAuthDomain as string,
      projectId: config.public.firebaseProjectId as string,
      storageBucket: config.public.firebaseStorageBucket as string,
      messagingSenderId:
        config.public.firebaseMessagingSenderId as string,
      appId: config.public.firebaseAppId as string,
    }

    if (
      !firebaseConfig.apiKey ||
      !firebaseConfig.authDomain ||
      !firebaseConfig.projectId ||
      !firebaseConfig.appId
    ) {
      throw new Error(
        'Firebase configuration is missing. Please check your .env file.',
      )
    }

    firebaseApp = getApps().length > 0
      ? getApps()[0]!
      : initializeApp(firebaseConfig)

    firebaseAuth = getAuth(firebaseApp)

    return firebaseAuth
  }

  // ========================================
  // RESTORE AUTHENTICATION SESSION
  // ========================================

  function initializeAuth(): Promise<void> {
    if (import.meta.server) {
      return Promise.resolve()
    }

    if (authInitialized.value) {
      return Promise.resolve()
    }

    if (initializationPromise) {
      return initializationPromise
    }

    initializationPromise = new Promise<void>((resolve, reject) => {
      try {
        const auth = getFirebaseAuth()

        if (authListenerStarted) {
          resolve()
          return
        }

        authListenerStarted = true

        onAuthStateChanged(
          auth,
          (user) => {
            currentUser.value = user
              ? mapUser(user)
              : null

            authInitialized.value = true
            resolve()
          },
          (error) => {
            authInitialized.value = true
            authListenerStarted = false
            initializationPromise = null

            console.error(
              'Firebase authentication state error:',
              error,
            )

            reject(error)
          },
        )
      } catch (error) {
        initializationPromise = null
        authListenerStarted = false
        reject(error)
      }
    })

    return initializationPromise
  }

  // ========================================
  // REGISTER WITH EMAIL AND PASSWORD
  // ========================================

  async function register(
    name: string,
    email: string,
    password: string,
  ) {
    const auth = getFirebaseAuth()

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      )

    await updateProfile(credential.user, {
      displayName: name.trim(),
    })

    currentUser.value = mapUser(credential.user)

    return credential.user
  }

  // ========================================
  // LOGIN WITH EMAIL AND PASSWORD
  // ========================================

  async function login(
    email: string,
    password: string,
  ) {
    const auth = getFirebaseAuth()

    const credential =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      )

    currentUser.value = mapUser(credential.user)

    return credential.user
  }

  // ========================================
  // LOGIN WITH GOOGLE
  // ========================================

  async function signInWithGoogle() {
    const auth = getFirebaseAuth()

    const provider = new GoogleAuthProvider()

    provider.setCustomParameters({
      prompt: 'select_account',
    })

    const credential = await signInWithPopup(
      auth,
      provider,
    )

    currentUser.value = mapUser(credential.user)

    return credential.user
  }

  // ========================================
  // LOGOUT
  // ========================================

  async function logout() {
    const auth = getFirebaseAuth()

    await signOut(auth)

    currentUser.value = null

    await navigateTo('/login')
  }

  // ========================================
  // RETURN AUTH FUNCTIONS
  // ========================================

  return {
    currentUser,
    authInitialized,

    initializeAuth,

    register,
    login,
    signInWithGoogle,
    logout,
  }
}
