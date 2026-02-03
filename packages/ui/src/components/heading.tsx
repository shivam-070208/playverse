import * as React from 'react';
import { cn } from '@workspace/ui/lib/utils';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'default' | 'sm' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

const sizeClasses: Record<NonNullable<HeadingProps['size']>, string> = {
  default: 'text-2xl md:text-3xl',
  sm: 'text-xl md:text-2xl',
  lg: 'text-3xl md:text-4xl',
  xl: 'text-4xl md:text-5xl',
  '2xl': 'text-5xl md:text-6xl',
};

const weightClasses: Record<NonNullable<HeadingProps['weight']>, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h2', size = 'default', weight = 'semibold', className, children, ...props }, ref) => {
    const Comp = as;
    return (
      <Comp
        ref={ref}
        className={cn('tracking-tight', sizeClasses[size], weightClasses[weight], className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Heading.displayName = 'Heading';
