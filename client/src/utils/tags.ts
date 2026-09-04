export function parseTags(text: string): string[] {
  return Array.from(
    new Set(
      text
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  )
}
