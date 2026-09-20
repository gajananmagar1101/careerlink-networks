import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

type ToastTone = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = crypto.randomUUID();
      setToasts((items) => [...items, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = toast.tone === 'success' ? CheckCircle2 : toast.tone === 'error' ? XCircle : Info;
          return (
            <div
              key={toast.id}
              className={clsx(
                'animate-[toast-in_.18s_ease-out] rounded-md border bg-white dark:bg-slate-900 p-4 shadow-soft',
                toast.tone === 'success' && 'border-brand-100 dark:border-brand-800',
                toast.tone === 'error' && 'border-red-200 dark:border-red-800',
                toast.tone === 'info' && 'border-slate-200 dark:border-slate-700'
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={clsx('mt-0.5 h-5 w-5 shrink-0', toast.tone === 'error' ? 'text-red-600 dark:text-red-400' : 'text-brand-600 dark:text-brand-400')} />
                <p className="flex-1 text-sm font-medium text-ink dark:text-slate-100">{toast.message}</p>
                <button type="button" className="rounded p-1 text-muted dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
