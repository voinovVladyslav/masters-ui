import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const isAuthenticated = computed<boolean>(() => user.value !== null)
    const isAdmin = computed<boolean>(() => {
        return user.value?.role === 'admin'
    })
    const loadUser = async (): Promise<boolean> => {
        return false
    }
    return { user, isAuthenticated, isAdmin, loadUser }
})
