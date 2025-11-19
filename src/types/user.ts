type Role = 'student' | 'teacher' | 'admin'
type User = {
    id: number
    email: string
    first_name: string
    last_name: string
    middle_name: string
    role: Role
    created_at: string
}

export type { Role, User }
