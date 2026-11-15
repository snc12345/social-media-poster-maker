
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useDesigns } from '~/composables/useDesigns'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { saveDesign, getDesign } = useDesigns()

// ==========================================
// EDITOR STATE
// ==========================================

const canvasElement = ref<HTMLCanvasElement | null>(null)

const loading = ref(true)
const saving = ref(false)
const saveMessage = ref('')

const designTitle = ref('My Poster')
const currentTemplateName = ref('Blank Poster')

const selectedText = ref('')
const selectedColor = ref('#222222')
const backgroundColor = ref('#FFFFFF')
const selectedObjectType = ref('')

const canvasWidth = ref(600)
const canvasHeight = ref(600)
const zoom = ref(100)

let posterCanvas: any = null
let fabric: any = null

const hasSelection = computed(() => !!selectedObjectType.value)

const isTextSelected = computed(() => {
  return (
    selectedObjectType.value === 'textbox' ||
    selectedObjectType.value === 'i-text' ||
    selectedObjectType.value === 'text'
  )
})

// ==========================================
// CANVAS SELECTION
// ==========================================

function syncSelection() {
  if (!posterCanvas) return

  const selected = posterCanvas.getActiveObject()

  if (!selected) {
    selectedObjectType.value = ''
    selectedText.value = ''
    selectedColor.value = '#222222'
    return
  }

  selectedObjectType.value = selected.type || 'object'
  selectedText.value = selected.text || ''
  selectedColor.value =
    typeof selected.fill === 'string'
      ? selected.fill
      : '#222222'
}

function updateSelectedText(value: string) {
  if (!posterCanvas) return

  const selected = posterCanvas.getActiveObject()

  if (!selected || !isTextSelected.value) return

  selected.set('text', value)
  posterCanvas.renderAll()
}

function updateSelectedColor(value: string) {
  if (!posterCanvas) return

  const selected = posterCanvas.getActiveObject()

  if (!selected) return

  selected.set('fill', value)
  selectedColor.value = value
  posterCanvas.renderAll()
}

// ==========================================
// CANVAS HELPERS
// ==========================================

function clearCanvas(color = '#FFFFFF', height = 600) {
  if (!posterCanvas) return

  canvasWidth.value = 600
  canvasHeight.value = height
  backgroundColor.value = color

  posterCanvas.clear()

  posterCanvas.setDimensions({
    width: canvasWidth.value,
    height: canvasHeight.value,
  })

  posterCanvas.backgroundColor = color
  posterCanvas.renderAll()

  syncSelection()
}

function addText(
  text: string,
  left: number,
  top: number,
  width: number,
  fontSize: number,
  color: string,
  options: {
    bold?: boolean
    align?: 'left' | 'center' | 'right'
  } = {},
) {
  if (!posterCanvas || !fabric) return

  posterCanvas.add(
    new fabric.Textbox(text, {
      left,
      top,
      width,
      fontSize,
      fill: color,
      fontWeight: options.bold ? 'bold' : 'normal',
      textAlign: options.align || 'left',
      fontFamily: 'Arial',
      lineHeight: 1.15,
      editable: true,
    }),
  )
}

function addRect(
  left: number,
  top: number,
  width: number,
  height: number,
  color: string,
  radius = 0,
) {
  if (!posterCanvas || !fabric) return

  posterCanvas.add(
    new fabric.Rect({
      left,
      top,
      width,
      height,
      fill: color,
      rx: radius,
      ry: radius,
    }),
  )
}

function addCircle(
  left: number,
  top: number,
  radius: number,
  color: string,
) {
  if (!posterCanvas || !fabric) return

  posterCanvas.add(
    new fabric.Circle({
      left,
      top,
      radius,
      fill: color,
    }),
  )
}

function addTriangle(
  left: number,
  top: number,
  width: number,
  height: number,
  color: string,
) {
  if (!posterCanvas || !fabric) return

  posterCanvas.add(
    new fabric.Triangle({
      left,
      top,
      width,
      height,
      fill: color,
    }),
  )
}

function addTemplateButton(
  text: string,
  left: number,
  top: number,
  width: number,
  height: number,
  buttonColor: string,
  textColor = '#FFFFFF',
) {
  addRect(left, top, width, height, buttonColor, 12)

  addText(
    text,
    left + 8,
    top + height / 2 - 10,
    width - 16,
    20,
    textColor,
    {
      bold: true,
      align: 'center',
    },
  )
}

