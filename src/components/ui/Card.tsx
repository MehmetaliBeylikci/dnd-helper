import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;      // NEW: Hover effect
  elevated?: boolean;   // NEW: Extra elevation
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = false,
  hover = false,
  elevated = false
}) => {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-lg overflow-hidden',
        // Shadow & Border
        glass ? 'glass-effect' : 'parchment-card',
        // Elevated variant
        elevated && 'ring-1 ring-parchment-300/50 dark:ring-parchment-700/30',
        // Hover effect
        hover && 'card-hover cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'px-4 sm:px-6 py-4',
      'border-b border-parchment-300/60 dark:border-dark-border',
      className
    )}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn('font-heading text-xl font-semibold text-parchment-900 dark:text-parchment-100', className)}>
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('px-4 sm:px-6 py-4 sm:py-5', className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'px-4 sm:px-6 py-4',
      'border-t border-parchment-300/60 dark:border-dark-border',
      'bg-parchment-100/50 dark:bg-dark-parchment/50',
      className
    )}>
      {children}
    </div>
  );
};
