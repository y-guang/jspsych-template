const uidCharSet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabdefghrt'

/**
 * Generate a unique id. Assumes that the function is called at most once per millisecond.
 * @returns a unique id string.
 */
export function generateUid(): string {
    console.log(uidCharSet)
    const length = uidCharSet.length

    // uniqueness from datetime
    let date = ''
    let n = Date.now()
    while (n > 0) {
        date += uidCharSet[n % length]
        n = Math.floor(n / length)
    }
    date = date.split('').reverse().join('')

    // uniqueness from random
    for (let i = 0; i < 2; i++) {
        date += uidCharSet[Math.floor(Math.random() * length)]
    }

    return date
}


/**
 * Convert a uid string to a display format. The display uid is formatted as 4 characters per group, separated by dashes.
 * @param uid - The uid to convert.
 * @returns The display uid.
 */
export function toDisplayUid(uid: string): string {
    const chars = Array.from(uid) // Unicode-safe split
    const chunks = []
    
    for (let i = 0; i < chars.length; i += 4) {
        chunks.push(chars.slice(i, i + 4).join(''))
    }

    return chunks.join('-')
}
