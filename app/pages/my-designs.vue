
<template>
  <div class="my-designs-page">
    <!-- Page heading -->
    <section class="page-heading">
      <div>
        <div class="eyebrow">YOUR CREATIVE COLLECTION</div>
        <h1>My Designs</h1>
        <p>Manage, edit, and continue working on your saved designs.</p>
      </div>

      <v-btn
        to="/templates"
        color="deep-purple"
        size="large"
        rounded="lg"
        prepend-icon="mdi-plus"
      >
        Create New Design
      </v-btn>
    </section>

    <!-- Summary -->
    <section class="summary-card">
      <div class="summary-icon">
        <v-icon icon="mdi-image-multiple-outline" size="30" />
      </div>

      <div>
        <div class="summary-number">{{ designs.length }}</div>
        <div class="summary-label">Saved Designs</div>
      </div>
    </section>

    <!-- Search and controls -->
    <section class="toolbar">
      <v-text-field
        v-model="search"
        placeholder="Search your designs..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="lg"
        density="comfortable"
        hide-details
        clearable
        class="search-field"
      />

      <v-btn
        variant="outlined"
        rounded="lg"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="loadDesigns"
      >
        Refresh
      </v-btn>
    </section>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <v-progress-circular
        indeterminate
        color="deep-purple"
        size="42"
      />
      <p>Loading your designs...</p>
    </div>

    <!-- Design cards -->
    <template v-else-if="filteredDesigns.length">
      <div class="results-heading">
        <div>
          <h2>All Saved Designs</h2>
          <p>{{ filteredDesigns.length }} designs found</p>
        </div>
      </div>

      <div class="design-grid">
        <v-card
          v-for="design in filteredDesigns"
          :key="design.id"
          rounded="xl"
          flat
          class="design-card"
        >
          <!-- Preview -->
          <div class="design-preview">
            <div class="preview-placeholder">
              <v-icon
                icon="mdi-image-outline"
                size="54"
                color="deep-purple"
              />
              <span>DESIGN PREVIEW</span>
            </div>

            <v-chip
              size="small"
              color="white"
              class="preview-chip"
            >
              {{ design.templateName || 'Custom Design' }}
            </v-chip>
          </div>

          <!-- Information -->
          <div class="design-information">
            <h3 class="text-truncate">
              {{ design.title || 'Untitled Design' }}
            </h3>

            <p>
              <v-icon icon="mdi-calendar-outline" size="14" />
              Updated {{ formatDate(design.updatedAt) }}
            </p>

            <div class="card-actions">
              <v-btn
                color="deep-purple"
                variant="flat"
                rounded="lg"
                size="small"
                prepend-icon="mdi-pencil-outline"
                class="edit-button"
                @click="editDesign(design.id)"
              >
                Edit
              </v-btn>

              <v-btn
                color="error"
                variant="tonal"
                rounded="lg"
                size="small"
                icon="mdi-delete-outline"
                aria-label="Delete design"
                @click="confirmDelete(design)"
              />
            </div>
          </div>
        </v-card>
      </div>
    </template>

    <!-- Empty search result -->
    <v-card
      v-else-if="designs.length"
      rounded="xl"
      flat
      class="empty-state"
    >
      <v-icon icon="mdi-magnify" size="55" color="deep-purple" />
      <h2>No matching designs</h2>
      <p>Try searching with a different design title.</p>

      <v-btn
        color="deep-purple"
        variant="tonal"
        rounded="lg"
        @click="search = ''"
      >
        Clear Search
      </v-btn>
    </v-card>

    <!-- No saved designs -->
    <v-card
      v-else
      rounded="xl"
      flat
      class="empty-state"
    >
      <v-avatar color="deep-purple-lighten-5" size="85">
        <v-icon
          icon="mdi-image-plus-outline"
          size="42"
          color="deep-purple"
        />
      </v-avatar>

      <h2>No designs yet</h2>

      <p>
        Your saved designs will appear here.
        Start creating your first poster today!
      </p>

      <v-btn
        to="/templates"
        color="deep-purple"
        rounded="lg"
        size="large"
        prepend-icon="mdi-plus"
      >
        Browse Templates
      </v-btn>
    </v-card>

    <!-- Delete confirmation -->
    <v-dialog
      v-model="deleteDialog"
      max-width="420"
    >
      <v-card rounded="xl" class="pa-5">
        <div class="text-center">
          <v-avatar color="red-lighten-5" size="65">
            <v-icon
              icon="mdi-delete-outline"
              color="error"
              size="32"
            />
          </v-avatar>

          <h2 class="text-h6 font-weight-bold mt-4">
            Delete Design?
          </h2>

          <p class="text-body-2 text-medium-emphasis mt-2">
            Are you sure you want to delete
            <strong>{{ selectedDesign?.title }}</strong>?
            This action cannot be undone.
          </p>
        </div>

        <v-card-actions class="mt-4">
          <v-btn
            variant="outlined"
            rounded="lg"
            class="flex-grow-1"
            :disabled="deleting"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"
            rounded="lg"
            class="flex-grow-1"
            :loading="deleting"
            @click="deleteSelectedDesign"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Feedback -->
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
import type { PosterDesign } from '~/composables/useDesigns'

