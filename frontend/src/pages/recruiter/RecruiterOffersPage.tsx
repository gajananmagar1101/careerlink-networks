import { Gift } from 'lucide-react';
import { useRecruiterOffers } from '../../hooks/useOffers';
import { formatDate } from '../../utils/format';
import { Card } from '../../components/ui/Card';

export function RecruiterOffersPage() {
  const { data: offers = [], isLoading } = useRecruiterOffers();

  const totalOffers = offers.length;
  const acceptedOffers = offers.filter(o => o.status === 'ACCEPTED').length;
  const pendingOffers = offers.filter(o => o.status === 'SENT').length;
  const acceptanceRate = totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2">
          <Gift className="h-6 w-6 text-emerald-600" />
          <h1 className="text-3xl font-extrabold text-ink">Extended Offers</h1>
        </div>
        <p className="mt-1 text-sm text-muted">
          Track official offers, acceptance rates, and candidate onboarding commitments
        </p>
      </div>

      {/* Metrics Row */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <span className="text-xs font-bold text-muted uppercase">Total Extended</span>
          <p className="mt-1 text-2xl font-black text-ink">{totalOffers}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-bold text-emerald-700 uppercase">Accepted Hires</span>
          <p className="mt-1 text-2xl font-black text-emerald-600">{acceptedOffers}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-bold text-amber-700 uppercase">Pending Decision</span>
          <p className="mt-1 text-2xl font-black text-amber-600">{pendingOffers}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-bold text-brand-700 uppercase">Acceptance Rate</span>
          <p className="mt-1 text-2xl font-black text-brand-700">{acceptanceRate}%</p>
        </Card>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white dark:bg-slate-900 dark:border-slate-700 p-12 text-center shadow-sm">
            <Gift className="h-12 w-12 text-emerald-300 stroke-1" />
            <h3 className="mt-3 text-lg font-bold text-ink">No offers extended yet</h3>
            <p className="mt-1 text-sm text-muted">
              Extend offers to qualified candidates directly from the Hiring Pipeline.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="transition hover:border-emerald-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-900 uppercase tracking-wider">
                        {offer.currency} {Number(offer.salary).toLocaleString()}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        offer.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : offer.status === 'DECLINED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {offer.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-ink">
                      {offer.job?.title || 'Position Offer'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted">
                      <span>Type: {offer.employmentType.replace('_', ' ')}</span>
                      {offer.joiningDate && (
                        <span>Joining Date: {formatDate(offer.joiningDate)}</span>
                      )}
                      <span>Extended: {formatDate(offer.createdAt)}</span>
                    </div>

                    {offer.message && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-xl">
                        "{offer.message}"
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
