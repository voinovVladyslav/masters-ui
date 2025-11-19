import type { AxiosResponse } from 'axios'

type Extra = {
    fields?: {
        [key: string]: string[]
    }
}
type ErrorData = {
    message: string
    extra: Extra
}
type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'
type ApiRequest = {
    method: RequestMethod
    url: string
    data?: object | null
    params?: object | null
    headers?: object | null
}
type ApiResponse = {
    response: AxiosResponse
    error: ErrorData | null
}
type SuccessResponse<T> = {
    result: T
    error: null
}
type ErrorResponse = {
    result: null
    error: ErrorData
}
type Response<T> = SuccessResponse<T> | ErrorResponse
type BackendResponse<T> = {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}
type PaginationOptions = {
    ordering: string
    page: number
    page_size: number
    search: string
}

const defaultPaginationOptions: PaginationOptions = {
    ordering: '-created_at',
    page: 1,
    page_size: 20,
    search: '',
}
export type { ApiRequest, ApiResponse, ErrorData, Response, BackendResponse, PaginationOptions }
export { defaultPaginationOptions }
