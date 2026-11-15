
<template>
  <div class="settings-page">
    <!-- Page Header -->
    <section class="page-heading">
      <div>
        <div class="eyebrow">PREFERENCES</div>
        <h1>Settings</h1>
        <p>Manage your account and customize your creative workspace.</p>
      </div>

      <v-avatar color="deep-purple-lighten-5" size="55">
        <v-icon icon="mdi-cog-outline" color="deep-purple" size="30" />
      </v-avatar>
    </section>

    <!-- Profile Card -->
    <section class="settings-section">
      <div class="section-heading">
        <div>
          <h2>Profile Information</h2>
          <p>Your account details and personal information.</p>
        </div>
      </div>

      <v-card rounded="xl" flat class="settings-card">
        <div class="profile-banner">
          <div class="profile-avatar">
            <v-avatar size="76" color="white">
              <v-img
                v-if="currentUser?.photoURL"
                :src="currentUser.photoURL"
                alt="Profile picture"
              />
              <span v-else class="profile-initials">
                {{ userInitials }}
              </span>
            </v-avatar>
          </div>

          <div class="profile-details">
            <h3>{{ currentUser?.name || 'PosterMaker User' }}</h3>
            <p>{{ currentUser?.email || 'No email available' }}</p>
            <v-chip
              color="success"
              size="small"
              variant="tonal"
              prepend-icon="mdi-check-circle"
              class="mt-2"
            >
              Active Account
            </v-chip>
          </div>
        </div>

        <v-divider />

        <div class="profile-information">
          <div class="information-item">
            <div class="information-icon">
              <v-icon icon="mdi-account-outline" />
            </div>
            <div>
              <span>Full Name</span>
              <strong>{{ currentUser?.name || 'Not available' }}</strong>
            </div>
          </div>

          <div class="information-item">
            <div class="information-icon">
              <v-icon icon="mdi-email-outline" />
            </div>
            <div>
              <span>Email Address</span>
              <strong>{{ currentUser?.email || 'Not available' }}</strong>
            </div>
          </div>
        </div>
      </v-card>
    </section>

    <!-- Appearance -->
    <section class="settings-section">
      <div class="section-heading">
        <div>
          <h2>Appearance</h2>
          <p>Customize the look of your design workspace.</p>
        </div>
      </div>

      <v-card rounded="xl" flat class="settings-card">
        <div class="setting-row">
          <div class="setting-leading-icon purple-setting">
            <v-icon icon="mdi-palette-outline" size="23" />
          </div>

          <div class="setting-description">
            <h3>Color Theme</h3>
            <p>Choose your preferred workspace color.</p>
          </div>

          <div class="theme-options">
            <button
              v-for="theme in themes"
              :key="theme.value"
              type="button"
              class="theme-option"
              :class="{ 'theme-selected': selectedTheme === theme.value }"
              :aria-label="theme.label"
              :title="theme.label"
              @click="selectedTheme = theme.value"
            >
              <span :style="{ background: theme.color }" />
              <v-icon
                v-if="selectedTheme === theme.value"
                icon="mdi-check"
                size="14"
              />
            </button>
          </div>
        </div>

        <v-divider />

        <div class="setting-row">
          <div class="setting-leading-icon blue-setting">
            <v-icon icon="mdi-view-dashboard-outline" size="23" />
          </div>

          <div class="setting-description">
            <h3>Workspace Layout</h3>
            <p>Choose how your creative workspace is displayed.</p>
          </div>

          <v-chip color="deep-purple" variant="tonal" size="small">
            Standard
          </v-chip>
        </div>
      </v-card>
    </section>

    <!-- Account -->
    <section class="settings-section">
      <div class="section-heading">
        <div>
          <h2>Account & Security</h2>
          <p>Manage your account access and security.</p>
        </div>
      </div>

      <v-card rounded="xl" flat class="settings-card">
        <button
          type="button"
          class="action-row"
          @click="passwordDialog = true"
        >
          <div class="setting-leading-icon green-setting">
            <v-icon icon="mdi-lock-reset" size="23" />
          </div>

          <div class="setting-description">
            <h3>Change Password</h3>
            <p>Update your account password.</p>
          </div>

          <v-icon icon="mdi-chevron-right" color="grey" />
        </button>

        <v-divider />

        <button
          type="button"
          class="action-row"
          @click="logoutDialog = true"
        >
          <div class="setting-leading-icon red-setting">
            <v-icon icon="mdi-logout" size="23" />
          </div>

          <div class="setting-description">
            <h3 class="text-error">Sign Out</h3>
            <p>Sign out of your PosterMaker account.</p>
          </div>

          <v-icon icon="mdi-chevron-right" color="grey" />
        </button>
      </v-card>
    </section>

    <!-- About -->
    <section class="settings-section">
      <v-card rounded="xl" flat class="about-card">
        <v-avatar color="deep-purple" size="48" rounded="lg">
          <v-icon icon="mdi-image-edit" color="white" size="26" />
        </v-avatar>

        <div class="about-content">
          <h3>PosterMaker</h3>
          <p>Your creative space for beautiful social media designs.</p>
          <span>Version 1.0.0</span>
        </div>
      </v-card>
    </section>

    <!-- Password Dialog -->
    <v-dialog v-model="passwordDialog" max-width="450">
      <v-card rounded="xl" class="pa-5">
        <div class="dialog-heading">
          <v-avatar color="green-lighten-5" size="55">
            <v-icon icon="mdi-lock-reset" color="success" size="27" />
          </v-avatar>
          <h2>Change Password</h2>
          <p>Enter your current password and choose a new one.</p>
        </div>

        <v-alert
          v-if="passwordError"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ passwordError }}
        </v-alert>

        <v-form ref="passwordForm" @submit.prevent="changePassword">
          <v-text-field
            v-model="currentPassword"
            label="Current Password"
            prepend-inner-icon="mdi-lock-outline"
            :type="showCurrentPassword ? 'text' : 'password'"
            :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            rounded="lg"
            :rules="[required]"
            @click:append-inner="showCurrentPassword = !showCurrentPassword"
          />

          <v-text-field
            v-model="newPassword"
            label="New Password"
            prepend-inner-icon="mdi-lock-plus-outline"
            :type="showNewPassword ? 'text' : 'password'"
            :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            rounded="lg"
            :rules="[required, minPassword]"
            @click:append-inner="showNewPassword = !showNewPassword"
          />

          <v-text-field
            v-model="confirmPassword"
            label="Confirm New Password"
            prepend-inner-icon="mdi-lock-check-outline"
            type="password"
            variant="outlined"
            rounded="lg"
            :rules="[required, passwordsMatch]"
          />

          <div class="d-flex ga-3 mt-2">
            <v-btn
              variant="outlined"
              rounded="lg"
              class="flex-grow-1"
              :disabled="passwordLoading"
              @click="closePasswordDialog"
            >
              Cancel
            </v-btn>

            <v-btn
              type="submit"
              color="deep-purple"
              rounded="lg"
              class="flex-grow-1"
              :loading="passwordLoading"
            >
              Update Password
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Logout Dialog -->
    <v-dialog v-model="logoutDialog" max-width="400">
      <v-card rounded="xl" class="pa-5">
        <div class="dialog-heading">
          <v-avatar color="red-lighten-5" size="60">
            <v-icon icon="mdi-logout" color="error" size="29" />
          </v-avatar>
          <h2>Sign Out?</h2>
          <p>Are you sure you want to sign out of your account?</p>
        </div>

        <div class="d-flex ga-3 mt-5">
          <v-btn
            variant="outlined"
            rounded="lg"
            class="flex-grow-1"
            :disabled="logoutLoading"
            @click="logoutDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"
            rounded="lg"
            class="flex-grow-1"
            :loading="logoutLoading"
            @click="handleLogout"
          >
            Sign Out
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Notifications -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      rounded="lg"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'
import { getAuth } from 'firebase/auth'

