const getToken = (): string | null => {
    const token = localStorage.getItem('token')
    return token
}

const setToken = (token: string): void => {
    localStorage.setItem('token', token)
}

const removeToken = (): void => {
    localStorage.removeItem('token')
}

export { getToken, setToken, removeToken }
