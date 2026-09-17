import { Building2, Check, ShieldCheck } from 'lucide-react';

const trackingStages = ['Applied', 'Under review', 'Shortlisted', 'Interview', 'Final decision'];

export function TrackingPreview() {
  return <div className="product-preview">
    <div className="flex items-center justify-between border-b border-line pb-5"><span className="text-sm font-semibold">Your next chapter</span><span className="preview-label">Product preview</span></div>
    <div className="mt-6 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700"><Building2 size={23} /></span><div><p className="font-semibold">Product Designer</p><p className="mt-1 text-xs text-muted">Example team · Remote</p></div></div>
    <div className="my-5 flex gap-2"><span className="preview-label">Full time</span><span className="preview-label">Design</span></div>
    <div className="rounded-lg bg-canvas p-5"><p className="text-xs font-semibold uppercase tracking-widest text-muted">Application journey</p><ol className="mt-5">{trackingStages.map((stage, i) => <li key={stage} className="flex gap-3"><div className="flex flex-col items-center"><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${i < 2 ? 'bg-brand-700 text-white' : 'border border-line bg-white text-muted'}`}>{i < 2 ? <Check size={13} /> : i + 1}</span>{i < 4 && <span className="my-1 h-4 w-px bg-line" />}</div><span className={`pt-0.5 text-sm ${i === 1 ? 'font-semibold text-brand-700' : 'text-muted'}`}>{stage}{i === 1 && <span className="ml-2 text-xs">· Current stage</span>}</span></li>)}</ol></div>
    <p className="mt-4 flex items-center gap-2 text-xs text-muted"><ShieldCheck size={15} /> Illustrative workflow, not a live application.</p>
  </div>;
}
