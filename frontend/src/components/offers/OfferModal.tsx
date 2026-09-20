import { useState } from 'react';
import { X, Gift } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCreateOffer } from '../../hooks/useOffers';
import { useToast } from '../../context/ToastContext';

interface OfferModalProps {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const labelClass = 'block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1';
const inputClass = 'w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-500 dark:focus:border-brand-400 focus:outline-none transition';

export function OfferModal({
  applicationId,
  candidateName,
  jobTitle,
  isOpen,
  onClose
}: OfferModalProps) {
  const { notify } = useToast();
  const createOfferMutation = useCreateOffer();

  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [joiningDate, setJoiningDate] = useState('');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salary || Number(salary) <= 0) {
      notify('Please enter a valid salary amount', 'error');
      return;
    }

    try {
      await createOfferMutation.mutateAsync({
        applicationId,
        salary: Number(salary),
        currency,
        joiningDate: joiningDate || undefined,
        employmentType,
        message: message || undefined
      });
      notify('Job offer extended successfully to candidate!', 'success');
      onClose();
    } catch {
      notify('Failed to create offer. Please verify parameters.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-transparent dark:border-slate-700 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Extend Job Offer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                To <span className="font-semibold text-slate-700 dark:text-slate-200">{candidateName}</span> • {jobTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Salary + Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>Annual Salary / CTC</label>
              <input
                type="number"
                required
                placeholder="e.g. 120000"
                min={1}
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={inputClass}
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
          </div>

          {/* Date + Employment Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Proposed Joining Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className={inputClass}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className={labelClass}>Personalized Offer Letter / Welcome Message</label>
            <textarea
              rows={4}
              placeholder="We were very impressed by your background and are delighted to extend this offer to join our team..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createOfferMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
            >
              {createOfferMutation.isPending ? 'Extending Offer...' : 'Send Official Offer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
