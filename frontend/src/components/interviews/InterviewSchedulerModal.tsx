import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useScheduleInterview } from '../../hooks/useInterviews';
import { useToast } from '../../context/ToastContext';

interface InterviewSchedulerModalProps {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const labelClass = 'block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1';
const inputClass = 'w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-500 dark:focus:border-brand-400 focus:outline-none transition';

export function InterviewSchedulerModal({
  applicationId,
  candidateName,
  jobTitle,
  isOpen,
  onClose
}: InterviewSchedulerModalProps) {
  const { notify } = useToast();
  const scheduleMutation = useScheduleInterview();

  const [interviewType, setInterviewType] = useState('TECHNICAL');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [mode, setMode] = useState('REMOTE');
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      notify('Please select a date for the interview', 'error');
      return;
    }

    try {
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
      await scheduleMutation.mutateAsync({
        applicationId,
        interviewType,
        scheduledAt,
        durationMinutes,
        mode,
        meetingLink: mode === 'REMOTE' ? (meetingLink || 'https://meet.google.com/new') : undefined,
        location: mode === 'ONSITE' ? location : undefined,
        notes
      });
      notify('Interview scheduled successfully and invitation sent!', 'success');
      onClose();
    } catch {
      notify('Failed to schedule interview. Please check details.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-transparent dark:border-slate-700 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Interview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For <span className="font-semibold text-slate-700 dark:text-slate-200">{candidateName}</span> • {jobTitle}
            </p>
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
          {/* Interview Type */}
          <div>
            <label className={labelClass}>Interview Type</label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className={inputClass}
            >
              <option value="TECHNICAL">Technical Interview</option>
              <option value="HR">HR / Culture Screen</option>
              <option value="SYSTEM_DESIGN">System Design Round</option>
              <option value="BEHAVIORAL">Behavioral Round</option>
              <option value="FINAL">Final Leadership Round</option>
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                required
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Duration + Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Duration</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className={inputClass}
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className={inputClass}
              >
                <option value="REMOTE">Remote Video Call</option>
                <option value="ONSITE">Onsite Office</option>
                <option value="PHONE">Phone Call</option>
              </select>
            </div>
          </div>

          {/* Meeting link or location */}
          {mode === 'REMOTE' ? (
            <div>
              <label className={labelClass}>Meeting Link (Google Meet, Zoom, Teams)</label>
              <input
                type="url"
                placeholder="https://meet.google.com/xyz-abcd-efg"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className={inputClass}
              />
            </div>
          ) : (
            <div>
              <label className={labelClass}>Location / Address</label>
              <input
                type="text"
                placeholder="Office Floor 4, Meeting Room B"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes & Instructions for Candidate</label>
            <textarea
              rows={3}
              placeholder="Please have your resume and code samples ready..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={scheduleMutation.isPending}>
              {scheduleMutation.isPending ? 'Scheduling...' : 'Send Interview Invite'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
