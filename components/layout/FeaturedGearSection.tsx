// components/FeaturedGear/FeaturedGearSlider.tsx

'use client';

/**
 * FeaturedGearSlider.tsx — ZARCZ Fitness Premium Horizontal Slider
 * ─────────────────────────────────────────────────────────────────
 * Stack: Next.js · Framer Motion · GSAP ScrollTrigger · Swiper.js
 *
 * Features:
 *  • Horizontal premium slider with momentum dragging
 *  • GSAP ScrollTrigger parallax section entrance
 *  • Mouse-follow light effect on active slide
 *  • Staggered card reveal animations
 *  • Image zoom on hover with scale effect
 *  • Floating badges (Best Seller / New / Trending)
 *  • Stock urgency & social proof indicators
 *  • Quick add to cart with animated feedback
 *  • Progress indicator with active slide tracking
 *  • Custom navigation arrows with glow effects
 *  • Animated gradient background that shifts on scroll
 *  • Responsive with touch-optimized dragging
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  m,
  LazyMotion,
  domAnimation,
  useInView,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type Variants,
} from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import {
  FreeMode,
  Mousewheel,
  Navigation,
  Pagination,
  EffectCreative,
} from 'swiper/modules';
import {
  Star,
  ShoppingCart,
  Eye,
  TrendingUp,
  Flame,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
  Crown,
  Timer,
  ArrowRight,
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { useProducts, type Product as ApiProduct } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';

/* ═══════════════════════════════════════════════════════
   Types & Data
═══════════════════════════════════════════════════════ */

interface Product {
  id: string;
  name: string;
  category: 'equipment' | 'supplement' | 'accessory';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: {
    text: string;
    type: 'bestseller' | 'new' | 'deal' | 'trending' | 'limited';
    icon?: React.ElementType;
  };
  stockLeft?: number;
  soldCount?: string;
  colors?: string[];
  isNew?: boolean;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pro Series Dumbbells',
    category: 'equipment',
    price: 1499,
    originalPrice: 2999,
    rating: 4.9,
    reviewCount: 4,
    image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&q=80',
    badge: { text: 'Best Seller', type: 'bestseller', icon: Crown },
    stockLeft: 8,
    soldCount: '1.2k+',
    colors: ['#1a1a1a', '#c0c0c0', '#ff6b35'],
  },
  {
    id: '2',
    name: 'Whey Isolate Protein',
    category: 'supplement',
    price: 2499,
    rating: 4.8,
    reviewCount: 24,
    image: '/products/isolate-whey-protein.webp',
    badge: { text: 'Trending Now', type: 'trending', icon: Flame },
    soldCount: '3.4k+',
    colors: ['#f5f5f0', '#2d1b0e'],
  },
  {
    id: '3',
    name: 'Carbon Fiber Lifting Straps',
    category: 'accessory',
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.7,
    reviewCount: 892,
    image: '/products/wrist-bands.jpeg',
    badge: { text: '20% Off', type: 'deal', icon: Zap },
  },
  {
    id: '4',
    name: 'Competition Kettlebell Set',
    category: 'equipment',
    price: 189.99,
    rating: 4.9,
    reviewCount: 567,
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    badge: { text: 'New Arrival', type: 'new', icon: Sparkles },
    stockLeft: 4,
    isNew: true,
  },
  {
    id: '5',
    name: 'Pre-Workout Elite Formula',
    category: 'supplement',
    price: 49.99,
    rating: 4.6,
    reviewCount: 2156,
    image: '/products/pre-workout.jpeg',
    badge: { text: 'Limited Edition', type: 'limited', icon: Timer },
    stockLeft: 12,
    soldCount: '2.1k+',
  },
  {
    id: '6',
    name: 'Premium Yoga Mat 6mm',
    category: 'accessory',
    price: 79.99,
    rating: 4.8,
    reviewCount: 734,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&q=80',
    badge: { text: 'Best Seller', type: 'bestseller', icon: Crown },
    colors: ['#2d1b4e', '#1a1a2e', '#16213e'],
  },
  {
    id: '7',
    name: 'Power Rack System Pro',
    category: 'equipment',
    price: 1299.99,
    rating: 5.0,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    badge: { text: 'Elite Choice', type: 'bestseller', icon: Crown },
    stockLeft: 2,
  },
  {
    id: '8',
    name: 'BCAA Recovery Complex',
    category: 'supplement',
    price: 39.99,
    originalPrice: 54.99,
    rating: 4.7,
    reviewCount: 1876,
    image: '/products/bcaa.jpg',
    badge: { text: 'Combo Deal', type: 'deal', icon: Zap },
    soldCount: '1.8k+',
  },
  {
    id: '9',
    name: 'Nivia Premium Stitched Football',
    category: 'equipment',
    price: 999,
    rating: 4.8,
    reviewCount: 452,
    image: '/products/footballs.jpeg',
    badge: { text: 'Trending', type: 'trending', icon: Flame },
    stockLeft: 15,
  },
  {
    id: '10',
    name: 'BDM Professional Cricket Bat',
    category: 'equipment',
    price: 4500,
    rating: 4.9,
    reviewCount: 124,
    image: '/products/cricket bats.jpeg',
    badge: { text: 'Premium', type: 'bestseller', icon: Crown },
  },
  {
    id: '11',
    name: 'Elite Adjustable Hand Grippers',
    category: 'accessory',
    price: 499,
    rating: 4.7,
    reviewCount: 89,
    image: '/products/adjustable hand grippers.jpeg',
    badge: { text: 'New', type: 'new', icon: Sparkles },
    stockLeft: 20,
  },
  {
    id: '12',
    name: 'Official CSK Training Jersey',
    category: 'accessory',
    price: 1299,
    rating: 4.9,
    reviewCount: 2300,
    image: '/products/csk jersys.jpeg',
    badge: { text: 'Limited', type: 'limited', icon: Timer },
  },
];

