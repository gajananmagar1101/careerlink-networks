import { Gift, CheckCircle2, XCircle } from 'lucide-react';
import { useCandidateOffers, useAcceptOffer, useDeclineOffer } from '../../hooks/useOffers';
import { formatDate } from '../../utils/format';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export function CandidateOffersPage() {
  const { notify } = useToast();
  const { data: offers = [], isLoading } = useCandidateOffers();
  const acceptMutation = useAcceptOffer();
  const declineMutation = useDeclineOffer();

  const handleAccept = async (offerId: string) => {
    try {
      await acceptMutation.mutateAsync(offerId);
      notify('Congratulations! You accepted the job offer!', 'success');
    } catch {
      notify('Failed to accept offer. Please try again.', 'error');
    }
  };

  const handleDecline = async (offerId: string) => {
    if (!confirm('Are you sure you want to decline this job offer?')) return;
    try {
      await declineMutation.mutateAsync(offerId);
      notify('You have declined the job offer.', 'info');
    } catch {
      notify('Failed to decline offer. Please try again.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2">
          <Gift className="h-6 w-6 text-emerald-600" />
          <h1 className="text-3xl font-extrabold text-ink">Job Offers</h1>
        </div>
        <p className="mt-1 text-sm text-muted">
          Review official employment offers extended by companies and manage your career decisions
        </p>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white dark:bg-slate-900 dark:border-slate-700 p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Gift className="h-8 w-8 stroke-1" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-ink">No job offers received yet</h3>
            <p className="mt-1 max-w-md text-sm text-muted">
              Keep applying and interviewing! Once a recruiter decides to extend an official job offer, all compensation details and acceptance options will be listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {offers.map((offer) => {
              const isPending = offer.status === 'SENT';
              const isAccepted = offer.status === 'ACCEPTED';
              const isDeclined = offer.status === 'DECLINED';

              return (
                <Card
                  key={offer.id}
                  className={`overflow-hidden border-2 transition ${
                    isAccepted
                      ? 'border-emerald-500/50 bg-emerald-50/10'
                      : isPending
                      ? 'border-brand-500/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="rounded-md bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-900 uppercase tracking-wider">
                          Official Offer
                        </span>
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Accepted & Hired
                          </span>
                        )}
                        {isDeclined && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-700">
                            <XCircle className="h-3.5 w-3.5" /> Declined
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800 animate-pulse">
                            Action Required
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-black text-ink">
                        {offer.job?.title || 'Employment Offer'}
                      </h2>

                      <p className="text-base font-semibold text-brand-700">
                        {offer.job?.companyName || 'Hiring Organization'}
                      </p>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 pt-2">
                        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Compensation</span>
                          <p className="text-lg font-extrabold text-ink mt-0.5">
                            {offer.currency} {Number(offer.salary).toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Employment</span>
                          <p className="text-sm font-bold text-ink mt-1">
                            {offer.employmentType.replace('_', ' ')}
                          </p>
                        </div>
                        {offer.joiningDate && (
                          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Joining Date</span>
                            <p className="text-sm font-bold text-ink mt-1">
                              {formatDate(offer.joiningDate)}
                            </p>
                          </div>
                        )}
                      </div>

                      {offer.message && (
                        <div className="rounded-xl bg-brand-50/60 p-4 text-xs text-brand-950 border border-brand-100 italic leading-relaxed">
                          "{offer.message}"
                        </div>
                      )}
                    </div>

                    {isPending && (
                      <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col shrink-0">
                        <Button
                          type="button"
                          onClick={() => handleAccept(offer.id)}
                          disabled={acceptMutation.isPending}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-lg shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Accept Offer
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleDecline(offer.id)}
                          disabled={declineMutation.isPending}
                          className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold gap-2"
                        >
                          <XCircle className="h-4 w-4" /> Decline Offer
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
