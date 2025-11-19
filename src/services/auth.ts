import type { AccessToken } from '@/types/auth'
import { makeRequest } from './api'
import type { Response } from '@/types/api'
import router from '@/router'
import { removeToken } from './token'

export const authService = {
    login: async (email: string, password: string): Promise<Response<AccessToken>> => {
        const { response, error } = await makeRequest({
            method: 'post',
            url: '/auth/token/',
            data: { email, password },
        })
        if (error) {
            return {
                result: null,
                error: error,
            }
        }
        return {
            result: response.data as AccessToken,
            error: error,
        }
    },
    logout: (): void => {
        removeToken()
        router.push({ name: 'login' })
    },
}
