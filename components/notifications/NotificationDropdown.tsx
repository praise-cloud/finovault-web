'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AppNotification } from '@/types';
import { NotificationItem } from './NotificationItem';

interface NotificationDropdownProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
  bellRef: React.RefObject<HTMLButtonElement | null>;
}

export function NotificationDropdown({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClose,
  bellRef,
}: NotificationDropdownProps) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const markAllRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number }>({ top: 56, right: 16 });

  // Position from bell's bounding rect — spec §3.1
  useEffect(() => {
    const measure = () => {
      const bell = bellRef.current;
      if (!bell) return;
      const rect = bell.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [bellRef]);

  // Focus management: move focus into dropdown on mount
  useEffect(() => {
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      'button, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }, []);

  // Esc to close + focus return
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        bellRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, bellRef]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, bellRef]);

  const isEmpty = notifications.length === 0;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={t('notifications.title')}
      className="fixed z-50 w-[calc(100vw-32px)] overflow-hidden rounded-[var(--fv-radius-card)] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] shadow-[var(--fv-shadow-hard)] sm:w-[384px]"
      style={{
        top: pos.top,
        right: pos.right,
        maxHeight: 'calc(100vh - 120px)',
      }}
    >
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-[var(--fv-border-subtle)] px-4">
        <span className="text-[15px] font-bold text-[var(--fv-text)]">
          {t('notifications.title')}
        </span>
        {!isEmpty && (
          <button
            ref={markAllRef}
            type="button"
            onClick={onMarkAllRead}
            className="text-[13px] font-medium text-[var(--fv-primary)] hover:underline"
          >
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      {/* List or empty state */}
      {isEmpty ? (
        <div className="flex flex-col items-center px-4 py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)]">
            <CircleCheck size={24} strokeWidth={1.8} className="text-[var(--fv-text)]" />
          </div>
          <p className="text-[15px] font-semibold text-[var(--fv-text)]">
            {t('notifications.emptyTitle')}
          </p>
          <p className="mt-1 text-[15px] text-[var(--fv-text-secondary)]">
            {t('notifications.emptyBody')}
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 176px)' }}>
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
}
