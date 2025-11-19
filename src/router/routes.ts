import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/MainView.vue'),
        meta: {
            authRequired: true,
            adminRequired: false,
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: {
            authRequired: false,
            adminRequired: false,
        },
    },
    {
        path: '/:catchAll(.*)*',
        name: 'not-found',
        redirect: () => {
            return { name: 'home' }
        },
        meta: {
            authRequired: false,
            adminRequired: false,
        },
    },
]

export default routes
