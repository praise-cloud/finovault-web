'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'date';
  placeholder?: string;
  autoComplete?: string;
}

export function TextField({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  type = 'text',
  placeholder,
  autoComplete,
}: TextFieldProps) {
  const id = React.useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-black uppercase tracking-wider text-[var(--fv-text)]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={effectiveType}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChangeText(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error}
          className={`min-h-[48px] w-full rounded-[10px] border-2 bg-[var(--fv-surface)] px-4 py-3 ${
            isPassword ? 'pr-12' : ''
          } text-sm font-medium text-[var(--fv-text)] transition-all focus:outline-none ${
            error
              ? 'border-[var(--fv-error)] focus:border-[var(--fv-error)] shadow-[2px_2px_0_0_var(--fv-error)]'
              : 'border-[var(--fv-border-ink)] focus:border-[var(--fv-primary)] focus:shadow-[2px_2px_0_0_#1D4ED8]'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-[var(--fv-text-secondary)] hover:text-[var(--fv-text)] transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} strokeWidth={2.2} /> : <Eye size={18} strokeWidth={2.2} />}
          </button>
        )}
      </div>
      {error ? (
        <p role="alert" className="text-xs font-bold text-[var(--fv-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}