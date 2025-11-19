import type { Response } from '@/types/api'
import type { User } from '@/types/user'
import { makeRequest } from './api'

const ProfileService = {
    getSelf: async (): Promise<Response<User>> => {
        const { response, error } = await makeRequest({
            url: '/users/self/',
            method: 'get',
        })
        if (error) {
            return {
                result: null,
                error: error,
            }
        }
        return {
            result: response.data as User,
            error: null,
        }
    },
}

export { ProfileService }
