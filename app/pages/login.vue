<template>
  <v-container
    fluid
    class="auth-page fill-height d-flex align-center justify-center pa-4"
  >
    <v-card width="450" max-width="100%" rounded="xl" elevation="8" class="pa-6 pa-sm-9">
      <div class="text-center mb-7">
        <v-avatar color="deep-purple" size="68" class="mb-4">
          <v-icon icon="mdi-image-edit" color="white" size="36" />
        </v-avatar>

        <h1 class="text-h4 font-weight-bold">Welcome Back!</h1>
        <p class="text-body-2 text-medium-emphasis mt-2">
          Sign in to continue creating your posters.
        </p>
      </div>

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
        {{ errorMessage }}
      </v-alert>

      <v-form ref="formRef" @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Email Address"
          placeholder="Enter your email"
          prepend-inner-icon="mdi-email-outline"
          type="email"
          variant="outlined"
          rounded="lg"
          :rules="[required, validEmail]"
        />

        <v-text-field
          v-model="password"
          label="Password"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          rounded="lg"
          :rules="[required]"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-btn
          type="submit"
          color="deep-purple"
          block
          size="large"
          rounded="lg"
          class="mt-4"
          :loading="loading"
          :disabled="loading || googleLoading"
        >
          Sign In
          <v-icon end icon="mdi-arrow-right" />
        </v-btn>
      </v-form>

      <div class="d-flex align-center my-6">
        <v-divider />
        <span class="text-caption text-medium-emphasis mx-3">OR</span>
        <v-divider />
      </div>

      <v-btn
        block
        size="large"
        rounded="lg"
        variant="outlined"
        :loading="googleLoading"
        :disabled="loading || googleLoading"
        @click="handleGoogleLogin"
      >
        <v-icon start icon="mdi-google" />
        Continue with Google
      </v-btn>

      <div class="text-center mt-7">
        <span class="text-body-2 text-medium-emphasis">
          Don't have an account?
        </span>
        <NuxtLink to="/register" class="text-deep-purple font-weight-bold text-decoration-none ml-1">
          Create Account
        </NuxtLink>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { login, signInWithGoogle } = useAuth()

const formRef = ref()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const googleLoading = ref(false)
const errorMessage = ref('')

const required = (value: string) =>
  !!value || 'This field is required.'

const validEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
  'Enter a valid email address.'

async function handleLogin() {
  errorMessage.value = ''

  const result = await formRef.value?.validate()
  if (!result?.valid) return

  loading.value = true

  try {
    await login(email.value.trim(), password.value)

    // Successful login goes to Dashboard.
    await navigateTo('/')
  } catch (error: any) {
    console.error('Login error:', error)

    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        errorMessage.value = 'Incorrect email or password.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Please enter a valid email.'
        break
      case 'auth/too-many-requests':
        errorMessage.value = 'Too many attempts. Try again later.'
        break
      default:
        errorMessage.value = error.message || 'Unable to sign in.'
    }
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  errorMessage.value = ''
  googleLoading.value = true

  try {
    await signInWithGoogle()
    await navigateTo('/')
  } catch (error: any) {
    console.error('Google login error:', error)

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage.value = 'Google sign-in was cancelled.'
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage.value = 'This domain is not authorized in Firebase.'
    } else {
      errorMessage.value = error.message || 'Google sign-in failed.'
    }
  } finally {
    googleLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, #ede7ff, transparent 40%),
    linear-gradient(135deg, #f8f6ff, #eee9ff);
}

.text-deep-purple {
  color: #673ab7;
}
</style>