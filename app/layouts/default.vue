<template>
  <v-layout class="app-layout">
    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :temporary="$vuetify.display.mobile"
      :permanent="!$vuetify.display.mobile"
      width="260"
      class="sidebar"
    >
      <!-- Logo -->
      <div class="pa-6">
        <div class="d-flex align-center">
          <v-avatar color="deep-purple" size="42" rounded="lg">
            <v-icon icon="mdi-image-edit" color="white" size="25" />
          </v-avatar>

          <div class="ml-3">
            <div class="text-h6 font-weight-bold">
              PosterMaker
            </div>

            <div class="text-caption text-medium-emphasis">
              Creative Studio
            </div>
          </div>
        </div>
      </div>

      <v-divider />

      <!-- Navigation -->
      <div class="px-4 pt-5">
        <div class="text-caption font-weight-bold text-medium-emphasis mb-3 ml-3">
          WORKSPACE
        </div>

        <v-list nav density="comfortable" class="navigation-list">
          <v-list-item
            v-for="item in navigationItems"
            :key="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            rounded="lg"
            color="deep-purple"
            class="mb-2"
            @click="closeMobileDrawer"
          />
        </v-list>
      </div>

      <!-- Create button -->
      <div class="px-5 mt-4">
        <v-btn
          to="/templates"
          color="deep-purple"
          block
          size="large"
          rounded="lg"
          prepend-icon="mdi-plus"
          @click="closeMobileDrawer"
        >
          Create New Design
        </v-btn>
      </div>

      <v-spacer />

      <!-- Bottom section -->
      <div class="pa-4">
        <v-card
          color="deep-purple-lighten-5"
          rounded="xl"
          class="pa-4 mb-4"
          flat
        >
          <v-icon
            icon="mdi-lightbulb-on-outline"
            color="deep-purple"
            size="28"
            class="mb-2"
          />

          <div class="font-weight-bold text-body-2">
            Bring your ideas to life!
          </div>

          <p class="text-caption text-medium-emphasis mt-1 mb-3">
            Choose a template and create something amazing.
          </p>

          <v-btn
            to="/templates"
            color="deep-purple"
            variant="tonal"
            size="small"
            block
            @click="closeMobileDrawer"
          >
            Explore Templates
          </v-btn>
        </v-card>

        <v-divider class="mb-4" />

        <!-- User information -->
        <div class="d-flex align-center">
          <v-avatar color="deep-purple" size="42">
            <v-img
              v-if="currentUser?.photoURL"
              :src="currentUser.photoURL"
              alt="Profile picture"
            />

            <span v-else class="text-white font-weight-bold">
              {{ userInitials }}
            </span>
          </v-avatar>

          <div class="ml-3 flex-grow-1 overflow-hidden">
            <div class="text-body-2 font-weight-bold text-truncate">
              {{ currentUser?.name || 'User' }}
            </div>

            <div class="text-caption text-medium-emphasis text-truncate">
              {{ currentUser?.email || '' }}
            </div>
          </div>

          <v-menu location="top end">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-dots-vertical"
                variant="text"
                size="small"
              />
            </template>

            <v-list density="compact" min-width="170">
              <v-list-item
                to="/settings"
                prepend-icon="mdi-cog-outline"
                title="Settings"
                @click="closeMobileDrawer"
              />

              <v-list-item
                prepend-icon="mdi-logout"
                title="Sign Out"
                color="error"
                @click="logoutDialog = true"
              />
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main class="main-content">
      <!-- Mobile top bar -->
      <v-app-bar
        v-if="$vuetify.display.mobile"
        flat
        color="white"
        class="mobile-toolbar"
      >
        <v-app-bar-nav-icon
          @click="drawer = !drawer"
        />

        <v-toolbar-title class="font-weight-bold">
          PosterMaker
        </v-toolbar-title>

        <v-spacer />

        <v-avatar color="deep-purple" size="34">
          <v-img
            v-if="currentUser?.photoURL"
            :src="currentUser.photoURL"
            alt="Profile picture"
          />

          <span v-else class="text-white text-caption font-weight-bold">
            {{ userInitials }}
          </span>
        </v-avatar>
      </v-app-bar>

      <div class="page-content">
        <slot />
      </div>
    </v-main>

    <!-- Logout confirmation -->
    <v-dialog
      v-model="logoutDialog"
      max-width="400"
    >
      <v-card rounded="xl" class="pa-4">
        <div class="text-center pt-3">
          <v-avatar color="red-lighten-5" size="65">
            <v-icon
              icon="mdi-logout"
              color="error"
              size="30"
            />
          </v-avatar>

          <h3 class="text-h6 font-weight-bold mt-4">
            Sign Out?
          </h3>

          <p class="text-body-2 text-medium-emphasis mt-2">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        <v-card-actions class="mt-4">
          <v-btn
            variant="outlined"
            rounded="lg"
            class="flex-grow-1"
            :disabled="loggingOut"
            @click="logoutDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"
            rounded="lg"
            class="flex-grow-1"
            :loading="loggingOut"
            @click="handleLogout"
          >
            Sign Out
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script setup lang="ts">
const { currentUser, logout } = useAuth()

const drawer = ref(true)
const logoutDialog = ref(false)
const loggingOut = ref(false)

const navigationItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    to: '/',
  },
  {
    title: 'Templates',
    icon: 'mdi-view-grid-outline',
    to: '/templates',
  },
  {
    title: 'My Designs',
    icon: 'mdi-image-multiple-outline',
    to: '/my-designs',
  },
  {
    title: 'Settings',
    icon: 'mdi-cog-outline',
    to: '/settings',
  },
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

function closeMobileDrawer() {
  if (import.meta.client && window.innerWidth < 1280) {
    drawer.value = false
  }
}

async function handleLogout() {
  loggingOut.value = true

  try {
    await logout()
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    loggingOut.value = false
    logoutDialog.value = false
  }
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: #f7f7fb;
}

.sidebar {
  border-right: 1px solid #eeeaf5;
  background: #ffffff;
}

.navigation-list :deep(.v-list-item) {
  min-height: 48px;
  font-weight: 500;
}

.navigation-list :deep(.v-list-item--active) {
  background: #eee7ff;
  color: #673ab7;
  font-weight: 700;
}

.main-content {
  background: #f7f7fb;
  min-height: 100vh;
}

.page-content {
  min-height: 100vh;
}

.mobile-toolbar {
  border-bottom: 1px solid #eeeaf5;
}

@media (max-width: 600px) {
  .page-content {
    min-height: calc(100vh - 64px);
  }
}
</style>