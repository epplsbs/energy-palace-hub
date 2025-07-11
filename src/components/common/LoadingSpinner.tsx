import { Loader2, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  iconClassName?: string;
  text?: string;
  textClassName?: string;
  fullPage?: boolean; // If true, centers it on the page with more padding
}

export const LoadingSpinner = ({
  size = 24, // Default size (h-6 w-6)
  className,
  iconClassName,
  text,
  textClassName,
  fullPage = false,
}: LoadingSpinnerProps) => {
  const containerClasses = cn(
    'flex flex-col items-center justify-center',
    fullPage ? 'min-h-[calc(100vh-200px)] py-12' : 'py-4', // Adjust min-height as needed
    className
  );

  const actualIconClassName = cn('animate-spin text-emerald-600', iconClassName);
  const actualTextClassName = cn('ml-2 text-gray-600', text ? 'mt-2' : '', textClassName);

  // Create a dynamic style object for size
  const iconStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div className={containerClasses}>
      <Loader2 className={actualIconClassName} style={iconStyle} />
      {text && <span className={actualTextClassName}>{text}</span>}
    </div>
  );
};
