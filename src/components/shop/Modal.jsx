import { useEffect, useRef } from 'react';

// Accessible modal built on the native <dialog> element (focus trapping,
// Escape to close, and background inertness come for free).
export default function Modal({ open, onClose, title, children, wide = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? 'modal--wide' : ''}`}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // Click on the backdrop (outside the panel) closes the dialog.
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
    >
      <div className="modal__panel">
        <div className="modal__head">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {open && children}
      </div>
    </dialog>
  );
}
