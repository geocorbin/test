import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Layout } from './Layout'
import { renderWithProviders } from '../test/renderWithProviders'

describe('Layout', () => {
  it('renders the header and the page content', () => {
    renderWithProviders(
      <Layout>
        <p>Page content</p>
      </Layout>,
    )
    expect(screen.getByRole('link', { name: /poonful/i })).toBeInTheDocument()
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })
})
