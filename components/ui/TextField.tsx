'use client';

import React from 'react';

export interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: 'text' | 'email' | 'password';
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
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--fv-text-secondary)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChangeText(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        className={`min-h-[48px] rounded-[10px] border bg-[var(--fv-surface)] px-4 py-3 text-[var(--fv-text)] outline-none transition-colors focus:border-[var(--fv-accent)] ${
          error ? 'border-[var(--fv-error)]' : 'border-[var(--fv-border)]'
        }`}
      />
      {error ? (
        <p role="alert" className="text-sm text-[var(--fv-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}