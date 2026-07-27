import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  closeLabel?: string;
  children: ReactNode;
}

export function Modal({ open, title, onClose, closeLabel = 'Close', children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      onClose={onClose}
      onCancel={onClose}
    >
      <div className="modal-header">
        <span className="modal-title">{title}</span>
        <button type="button" className="modal-close" onClick={onClose}>
          {closeLabel}
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
