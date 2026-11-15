<template>
  <v-container
    fluid
    class="auth-page fill-height d-flex align-center justify-center pa-4"
  >
    <v-card width="470" max-width="100%" rounded="xl" elevation="8" class="pa-6 pa-sm-9">
      <div class="text-center mb-6">
        <v-avatar color="deep-purple" size="68" class="mb-4">
          <v-icon icon="mdi-account-plus" color="white" size="36" />
        </v-avatar>

        <h1 class="text-h4 font-weight-bold">Create Account</h1>
        <p class="text-body-2 text-medium-emphasis mt-2">
          Register to start designing your social media posters.
        </p>
      </div>

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
        {{ errorMessage }}
      </v-alert>

      <v-form ref="formRef" @submit.prevent="handleRegister">
        <v-text-field
          v-model="name"
          label="Full Name"
          placeholder="Enter your full name"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          rounded="lg"
          :rules="[required]"
        />

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
          placeholder="Create a password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          rounded="lg"
          :rules="[required, validPassword]"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          prepend-inner-icon="mdi-lock-check-outline"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showConfirmPassword ? 'text' : 'password'"
          variant="outlined"
          rounded="lg"
          :rules="[required, passwordsMatch]"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
        />

        <v-btn
          type="submit"
          color="deep-purple"
          block
          size="large"
          rounded="lg"
          class="mt-3"
          :loading="loading"
          :disabled="loading || googleLoading"
        >
          Create Account
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
        @click="handleGoogleRegister"
      >
        <v-icon start icon="mdi-google" />
        Sign Up with Google
      </v-btn>

      <div class="text-center mt-7">
        <span class="text-body-2 text-medium-emphasis">
          Already have an account?
        </span>
        <NuxtLink to="/login" class="text-deep-purple font-weight-bold text-decoration-none ml-1">
          Sign In
        </NuxtLink>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { register, signInWithGoogle } = useAuth()

const formRef = ref()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)
const googleLoading = ref(false)
const errorMessage = ref('')

const required = (value: string) =>
  !!value || 'This field is required.'

const validEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
  'Enter a valid email address.'

const validPassword = (value: string) =>
  value.length >= 6 || 'Password must contain at least 6 characters.'

const passwordsMatch = (value: string) =>
  value === password.value || 'Passwords do not match.'

async function handleRegister() {
  errorMessage.value = ''

  const result = await formRef.value?.validate()
  if (!result?.valid) return

  loading.value = true

  try {
    await register(
      name.value.trim(),
      email.value.trim(),
      password.value,
    )

    // Successful registration goes to Dashboard.
    await navigateTo('/')
  } catch (error: any) {
    console.error('Registration error:', error)

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage.value = 'This email is already registered.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Please enter a valid email address.'
        break
      case 'auth/weak-password':
        errorMessage.value = 'Please choose a stronger password.'
        break
      default:
        errorMessage.value = error.message || 'Unable to create your account.'
    }
  } finally {
    loading.value = false
  }
}

async function handleGoogleRegister() {
  errorMessage.value = ''
  googleLoading.value = true

  try {
    await signInWithGoogle()
    await navigateTo('/')
  } catch (error: any) {
    console.error('Google registration error:', error)

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage.value = 'Google sign-up was cancelled.'
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage.value = 'This domain is not authorized in Firebase.'
    } else {
      errorMessage.value = error.message || 'Google sign-up failed.'
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
    radial-gradient(circle at top right, #ede7ff, transparent 40%),
    linear-gradient(135deg, #f8f6ff, #eee9ff);
}

.text-deep-purple {
  color: #673ab7;
}
</style>