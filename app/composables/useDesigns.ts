import { openDB } from 'idb'

export interface PosterDesign {
  id: string
  title: string
  templateName: string
  canvasData: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

const DATABASE_NAME = 'poster-maker-database'
const STORE_NAME = 'designs'

async function getDatabase() {
  return openDB(DATABASE_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        })
      }
    },
  })
}

export function useDesigns() {
  async function saveDesign(design: PosterDesign) {
    const database = await getDatabase()
    await database.put(STORE_NAME, design)
  }

  async function getAllDesigns(): Promise<PosterDesign[]> {
    const database = await getDatabase()
    const designs = await database.getAll(STORE_NAME)

    return designs.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime(),
    )
  }

  async function getDesign(id: string) {
    const database = await getDatabase()
    return database.get(STORE_NAME, id)
  }

  async function deleteDesign(id: string) {
    const database = await getDatabase()
    await database.delete(STORE_NAME, id)
  }

  return {
    saveDesign,
    getAllDesigns,
    getDesign,
    deleteDesign,
  }
}