// ==========================================
// TEMPLATE DESIGNS
// IDs MATCH THE TEMPLATES GALLERY
// ==========================================

function createTemplate(templateId: number) {
  if (!posterCanvas || !fabric) return

  switch (templateId) {
    case 1:
      currentTemplateName.value = 'Modern Sale'
      clearCanvas('#FFF0DC')

      addCircle(390, 45, 140, '#F8C98C')
      addRect(45, 60, 125, 35, '#E87835', 18)

      addText('SPECIAL OFFER', 55, 68, 105, 18, '#FFFFFF', {
        bold: true,
        align: 'center',
      })

      addText('BIG SALE', 45, 165, 510, 82, '#713B26', {
        bold: true,
        align: 'center',
      })

      addText('UP TO 50% OFF', 45, 265, 510, 48, '#E87835', {
        bold: true,
        align: 'center',
      })

      addText(
        'Limited time only. Shop today!',
        55,
        350,
        490,
        30,
        '#713B26',
        { align: 'center' },
      )

      addTemplateButton('SHOP NOW', 190, 440, 220, 58, '#E87835')
      break

    case 2:
      currentTemplateName.value = 'Minimal Business'
      clearCanvas('#E5F0EA')

      addRect(0, 0, 600, 160, '#28745C')
      addCircle(440, 35, 90, '#70AA91')

      addText('YOUR BRAND', 55, 48, 460, 28, '#FFFFFF', {
        bold: true,
      })

      addText('BUILD YOUR\nBUSINESS', 55, 210, 490, 125, '#24513F', {
        bold: true,
      })

      addText(
        'Ideas become reality when you take action.',
        58,
        365,
        475,
        65,
        '#49685B',
      )

      addTemplateButton('LEARN MORE', 55, 475, 210, 55, '#28745C')
      break

    case 3:
      currentTemplateName.value = 'Daily Inspiration'
      clearCanvas('#EAE2FF')

      addCircle(35, 40, 85, '#C5B3F0')
      addCircle(440, 425, 95, '#C5B3F0')

      addText('DAILY REMINDER', 55, 130, 490, 35, '#7856B5', {
        bold: true,
        align: 'center',
      })

      addText('DREAM\nBIG.', 65, 205, 470, 150, '#493174', {
        bold: true,
        align: 'center',
      })

      addText(
        'Start where you are. Use what you have.\nDo what you can.',
        65,
        390,
        470,
        70,
        '#604B80',
        { align: 'center' },
      )
      break

    case 4:
      currentTemplateName.value = 'Social Announcement'
      clearCanvas('#DCEAFF', 315)

      addRect(0, 0, 190, 315, '#356FC0')
      addCircle(45, 65, 55, '#79A9EA')

      addText('ANNOUNCEMENT', 225, 55, 340, 32, '#356FC0', {
        bold: true,
      })

      addText(
        'SOMETHING\nNEW IS HERE!',
        225,
        105,
        340,
        100,
        '#193D70',
        { bold: true },
      )

      addText(
        'Stay tuned for exciting updates.',
        225,
        225,
        330,
        45,
        '#35577E',
      )
      break

    case 5:
      currentTemplateName.value = 'Story Promotion'
      clearCanvas('#FFE5EE', 1067)

      addCircle(330, 100, 210, '#F8B8CE')

      addText('YOUR BRAND', 45, 55, 510, 35, '#A23D65', {
        bold: true,
        align: 'center',
      })

      addText(
        'A LITTLE\nSOMETHING\nSPECIAL',
        45,
        345,
        510,
        210,
        '#9B365D',
        { bold: true, align: 'center' },
      )

      addText(
        'Discover our latest collection.',
        55,
        625,
        490,
        65,
        '#88425D',
        { align: 'center' },
      )

      addTemplateButton('SHOP NOW', 150, 790, 300, 75, '#C34D78')

      addText('@yourbrand', 50, 970, 500, 30, '#A23D65', {
        align: 'center',
      })
      break

    case 6:
      currentTemplateName.value = 'Product Launch'
      clearCanvas('#D9EDF1')

      addCircle(175, 80, 125, '#9ACBD4')
      addCircle(235, 135, 70, '#FFFFFF')

      addText('INTRODUCING', 55, 300, 490, 35, '#277A91', {
        bold: true,
        align: 'center',
      })

      addText('OUR NEW\nPRODUCT', 55, 350, 490, 120, '#174D5B', {
        bold: true,
        align: 'center',
      })

      addText(
        'Designed to make your life better.',
        55,
        490,
        490,
        45,
        '#426D77',
        { align: 'center' },
      )

      addTemplateButton('DISCOVER MORE', 180, 545, 240, 42, '#277A91')
      break

    case 7:
      currentTemplateName.value = 'Weekend Sale'
      clearCanvas('#F8DDD5')

      addRect(35, 35, 530, 530, '#C65D49', 25)

      addText('WEEKEND', 60, 105, 480, 55, '#FFFFFF', {
        bold: true,
        align: 'center',
      })

      addText('SALE!', 55, 190, 490, 115, '#FFE8D8', {
        bold: true,
        align: 'center',
      })

      addText(
        'SPECIAL DEALS JUST FOR YOU',
        55,
        345,
        490,
        35,
        '#FFFFFF',
        { bold: true, align: 'center' },
      )

      addTemplateButton(
        'SHOP TODAY',
        165,
        430,
        270,
        65,
        '#FFE8D8',
        '#C65D49',
      )
      break

    case 8:
      currentTemplateName.value = 'Creative Quote'
      clearCanvas('#F1E5CA')

      addText('“', 55, 65, 100, 120, '#A88955', {
        bold: true,
      })

      addText(
        'CREATE\nYOUR OWN\nOPPORTUNITY.',
        65,
        195,
        470,
        210,
        '#765C35',
        { bold: true, align: 'center' },
      )

      addRect(190, 440, 220, 5, '#A88955')

      addText(
        'INSPIRE · CREATE · GROW',
        55,
        475,
        490,
        35,
        '#8D7042',
        { bold: true, align: 'center' },
      )
      break

    case 9:
      currentTemplateName.value = 'Story Announcement'
      clearCanvas('#E0E8FA', 1067)

      addCircle(350, 100, 180, '#B8C9F0')

      addText('IMPORTANT', 50, 280, 500, 40, '#4865A4', {
        bold: true,
        align: 'center',
      })

      addText(
        'BIG NEWS\nCOMING SOON',
        45,
        370,
        510,
        180,
        '#263F78',
        { bold: true, align: 'center' },
      )

      addText(
        'Follow us so you do not miss it.',
        55,
        630,
        490,
        60,
        '#4865A4',
        { align: 'center' },
      )

      addTemplateButton('STAY TUNED', 140, 790, 320, 70, '#4865A4')
      break

    case 10:
      currentTemplateName.value = 'Facebook Promotion'
      clearCanvas('#EAE2FF', 315)

      addRect(0, 0, 600, 315, '#7751B4')
      addCircle(435, 35, 115, '#A98BDB')

      addText(
        'SPECIAL PROMOTION',
        40,
        45,
        510,
        35,
        '#FFFFFF',
        { bold: true, align: 'center' },
      )

      addText('SAVE MORE\nTODAY!', 45, 100, 510, 105, '#FFFFFF', {
        bold: true,
        align: 'center',
      })

      addText(
        'Offers you do not want to miss.',
        50,
        235,
        500,
        35,
        '#F1E9FF',
        { align: 'center' },
      )
      break

    case 11:
      currentTemplateName.value = 'Special Offer'
      clearCanvas('#FFF0C9')

      addCircle(380, 30, 130, '#F6D987')
      addTriangle(35, 35, 100, 100, '#E7B95A')

      addText('A SPECIAL GIFT', 55, 135, 490, 35, '#A16D1E', {
        bold: true,
        align: 'center',
      })

      addText('JUST FOR\nYOU!', 55, 205, 490, 130, '#8A5B15', {
        bold: true,
        align: 'center',
      })

      addText(
        'Enjoy our exclusive offer.',
        55,
        375,
        490,
        35,
        '#A16D1E',
        { align: 'center' },
      )

      addTemplateButton('GET YOUR OFFER', 165, 450, 270, 60, '#B47B20')
      break

    case 12:
      currentTemplateName.value = 'Business Profile'
      clearCanvas('#D9E8E1')

      addRect(0, 0, 600, 175, '#34785C')
      addCircle(235, 45, 65, '#8CBCA2')

      addText('YOUR BUSINESS', 45, 205, 510, 40, '#24513F', {
        bold: true,
        align: 'center',
      })

      addText(
        'QUALITY YOU CAN TRUST',
        45,
        275,
        510,
        65,
        '#34785C',
        { bold: true, align: 'center' },
      )

      addText(
        'Professional service. Excellent results.',
        55,
        370,
        490,
        55,
        '#49685B',
        { align: 'center' },
      )

      addTemplateButton('CONTACT US', 180, 470, 240, 55, '#34785C')
      break

    default:
      currentTemplateName.value = 'Blank Poster'
      clearCanvas('#FFFFFF')

      addText(
        'YOUR POSTER TITLE',
        65,
        220,
        470,
        55,
        '#145C4B',
        { bold: true, align: 'center' },
      )

      addText(
        'Start creating something amazing!',
        65,
        290,
        470,
        35,
        '#475569',
        { align: 'center' },
      )
  }

  posterCanvas.renderAll()
  syncSelection()
}

