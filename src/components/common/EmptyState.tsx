import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Optional: for a default CTA button

interface EmptyStateProps {
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>; // Expect a Lucide icon component instance
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  ctaButton?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    buttonClassName?: string;
  } | React.ReactNode; // Allow a custom ReactNode for CTA as well
}

export const EmptyState = ({
  icon,
  title,
  description,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
  ctaButton,
}: EmptyStateProps) => {
  const containerClasses = cn(
    'flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50',
    className
  );
  const actualIconClassName = cn('h-16 w-16 text-gray-400 mb-4', iconClassName);
  const actualTitleClassName = cn('text-xl font-semibold text-gray-700 mb-2', titleClassName);
  const actualDescriptionClassName = cn('text-gray-500', descriptionClassName);

  return (
    <div className={containerClasses}>
      {icon && React.cloneElement(icon, { className: actualIconClassName })}
      <h3 className={actualTitleClassName}>{title}</h3>
      <p className={actualDescriptionClassName}>{description}</p>
      {ctaButton && (
        <div className="mt-6">
          {React.isValidElement(ctaButton) ? (
            ctaButton
          ) : (
            ctaButton && typeof ctaButton === 'object' && 'text' in ctaButton && ( // Check if it's the button config object
              <Button onClick={ctaButton.onClick} className={cn(ctaButton.buttonClassName)}>
                {ctaButton.icon && React.cloneElement(ctaButton.icon, { className: 'mr-2 h-4 w-4' })}
                {ctaButton.text}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
};
