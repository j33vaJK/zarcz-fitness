import Link from 'next/link';
import { MainNav } from './main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from './user-nav';
import { CartSheet } from '@/components/ui/cart-sheet';

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="flex items-center shrink-0">
                    <Link href="/" className="flex items-center space-x-3">
                        <img
                            src="/zarcz-logo.png"
                            alt="ZarcZ Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <span className="font-black text-xl md:text-2xl tracking-tight">
                            ZarcZ Fitness
                        </span>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center">
                    <MainNav />
                </div>

                <div className="flex items-center justify-end space-x-2 shrink-0">
                    <nav className="flex items-center space-x-2">
                        <CartSheet />
                        <ThemeToggle />
                        {/* <UserNav /> */}
                    </nav>
                </div>
            </div>
        </header>
    );
}