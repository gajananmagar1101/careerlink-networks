import { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Clock, Calendar, Gift, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications, useUnreadNotificationCount, useMarkNotificationRead } from '../hooks/useNotifications';
import { formatDate } from '../utils/format';
import type { NotificationItem, NotificationType } from '../types/domain';

export function NotificationBell() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: count = 0 } = useUnreadNotificationCount(Boolean(user));
  const { data: notifications = [], isLoading } = useNotifications(Boolean(user) && isOpen);
  const { markAsRead, markAllAsRead, isPending } = useMarkNotificationRead();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'APPLICATION_SUBMITTED':
      case 'APPLICATION_STATUS_CHANGED':
        return <FileText className="h-4 w-4 text-brand-600 dark:text-brand-400" />;
      case 'INTERVIEW_SCHEDULED':
      case 'INTERVIEW_RESCHEDULED':
      case 'INTERVIEW_CANCELLED':
        return <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'OFFER_SENT':
      case 'OFFER_ACCEPTED':
      case 'OFFER_DECLINED':
        return <Gift className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getNotificationLink = (n: NotificationItem) => {
    if (user.role === 'CANDIDATE') {
      if (n.type.includes('INTERVIEW')) return '/candidate/interviews';
      if (n.type.includes('OFFER')) return '/candidate/offers';
      return '/candidate/applications';
    } else {
      if (n.type.includes('INTERVIEW')) return '/recruiter/interviews';
      if (n.type.includes('OFFER')) return '/recruiter/offers';
      return '/recruiter/pipeline';
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink dark:text-white">Notifications</span>
              {count > 0 && (
                <span className="rounded-full bg-brand-50 dark:bg-brand-900/40 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
                  {count} new
                </span>
              )}
            </div>
            {count > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                disabled={isPending}
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200 transition"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-96 divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-muted dark:text-slate-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 stroke-1" />
                <p className="mt-2 text-sm font-medium text-ink dark:text-slate-200">No notifications</p>
                <p className="text-xs text-muted dark:text-slate-400">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group relative flex gap-3 p-3.5 transition ${
                    !n.read
                      ? 'bg-brand-50/40 dark:bg-brand-900/10 hover:bg-brand-50/70 dark:hover:bg-brand-900/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        to={getNotificationLink(n)}
                        onClick={() => {
                          if (!n.read) markAsRead(n.id);
                          setIsOpen(false);
                        }}
                        className="block font-semibold text-xs text-ink dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-400 truncate"
                      >
                        {n.title}
                      </Link>
                      {!n.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600 dark:bg-brand-400" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-muted dark:text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(n.createdAt)}</span>
                    </div>
                  </div>
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(n.id)}
                      title="Mark as read"
                      className="opacity-0 group-hover:opacity-100 transition self-center p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 dark:border-slate-800 p-2 text-center bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl">
            <Link
              to={user.role === 'CANDIDATE' ? '/candidate/notifications' : '/recruiter/notifications'}
              onClick={() => setIsOpen(false)}
              className="block text-xs font-semibold text-brand-700 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200 py-1"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
