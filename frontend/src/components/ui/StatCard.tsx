import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';

export function StatCard({ label, value, icon: Icon, hint }: { label: string; value: string | number; icon: LucideIcon; hint?: string }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
          {hint ? <p className="mt-2 text-xs font-medium text-brand-700">{hint}</p> : null}
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-md bg-brand-50 text-brand-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
