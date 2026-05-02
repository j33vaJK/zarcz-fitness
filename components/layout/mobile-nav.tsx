"use client";

import * as React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export function MobileNav() {
    const [open, setOpen] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <div className="px-2">
                    <SheetTitle className="text-left font-black tracking-tight text-xl mb-4">
                        ZarcZ Fitness
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        Navigation Menu
                    </SheetDescription>
                    <div className="flex flex-col space-y-4">
                        <Link href="/" onClick={() => setOpen(false)} className="text-sm font-medium transition-colors hover:text-primary">
                            Home
                        </Link>
                        <Link href="/products" onClick={() => setOpen(false)} className="text-sm font-medium transition-colors hover:text-primary">
                            Shop Sportswear
                        </Link>
                        <Link href="/admin" onClick={() => setOpen(false)} className="text-sm font-medium transition-colors hover:text-primary">
                            Admin
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
