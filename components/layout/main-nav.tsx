// components/layout/MainNav.tsx

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Package,
    Info,
    Mail,
    ChevronDown,
    Gamepad2,
    Menu,
    X,
    Tag,
} from 'lucide-react';
import { useCategories } from '@/hooks/use-categories';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════ */

interface NavItem {
    href: string;
    label: string;
    icon?: React.ElementType;
    children?: NavItem[];
}

/* ═══════════════════════════════════════════════════════
   Constants
═══════════════════════════════════════════════════════ */

const NAV_ITEMS: NavItem[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/gaming-arena', label: 'Gaming', icon: Gamepad2 },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    'Gym Wear': Tag,
    'Running Gear': Tag,
    'Training Accessories': Tag,
    'Yoga Collection': Tag,
};

/* ═══════════════════════════════════════════════════════
   Dropdown Component
═══════════════════════════════════════════════════════ */

function DropdownMenu({
    item,
    isActive,
    onClose,
}: {
    item: NavItem;
    isActive: boolean;
    onClose?: () => void;
}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger */}
            <Link
                href={item.href as any}
                onClick={() => {
                    onClose?.();
                }}
                className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
            >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
                {item.children?.length && (
                    <ChevronDown
                        className={cn(
                            'w-3.5 h-3.5 transition-transform duration-200',
                            isOpen && 'rotate-180'
                        )}
                    />
                )}
            </Link>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && item.children?.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                    >
                        {item.children.map((child) => (
                            <Link
                                key={child.href}
                                href={child.href as any}
                                onClick={() => {
                                    setIsOpen(false);
                                    onClose?.();
                                }}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                {child.icon && (
                                    <child.icon className="w-4 h-4 text-gray-400" />
                                )}
                                <span>{child.label}</span>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   Mobile Menu
═══════════════════════════════════════════════════════ */

function MobileMenu({
    isOpen,
    onClose,
    items,
}: {
    isOpen: boolean;
    onClose: () => void;
    items: NavItem[];
}) {
    const pathname = usePathname();
    const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    />

                    {/* Menu */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-2xl z-50 lg:hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="text-lg font-bold">Menu</span>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="py-2 overflow-y-auto">
                            {items.map((item) => {
                                const isActive = pathname === item.href;
                                const hasChildren = item.children?.length;
                                const isExpanded = expandedItem === item.href;

                                return (
                                    <div key={item.href}>
                                        {/* Parent item */}
                                        <div
                                            onClick={() => {
                                                if (hasChildren) {
                                                    setExpandedItem(
                                                        isExpanded ? null : item.href
                                                    );
                                                } else {
                                                    onClose();
                                                }
                                            }}
                                            className={cn(
                                                'flex items-center justify-between px-4 py-3 cursor-pointer transition-colors',
                                                isActive
                                                    ? 'bg-primary/5 text-primary'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            )}
                                        >
                                            <Link
                                                href={item.href as any}
                                                onClick={() => {
                                                    onClose();
                                                }}
                                                className="flex items-center gap-3 flex-1"
                                            >
                                                {item.icon && (
                                                    <item.icon className="w-5 h-5" />
                                                )}
                                                <span className="font-medium">
                                                    {item.label}
                                                </span>
                                            </Link>
                                            {hasChildren && (
                                                <ChevronDown
                                                    className={cn(
                                                        'w-4 h-4 transition-transform',
                                                        isExpanded && 'rotate-180'
                                                    )}
                                                />
                                            )}
                                        </div>

                                        {/* Children */}
                                        <AnimatePresence>
                                            {isExpanded && item.children && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden bg-gray-50"
                                                >
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href as any}
                                                            onClick={onClose}
                                                            className="flex items-center gap-3 pl-14 pr-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                                        >
                                                            {child.icon && (
                                                                <child.icon className="w-4 h-4" />
                                                            )}
                                                            <span>{child.label}</span>
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

/* ═══════════════════════════════════════════════════════
   Main Navigation
═══════════════════════════════════════════════════════ */

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const { data: categories } = useCategories();

    // Build navigation items with categories
    const navItems: NavItem[] = React.useMemo(() => {
        const categoryItems: NavItem[] = (categories ?? []).map((cat) => ({
            href: `/products?category=${encodeURIComponent(cat.name)}`,
            label: cat.name,
            icon: CATEGORY_ICONS[cat.name] || Tag,
        }));

        return NAV_ITEMS.map((item) =>
            item.href === '/products'
                ? { ...item, children: categoryItems }
                : item
        );
    }, [categories]);

    return (
        <nav className={cn('flex items-center', className)} {...props}>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.children?.some(
                            (child) => pathname === child.href
                        ) ??
                            false);

                    if (item.children?.length) {
                        return (
                            <DropdownMenu
                                key={item.href}
                                item={item}
                                isActive={isActive}
                            />
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href as any}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            )}
                        >
                            {item.icon && <item.icon className="w-4 h-4" />}
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

        </nav>
    );
}

/* ═══════════════════════════════════════════════════════
   Export Additional Components
═══════════════════════════════════════════════════════ */

export function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 pointer-events-none">
            <div className="mx-auto max-w-md bg-background/80 backdrop-blur-lg border border-border/50 shadow-lg rounded-full pointer-events-auto overflow-hidden supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center justify-around px-2">
                    {NAV_ITEMS.slice(0, 5).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href as any}
                                className={cn(
                                    'flex flex-1 flex-col items-center justify-center gap-1 py-2.5 px-1 transition-all relative',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-indicator"
                                        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full"
                                    />
                                )}
                                {item.icon && <item.icon className="w-5 h-5" />}
                                <span className="text-[10px] font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}