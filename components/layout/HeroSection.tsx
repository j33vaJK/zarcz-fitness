'use client';

/**
 * HeroSection.tsx — ZarcZ Fitness Premium Hero
 * ─────────────────────────────────────────────
 * Stack: Next.js (App Router) · Framer Motion · Tailwind CSS
 *
 * Features:
 *  • Kinetic headline word-swap animation
 *  • Mouse-parallax floating product cards
 *  • Animated particle canvas background
 *  • Framer Motion scroll-linked fade/parallax
 *  • Animated counters (IntersectionObserver)
 *  • Pulse-glow CTA buttons
 *  • Floating product cards with depth
 *  • Trust badge micro-interactions
 *  • Rotating orbit ring decoration
 *  • Mobile-responsive (products hidden on small screens)
 *
 * Dependencies (add to package.json if not present):
 *   framer-motion  ≥ 10
 *   lucide-react
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  m,
  LazyMotion,
  domAnimation,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  animate,
  type Variants,
} from 'framer-motion';
import { ArrowRight, Zap, Shield, Star, Truck } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
  Types
═══════════════════════════════════════════════════════ */
interface FloatingProduct {
  id: number;
  src: string;
  alt: string;
  x: string;
  y: string;
  size: string;
  delay: number;
  depth: number; // 0.01–0.06, controls parallax strength
}

interface TrustBadge {
  icon: React.ElementType;
  label: string;
  sub: string;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

/* ═══════════════════════════════════════════════════════
  Data
═══════════════════════════════════════════════════════ */
const TRUST_BADGES: TrustBadge[] = [
  { icon: Truck, label: 'Fast Delivery', sub: 'Same-day dispatch' },
  { icon: Shield, label: 'Secure Checkout', sub: '256-bit encryption' },
  { icon: Star, label: 'Top Rated Products', sub: '4.9★ avg rating' },
  { icon: Zap, label: 'Premium Quality', sub: 'Lab-tested gear' },
];

const STATS: Stat[] = [
  { value: 1000, suffix: '+', label: 'Athletes' },
  { value: 98, suffix: '%', label: 'Satisfaction' },
  { value: 500, suffix: '+', label: 'Products' },
];

/**
 * Replace these Unsplash URLs with your own CDN images.
 * x/y are % positions within the right column container.
 * depth controls parallax strength (higher = moves more).
 */
const FLOATING_PRODUCTS: FloatingProduct[] = [
  {
    id: 1,
    src: '/hero/shop1.webp',
    alt: 'Premium Soccer Gear',
    x: '55%', y: '5%', size: '200px',
    delay: 0, depth: 0.04,
  },
  {
    id: 2,
    src: '/hero/shop2.webp',
    alt: 'Elite Supplements',
    x: '68%', y: '36%', size: '260px',
    delay: 0.2, depth: 0.055,
  },
  {
    id: 3,
    src: '/hero/shop3.webp',
    alt: 'Professional Cricket Gear',
    x: '48%', y: '55%', size: '190px',
    delay: 0.12, depth: 0.025,
  },
  {
    id: 4,
    src: '/hero/shop4.webp',
    alt: 'Racing Simulator',
    x: '75%', y: '68%', size: '155px',
    delay: 0.35, depth: 0.045,
  },
];

const KINETIC_WORDS = ['FITTER', 'STRONGER', 'HEALTHIER'];

/* ═══════════════════════════════════════════════════════
  Sub-components
═══════════════════════════════════════════════════════ */

/** Cycles through KINETIC_WORDS with a slide-up animation */
function KineticWord() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % KINETIC_WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        minWidth: '10ch',
      }}
    >
      <m.span
        key={idx}
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-110%', opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'block',
          background: 'linear-gradient(135deg, #ff6b35 0%, #ffa07a 50%, #ff6b35 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {KINETIC_WORDS[idx]}
      </m.span>
    </span>
  );
}

/** Counts up to `value` when it enters the viewport */
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || !entry.isIntersecting) return;
        observer.disconnect();
        const controls = animate(0, value, {
          duration: 2.4,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: v => setDisplay(Math.round(v)),
        });
        return controls.stop;
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}



