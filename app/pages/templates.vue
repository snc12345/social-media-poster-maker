
<template>
  <div class="templates-page">
    <!-- Heading -->
    <section class="page-heading">
      <div>
        <div class="eyebrow">DESIGN LIBRARY</div>
        <h1>Templates Gallery</h1>
        <p>Find the perfect design and make it yours.</p>
      </div>
    </section>

    <!-- Hero banner -->
    <section class="hero-banner">
      <div class="hero-copy">
        <div class="hero-label">GET CREATIVE INSPIRATION</div>
        <h2>Start with a template.<br />Finish with your style.</h2>
        <p>
          Explore ready-made layouts for social media,
          promotions, stories, and business designs.
        </p>
        <div class="hero-note">
          <v-icon icon="mdi-check-circle-outline" />
          12 editable templates available
        </div>
      </div>

      <div class="hero-decoration">
        <v-icon icon="mdi-palette-outline" size="100" />
        <v-icon icon="mdi-image-multiple-outline" size="60" />
      </div>
    </section>

    <!-- Search -->
    <section class="search-section">
      <v-text-field
        v-model="search"
        placeholder="Search templates, categories, or designs..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="xl"
        hide-details
        clearable
        class="search-field"
      />
    </section>

    <!-- Categories -->
    <section class="category-section">
      <div class="section-heading">
        <div>
          <h2>Browse Categories</h2>
          <p>Choose a category to explore.</p>
        </div>
      </div>

      <div class="category-list">
        <v-btn
          v-for="category in categories"
          :key="category.name"
          :color="activeCategory === category.name ? 'deep-purple' : undefined"
          :variant="activeCategory === category.name ? 'flat' : 'outlined'"
          rounded="lg"
          class="category-button"
          @click="activeCategory = category.name"
        >
          <v-icon start :icon="category.icon" />
          {{ category.name }}
          <v-badge
            inline
            :content="categoryCount(category.name)"
            color="grey-lighten-2"
            class="ml-2"
          />
        </v-btn>
      </div>
    </section>

    <!-- Template list -->
    <section class="templates-section">
      <div class="section-heading">
        <div>
          <h2>
            {{ activeCategory === 'All' ? 'All Templates' : activeCategory }}
          </h2>
          <p>{{ filteredTemplates.length }} designs found</p>
        </div>
      </div>

      <div v-if="filteredTemplates.length" class="templates-grid">
        <v-card
          v-for="template in filteredTemplates"
          :key="template.id"
          rounded="xl"
          flat
          class="template-card"
        >
          <div
            class="template-preview"
            :style="{
              background: template.background,
              color: template.textColor,
              aspectRatio: template.ratio,
            }"
          >
            <div class="preview-badge">
              {{ template.badge }}
            </div>

            <div class="preview-content">
              <div
                class="preview-accent"
                :style="{ background: template.accent }"
              >
                {{ template.label }}
              </div>

              <div class="preview-title">
                {{ template.previewTitle }}
              </div>

              <div
                class="preview-subtitle"
                :style="{ color: template.accent }"
              >
                {{ template.subtitle }}
              </div>

              <div
                class="preview-action"
                :style="{ background: template.accent }"
              >
                {{ template.action }}
              </div>
            </div>
          </div>

          <div class="template-details">
            <div class="d-flex justify-space-between align-center ga-2">
              <h3>{{ template.name }}</h3>
              <v-chip size="x-small" color="deep-purple" variant="tonal">
                {{ template.category }}
              </v-chip>
            </div>

            <p>{{ template.description }}</p>

            <div class="template-footer">
              <span>
                <v-icon icon="mdi-monitor" size="15" />
                {{ template.dimensions }}
              </span>

              <v-btn
                color="deep-purple"
                rounded="lg"
                size="small"
                @click="useTemplate(template.id)"
              >
                Use Template
                <v-icon end icon="mdi-arrow-right" />
              </v-btn>
            </div>
          </div>
        </v-card>
      </div>

      <v-card v-else class="empty-state" rounded="xl" flat>
        <v-icon icon="mdi-magnify" size="48" color="deep-purple" />
        <h3>No templates found</h3>
        <p>Try another search or select a different category.</p>
        <v-btn
          color="deep-purple"
          variant="tonal"
          @click="resetFilters"
        >
          Clear Filters
        </v-btn>
      </v-card>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

