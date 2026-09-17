import { initials } from '../../utils/format';

export function Avatar({ name }: { name?: string }) {
  return <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-100 text-sm font-bold text-brand-700">{initials(name)}</div>;
}
