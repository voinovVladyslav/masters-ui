import type { Material } from './material'

type Theme = {
    id: number
    name: string
    description: string | null
    course: number // course ID
    order: number
    materials: Material[]
    created_at: string
}

export type { Theme }