// ==========================================
// EDITING TOOLS
// ==========================================

function addNewText() {
  if (!posterCanvas || !fabric) return

  const text = new fabric.Textbox('Edit this text', {
    left: 100,
    top: 100,
    width: 300,
    fontSize: 30,
    fill: '#222222',
    fontWeight: 'bold',
    fontFamily: 'Arial',
  })

  posterCanvas.add(text)
  posterCanvas.setActiveObject(text)
  posterCanvas.renderAll()
  syncSelection()
}

function addNewRectangle() {
  if (!posterCanvas || !fabric) return

  const shape = new fabric.Rect({
    left: 130,
    top: 130,
    width: 170,
    height: 110,
    fill: '#A78BFA',
    rx: 8,
    ry: 8,
  })

  posterCanvas.add(shape)
  posterCanvas.setActiveObject(shape)
  posterCanvas.renderAll()
  syncSelection()
}

function addNewCircle() {
  if (!posterCanvas || !fabric) return

  const shape = new fabric.Circle({
    left: 150,
    top: 150,
    radius: 65,
    fill: '#86C9B5',
  })

  posterCanvas.add(shape)
  posterCanvas.setActiveObject(shape)
  posterCanvas.renderAll()
  syncSelection()
}

function deleteSelected() {
  if (!posterCanvas) return

  const selected = posterCanvas.getActiveObject()

  if (!selected) {
    saveMessage.value = 'Select an object first.'
    return
  }

  posterCanvas.remove(selected)
  posterCanvas.discardActiveObject()
  posterCanvas.renderAll()

  syncSelection()
}

