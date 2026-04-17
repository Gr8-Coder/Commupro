export function getTodayKey() {
  const today = new Date()
  return toDateKey(today)
}

export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function shiftDateKey(dateKey: string, offsetDays: number) {
  const date = new Date(`${dateKey}T12:00:00`)
  date.setDate(date.getDate() + offsetDays)
  return toDateKey(date)
}

export function formatLongDate(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function pickDailyItem<T>(items: T[], dateKey: string, salt: string) {
  const hash = `${dateKey}:${salt}`.split('').reduce((accumulator, character) => {
    return (accumulator * 31 + character.charCodeAt(0)) % 2147483647
  }, 7)

  return items[hash % items.length]
}
