import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'font-heading font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2';
    
    const variants = {
      primary: cn(
        'bg-gradient-to-b from-burgundy-500 to-burgundy-600',
        'hover:from-burgundy-600 hover:to-burgundy-700',
        'text-white font-medium',
        'shadow-md hover:shadow-lg',
        'border border-burgundy-700/20',
        'focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2',
        'dark:from-burgundy-600 dark:to-burgundy-700',
        'dark:hover:from-burgundy-500 dark:hover:to-burgundy-600'
      ),
      secondary: cn(
        'bg-gradient-to-b from-parchment-200 to-parchment-300',
        'hover:from-parchment-300 hover:to-parchment-400',
        'text-parchment-900',
        'shadow-sm hover:shadow-md',
        'border border-parchment-400/50',
        'focus:ring-2 focus:ring-parchment-500 focus:ring-offset-2',
        'dark:from-dark-surface dark:to-dark-border',
        'dark:hover:from-dark-border dark:hover:to-parchment-800',
        'dark:text-parchment-100 dark:border-dark-border'
      ),
      danger: cn(
        'bg-gradient-to-b from-red-500 to-red-600',
        'hover:from-red-600 hover:to-red-700',
        'text-white shadow-md hover:shadow-lg',
        'border border-red-700/20',
        'focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
      ),
      ghost: 'hover:bg-parchment-200 text-parchment-800 focus:ring-parchment-400 dark:hover:bg-dark-border dark:text-parchment-300',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-medieval',
      md: 'px-4 py-2 text-base rounded-medieval',
      lg: 'px-6 py-3 text-lg rounded-md',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