definePageMeta({
  middleware: 'auth',
})

const {
  getAllDesigns,
  deleteDesign,
} = useDesigns()

const designs = ref<PosterDesign[]>([])
const loading = ref(true)
const deleting = ref(false)

const search = ref('')

const deleteDialog = ref(false)
const selectedDesign = ref<PosterDesign | null>(null)

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const filteredDesigns = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return designs.value

  return designs.value.filter((design) => {
    return (
      design.title.toLowerCase().includes(keyword) ||
      (design.templateName || '').toLowerCase().includes(keyword)
    )
  })
})

async function loadDesigns() {
  loading.value = true

  try {
    designs.value = await getAllDesigns()
  } catch (error) {
    console.error('Unable to load saved designs:', error)
    showMessage('Unable to load your designs.', 'error')
  } finally {
    loading.value = false
  }
}

function editDesign(id: string) {
  navigateTo(`/editor?design=${encodeURIComponent(id)}`)
}

function confirmDelete(design: PosterDesign) {
  selectedDesign.value = design
  deleteDialog.value = true
}

async function deleteSelectedDesign() {
  if (!selectedDesign.value) return

  deleting.value = true

  try {
    await deleteDesign(selectedDesign.value.id)

    designs.value = designs.value.filter(
      (design) => design.id !== selectedDesign.value?.id,
    )

    deleteDialog.value = false
    showMessage('Design deleted successfully.', 'success')
    selectedDesign.value = null
  } catch (error) {
    console.error('Unable to delete design:', error)
    showMessage('Unable to delete this design.', 'error')
  } finally {
    deleting.value = false
  }
}

function formatDate(date: string) {
  if (!date) return 'Recently'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Recently'
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function showMessage(message: string, color: string) {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(loadDesigns)
</script>

<style scoped>
.my-designs-page {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 36px;
  box-sizing: border-box;
}

/* Heading */
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 30px;
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
  font-size: clamp(27px, 3vw, 34px);
  font-weight: 800;
}

.page-heading p {
  color: #888394;
  margin-top: 9px;
}

/* Summary */
.summary-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 25px;
  background: white;
  border: 1px solid #eeeaf4;
  border-radius: 18px;
  margin-bottom: 30px;
}

.summary-icon {
  width: 55px;
  height: 55px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  color: #7950c8;
  background: #eee7ff;
}

.summary-number {
  font-size: 27px;
  font-weight: 800;
  color: #2b2340;
}

.summary-label {
  color: #888394;
  font-size: 13px;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 34px;
}

.search-field {
  max-width: 500px;
  background: white;
  border-radius: 12px;
}

.toolbar :deep(.v-btn) {
  text-transform: none;
  letter-spacing: 0;
}

/* Results */
.results-heading {
  margin-bottom: 20px;
}

.results-heading h2 {
  font-size: 22px;
  color: #2b2340;
  font-weight: 800;
}

.results-heading p {
  color: #888394;
  margin-top: 6px;
  font-size: 13px;
}

/* Design grid */
.design-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.design-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #eeeaf4;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.design-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px #30204b14;
}

.design-preview {
  height: 220px;
  position: relative;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #eee7ff, #f7efff);
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.preview-placeholder span {
  color: #7950c8;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.preview-chip {
  position: absolute;
  bottom: 12px;
  left: 12px;
  color: #7950c8;
}

.design-information {
  padding: 19px;
}

.design-information h3 {
  color: #302640;
  font-size: 16px;
  font-weight: 800;
}

.design-information > p {
  color: #888394;
  font-size: 12px;
  margin-top: 9px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}

.edit-button {
  flex: 1;
}

.card-actions :deep(.v-btn) {
  text-transform: none;
  letter-spacing: 0;
}

/* Empty and loading states */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  border: 1px dashed #d8cdea;
}

.empty-state h2 {
  color: #302640;
  font-size: 21px;
  margin-top: 17px;
}

.empty-state p {
  max-width: 400px;
  color: #888394;
  line-height: 1.6;
  margin: 10px auto 22px;
}

.loading-state {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: #888394;
}

@media (max-width: 1100px) {
  .design-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .my-designs-page {
    padding: 24px;
  }
}

@media (max-width: 600px) {
  .my-designs-page {
    padding: 18px 16px;
  }

  .page-heading {
    align-items: stretch;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 23px;
  }

  .page-heading :deep(.v-btn) {
    width: 100%;
  }

  .summary-card {
    margin-bottom: 22px;
  }

  .toolbar {
    align-items: stretch;
    flex-direction: column;
    margin-bottom: 28px;
  }

  .search-field {
    max-width: 100%;
  }

  .design-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .design-preview {
    height: 210px;
  }
}
</style>
