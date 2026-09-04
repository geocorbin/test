interface ConfirmModalProps {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ title, description, confirmLabel, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        <p className="text-muted">{description}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Nevermind
          </button>
        </div>
      </div>
    </div>
  )
}