function changeBackground(color: string) {
  if (!posterCanvas) return

  backgroundColor.value = color
  posterCanvas.backgroundColor = color
  posterCanvas.renderAll()
}

function changeZoom(value: number) {
  if (!posterCanvas) return

  zoom.value = value
  posterCanvas.setZoom(value / 100)
  posterCanvas.renderAll()
}

function bringForward() {
  if (!posterCanvas) return

  const selected = posterCanvas.getActiveObject()

  if (!selected) return

  posterCanvas.bringObjectForward(selected)
  posterCanvas.renderAll()
}

function sendBackward() {
  if (!posterCanvas) return

  const selected = posterCanvas.getActiveObject()

  if (!selected) return

  posterCanvas.sendObjectBackwards(selected)
  posterCanvas.renderAll()
}

function deselectObject() {
  if (!posterCanvas) return

  posterCanvas.discardActiveObject()
  posterCanvas.renderAll()
  syncSelection()
}

// ==========================================
// LOAD SAVED DESIGN
// ==========================================

async function loadSavedDesign(id: string) {
  if (!posterCanvas) return

  const design = await getDesign(id)

  if (!design) {
    saveMessage.value = 'Saved design not found.'
    createTemplate(0)
    return
  }

  designTitle.value = design.title
  currentTemplateName.value = design.templateName

  const savedCanvas = design.canvasData as Record<string, any>

  const savedWidth = Number(savedCanvas.width) || 600
  const savedHeight = Number(savedCanvas.height) || 600

  canvasWidth.value = savedWidth
  canvasHeight.value = savedHeight

  posterCanvas.setDimensions({
    width: savedWidth,
    height: savedHeight,
  })

  await posterCanvas.loadFromJSON(savedCanvas)

  backgroundColor.value =
    typeof posterCanvas.backgroundColor === 'string'
      ? posterCanvas.backgroundColor
      : '#FFFFFF'

  posterCanvas.renderAll()
  syncSelection()
}

