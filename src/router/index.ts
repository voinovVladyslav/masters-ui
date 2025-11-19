import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes'
import { useAuthStore } from '@/stores/auth'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
})
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    const isAuthRequired = to.meta.authRequired
    const isAdminRequired = to.meta.adminRequired
    if (!isAuthRequired) {
        return next()
    }

    if (isAdminRequired && authStore.isAdmin) {
        return next()
    }

    if (isAuthRequired && authStore.isAuthenticated && !isAdminRequired) {
        return next()
    }

    if (isAuthRequired && !authStore.isAuthenticated) {
        const userLoaded = await authStore.loadUser()
        if (!userLoaded) {
            return next({ name: 'login' })
        }
        if (isAdminRequired && !authStore.isAdmin) {
            return next({ name: 'home' })
        }
        return next()
    }
    return next(from || { name: 'home' })
})

export default router