definePageMeta({
  middleware: 'auth',
})

const { currentUser, logout } = useAuth()

const passwordDialog = ref(false)
const logoutDialog = ref(false)

const passwordForm = ref()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)

const passwordLoading = ref(false)
const logoutLoading = ref(false)

const passwordError = ref('')

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const selectedTheme = ref('purple')

const themes = [
  { value: 'purple', label: 'Purple', color: '#7950c8' },
  { value: 'blue', label: 'Blue', color: '#4778ca' },
  { value: 'green', label: 'Green', color: '#29956b' },
]

const userInitials = computed(() => {
  const name = currentUser.value?.name || 'User'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
})

const required = (value: string) =>
  !!value || 'This field is required.'

const minPassword = (value: string) =>
  value.length >= 6 || 'Password must have at least 6 characters.'

const passwordsMatch = (value: string) =>
  value === newPassword.value || 'Passwords do not match.'

function showMessage(message: string, color = 'success') {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

function closePasswordDialog() {
  passwordDialog.value = false
  passwordError.value = ''
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

async function changePassword() {
  passwordError.value = ''

  const validation = await passwordForm.value?.validate()

  if (!validation?.valid) return

  const auth = getAuth()
  const user = auth.currentUser

  if (!user || !user.email) {
    passwordError.value = 'Unable to identify your account.'
    return
  }

  passwordLoading.value = true

  try {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword.value,
    )

    await reauthenticateWithCredential(user, credential)
    await updatePassword(user, newPassword.value)

    closePasswordDialog()
    showMessage('Your password was updated successfully.')
  } catch (error: any) {
    console.error('Password update error:', error)

    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        passwordError.value = 'Your current password is incorrect.'
        break
      case 'auth/weak-password':
        passwordError.value = 'Please choose a stronger password.'
        break
      case 'auth/requires-recent-login':
        passwordError.value = 'Please sign in again before changing your password.'
        break
      default:
        passwordError.value = error.message || 'Unable to update password.'
    }
  } finally {
    passwordLoading.value = false
  }
}

