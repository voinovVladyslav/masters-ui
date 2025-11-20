import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        redirect: () => {
            return { name: 'courses' }
        },
        meta: {
            authRequired: true,
            adminRequired: false,
        },
    },
    {
        path: '/courses',
        name: 'courses',
        component: () => import('@/views/CoursesView.vue'),
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
            return { name: 'courses' }
        },
        meta: {
            authRequired: false,
            adminRequired: false,
        },
    },
]

export default routes
