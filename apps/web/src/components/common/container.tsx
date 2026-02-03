import { cn } from '@workspace/ui/lib/utils';
import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  as?: React.ElementType;
  children: React.ReactNode;
}

const maxWidthClasses: Record<NonNullable<ContainerProps['maxWidth']>, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

const paddingClasses: Record<NonNullable<ContainerProps['padding']>, string> = {
  xs: 'px-2',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
  xl: 'px-10',
  '2xl': 'px-12',
  full: 'px-0',
};

const Container: React.FC<ContainerProps> = ({
  maxWidth = '2xl',
  as: Component = 'div',
  className,
  children,
  padding = 'md',
  ...props
}) => {
  return (
    <Component
      className={cn(
        'w-full mx-auto',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Container };
