import type { Theme } from './theme'
import type { User } from './user'

type Course = {
    id: number
    name: string
    owner: User
    students: User[]
    themes: Theme[]
    created_at?: string
}

export type { Course }

