
<template>
  <div class="dashboard-page">
    <!-- Welcome heading -->
    <section class="page-heading">
      <div>
        <div class="eyebrow">YOUR CREATIVE WORKSPACE</div>
        <h1>Welcome back, {{ firstName }}! 👋</h1>
        <p>Let's create something amazing today.</p>
      </div>

      <v-btn
        to="/templates"
        color="deep-purple"
        rounded="lg"
        size="large"
        prepend-icon="mdi-plus"
        class="create-button"
      >
        Create Design
      </v-btn>
    </section>

    <!-- Hero -->
    <section class="hero-banner">
      <div class="hero-content">
        <div class="hero-label">CREATIVE STUDIO</div>
        <h2>Bring your ideas<br />to life.</h2>
        <p>
          Design beautiful social media posts, promotions,
          stories, and business graphics with ready-made templates.
        </p>

        <v-btn
          to="/templates"
          color="white"
          rounded="lg"
          class="hero-button"
        >
          Explore Templates
          <v-icon end icon="mdi-arrow-right" />
        </v-btn>
      </div>

      <div class="hero-art">
        <div class="art-card art-card-back">
          <v-icon icon="mdi-star-four-points" />
          <span>YOUR IDEAS</span>
        </div>
        <div class="art-card art-card-front">
          <v-icon icon="mdi-palette-outline" size="45" />
          <strong>CREATE</strong>
          <span>Something beautiful</span>
        </div>
      </div>
    </section>

    <!-- Statistics -->
    <section class="stats-grid">
      <v-card rounded="xl" class="stat-card" flat>
        <div class="stat-icon purple-icon">
          <v-icon icon="mdi-image-multiple-outline" />
        </div>
        <div>
          <div class="stat-value">{{ totalDesigns }}</div>
          <div class="stat-label">My Designs</div>
        </div>
      </v-card>

      <v-card rounded="xl" class="stat-card" flat>
        <div class="stat-icon blue-icon">
          <v-icon icon="mdi-view-grid-outline" />
        </div>
        <div>
          <div class="stat-value">12</div>
          <div class="stat-label">Available Templates</div>
        </div>
      </v-card>

      <v-card rounded="xl" class="stat-card" flat>
        <div class="stat-icon green-icon">
          <v-icon icon="mdi-clock-outline" />
        </div>
        <div>
          <div class="stat-value">{{ recentDesigns.length }}</div>
          <div class="stat-label">Recent Designs</div>
        </div>
      </v-card>
    </section>

    <!-- Quick actions -->
    <section class="content-section">
      <div class="section-heading">
        <div>
          <h2>Quick Actions</h2>
          <p>Choose what you want to do next.</p>
        </div>
      </div>

      <div class="quick-grid">
        <v-card
          to="/templates"
          rounded="xl"
          flat
          class="quick-card"
        >
          <div class="quick-icon purple-icon">
            <v-icon icon="mdi-view-grid-plus-outline" size="27" />
          </div>
          <h3>Browse Templates</h3>
          <p>Explore ready-made designs.</p>
          <v-icon icon="mdi-arrow-right" class="quick-arrow" />
        </v-card>

        <v-card
          to="/my-designs"
          rounded="xl"
          flat
          class="quick-card"
        >
          <div class="quick-icon blue-icon">
            <v-icon icon="mdi-folder-image" size="27" />
          </div>
          <h3>My Designs</h3>
          <p>Continue your saved projects.</p>
          <v-icon icon="mdi-arrow-right" class="quick-arrow" />
        </v-card>

        <v-card
          to="/editor"
          rounded="xl"
          flat
          class="quick-card"
        >
          <div class="quick-icon green-icon">
            <v-icon icon="mdi-draw" size="27" />
          </div>
          <h3>Open Editor</h3>
          <p>Start with a blank canvas.</p>
          <v-icon icon="mdi-arrow-right" class="quick-arrow" />
        </v-card>
      </div>
    </section>

    <!-- Recent designs -->
    <section class="content-section">
      <div class="section-heading">
        <div>
          <h2>Recent Designs</h2>
          <p>Your latest saved creative projects.</p>
        </div>

        <v-btn
          to="/my-designs"
          variant="text"
          color="deep-purple"
          append-icon="mdi-arrow-right"
        >
          View All
        </v-btn>
      </div>

      <div v-if="loading" class="loading-area">
        <v-progress-circular indeterminate color="deep-purple" />
      </div>

      <div v-else-if="recentDesigns.length" class="recent-grid">
        <v-card
          v-for="design in recentDesigns"
          :key="design.id"
          rounded="xl"
          flat
          class="design-card"
          @click="openDesign(design.id)"
        >
          <div class="design-preview">
            <v-icon icon="mdi-image-outline" size="48" />
          </div>

          <div class="design-info">
            <h3 class="text-truncate">{{ design.title }}</h3>
            <p>{{ design.templateName || 'Custom Design' }}</p>
            <span>{{ formatDate(design.updatedAt) }}</span>
          </div>
        </v-card>
      </div>

      <v-card v-else rounded="xl" flat class="empty-card">
        <v-icon icon="mdi-image-plus-outline" size="52" color="deep-purple" />
        <h3>No designs yet</h3>
        <p>Start creating your first social media design.</p>
        <v-btn to="/templates" color="deep-purple" rounded="lg">
          Browse Templates
        </v-btn>
      </v-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PosterDesign } from '~/composables/useDesigns'

