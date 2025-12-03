'use client';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            // Variant styles
            'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] focus:ring-[var(--primary)]':
              variant === 'primary',
            'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--secondary)]/80 focus:ring-[var(--secondary)]':
              variant === 'secondary',
            'border border-[var(--muted-light)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted-light)] hover:bg-opacity-10 focus:ring-[var(--primary)]':
              variant === 'outline',
            'text-[var(--foreground)] hover:bg-[var(--muted-light)] hover:bg-opacity-10 focus:ring-[var(--primary)]':
              variant === 'ghost',
            'text-[var(--primary)] underline-offset-4 hover:underline focus:ring-[var(--primary)]':
              variant === 'link',

            // Size styles
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 py-2 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',

            // Loading state
            'opacity-70 cursor-not-allowed': loading,
          },
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <span className="mr-2 h-4 w-4 animate-spin">
            <svg
              className="h-full w-full"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };