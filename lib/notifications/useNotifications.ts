'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { moneyApi } from '@/lib/api/money';
import { USE_REAL_BACKEND } from '@/lib/api/client';
import { simulateIncomingNotification } from '@/lib/api/mock/db';
import { useAuthStore } from '@/stores/auth-store';
import type { AppNotification } from '@/types';

const POLL_INTERVAL_MS = 15_000;
const MOCK_TIMER_MIN_MS = 15_000;
const MOCK_TIMER_MAX_MS = 30_000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const userId = useAuthStore((s) => s.user?.id);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await moneyApi.getNotifications();
      setNotifications(data);
    } catch {
      // ponytail: swallow poll errors silently
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    await moneyApi.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
  }, []);

  const markAllRead = useCallback(async () => {
    await moneyApi.markAllNotificationsRead();
    const now = new Date().toISOString();
    setNotifications((prev) => prev.map((n) => (n.readAt ? n : { ...n, readAt: now })));
  }, []);

  // Initial fetch + poll
  useEffect(() => {
    // ponytail: setState is post-await, rule can't prove it
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mock generator timer — only when not using real backend
  useEffect(() => {
    if (USE_REAL_BACKEND || !userId) return;

    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = MOCK_TIMER_MIN_MS + Math.random() * (MOCK_TIMER_MAX_MS - MOCK_TIMER_MIN_MS);
      timeout = setTimeout(() => {
        const newNotif = simulateIncomingNotification(userId);
        if (newNotif) {
          setNotifications((prev) => [newNotif, ...prev]);
          setAnnouncement(newNotif.title);
        }
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  // Clear announcement after screen readers pick it up
  useEffect(() => {
    if (!announcement) return;
    const t = setTimeout(() => setAnnouncement(''), 3000);
    return () => clearTimeout(t);
  }, [announcement]);

  return { notifications, unreadCount, loading, markRead, markAllRead, announcement, refetch: fetchNotifications };
}

/** Relative time helper — locale-aware per spec §9. */
export function relativeTime(isoDate: string, locale: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return locale === 'fr' ? "à l'instant" : 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return locale === 'fr'
      ? `il y a ${minutes} min`
      : `${minutes} min ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return locale === 'fr'
      ? `il y a ${hours} h`
      : `${hours}h ago`;
  }
  return new Date(isoDate).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
