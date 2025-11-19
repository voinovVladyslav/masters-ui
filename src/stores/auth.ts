import { authenticateApi } from '@/services/api'
import { getToken } from '@/services/token'
import { ProfileService } from '@/services/users'
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
        const token = getToken()
        if (!token) {
            return false
        }
        authenticateApi(token)
        const response = await ProfileService.getSelf()
        user.value = response.result
        return isAuthenticated.value
    }
    return { user, isAuthenticated, isAdmin, loadUser }
})
