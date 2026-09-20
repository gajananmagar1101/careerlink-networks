import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs({ items }: { items: Array<{ label: string; to?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted dark:text-slate-400">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
          {item.to ? (
            <Link to={item.to} className="hover:text-ink dark:hover:text-white hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-ink dark:text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
