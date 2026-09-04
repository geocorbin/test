import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Header } from './Header'
import { renderWithProviders } from '../test/renderWithProviders'

describe('Header', () => {
  it('shows a Login link when logged out', () => {
    renderWithProviders(<Header />)
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login')
  })

  it('links the logo to the home page when logged out', () => {
    renderWithProviders(<Header />)
    expect(screen.getByRole('link', { name: /poonful/i })).toHaveAttribute('href', '/')
  })
})
