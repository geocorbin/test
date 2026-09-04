import { describe, expect, it } from 'vitest'
import { parseTags } from './tags'

describe('parseTags', () => {
  it('splits a comma-separated string into trimmed tags', () => {
    expect(parseTags('Vegan, Dinner , Easy')).toEqual(['Vegan', 'Dinner', 'Easy'])
  })

  it('drops empty segments', () => {
    expect(parseTags('Vegan,, Dinner,')).toEqual(['Vegan', 'Dinner'])
  })

  it('de-duplicates repeated tags', () => {
    expect(parseTags('Vegan, vegan, Vegan')).toEqual(['Vegan', 'vegan'])
  })

  it('returns an empty array for blank input', () => {
    expect(parseTags('   ')).toEqual([])
  })
})
