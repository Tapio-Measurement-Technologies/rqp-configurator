export function getTimezoneOffset(timezone: string): number {
  if (timezone === 'local') {
    return new Date().getTimezoneOffset() * 60000
  }
  if (timezone === 'UTC') {
    return 0
  }
  const match = timezone.match(/UTC([+-])(\d+)/)
  if (match) {
    const [, sign, hours] = match
    return (sign === '-' ? 1 : -1) * parseInt(hours) * 3600000
  }
  return 0
}

export function getCurrentTimestamp(timezone: string): number {
  const offset = getTimezoneOffset(timezone)
  return Math.floor((Date.now() - offset) / 1000)
}