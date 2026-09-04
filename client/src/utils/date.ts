export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear() % 100
  return `${month}/${day}/${year}`
}

export function formatCreatedDate(dateString: string): string {
  return `Created on ${formatDate(dateString)}`
}
