'use client';

import React from 'react';
import { ArrowUpRight, Receipt, TriangleAlert, Award, Bell } from 'lucide-react';
import type { AppNotification, NotificationType } from '@/types';
import { relativeTime } from '@/lib/notifications/useNotifications';
import { useTranslation } from 'react-i18next';

const TYPE_CONFIG: Record<NotificationType, { icon: typeof Bell; bg: string }> = {
  transfer: { icon: ArrowUpRight, bg: 'bg-[var(--fv-success-bg)]' },
  bill: { icon: Receipt, bg: 'bg-[var(--fv-warning-bg)]' },
  security: { icon: TriangleAlert, bg: 'bg-[var(--fv-warning-bg)]' },
  goal: { icon: Award, bg: 'bg-[var(--fv-wash)]' },
  system: { icon: Bell, bg: 'bg-[var(--fv-wash)]' },
};

interface NotificationItemProps {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const { i18n } = useTranslation();
  const isUnread = !notification.readAt;
  const config = TYPE_CONFIG[notification.type];
  const Icon = config.icon;

  const handleClick = () => {
    if (!isUnread) return; // already read, no-op
    void onMarkRead(notification.id);
    // ponytail: navigation to link deferred — link exists on notification but navigation wiring needs router context in dropdown parent
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--fv-border-subtle)] ${
        isUnread ? 'bg-[var(--fv-wash)]' : ''
      }`}
      style={{ minHeight: 48 }}
    >
      {/* Unread dot OR spacer */}
      <div className="flex w-3 shrink-0 items-start pt-1.5">
        {isUnread && (
          <span className="block h-2 w-2 rounded-full bg-[var(--fv-primary)]" aria-hidden="true" />
        )}
      </div>

      {/* Type icon */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--fv-border-subtle)] ${config.bg}`}
      >
        <Icon size={16} strokeWidth={1.8} className="text-[var(--fv-text)]" />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-[var(--fv-text)]">
          {notification.title}
        </p>
        <p className="line-clamp-2 text-[13px] text-[var(--fv-text-secondary)]">
          {notification.body}
        </p>
        <p className="mt-0.5 text-[12px] font-medium text-[var(--fv-text-secondary)]">
          {relativeTime(notification.createdAt, i18n.language)}
        </p>
      </div>
    </button>
  );
}
