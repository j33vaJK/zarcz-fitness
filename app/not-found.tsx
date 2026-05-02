import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">404</h1>
            <p className="text-lg text-muted-foreground">
                The page you are looking for does not exist.
            </p>
            <Link href="/" className={buttonVariants()}>
                Go back home
            </Link>
        </div>
    );
}