// ==========================================
// SAVE DESIGN TO INDEXEDDB
// ==========================================

async function saveCurrentDesign() {
  if (!posterCanvas) return

  saving.value = true
  saveMessage.value = ''

  try {
    const routeDesignId = route.query.design

    const id =
      typeof routeDesignId === 'string'
        ? routeDesignId
        : crypto.randomUUID()

    const existingDesign = await getDesign(id)
    const now = new Date().toISOString()

    const canvasData = posterCanvas.toJSON()

    // Preserve the canvas dimensions in saved data.
    canvasData.width = canvasWidth.value
    canvasData.height = canvasHeight.value

    await saveDesign({
      id,
      title: designTitle.value.trim() || 'Untitled Poster',
      templateName: currentTemplateName.value,
      canvasData: canvasData as Record<string, unknown>,
      createdAt: existingDesign?.createdAt || now,
      updatedAt: now,
    })

    saveMessage.value = 'Design saved successfully!'

    if (route.query.design !== id) {
      await navigateTo(`/editor?design=${encodeURIComponent(id)}`)
    }
  } catch (error) {
    console.error('Error saving design:', error)
    saveMessage.value = 'Unable to save design. Please try again.'
  } finally {
    saving.value = false
  }
}

// ==========================================
// DOWNLOAD PNG
// ==========================================

function downloadPoster() {
  if (!posterCanvas) return

  const dataUrl = posterCanvas.toDataURL({
    format: 'png',
    multiplier: 2,
  })

  const link = document.createElement('a')

  link.href = dataUrl
  link.download = `${
    designTitle.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'my-poster'
  }.png`

  link.click()
}

// ==========================================
// INITIALIZE FABRIC.JS
// ==========================================

onMounted(async () => {
  if (!canvasElement.value) return

  try {
    fabric = await import('fabric')

    posterCanvas = new fabric.Canvas(canvasElement.value, {
      width: canvasWidth.value,
      height: canvasHeight.value,
      backgroundColor: '#FFFFFF',
      selection: true,
      preserveObjectStacking: true,
    })

    posterCanvas.on('selection:created', syncSelection)
    posterCanvas.on('selection:updated', syncSelection)
    posterCanvas.on('selection:cleared', syncSelection)

    posterCanvas.on('object:modified', syncSelection)

    const designId = route.query.design

    if (typeof designId === 'string') {
      await loadSavedDesign(designId)
    } else {
      const templateId = Number(route.query.template || 0)

      if (
        Number.isInteger(templateId) &&
        templateId >= 0 &&
        templateId <= 12
      ) {
        createTemplate(templateId)
      } else {
        createTemplate(0)
      }
    }
  } catch (error) {
    console.error('Unable to load the poster editor:', error)
    saveMessage.value = 'Unable to load the editor. Check the console.'
  } finally {
    loading.value = false
  }
})

// ==========================================
// CLEANUP
// ==========================================

onBeforeUnmount(() => {
  if (posterCanvas) {
    posterCanvas.dispose()
    posterCanvas = null
  }
})
</script>

