export interface ResponseT<T> {
    data: PagingT<T> | T
    code: number
    message: string
    messageKey: string
}

export interface PagingT<T> {
    totalPage: number
    totalElements: number
    currentPage: number
    pageSize: number
    result: T[]
    additionalData: any
    empty: boolean
    first: boolean
    last: boolean
    total: number
}