const { currentUser } = useAuth()
const { getAllDesigns } = useDesigns()

const loading = ref(true)
const designs = ref<PosterDesign[]>([])

const firstName = computed(() => {
  return currentUser.value?.name?.split(' ')[0] || 'Creator'
})

const totalDesigns = computed(() => designs.value.length)

const recentDesigns = computed(() => designs.value.slice(0, 4))

async function loadDesigns() {
  loading.value = true

  try {
    designs.value = await getAllDesigns()
  } catch (error) {
    console.error('Unable to load designs:', error)
  } finally {
    loading.value = false
  }
}

function openDesign(id: string) {
  navigateTo(`/editor?design=${encodeURIComponent(id)}`)
}

function formatDate(date: string) {
  if (!date) return 'Recently updated'

  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

onMounted(loadDesigns)
</script>

<style scoped>
.dashboard-page {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 36px;
  box-sizing: border-box;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
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
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 800;
}

.page-heading p,
.section-heading p {
  color: #888394;
  margin-top: 8px;
}

.hero-banner {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 38px 44px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(115deg, #6040b8, #8c60d9);
  color: white;
  margin-bottom: 32px;
}

.hero-content {
  max-width: 540px;
  position: relative;
  z-index: 1;
}

.hero-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  opacity: 0.8;
  margin-bottom: 14px;
}

.hero-content h2 {
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.15;
  font-weight: 800;
}

.hero-content p {
  margin: 16px 0 22px;
  line-height: 1.7;
  opacity: 0.9;
}

.hero-button {
  color: #6845bd;
  font-weight: 700;
}

.hero-art {
  position: relative;
  width: 270px;
  height: 210px;
  flex-shrink: 0;
}

.art-card {
  position: absolute;
  width: 165px;
  height: 185px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 16px 30px #33205b55;
}

.art-card-back {
  right: 0;
  top: 0;
  transform: rotate(10deg);
  background: #f6d9a8;
  color: #754a2c;
}

.art-card-front {
  left: 5px;
  bottom: 0;
  transform: rotate(-8deg);
  background: #fff;
  color: #6845bd;
}

.art-card span {
  font-size: 11px;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  padding: 23px;
  display: flex;
  align-items: center;
  gap: 17px;
  border: 1px solid #eeeaf4;
}

.stat-icon,
.quick-icon {
  width: 52px;
  height: 52px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 27px;
  font-weight: 800;
  color: #2b2340;
}

.stat-label {
  color: #8a8594;
  font-size: 13px;
  margin-top: 3px;
}

.purple-icon {
  background: #eee7ff;
  color: #7950c8;
}

.blue-icon {
  background: #e5efff;
  color: #4778ca;
}

.green-icon {
  background: #e2f5ec;
  color: #29956b;
}

.content-section {
  margin-bottom: 42px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.section-heading h2 {
  font-size: 22px;
  font-weight: 800;
  color: #2b2340;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.quick-card {
  position: relative;
  padding: 24px;
  border: 1px solid #eeeaf4;
  transition: 0.2s ease;
}

.quick-card:hover,
.design-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px #30204b12;
}

.quick-card h3 {
  font-size: 16px;
  margin-top: 17px;
  color: #2b2340;
}

.quick-card p {
  font-size: 13px;
  color: #8a8594;
  margin-top: 6px;
}

.quick-arrow {
  position: absolute;
  right: 22px;
  top: 24px;
  color: #a69ab9;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.design-card {
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #eeeaf4;
  transition: 0.2s ease;
}

.design-preview {
  height: 155px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #eee7ff, #f7efff);
  color: #7950c8;
}

.design-info {
  padding: 16px;
}

.design-info h3 {
  font-size: 15px;
  font-weight: 700;
  color: #302640;
}

.design-info p,
.design-info span {
  display: block;
  color: #8a8594;
  font-size: 12px;
  margin-top: 6px;
}

.empty-card {
  text-align: center;
  padding: 48px 20px;
  border: 1px dashed #d8cdea;
}

.empty-card h3 {
  margin-top: 15px;
}

.empty-card p {
  margin: 8px 0 20px;
  color: #8a8594;
}

.loading-area {
  display: flex;
  justify-content: center;
  padding: 45px;
}

@media (max-width: 1100px) {
  .recent-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .dashboard-page {
    padding: 24px;
  }

  .hero-art {
    display: none;
  }

  .stats-grid,
  .quick-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .dashboard-page {
    padding: 18px 16px;
  }

  .page-heading {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 22px;
  }

  .create-button {
    width: 100%;
  }

  .hero-banner {
    padding: 28px 23px;
    min-height: auto;
    border-radius: 18px;
  }

  .stats-grid {
    gap: 12px;
    margin-bottom: 30px;
  }

  .stat-card {
    padding: 17px;
  }

  .recent-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .content-section {
    margin-bottom: 30px;
  }
}
</style>