async function handleLogout() {
  logoutLoading.value = true

  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
    showMessage('Unable to sign out. Please try again.', 'error')
  } finally {
    logoutLoading.value = false
    logoutDialog.value = false
  }
}
</script>

<style scoped>
.settings-page {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 36px;
  box-sizing: border-box;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 36px;
}

.eyebrow {
  color: #7950c8;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.page-heading h1 {
  color: #241a38;
  font-size: clamp(28px, 3vw, 34px);
  font-weight: 800;
}

.page-heading p {
  color: #888394;
  margin-top: 8px;
}

.settings-section {
  margin-bottom: 36px;
}

.section-heading {
  margin-bottom: 18px;
}

.section-heading h2 {
  color: #302640;
  font-size: 20px;
  font-weight: 800;
}

.section-heading p {
  color: #888394;
  font-size: 13px;
  margin-top: 6px;
}

.settings-card {
  overflow: hidden;
  border: 1px solid #eeeaf4;
  background: white;
}

.profile-banner {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 27px;
  background: linear-gradient(110deg, #f4efff, #faf8ff);
}

.profile-avatar {
  padding: 5px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 3px 12px #30204b12;
}

.profile-initials {
  color: #7950c8;
  font-size: 25px;
  font-weight: 800;
}

.profile-details h3 {
  color: #302640;
  font-size: 19px;
  font-weight: 800;
}

.profile-details p {
  color: #888394;
  font-size: 13px;
  margin-top: 5px;
}

.profile-information {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  padding: 24px 27px;
}

.information-item {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.information-icon,
.setting-leading-icon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: #eee7ff;
  color: #7950c8;
}

.information-item span {
  display: block;
  color: #888394;
  font-size: 12px;
  margin-bottom: 5px;
}

.information-item strong {
  display: block;
  color: #302640;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.setting-row,
.action-row {
  display: flex;
  align-items: center;
  gap: 17px;
  padding: 21px 24px;
  min-height: 90px;
}

.setting-description {
  flex: 1;
  min-width: 0;
}

.setting-description h3 {
  color: #302640;
  font-size: 14px;
  font-weight: 700;
}

.setting-description p {
  color: #888394;
  font-size: 12px;
  margin-top: 5px;
}

.purple-setting {
  background: #eee7ff;
  color: #7950c8;
}

.blue-setting {
  background: #e5efff;
  color: #4778ca;
}

.green-setting {
  background: #e2f5ec;
  color: #29956b;
}

.red-setting {
  background: #ffebeb;
  color: #d84c4c;
}

.theme-options {
  display: flex;
  gap: 10px;
}

.theme-option {
  width: 31px;
  height: 31px;
  position: relative;
  border-radius: 50%;
  border: 2px solid transparent;
  padding: 4px;
  cursor: pointer;
}

.theme-option span {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.theme-option .v-icon {
  position: absolute;
  inset: 0;
  margin: auto;
  color: white;
}

.theme-selected {
  border-color: #302640;
}

.action-row {
  width: 100%;
  border: 0;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.action-row:hover {
  background: #faf9fc;
}

.about-card {
  display: flex;
  align-items: center;
  gap: 17px;
  padding: 23px;
  border: 1px solid #eeeaf4;
  background: white;
}

.about-content h3 {
  font-size: 15px;
  font-weight: 800;
  color: #302640;
}

.about-content p {
  color: #888394;
  font-size: 12px;
  margin-top: 4px;
}

.about-content span {
  display: inline-block;
  color: #7950c8;
  font-size: 11px;
  font-weight: 700;
  margin-top: 7px;
}

.dialog-heading {
  text-align: center;
  margin-bottom: 23px;
}

.dialog-heading h2 {
  color: #302640;
  font-size: 21px;
  font-weight: 800;
  margin-top: 13px;
}

.dialog-heading p {
  color: #888394;
  font-size: 13px;
  margin-top: 7px;
}

@media (max-width: 800px) {
  .settings-page {
    padding: 24px;
  }

  .profile-information {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .settings-page {
    padding: 18px 16px;
  }

  .page-heading {
    margin-bottom: 26px;
  }

  .profile-banner {
    padding: 21px;
    gap: 15px;
  }

  .profile-information {
    padding: 20px;
  }

  .setting-row,
  .action-row {
    padding: 17px;
    gap: 12px;
  }

  .setting-description p {
    line-height: 1.5;
  }

  .theme-options {
    gap: 5px;
  }

  .theme-option {
    width: 27px;
    height: 27px;
  }

  .about-card {
    padding: 18px;
  }
}
</style>