interface PosterTemplate {
  id: number
  name: string
  category: string
  dimensions: string
  description: string
  background: string
  accent: string
  textColor: string
  badge: string
  label: string
  previewTitle: string
  subtitle: string
  action: string
  ratio: string
}

const search = ref('')
const activeCategory = ref('All')

const categories = [
  { name: 'All', icon: 'mdi-view-grid' },
  { name: 'Instagram', icon: 'mdi-instagram' },
  { name: 'Facebook', icon: 'mdi-facebook' },
  { name: 'Stories', icon: 'mdi-cellphone' },
  { name: 'Promotions', icon: 'mdi-tag-outline' },
  { name: 'Business', icon: 'mdi-briefcase-outline' },
]

const templates: PosterTemplate[] = [
  {
    id: 1,
    name: 'Modern Sale',
    category: 'Promotions',
    dimensions: '600 × 600 px',
    description: 'A bold layout for sales and special offers.',
    background: '#FFF0DC',
    accent: '#E87835',
    textColor: '#713B26',
    badge: 'POPULAR',
    label: 'SPECIAL OFFER',
    previewTitle: 'BIG SALE',
    subtitle: 'UP TO 50% OFF',
    action: 'SHOP NOW',
    ratio: '1 / 1',
  },
  {
    id: 2,
    name: 'Minimal Business',
    category: 'Business',
    dimensions: '600 × 600 px',
    description: 'A clean and professional business design.',
    background: '#E5F0EA',
    accent: '#28745C',
    textColor: '#24513F',
    badge: 'BUSINESS',
    label: 'WELCOME',
    previewTitle: 'YOUR BRAND',
    subtitle: 'GROW WITH US',
    action: 'LEARN MORE',
    ratio: '1 / 1',
  },
  {
    id: 3,
    name: 'Daily Inspiration',
    category: 'Instagram',
    dimensions: '600 × 600 px',
    description: 'Share an inspiring message with your audience.',
    background: '#EAE2FF',
    accent: '#7856B5',
    textColor: '#493174',
    badge: 'CREATIVE',
    label: 'DAILY REMINDER',
    previewTitle: 'DREAM BIG',
    subtitle: 'START TODAY',
    action: 'KEEP GOING',
    ratio: '1 / 1',
  },
  {
    id: 4,
    name: 'Social Announcement',
    category: 'Facebook',
    dimensions: '600 × 315 px',
    description: 'Share updates and announcements.',
    background: '#DCEAFF',
    accent: '#356FC0',
    textColor: '#193D70',
    badge: 'SOCIAL',
    label: 'ANNOUNCEMENT',
    previewTitle: 'BIG NEWS',
    subtitle: 'SOMETHING IS COMING',
    action: 'READ MORE',
    ratio: '1.9 / 1',
  },
  {
    id: 5,
    name: 'Story Promotion',
    category: 'Stories',
    dimensions: '600 × 1067 px',
    description: 'A vertical layout for story promotions.',
    background: '#FFE5EE',
    accent: '#C34D78',
    textColor: '#9B365D',
    badge: 'STORY',
    label: 'LIMITED OFFER',
    previewTitle: 'NEW DEAL',
    subtitle: 'JUST FOR YOU',
    action: 'SWIPE UP',
    ratio: '9 / 16',
  },
  {
    id: 6,
    name: 'Product Launch',
    category: 'Promotions',
    dimensions: '600 × 600 px',
    description: 'Introduce a new product in style.',
    background: '#D9EDF1',
    accent: '#277A91',
    textColor: '#174D5B',
    badge: 'NEW',
    label: 'INTRODUCING',
    previewTitle: 'NEW PRODUCT',
    subtitle: 'MADE FOR YOU',
    action: 'DISCOVER',
    ratio: '1 / 1',
  },
  {
    id: 7,
    name: 'Weekend Sale',
    category: 'Promotions',
    dimensions: '600 × 600 px',
    description: 'Promote weekend discounts and deals.',
    background: '#F8DDD5',
    accent: '#C65D49',
    textColor: '#FFFFFF',
    badge: 'HOT DEAL',
    label: 'WEEKEND ONLY',
    previewTitle: 'SAVE MORE',
    subtitle: 'SPECIAL DISCOUNTS',
    action: 'SHOP NOW',
    ratio: '1 / 1',
  },
  {
    id: 8,
    name: 'Creative Quote',
    category: 'Instagram',
    dimensions: '600 × 600 px',
    description: 'A simple design for quotes and messages.',
    background: '#F1E5CA',
    accent: '#A88955',
    textColor: '#765C35',
    badge: 'QUOTE',
    label: 'A THOUGHT',
    previewTitle: 'BE YOURSELF',
    subtitle: 'YOU ARE ENOUGH',
    action: 'INSPIRE',
    ratio: '1 / 1',
  },
  {
    id: 9,
    name: 'Story Announcement',
    category: 'Stories',
    dimensions: '600 × 1067 px',
    description: 'Announce events and important updates.',
    background: '#E0E8FA',
    accent: '#4865A4',
    textColor: '#263F78',
    badge: 'STORY',
    label: 'SAVE THE DATE',
    previewTitle: 'COMING SOON',
    subtitle: 'DON’T MISS OUT',
    action: 'STAY TUNED',
    ratio: '9 / 16',
  },
  {
    id: 10,
    name: 'Facebook Promotion',
    category: 'Facebook',
    dimensions: '600 × 315 px',
    description: 'A wide promotional layout for Facebook.',
    background: '#EAE2FF',
    accent: '#7751B4',
    textColor: '#493174',
    badge: 'PROMO',
    label: 'EXCLUSIVE',
    previewTitle: 'SPECIAL DEAL',
    subtitle: 'AVAILABLE NOW',
    action: 'GET STARTED',
    ratio: '1.9 / 1',
  },
  {
    id: 11,
    name: 'Special Offer',
    category: 'Promotions',
    dimensions: '600 × 600 px',
    description: 'Highlight limited-time offers.',
    background: '#FFF0C9',
    accent: '#B47B20',
    textColor: '#8A5B15',
    badge: 'OFFER',
    label: 'LIMITED TIME',
    previewTitle: 'SPECIAL OFFER',
    subtitle: 'DON’T MISS IT',
    action: 'CLAIM NOW',
    ratio: '1 / 1',
  },
  {
    id: 12,
    name: 'Business Profile',
    category: 'Business',
    dimensions: '600 × 600 px',
    description: 'Showcase your brand and business.',
    background: '#D9E8E1',
    accent: '#34785C',
    textColor: '#24513F',
    badge: 'BRANDING',
    label: 'ABOUT US',
    previewTitle: 'OUR BUSINESS',
    subtitle: 'QUALITY YOU TRUST',
    action: 'CONTACT US',
    ratio: '1 / 1',
  },
]

