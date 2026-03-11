'use client';

import React from 'react';

export interface ButtonProps {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantClasses: Record<'primary' | 'secondary' | 'danger', string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent',
  secondary: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent',
};

export default function Button({
  label,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const isInactive = disabled || loading;

  return (
    <button
      type={type}
      onClick={isInactive ? undefined : onClick}
      disabled={isInactive}
      aria-disabled={isInactive}
      aria-busy={loading}
      className={[
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium',
        'max-w-[200px] w-full',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'transition-colors duration-150',
        variantClasses[variant],
        isInactive ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {label}
    </button>
  );
}
