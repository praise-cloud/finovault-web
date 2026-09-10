'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationBellProps {
  unreadCount: number;
  isOpen: boolean;
  onToggle: () => void;
  bellRef?: React.RefObject<HTMLButtonElement | null>;
}

export function NotificationBell({ unreadCount, isOpen, onToggle, bellRef }: NotificationBellProps) {
  const { t } = useTranslation();
  const [popKey, setPopKey] = useState(0);
  const prevCount = useRef(unreadCount);

  useEffect(() => {
    if (unreadCount !== prevCount.current) {
      prevCount.current = unreadCount;
      setPopKey((k) => k + 1);
    }
  }, [unreadCount]);

  const label =
    unreadCount > 0
      ? t('notifications.bellLabelUnread', { count: unreadCount })
      : t('notifications.bellLabel');

  return (
    <button
      ref={bellRef}
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-expanded={isOpen}
      aria-haspopup="true"
      className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--fv-radius-control)] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] shadow-[var(--fv-shadow-hard-sm)] transition-all duration-[120ms] hover:-translate-y-0.5 hover:shadow-[var(--fv-shadow-hard)] active:translate-y-0.5 active:shadow-none"
    >
      <Bell size={20} strokeWidth={1.8} className="text-[var(--fv-text)]" />
      {unreadCount > 0 && (
        <span
          key={popKey}
          className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-[var(--fv-error)] px-1 text-[11px] font-bold leading-[18px] text-white [animation:badge-pop_120ms_ease-out]"
          style={{ minWidth: unreadCount >= 100 ? 26 : unreadCount >= 10 ? 22 : 18 }}
        >
          {unreadCount >= 100 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
