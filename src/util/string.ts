function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function assignSnakeKeys(target: Record<string, any>, source: Record<string, any>) {
    for (const key in source) {
        const snakeKey = camelToSnake(key);
        target[snakeKey] = source[key];
    }
}