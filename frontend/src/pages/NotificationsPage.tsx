import { useState } from 'react';
import { Bell, CheckCheck, Clock, Calendar, Gift, FileText, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications, useMarkNotificationRead } from '../hooks/useNotifications';
import { formatDate } from '../utils/format';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { NotificationItem, NotificationType } from '../types/domain';

export function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const { data: notifications = [], isLoading } = useNotifications(Boolean(user));
  const { markAsRead, markAllAsRead, isPending } = useMarkNotificationRead();

  const filtered = notifications.filter((n) => (filter === 'UNREAD' ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'APPLICATION_SUBMITTED':
      case 'APPLICATION_STATUS_CHANGED':
        return <FileText className="h-5 w-5 text-brand-600" />;
      case 'INTERVIEW_SCHEDULED':
      case 'INTERVIEW_RESCHEDULED':
      case 'INTERVIEW_CANCELLED':
        return <Calendar className="h-5 w-5 text-purple-600" />;
      case 'OFFER_SENT':
      case 'OFFER_ACCEPTED':
      case 'OFFER_DECLINED':
        return <Gift className="h-5 w-5 text-emerald-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const getLink = (n: NotificationItem) => {
    if (user?.role === 'CANDIDATE') {
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-extrabold text-ink">Notifications</h1>
          </div>
          <p className="mt-1 text-sm text-muted">
            Stay updated with real-time alerts about your applications, interviews, and offers
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => markAllAsRead()}
            disabled={isPending}
            className="gap-2 self-start"
          >
            <CheckCheck className="h-4 w-4" /> Mark All as Read
          </Button>
        )}
      </div>

      <div className="mt-6 flex gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
            filter === 'ALL' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('UNREAD')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
            filter === 'UNREAD' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white dark:bg-slate-900 dark:border-slate-700 p-12 text-center shadow-sm">
            <Bell className="h-10 w-10 text-slate-300 stroke-1" />
            <h3 className="mt-3 text-lg font-bold text-ink">No notifications</h3>
            <p className="mt-1 text-xs text-muted">
              {filter === 'UNREAD' ? "You don't have any unread notifications." : 'No notifications found.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <Card
                key={n.id}
                className={`flex items-start gap-4 p-4 transition hover:shadow-md ${
                  !n.read ? 'border-brand-300 bg-brand-50/30 dark:bg-brand-900/20 dark:border-brand-700' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={getLink(n)}
                      onClick={() => {
                        if (!n.read) markAsRead(n.id);
                      }}
                      className="text-sm font-bold text-ink hover:text-brand-700 transition truncate"
                    >
                      {n.title}
                    </Link>
                    <div className="flex items-center gap-1 text-[11px] text-muted shrink-0">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(n.createdAt)}</span>
                    </div>
                  </div>

                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <Link
                      to={getLink(n)}
                      onClick={() => {
                        if (!n.read) markAsRead(n.id);
                      }}
                      className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                    >
                      View Details →
                    </Link>

                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(n.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-brand-700"
                      >
                        <Check className="h-3 w-3" /> Mark as read
                      </button>
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
