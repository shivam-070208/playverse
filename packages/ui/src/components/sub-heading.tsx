import * as React from 'react';
import { cn } from '@workspace/ui/lib/utils';

export interface SubHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'sm' | 'default' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

const subHeadingSizeClasses: Record<NonNullable<SubHeadingProps['size']>, string> = {
  sm: 'text-sm md:text-base',
  default: 'text-lg md:text-xl',
  lg: 'text-xl md:text-2xl',
};

const subHeadingWeightClasses: Record<NonNullable<SubHeadingProps['weight']>, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const SubHeading = React.forwardRef<HTMLHeadingElement, SubHeadingProps>(
  ({ as = 'h3', size = 'default', weight = 'medium', className, children, ...props }, ref) => {
    const Comp = as;
    return (
      <Comp
        ref={ref}
        className={cn(
          'tracking-tight text-muted-foreground',
          subHeadingSizeClasses[size],
          subHeadingWeightClasses[weight],
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
SubHeading.displayName = 'SubHeading';
