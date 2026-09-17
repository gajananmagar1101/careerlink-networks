import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);
  
  const visiblePages = pages.filter(p => 
    p === 0 || 
    p === totalPages - 1 || 
    Math.abs(p - page) <= 1
  );

  const getPageItems = () => {
    const items: (number | string)[] = [];
    let last = -1;
    for (const p of visiblePages) {
      if (last !== -1 && p - last > 1) {
        items.push('...');
      }
      items.push(p);
      last = p;
    }
    return items;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-6 pb-6" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="inline-flex h-9 w-9 items-center justify-center rounded border border-line bg-white text-muted hover:bg-canvas disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {getPageItems().map((p, i) => (
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={clsx(
              "inline-flex h-9 min-w-9 items-center justify-center rounded px-3 text-sm font-semibold transition-colors",
              page === p
                ? "bg-brand-600 text-white"
                : "border border-line bg-white text-muted hover:bg-brand-50 hover:text-brand-700"
            )}
            aria-current={page === p ? "page" : undefined}
          >
            {(p as number) + 1}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="inline-flex h-9 w-9 items-center justify-center rounded border border-line bg-white text-muted hover:bg-canvas disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