/** A single floating product card that reacts to mouse position */
function FloatingCard({
  product,
  mouseX,
  mouseY,
}: {
  product: FloatingProduct;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const factor = product.depth * 120;

  const rawX = useTransform(mouseX, [-1, 1], [-factor, factor]);
  const rawY = useTransform(mouseY, [-1, 1], [-factor * 0.7, factor * 0.7]);
  const springX = useSpring(rawX, { stiffness: 55, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 55, damping: 18 });

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.65, y: 70 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: product.delay + 0.9, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        left: product.x,
        top: product.y,
        width: product.size,
        x: springX,
        y: springY,
        zIndex: Math.round(product.depth * 100),
      }}
      whileHover={{ scale: 1.07, zIndex: 55 }}
    >
      {/* Float bob animation */}
      <m.div
        animate={{ y: [0, -14, 0] }}
        transition={{
          duration: 4 + product.depth * 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: product.delay,
        }}
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255,107,53,0.2)',
          background: 'rgba(255,255,255,0.035)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
          cursor: 'pointer',
          position: 'relative',
          aspectRatio: '1/1',
        }}
      >
        <Image
          src={product.src}
          alt={product.alt}
          fill
          priority={product.id <= 2}
          sizes="(max-width: 768px) 100vw, 300px"
          style={{ objectFit: 'cover' }}
        />
        {/* Bottom gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px' }}>
          <p style={{
            margin: 0,
            fontSize: 'clamp(8px, 1.2vw, 10px)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)',
          }}>
            {product.alt}
          </p>
        </div>
      </m.div>
    </m.div>
  );
}

/* ═══════════════════════════════════════════════════════
  Main Hero Component
═══════════════════════════════════════════════════════ */
export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Scroll-linked transforms
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bgParallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - left) / width - 0.5) * 2);
    mouseY.set(((e.clientY - top) / height - 0.5) * 2);
  };

  // Staggered text entrance
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 44 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.13, duration: 0.95, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="bg-background text-foreground min-h-[60vh] lg:min-h-screen"
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >

        {/* ── Content ── */}
        <m.div
          style={{ y: contentY, opacity: contentOpacity, position: 'relative', zIndex: 10 }}
          initial="hidden"
          animate="visible"
        >
          <div
            className="hero-grid container mx-auto px-4 md:px-6 w-full"
            style={{
              paddingTop: 'clamp(20px, 5vh, 60px)',
              paddingBottom: '100px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              alignItems: 'center',
            }}
          >

            {/* ╔══════════════════════════════╗
                ║  LEFT: Copy + CTAs + Trust   ║
                ╚══════════════════════════════╝ */}
            <div
              className="flex flex-col min-w-0"
              style={{ gap: 'clamp(16px, 4vw, 28px)' }}
            >

              {/* Eyebrow pill */}
              <m.div custom={0} variants={textVariants}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255,107,53,0.28)',
                    background: 'rgba(255,107,53,0.07)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Pulse dot */}
                  <span style={{ position: 'relative', width: '6px', height: '6px', display: 'flex' }}>
                    <m.span
                      animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: '#ff6b35',
                        opacity: 0.5,
                      }}
                    />
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff6b35', flexShrink: 0, boxShadow: '0 0 8px #ff6b35' }} />
                  </span>
                  <span
                    style={{
                      fontSize: 'clamp(8px, 1.2vw, 9px)',
                      fontWeight: 700,
                      letterSpacing: '0.22em',
                      color: '#ff6b35',
                      textTransform: 'uppercase',
                    }}
                  >
                    Your Fitness Journey Starts Here
                  </span>
                </div>
              </m.div>

              {/* Headline */}
              <m.div custom={1} variants={textVariants}>
                <h1
                  className="text-foreground"
                  style={{
                    fontSize: 'clamp(36px, 5.5vw, 88px)',
                    fontWeight: 900,
                    lineHeight: 1.0,
                    letterSpacing: '-0.03em',
                    margin: 0,
                  }}
                >
                  <span style={{ display: 'block' }}>TRAIN TO BE</span>
                  <span
                    style={{
                      display: 'block',
                      height: 'clamp(40px, 6.5vw, 98px)',
                      overflow: 'hidden',
                    }}
                  >
                    <KineticWord />
                  </span>
                </h1>
              </m.div>

              {/* Supporting copy */}
              <m.p
                custom={2}
                variants={textVariants}
                className="text-fluid-p text-muted-foreground leading-relaxed w-full break-words"
              >
                Quality gym equipment, reliable supplements, and essential fitness accessories — making a healthy lifestyle accessible and affordable for everyone.
              </m.p>

              {/* CTA Buttons */}
              <m.div
                custom={3}
                variants={textVariants}
                style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}
              >
                {/* Primary CTA */}
                <Link href="/products" style={{ textDecoration: 'none' }}>
                  <m.button
                    whileHover={{
                      scale: 1.04,
                      boxShadow: '0 0 50px rgba(255,107,53,0.55), 0 20px 40px rgba(255,107,53,0.25)',
                    }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '15px 32px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #ff6b35 0%, #e25520 100%)',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 'clamp(11px, 1.4vw, 14px)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 0 24px rgba(255,107,53,0.4), 0 8px 28px rgba(255,107,53,0.2)',
                      transition: 'box-shadow 0.3s ease',
                    }}
                  >
                    Shop Now
                    <ArrowRight size={16} />
                  </m.button>
                </Link>

                {/* Secondary CTA */}
                {/* <Link href="/collections" style={{ textDecoration: 'none' }}>
                <m.button
                  whileHover={{
                    scale: 1.04,
                    background: 'rgba(255,107,53,0.09)',
                    borderColor: 'rgba(255,107,53,0.45)',
                  }}
                  whileTap={{ scale: 0.96 }}
                  className="text-foreground"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '15px 32px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    fontWeight: 700,
                    fontSize: 'clamp(11px, 1.4vw, 14px)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(150,150,150,0.13)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  Explore Collections
                </m.button>
              </Link> */}
              </m.div>

              {/* Stats row */}
              <m.div
                custom={4}
                variants={textVariants}
                style={{ display: 'flex', gap: 'clamp(16px, 5vw, 36px)', flexWrap: 'wrap', paddingTop: '4px' }}
              >
                {STATS.map(s => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontSize: 'clamp(20px, 2.5vw, 34px)',
                        fontWeight: 900,
                        color: '#ff6b35',
                        lineHeight: 1,
                      }}
                    >
                      <AnimatedCounter value={s.value} suffix={s.suffix} />
                    </div>
                    <div
                      className="text-muted-foreground"
                      style={{
                        fontSize: 'clamp(9px, 1.2vw, 11px)',
                        fontWeight: 600,
                        letterSpacing: '0.13em',
                        textTransform: 'uppercase',
                        marginTop: '5px',
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </m.div>

              {/* Trust badges grid */}
              <m.div
                custom={5}
                variants={textVariants}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '10px',
                  maxWidth: '470px',
                }}
              >
                {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                  <m.div
                    key={label}
                    whileHover={{
                      scale: 1.025,
                      borderColor: 'rgba(255,107,53,0.38)',
                      background: 'rgba(255,107,53,0.05)',
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 13px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.07)',
                      background: 'rgba(255,255,255,0.025)',
                      backdropFilter: 'blur(10px)',
                      cursor: 'default',
                      transition: 'all 0.22s ease',
                    }}
                  >
                    {/* Icon bubble */}
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255,107,53,0.14)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={14} color="#ff6b35" />
                    </div>
                    <div>
                      <div
                        className="text-foreground"
                        style={{
                          fontSize: 'clamp(9px, 1.2vw, 12px)',
                          fontWeight: 700,
                          lineHeight: 1.25,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        className="text-muted-foreground"
                        style={{
                          fontSize: 'clamp(8.5px, 1.2vw, 10.5px)',
                          lineHeight: 1.3,
                        }}
                      >
                        {sub}
                      </div>
                    </div>
                  </m.div>
                ))}
              </m.div>
            </div>

            {/* ╔══════════════════════════════╗
                ║  RIGHT: Floating Products    ║
                ╚══════════════════════════════╝ */}
            <div
              className="hero-products"
              style={{ position: 'relative', height: 'clamp(520px, 72vh, 760px)' }}
            >
              {/* Central ambient glow */}
              <m.div
                animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '300px', height: '300px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)',
                  filter: 'blur(22px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Orbiting ring */}
              <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '360px', height: '360px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,107,53,0.09)',
                  pointerEvents: 'none',
                }}
              >
                {/* Orbit dots at 4 positions */}
                {[0, 90, 180, 270].map(deg => (
                  <div
                    key={deg}
                    style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      width: '7px', height: '7px',
                      borderRadius: '50%',
                      background: '#ff6b35',
                      boxShadow: '0 0 10px #ff6b35, 0 0 20px rgba(255,107,53,0.4)',
                      transform: `rotate(${deg}deg) translateX(180px) translate(-50%, -50%)`,
                    }}
                  />
                ))}
              </m.div>

              {/* Counter-rotating inner ring */}
              <m.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '240px', height: '240px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255,107,53,0.07)',
                  pointerEvents: 'none',
                }}
              />

              {/* Floating product cards */}
              {FLOATING_PRODUCTS.map(p => (
                <FloatingCard key={p.id} product={p} mouseX={mouseX} mouseY={mouseY} />
              ))}

              {/* Info badge: Best Seller */}
              <m.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  top: '10%', left: '2%',
                  zIndex: 60,
                  background: 'rgba(7,9,16,0.88)',
                  border: '1px solid rgba(255,107,53,0.28)',
                  borderRadius: '13px',
                  padding: '12px 16px',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.45)',
                  minWidth: '140px',
                }}
              >
                <div style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', color: 'rgba(220,228,244,0.45)', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', }}>Best Seller</div>
                <div style={{ fontSize: 'clamp(14px, 1.9vw, 19px)', fontWeight: 900, color: '#ff6b35', lineHeight: 1.1, marginTop: '2px' }}>Pro Series</div>
                <div style={{ fontSize: 'clamp(9px, 1.2vw, 12px)', color: 'rgba(220,228,244,0.55)', marginTop: '3px' }}>Dumbbells 5–50 kg</div>
              </m.div>

              {/* Info badge: Rating */}
              <m.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  bottom: '17%', left: '1%',
                  zIndex: 60,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #e25520 100%)',
                  borderRadius: '13px',
                  padding: '12px 20px',
                  boxShadow: '0 24px 48px rgba(255,107,53,0.32)',
                }}
              >
                <div style={{ fontSize: 'clamp(18px, 2.4vw, 24px)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>4.9 ★</div>
                <div style={{ fontSize: 'clamp(9px, 1.2vw, 11px)', color: 'rgba(255,255,255,0.75)', marginTop: '3px' }}>50+ reviews</div>
              </m.div>
            </div>
          </div>
        </m.div>

        {/* ── Scroll indicator ── */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="hidden md:flex flex-col items-center gap-1.5"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.07], [1, 0]),
            position: 'absolute',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          <span
            style={{
              fontSize: 'clamp(8px, 1.2vw, 9px)',
              fontWeight: 700,
              letterSpacing: '0.28em',
              color: 'rgba(220,228,244,0.28)',
              textTransform: 'uppercase',
            }}
          >
            Scroll
          </span>
          <m.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '1px',
              height: '42px',
              background: 'linear-gradient(to bottom, rgba(255,107,53,0.7), transparent)',
            }}
          />
        </m.div>

        {/* ── Responsive CSS ── */}
        <style>{`
          @media (max-width: 900px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
            }
            .hero-products {
              display: none !important;
            }
          }
          @media (max-width: 600px) {
            .hero-grid {
              padding-left: 20px !important;
              padding-right: 20px !important;
            }
          }
        `}</style>
      </section>
    </LazyMotion>
  );
}
