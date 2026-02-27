import { openDB, DBSchema } from 'idb'

export interface AnalysisRecord {
  id?: number
  date: string
  image: string // thumbnail data URL
  result: any
  createdAt: number
}

interface NoddakDB extends DBSchema {
  analyses: {
    key: number
    value: AnalysisRecord
    indexes: { 'by-date': string }
  }
}

const DB_NAME = 'noddak-db'
const DB_VERSION = 1

function getDB() {
  return openDB<NoddakDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore('analyses', { keyPath: 'id', autoIncrement: true })
      store.createIndex('by-date', 'date')
    },
  })
}

export async function saveAnalysis(record: Omit<AnalysisRecord, 'id'>): Promise<number> {
  const db = await getDB()
  return db.add('analyses', record as AnalysisRecord)
}

export async function getAllAnalyses(): Promise<AnalysisRecord[]> {
  const db = await getDB()
  const all = await db.getAll('analyses')
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

export async function getAnalysis(id: number): Promise<AnalysisRecord | undefined> {
  const db = await getDB()
  return db.get('analyses', id)
}

export async function deleteAnalysis(id: number): Promise<void> {
  const db = await getDB()
  await db.delete('analyses', id)
}

export function createThumbnail(dataUrl: string, maxWidth = 200): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ratio = maxWidth / img.width
      canvas.width = maxWidth
      canvas.height = img.height * ratio
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.6))
    }
    img.src = dataUrl
  })
}
