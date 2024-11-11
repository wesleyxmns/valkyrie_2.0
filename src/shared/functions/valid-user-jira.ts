export function validateUserJira(user: string) {
    const regex = /^[a-zA-Z]+\.[a-zA-Z]+$/
    return regex.test(user)
}