/* ═══════════════════════════════════════════════════════
   Sub-components
═══════════════════════════════════════════════════════ */

/** Animated heading with staggered text reveal */
function SliderHeading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const titleWords = ['Community', 'Favorites'];

  const letterVariants: Variants = {
    hidden: { y: '100%', opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.03,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Eyebrow */}
      <m.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="h-px w-12 bg-gradient-to-r from-primary to-transparent" />
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary/80">
          Our Popular Gear
        </span>
      </m.div>

      {/* Main title */}
      <div className="overflow-hidden">
        <div className="flex flex-wrap gap-x-4">
          {titleWords.map((word, idx) => (
            <div key={idx} className="overflow-hidden">
              <m.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={{
                  visible: { transition: { staggerChildren: 0.03 } },
                }}
                className={`text-fluid-h1 font-black tracking-tight ${idx === 1
                    ? 'bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent'
                    : 'text-foreground'
                  }`}
              >
                {word.split('').map((letter, i) => (
                  <m.span
                    key={i}
                    variants={letterVariants}
                    custom={i}
                    className="inline-block"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </m.span>
                ))}
              </m.div>
            </div>
          ))}
        </div>
      </div>

      {/* Supporting text */}
      <m.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-fluid-p text-muted-foreground max-w-xl"
      >
        Our most loved fitness equipment and accessories. Great quality at honest prices.
      </m.p>
    </div>
  );
}

/** Product badge with icon and animation */
function ProductBadge({ badge }: { badge: Product['badge'] }) {
  if (!badge) return null;

  const Icon = badge.icon || Sparkles;

  const badgeStyles = {
    bestseller: 'from-amber-500/90 to-orange-500/90 border-amber-400/30 text-white',
    new: 'from-emerald-500/90 to-teal-500/90 border-emerald-400/30 text-white',
    deal: 'from-rose-500/90 to-pink-500/90 border-rose-400/30 text-white',
    trending: 'from-purple-500/90 to-violet-500/90 border-purple-400/30 text-white',
    limited: 'from-red-500/90 to-orange-600/90 border-red-400/30 text-white',
  };

  return (
    <m.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      className={`absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md shadow-2xl bg-gradient-to-r ${badgeStyles[badge.type]}`}
    >
      <Icon className="w-3 h-3" />
      {badge.text}
    </m.div>
  );
}

