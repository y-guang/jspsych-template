export function generateUid(): string {
    const chars = 'aAbBcdDeEfFgGhHjkmnopqQrRstTuvwxyz23456789'
    const length = chars.length
    
    // uniqueness from datetime
    let date = ''
    let n = Date.now()
    while (n > 0) {
        date += chars[n % length]
        n = Math.floor(n / length)
    }
    date = date.split('').reverse().join('')

    // uniqueness from random
    for (let i = 0; i < 2; i++) {
        date += chars[Math.floor(Math.random() * length)]
    }

    return date
}