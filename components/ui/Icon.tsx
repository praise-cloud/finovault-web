import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Bell,
  Briefcase,
  ChevronRight,
  Cpu,
  FileText,
  Lock,
  Minus,
  Plus,
  PlusCircle,
  Send,
  TrendingUp,
  Umbrella,
} from 'lucide-react';

const glyphMap = {
  'arrow-up-right': ArrowUpRight,
  'arrow-down-right': ArrowDownRight,
  minus: Minus,
  'trending-up': TrendingUp,
  briefcase: Briefcase,
  send: Send,
  cpu: Cpu,
  award: Award,
  'chevron-right': ChevronRight,
  plus: Plus,
  'plus-circle': PlusCircle,
  umbrella: Umbrella,
  'file-text': FileText,
  bell: Bell,
  lock: Lock,
} as const;

export type IconName = keyof typeof glyphMap;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  subdued?: boolean;
  className?: string;
}

export function Icon({ name, size = 22, color, subdued = false, className = '' }: IconProps) {
  const Glyph = glyphMap[name];
  const resolved = color ?? (subdued ? 'var(--fv-text-secondary)' : 'var(--fv-primary)');
  return <Glyph size={size} color={resolved} strokeWidth={1.8} className={className} />;
}