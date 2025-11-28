import type { AxiosResponse } from 'axios'
import type { ErrorData, ApiRequest, ApiResponse } from '@/types/api'
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
})

function checkError(response: AxiosResponse): ErrorData | null {
    if (response.status < 400) {
        return null
    }
    return response.data as ErrorData
}

const makeRequest = async ({
    method,
    url,
    data = null,
    params = null,
    headers = null,
}: ApiRequest): Promise<ApiResponse> => {
    headers = headers || {}
    const response = await api.request({
        method: method,
        url: url,
        data: data,
        params: params,
        headers: { ...headers },
        validateStatus: (status) => true, // do not raise eror on 4xx or 5xx
    })
    return { response: response, error: checkError(response) }
}

const authenticateApi = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Token ${token}`
}
const unauthenticateApi = () => {
    delete api.defaults.headers.common['Authorization']
}
export { makeRequest, authenticateApi, unauthenticateApi }
