import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'default' | 'lg' | 'xl';
}

const Loader = ({ className, size = 'default', ...props }: LoaderProps) => {
    return (
        <div className={cn('flex items-center justify-center', className)} {...props}>
            <Loader2
                className={cn('animate-spin text-primary', {
                    'h-4 w-4': size === 'sm',
                    'h-6 w-6': size === 'default',
                    'h-8 w-8': size === 'lg',
                    'h-12 w-12': size === 'xl',
                })}
            />
        </div>
    );
};

export { Loader };
