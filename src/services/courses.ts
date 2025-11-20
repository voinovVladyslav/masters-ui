import type { Response, BackendResponse } from '@/types/api'
import type { Course } from '@/types/course'
import { makeRequest } from './api'

const CoursesService = {
    getCourses: async (): Promise<Response<BackendResponse<Course>>> => {
        const { response, error } = await makeRequest({
            url: '/courses/',
            method: 'get',
        })
        if (error) {
            return {
                result: null,
                error: error,
            }
        }
        return {
            result: response.data as BackendResponse<Course>,
            error: null,
        }
    },
    getCourse: async (id: number): Promise<Response<Course>> => {
        const { response, error } = await makeRequest({
            url: `/courses/${id}/`,
            method: 'get',
        })
        if (error) {
            return {
                result: null,
                error: error,
            }
        }
        return {
            result: response.data as Course,
            error: null,
        }
    },
}

export { CoursesService }