const filteredTemplates = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return templates.filter((template) => {
    const matchesCategory =
      activeCategory.value === 'All' ||
      template.category === activeCategory.value

    const matchesSearch =
      !keyword ||
      template.name.toLowerCase().includes(keyword) ||
      template.category.toLowerCase().includes(keyword) ||
      template.description.toLowerCase().includes(keyword)

    return matchesCategory && matchesSearch
  })
})

function categoryCount(category: string) {
  if (category === 'All') return templates.length

  return templates.filter((template) => template.category === category).length
}

function useTemplate(id: number) {
  navigateTo(`/editor?template=${id}`)
}

function resetFilters() {
  search.value = ''
  activeCategory.value = 'All'
}
</script>

<style scoped>
.templates-page {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 36px;
  box-sizing: border-box;
}

.page-heading {
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
  margin-top: 10px;
}

.hero-banner {
  min-height: 280px;
  padding: 38px 44px;
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  overflow: hidden;
  background: linear-gradient(115deg, #6040b8, #8c60d9);
  color: white;
  margin-bottom: 32px;
}

.hero-copy {
  max-width: 570px;
}

.hero-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  opacity: 0.8;
  margin-bottom: 15px;
}

.hero-copy h2 {
  font-size: clamp(27px, 3.5vw, 38px);
  line-height: 1.25;
  font-weight: 800;
}

