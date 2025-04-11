export function generateLocalDatetimeFilenameSafeString(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0');
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    const tzOffsetMinutes = date.getTimezoneOffset();
    const tzSign = tzOffsetMinutes <= 0 ? 'p' : 'm';
    const tzHours = pad(Math.floor(Math.abs(tzOffsetMinutes) / 60));
    const tzMins = pad(Math.abs(tzOffsetMinutes) % 60);
    const tzString = `${tzSign}${tzHours}${tzMins}`;
  
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}_${tzString}`;
}

export function generateIsoDatetimeFilenameSafeString(date: Date): string {
    return date.toISOString()
        .replace(/:/g, '-')
        .replace('T', '_')
}