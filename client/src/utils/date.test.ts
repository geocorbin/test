import { describe, expect, it } from 'vitest'
import { formatDate, formatCreatedDate } from './date'

function expectedFormat(iso: string): string {
  const date = new Date(iso)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear() % 100}`
}

describe('formatDate', () => {
  it('formats a date as M/D/YY', () => {
    const iso = '2025-02-13T12:00:00.000Z'
    expect(formatDate(iso)).toBe(expectedFormat(iso))
  })

  it('does not zero-pad single digit months or days', () => {
    const iso = '2025-01-05T12:00:00.000Z'
    expect(formatDate(iso)).toBe(expectedFormat(iso))
  })
})

describe('formatCreatedDate', () => {
  it('prefixes the formatted date with "Created on "', () => {
    const iso = '2025-02-13T12:00:00.000Z'
    expect(formatCreatedDate(iso)).toBe(`Created on ${expectedFormat(iso)}`)
  })
})
