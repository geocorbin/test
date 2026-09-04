import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmModal } from './ConfirmModal'

describe('ConfirmModal', () => {
  it('renders the title and description', () => {
    render(
      <ConfirmModal
        title="Delete recipe?"
        description="This cannot be undone."
        confirmLabel="Yes, Delete Recipe"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByText('Delete recipe?')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('calls onConfirm and onCancel from their buttons', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmModal
        title="Delete recipe?"
        description="This cannot be undone."
        confirmLabel="Yes, Delete Recipe"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Yes, Delete Recipe' }))
    expect(onConfirm).toHaveBeenCalledOnce()
    await userEvent.click(screen.getByRole('button', { name: 'Nevermind' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('does not call onCancel when clicking inside the dialog', async () => {
    const onCancel = vi.fn()
    render(
      <ConfirmModal
        title="Delete recipe?"
        description="This cannot be undone."
        confirmLabel="Yes, Delete Recipe"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    )
    await userEvent.click(screen.getByText('Delete recipe?'))
    expect(onCancel).not.toHaveBeenCalled()
  })
})