/** Rating stars component */
function RatingDisplay({ rating, reviewCount, size = 'sm' }: { rating: number; reviewCount: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} ${i < Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-border text-border'
              }`}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-foreground/90">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString()})</span>
    </div>
  );
}

/** Quick add to cart button with animation */
function QuickAddButton({ product }: { product: Product }) {
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Map the featured-section Product shape to the cart store's Product shape
    addItem({
      id: product.id,
      name: product.name,
      categoryId: 'featured',
      category: { id: 'featured', name: product.category, itemCount: 0 },
      price: product.price,
      stock: product.stockLeft ?? 99,
      status: product.stockLeft !== undefined && product.stockLeft <= 0
        ? 'OUT_OF_STOCK'
        : product.stockLeft !== undefined && product.stockLeft <= 10
        ? 'LOW_STOCK'
        : 'IN_STOCK',
      image: product.image,
      description: product.name,
      featured: true,
    });

    toast.success(`${product.name} added to cart`, {
      description: 'Access your cart in the header to checkout.',
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <m.button
      onClick={handleAddToCart}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card/50 border border-border backdrop-blur-xl overflow-hidden group"
    >
      {/* Animated background */}
      <m.div
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '0%' : '-100%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500"
      />

      <AnimatePresence mode="wait">
        {isAdded ? (
          <m.span
            key="added"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative z-10 text-white text-sm font-bold"
          >
            Added ✓
          </m.span>
        ) : (
          <m.span
            key="add"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative z-10 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4 text-foreground/80 group-hover:text-foreground" />
            <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground">
              Quick Add
            </span>
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  );
}

/** Individual product slide card */
function ProductSlideCard({ product, isActive }: { product: Product; isActive: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Mouse-follow 3D effect
  const rotateX = useTransform(mouseY, [0, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 1], [-5, 5]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  // Mouse light effect
  const lightX = useTransform(mouseX, [0, 1], [-30, 30]);
  const lightY = useTransform(mouseY, [0, 1], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <m.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1200,
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="group relative h-full"
    >
      {/* Card Container */}
      <div className={`relative h-full rounded-3xl overflow-hidden transition-all duration-500 ${isActive
          ? 'border-primary/40 shadow-2xl shadow-primary/20'
          : 'border-border/50'
        } border backdrop-blur-xl bg-gradient-to-b from-card/40 to-card/10`}>

        {/* Active slide glow */}
        {isActive && (
          <m.div
            layoutId="activeGlow"
            className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/30 via-orange-500/20 to-primary/30 blur-xl -z-10"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        {/* Mouse-follow light */}
        <m.div
          style={{ x: lightX, y: lightY }}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
        >
          <div className="absolute w-[150%] h-[150%] -top-1/4 -left-1/4 bg-radial-gradient from-primary/20 via-transparent to-transparent blur-3xl" />
        </m.div>

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={product.id === '1'}
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

          {/* Badge */}
          <ProductBadge badge={product.badge} />

          {/* New indicator */}
          {product.isNew && (
            <m.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute top-4 right-4 z-20"
            >
              <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-background/20 backdrop-blur-xl border border-border/50 text-foreground">
                Just Dropped
              </span>
            </m.div>
          )}

          {/* Quick actions overlay — opens product quick-view dialog */}
          <Dialog>
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <DialogTrigger asChild>
                <m.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-background/20 backdrop-blur-xl border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary shadow-xl"
                >
                  <Eye className="w-5 h-5" />
                </m.button>
              </DialogTrigger>
            </div>

            <DialogContent className="sm:max-w-[800px] border-border/50 bg-background/95 backdrop-blur-2xl p-0 overflow-hidden shadow-[0_0_50px_rgba(255,107,53,0.15)] rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image panel */}
                <div className="relative h-64 md:h-full bg-muted overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent md:bg-gradient-to-r" />
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-full border border-primary/30 backdrop-blur-md shadow-lg bg-primary/20 text-primary">
                        {product.badge.text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details panel */}
                <div className="p-8 md:p-10 flex flex-col justify-center relative">
                  <DialogHeader>
                    <div className="text-xs font-black text-primary mb-3 uppercase tracking-widest">
                      {product.category}
                    </div>
                    <DialogTitle className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight">
                      {product.name}
                    </DialogTitle>
                    <DialogDescription className="text-2xl font-black text-foreground mt-4 tracking-tighter">
                      ₹{product.price.toFixed(2)}
                      {product.originalPrice && (
                        <span className="ml-3 text-base font-semibold text-muted-foreground line-through">
                          ₹{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-6 space-y-4">

                    {/* Color swatches */}
                    {product.colors && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Colors:</span>
                        {product.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-5 h-5 rounded-full border-2 border-border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Stock urgency */}
                    {product.stockLeft && product.stockLeft <= 10 && (
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider">
                        ⚡ Only {product.stockLeft} left in stock
                      </p>
                    )}

                    {/* CTA */}
                    <QuickAddButton product={product} />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Stock urgency badge */}
          {product.stockLeft && product.stockLeft <= 10 && (
            <div className="absolute bottom-4 left-4 z-20">
              <m.div
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 backdrop-blur-xl border border-red-500/30"
              >
                <Timer className="w-3 h-3 text-red-400" />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">
                  Only {product.stockLeft} left
                </span>
              </m.div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Category & Social Proof */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {product.category}
            </span>
            {product.soldCount && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400">{product.soldCount} sold</span>
              </div>
            )}
          </div>

          {/* Product name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-foreground/90 line-clamp-2 leading-tight group-hover:text-foreground transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Color options */}
          {product.colors && (
            <div className="flex items-center gap-1">
              {product.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border-2 border-border cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex items-end justify-between pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                ₹{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Quick add button */}
          <QuickAddButton product={product} />
        </div>
      </div>
    </m.div>
  );
}

/** Custom navigation arrows */
function SliderNavigation({ swiperRef }: { swiperRef: React.RefObject<SwiperType | null> }) {
  return (
    <div className="flex items-center gap-3">
      <m.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => swiperRef.current?.slidePrev()}
        className="group relative w-12 h-12 rounded-full bg-card/50 border border-border backdrop-blur-xl flex items-center justify-center hover:border-primary/40 transition-colors"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </m.button>

      <m.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => swiperRef.current?.slideNext()}
        className="group relative w-12 h-12 rounded-full bg-card/50 border border-border backdrop-blur-xl flex items-center justify-center hover:border-primary/40 transition-colors"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </m.button>
    </div>
  );
}

/** Progress bar for slider */
function SliderProgress({ swiperRef, total }: { swiperRef: React.RefObject<SwiperType | null>; total: number }) {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const updateProgress = () => {
      setProgress(swiper.progress);
      setActiveIndex(swiper.activeIndex);
    };

    swiper.on('progress', updateProgress);
    swiper.on('slideChange', updateProgress);
    updateProgress();

    return () => {
      swiper.off('progress', updateProgress);
      swiper.off('slideChange', updateProgress);
    };
  }, [swiperRef]);

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 sm:w-48 h-0.5 bg-border rounded-full overflow-hidden">
        <m.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-orange-500 rounded-full"
          style={{ width: `${progress * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      <span className="text-xs font-bold text-muted-foreground tabular-nums">
        {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════ */

export default function FeaturedGearSlider() {
  const sectionRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // GSAP ScrollTrigger parallax
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { data, isLoading } = useProducts({ featured: true });
  const featuredProducts = data?.products ?? [];

  // Map API products to the slider's expected format
  const mappedProducts = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: (p.category?.name?.toLowerCase() || 'equipment') as any,
    price: p.price,
    image: p.image || '/products/placeholder.jpeg',
    rating: 4.8 + Math.random() * 0.2, // Mock rating as it's not in DB yet
    reviewCount: Math.floor(Math.random() * 1000) + 50,
    stockLeft: p.stock,
    isNew: new Date(p.createdAt || Date.now()).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
    badge: p.stock < 10 ? { text: 'Low Stock', type: 'limited' as const, icon: Timer } : undefined
  }));

  return (
    <LazyMotion features={domAnimation}>
    <section
      ref={sectionRef}
      className="relative py-fluid-section overflow-hidden"
    >
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header with navigation */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <SliderHeading />

          {!isLoading && mappedProducts.length > 0 && (
            <div className="flex items-center gap-6">
              <SliderProgress swiperRef={swiperRef} total={mappedProducts.length} />
              <SliderNavigation swiperRef={swiperRef} />
            </div>
          )}
        </div>

        {/* Swiper Slider */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="-mx-4 px-4 md:-mx-6 md:px-6"
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setActiveSlideIndex(swiper.activeIndex)}
              modules={[FreeMode, Mousewheel, Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1.2}
              freeMode={{
                enabled: true,
                sticky: false,
                momentumBounce: false,
                momentumRatio: 0.5,
                momentumVelocityRatio: 0.5,
              }}
              mousewheel={{
                forceToAxis: true,
                sensitivity: 1,
              }}
              breakpoints={{
                640: { slidesPerView: 2.2, spaceBetween: 24 },
                1024: { slidesPerView: 3.2, spaceBetween: 32 },
                1280: { slidesPerView: 4.2, spaceBetween: 32 },
                1536: { slidesPerView: 4.5, spaceBetween: 32 },
              }}
              className="!overflow-visible"
            >
              {mappedProducts.map((product, index) => (
                <SwiperSlide key={product.id}>
                  <ProductSlideCard
                    product={product as any}
                    isActive={index === activeSlideIndex}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </m.div>

        {/* CTA Button */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Link href="/products">
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-full overflow-hidden"
            >
              {/* Button gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-border backdrop-blur-xl group-hover:border-primary/30 transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="relative z-10 font-bold text-foreground/90 group-hover:text-white uppercase tracking-wider transition-colors">
                View All Products
              </span>
              <ArrowRight className="relative z-10 w-5 h-5 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
            </m.button>
          </Link>
        </m.div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        .swiper-slide {
          height: auto !important;
        }
        
        .bg-radial-gradient {
          background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%);
        }
      `}</style>
    </section>
    </LazyMotion>
  );
}