<template>
  <div class="editor-page">

    <!-- ================================== -->
    <!-- TOP EDITOR BAR -->
    <!-- ================================== -->

    <div class="editor-topbar">

      <div class="d-flex align-center ga-3">

        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          color="deep-purple"
          to="/templates"
          aria-label="Back to templates"
        />

        <div class="editor-brand-icon">
          <v-icon color="white">
            mdi-palette-swatch
          </v-icon>
        </div>

        <div>
          <div class="font-weight-bold editor-brand-title">
            Poster Maker
          </div>

          <div class="text-caption text-grey">
            Creative Editor
          </div>
        </div>

      </div>

      <div class="editor-title-input">
        <v-text-field
          v-model="designTitle"
          placeholder="Untitled design"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-pencil-outline"
          aria-label="Design name"
        />
      </div>

      <div class="d-flex align-center ga-2">

        <v-chip
          v-if="saveMessage"
          size="small"
          :color="saveMessage.includes('successfully') ? 'success' : 'error'"
          variant="tonal"
          class="save-status"
        >
          {{ saveMessage }}
        </v-chip>

        <v-btn
          color="deep-purple"
          variant="tonal"
          rounded="lg"
          prepend-icon="mdi-content-save-outline"
          :loading="saving"
          :disabled="loading"
          @click="saveCurrentDesign"
        >
          Save
        </v-btn>

        <v-btn
          color="deep-purple"
          rounded="lg"
          prepend-icon="mdi-download"
          @click="downloadPoster"
        >
          Export
        </v-btn>

      </div>

    </div>

    <!-- ================================== -->
    <!-- EDITOR WORKSPACE -->
    <!-- ================================== -->

    <div class="editor-workspace">

      <!-- LEFT TOOLBAR -->

      <aside class="left-toolbar">

        <div class="tool-group">

          <button
            class="tool-button"
            type="button"
            @click="addNewText"
          >
            <v-icon size="23">
              mdi-format-text
            </v-icon>

            <span>Text</span>
          </button>

          <button
            class="tool-button"
            type="button"
            @click="addNewRectangle"
          >
            <v-icon size="23">
              mdi-rectangle-outline
            </v-icon>

            <span>Rectangle</span>
          </button>

          <button
            class="tool-button"
            type="button"
            @click="addNewCircle"
          >
            <v-icon size="23">
              mdi-circle-outline
            </v-icon>

            <span>Circle</span>
          </button>

        </div>

        <v-divider class="my-3" />

        <div class="tool-group">

          <button
            class="tool-button"
            type="button"
            :disabled="!hasSelection"
            @click="bringForward"
          >
            <v-icon size="23">
              mdi-arrange-bring-forward
            </v-icon>

            <span>Forward</span>
          </button>

          <button
            class="tool-button"
            type="button"
            :disabled="!hasSelection"
            @click="sendBackward"
          >
            <v-icon size="23">
              mdi-arrange-send-backward
            </v-icon>

            <span>Backward</span>
          </button>

          <button
            class="tool-button tool-delete"
            type="button"
            :disabled="!hasSelection"
            @click="deleteSelected"
          >
            <v-icon size="23">
              mdi-delete-outline
            </v-icon>

            <span>Delete</span>
          </button>

        </div>

      </aside>

      <!-- CENTER CANVAS AREA -->

      <main class="canvas-workspace">

        <div class="canvas-heading">

          <div>
            <div class="font-weight-bold">
              {{ currentTemplateName }}
            </div>

            <div class="text-caption text-grey">
              {{ canvasWidth }} × {{ canvasHeight }} px
            </div>
          </div>

          <div class="d-flex align-center ga-2">

            <v-btn
              icon="mdi-fit-to-screen-outline"
              variant="text"
              size="small"
              color="deep-purple"
              aria-label="Reset zoom"
              @click="changeZoom(100)"
            />

            <span class="text-caption font-weight-medium">
              {{ zoom }}%
            </span>

          </div>

        </div>

        <div class="canvas-stage">

          <div
            v-if="loading"
            class="canvas-loading"
          >
            <v-progress-circular
              indeterminate
              color="deep-purple"
              size="42"
            />

            <p class="text-grey mt-3">
              Preparing your poster...
            </p>
          </div>

          <div
            v-show="!loading"
            class="canvas-scroll"
          >
            <div class="canvas-paper">
              <canvas ref="canvasElement"></canvas>
            </div>
          </div>

        </div>

        <!-- CANVAS BOTTOM BAR -->

        <div class="canvas-bottom-bar">

          <div class="d-flex align-center ga-2">
            <v-icon color="deep-purple" size="18">
              mdi-cursor-move
            </v-icon>

            <span class="text-caption text-grey">
              Select and drag objects on your poster
            </span>
          </div>

          <div class="zoom-controls">

            <v-btn
              icon="mdi-minus"
              size="x-small"
              variant="text"
              aria-label="Zoom out"
              :disabled="zoom <= 25"
              @click="changeZoom(Math.max(25, zoom - 10))"
            />

            <v-slider
              :model-value="zoom"
              min="25"
              max="150"
              step="5"
              color="deep-purple"
              track-color="grey-lighten-2"
              hide-details
              density="compact"
              class="zoom-slider"
              aria-label="Canvas zoom"
              @update:model-value="changeZoom"
            />

            <v-btn
              icon="mdi-plus"
              size="x-small"
              variant="text"
              aria-label="Zoom in"
              :disabled="zoom >= 150"
              @click="changeZoom(Math.min(150, zoom + 10))"
            />

          </div>

        </div>

      </main>

      <!-- RIGHT PROPERTIES PANEL -->

      <aside class="properties-panel">

        <div class="properties-heading">
          <v-icon color="deep-purple" class="mr-2">
            mdi-tune-variant
          </v-icon>

          <span class="font-weight-bold">
            Properties
          </span>
        </div>

        <v-divider />

        <!-- SELECTED OBJECT -->

        <div v-if="hasSelection" class="pa-4">

          <div class="text-overline text-grey mb-3">
            SELECTED OBJECT
          </div>

          <v-chip
            color="deep-purple"
            variant="tonal"
            size="small"
            class="mb-4"
          >
            {{ selectedObjectType }}
          </v-chip>

          <div v-if="isTextSelected">

            <label class="property-label">
              Text Content
            </label>

            <v-textarea
              v-model="selectedText"
              variant="outlined"
              density="comfortable"
              rows="3"
              auto-grow
              hide-details
              @update:model-value="updateSelectedText"
            />

          </div>

          <div class="mt-5">

            <label class="property-label">
              Object Color
            </label>

            <div class="d-flex align-center ga-3 mt-2">

              <input
                v-model="selectedColor"
                type="color"
                class="color-picker"
                aria-label="Selected object color"
                @input="updateSelectedColor(selectedColor)"
              />

              <span class="text-body-2 text-grey">
                {{ selectedColor.toUpperCase() }}
              </span>

            </div>

          </div>

          <v-divider class="my-5" />

          <div class="text-caption text-grey mb-3">
            LAYER ORDER
          </div>

          <v-btn
            block
            variant="tonal"
            color="deep-purple"
            prepend-icon="mdi-arrange-bring-forward"
            class="mb-2"
            @click="bringForward"
          >
            Bring Forward
          </v-btn>

          <v-btn
            block
            variant="tonal"
            color="deep-purple"
            prepend-icon="mdi-arrange-send-backward"
            class="mb-2"
            @click="sendBackward"
          >
            Send Backward
          </v-btn>

          <v-btn
            block
            variant="tonal"
            color="error"
            prepend-icon="mdi-delete-outline"
            @click="deleteSelected"
          >
            Delete Object
          </v-btn>

          <v-btn
            block
            variant="text"
            color="grey-darken-1"
            class="mt-2"
            @click="deselectObject"
          >
            Deselect
          </v-btn>

        </div>

        <!-- NO SELECTION -->

        <div v-else class="pa-4">

          <div class="text-center py-5">

            <v-avatar
              color="#F0EBFF"
              size="62"
            >
              <v-icon
                color="deep-purple"
                size="30"
              >
                mdi-cursor-default-click-outline
              </v-icon>
            </v-avatar>

            <div class="font-weight-bold mt-4">
              Nothing selected
            </div>

            <p class="text-caption text-grey mt-2">
              Select text or a shape on your poster to edit its properties.
            </p>

          </div>

        </div>

        <v-divider />

        <!-- BACKGROUND COLOR -->

        <div class="pa-4">

          <div class="text-overline text-grey mb-3">
            CANVAS BACKGROUND
          </div>

          <div class="d-flex align-center ga-3">

            <input
              v-model="backgroundColor"
              type="color"
              class="color-picker"
              aria-label="Poster background color"
              @input="changeBackground(backgroundColor)"
            />

            <span class="text-body-2 text-grey">
              {{ backgroundColor.toUpperCase() }}
            </span>

          </div>

          <div class="text-caption text-grey mt-3">
            Changes the poster background without changing its objects.
          </div>

        </div>

        <v-divider />

        <!-- POSTER INFORMATION -->

        <div class="pa-4">

          <div class="text-overline text-grey mb-3">
            POSTER INFORMATION
          </div>

          <div class="d-flex justify-space-between mb-3">
            <span class="text-caption text-grey">
              Width
            </span>

            <span class="text-caption font-weight-bold">
              {{ canvasWidth }} px
            </span>
          </div>

          <div class="d-flex justify-space-between mb-3">
            <span class="text-caption text-grey">
              Height
            </span>

            <span class="text-caption font-weight-bold">
              {{ canvasHeight }} px
            </span>
          </div>

          <div class="d-flex justify-space-between">
            <span class="text-caption text-grey">
              Template
            </span>

            <span class="text-caption font-weight-bold text-right">
              {{ currentTemplateName }}
            </span>
          </div>

        </div>

      </aside>

    </div>

  </div>
