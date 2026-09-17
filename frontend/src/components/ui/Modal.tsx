import { clsx } from 'clsx';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-ink/40 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close dialog" onClick={onClose} />
      <div className="relative mx-auto max-h-[calc(100vh-3rem)] max-w-2xl overflow-auto rounded-lg bg-white shadow-soft">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <h2 id="dialog-title" className="text-lg font-bold text-ink">
            {title}
          </h2>
          <button type="button" className="rounded p-2 hover:bg-slate-100" onClick={onClose} aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  tone = 'danger',
  onCancel,
  onConfirm
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: 'danger' | 'primary';
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm leading-6 text-muted">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function Drawer({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={clsx('fixed inset-0 z-40', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}>
      <button
        type="button"
        className={clsx('absolute inset-0 bg-ink/40 transition', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
        aria-label="Close panel"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={clsx(
          'absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-soft transition-transform duration-200',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="drawer-title" className="text-lg font-bold">
            {title}
          </h2>
          <button type="button" className="rounded p-2 hover:bg-slate-100" onClick={onClose} aria-label="Close panel">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