.hero-copy p {
  max-width: 520px;
  line-height: 1.7;
  margin: 16px 0;
  opacity: 0.9;
}

.hero-note {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 22px;
  font-size: 14px;
}

.hero-decoration {
  width: 220px;
  height: 180px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: #fff;
  opacity: 0.8;
}

.hero-decoration :last-child {
  position: absolute;
  right: 0;
  bottom: 0;
  color: #f6d9a8;
}

.search-section {
  margin-bottom: 38px;
}

.search-field {
  background: white;
  border-radius: 14px;
}

.category-section,
.templates-section {
  margin-bottom: 40px;
}

.section-heading {
  margin-bottom: 20px;
}

.section-heading h2 {
  color: #2b2340;
  font-size: 22px;
  font-weight: 800;
}

.section-heading p {
  color: #8a8594;
  margin-top: 7px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-button {
  min-height: 44px;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
  background: white;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.template-card {
  overflow: hidden;
  min-width: 0;
  border: 1px solid #eeeaf4;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px #30204b14;
}

.template-preview {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 190px;
  padding: 22px;
}

.preview-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 6px 9px;
  border-radius: 6px;
  background: #ffffffdd;
  color: #7651bb;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.preview-content {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  gap: 10px;
  max-width: 100%;
}

.preview-accent {
  border-radius: 30px;
  color: white;
  padding: 6px 13px;
  font-size: 9px;
  font-weight: 800;
}

.preview-title {
  font-size: clamp(20px, 2.5vw, 29px);
  font-weight: 900;
  line-height: 1.1;
  overflow-wrap: anywhere;
}

.preview-subtitle {
  font-size: 13px;
  font-weight: 800;
}

.preview-action {
  border-radius: 8px;
  color: white;
  padding: 8px 15px;
  font-size: 9px;
  font-weight: 800;
}

.template-details {
  padding: 19px;
}

.template-details h3 {
  font-size: 16px;
  color: #302640;
  font-weight: 800;
}

.template-details p {
  color: #8a8594;
  font-size: 13px;
  line-height: 1.6;
  margin: 11px 0 18px;
  min-height: 40px;
}

.template-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.template-footer span {
  color: #888394;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.template-footer :deep(.v-btn) {
  text-transform: none;
  letter-spacing: 0;
}

.empty-state {
  padding: 55px 20px;
  text-align: center;
  border: 1px dashed #d8cdea;
}

.empty-state h3 {
  margin-top: 14px;
}

.empty-state p {
  color: #8a8594;
  margin: 8px 0 20px;
}

@media (max-width: 1100px) {
  .templates-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .templates-page {
    padding: 24px;
  }

  .hero-decoration {
    display: none;
  }
}

@media (max-width: 600px) {
  .templates-page {
    padding: 18px 16px;
  }

  .page-heading {
    margin-bottom: 22px;
  }

  .hero-banner {
    padding: 26px 22px;
    min-height: auto;
    border-radius: 18px;
    margin-bottom: 24px;
  }

  .search-section {
    margin-bottom: 28px;
  }

  .category-section,
  .templates-section {
    margin-bottom: 30px;
  }

  .category-list {
    gap: 8px;
  }

  .category-button {
    font-size: 12px;
  }

  .templates-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .template-preview {
    min-height: 230px;
  }
}
</style>