</template>

<style scoped>
.editor-page {
  min-height: 100vh;
  background: #F5F4F9;
  color: #29243A;
}

.editor-topbar {
  min-height: 76px;
  background: #FFFFFF;
  border-bottom: 1px solid #ECE8F3;
  padding: 12px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
}

.editor-brand-icon {
  width: 39px;
  height: 39px;
  border-radius: 11px;
  background: #7655D8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-brand-title {
  font-size: 14px;
}

.editor-title-input {
  width: 250px;
  max-width: 100%;
}

.editor-workspace {
  min-height: calc(100vh - 76px);
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) 280px;
}

.left-toolbar {
  background: #FFFFFF;
  border-right: 1px solid #ECE8F3;
  padding: 18px 8px;
}

.tool-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.tool-button {
  width: 100%;
  min-height: 65px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #625B70;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.tool-button:hover:not(:disabled) {
  color: #7655D8;
  background: #F2EDFF;
}

.tool-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.tool-delete:hover:not(:disabled) {
  color: #D04444;
  background: #FFF0F0;
}

.canvas-workspace {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.canvas-heading {
  min-height: 65px;
  padding: 12px 22px;
  background: #FFFFFF;
  border-bottom: 1px solid #ECE8F3;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.canvas-stage {
  min-height: 540px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 35px;
  background-color: #F0EFF4;
  background-image: radial-gradient(#D9D5E1 1px, transparent 1px);
  background-size: 18px 18px;
  overflow: hidden;
}

.canvas-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.canvas-scroll {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.canvas-paper {
  flex: 0 0 auto;
  width: 600px;
  height: 600px;
  background: white;
  box-shadow: 0 8px 35px rgba(38, 28, 64, 0.16);
}

.canvas-paper :deep(.canvas-container) {
  display: block;
}

.canvas-bottom-bar {
  min-height: 55px;
  background: #FFFFFF;
  border-top: 1px solid #ECE8F3;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.zoom-controls {
  width: 210px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-slider {
  flex: 1;
}

.properties-panel {
  background: #FFFFFF;
  border-left: 1px solid #ECE8F3;
}

.properties-heading {
  min-height: 65px;
  display: flex;
  align-items: center;
  padding: 0 18px;
}

.property-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #625B70;
  margin-bottom: 9px;
}

.color-picker {
  width: 43px;
  height: 39px;
  padding: 3px;
  border: 1px solid #E4DFEC;
  border-radius: 9px;
  background: white;
  cursor: pointer;
}

@media (max-width: 1050px) {
  .editor-workspace {
    grid-template-columns: 78px minmax(0, 1fr);
  }

  .properties-panel {
    grid-column: 1 / -1;
    border-left: 0;
    border-top: 1px solid #ECE8F3;
  }

  .properties-panel > .pa-4 {
    display: block;
  }
}

@media (max-width: 650px) {
  .editor-topbar {
    padding: 12px;
  }

  .editor-title-input {
    order: 3;
    width: 100%;
  }

  .save-status {
    display: none;
  }

  .editor-workspace {
    grid-template-columns: 65px minmax(0, 1fr);
  }

  .left-toolbar {
    padding: 12px 5px;
  }

  .tool-button {
    min-height: 58px;
    font-size: 9px;
  }

  .canvas-stage {
    min-height: 400px;
    padding: 12px;
  }

  .canvas-scroll {
    justify-content: flex-start;
  }

  .canvas-bottom-bar {
    flex-wrap: wrap;
  }

  .zoom-controls {
    width: 100%;
  }
}
</style>
