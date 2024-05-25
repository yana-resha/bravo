export type ServerResponseType<T> = {
    data?: T,
    error?: string,
    query?: string,
    log?:string,
}
