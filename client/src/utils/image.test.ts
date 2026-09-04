import { describe, expect, it } from 'vitest'
import { readImageFile } from './image'

describe('readImageFile', () => {
  it('resolves with a base64 data URL for the given file', async () => {
    const file = new File(['hello'], 'photo.png', { type: 'image/png' })
    const result = await readImageFile(file)
    expect(result).toMatch(/^data:image\/png;base64,/)
  })
})
