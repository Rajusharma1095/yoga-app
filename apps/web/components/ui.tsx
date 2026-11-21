'use client';

import type { ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';

/** Applies the Devanagari font and line height when the text is Hindi. */
export function L({ lang, children, className = '' }: { lang: Lang; children: ReactNode; className?: string }) {
  return (
    <span lang={lang} className={className}>
      {children}
    </span>
  );
}

export function Button({
  children, onClick, variant = 'primary', disabled, type = 'button', className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}) {
  const styles = {
    primary: 'bg-calm-600 text-white hover:bg-calm-700 disabled:bg-slate-300 disabled:text-slate-500',
    ghost: 'card hover:border-calm-400',
    danger: 'bg-warn-600 text-white hover:bg-warn-700',
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`tap w-full rounded-xl px-5 py-3 text-center font-semibold transition-colors ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Choice({
  selected, onClick, children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`tap flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
        selected ? 'border-calm-600 bg-calm-50 text-calm-900' : 'card hover:border-calm-400'
      }`}
    >
      <span
        aria-hidden
        className={`grid size-6 shrink-0 place-items-center rounded-full border-2 ${
          selected ? 'border-calm-600 bg-calm-600 text-white' : 'border-slate-400'
        }`}
      >
        {selected ? '✓' : ''}
      </span>
      <span className="font-medium">{children}</span>
    </button>
  );
}

/** The red box. It is never collapsed and never shortened — it is the product. */
export function AvoidBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-warn-200 bg-warn-50 p-4 text-slate-900">
      <p className="mb-2 flex items-center gap-2 font-bold text-warn-700">
        <span aria-hidden>🔴</span>
        {title}
      </p>
      {children}
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-sm muted">{children}</span>
  );
}
