'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  m, LazyMotion, domAnimation, useInView, AnimatePresence,
} from 'framer-motion';
import {
  Gamepad2, Clock, Users, Zap, ChevronRight, Play,
  Image as ImageIcon, Video, Star, Trophy, Flame,
  ArrowRight, CheckCircle2, Timer,
} from 'lucide-react';

/* ── Data ───────────────────────────────────────────── */
const FEATURES = [
  { icon: Gamepad2, title: 'Full Race Setup', desc: 'Logitech G29 wheel, pedals & gear-shifter for an authentic driving experience.' },
  { icon: Zap, title: 'High-FPS Gaming', desc: '144Hz display, low-latency response — every millisecond counts on the track.' },
  { icon: Users, title: 'Kids & Adults', desc: 'Adjustable seat and controls — perfect for all ages and skill levels.' },
  { icon: Trophy, title: 'Top Titles', desc: 'Gran Turismo 7, F1 24, Assetto Corsa and more racing sims available.' },
];

const INCLUSIONS = [
  'Steering wheel, pedals & gear-shifter',
  '144Hz racing display',
  'Racing bucket seat',
  'All top racing sim titles',
  'No booking fee — walk in & play',
  'Friendly staff assistance',
];

const PRICING = [
  { label: '1 Hour', price: 299, tag: null },
  { label: '2 Hours', price: 549, tag: 'Save ₹50' },
  { label: '3 Hours', price: 799, tag: 'Best Value' },
];

/* ── Reusable section heading ──────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px w-10 bg-gradient-to-r from-primary to-transparent" />
      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/80">{text}</span>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────── */
export default function GamingArenaPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const featInView = useInView(featRef, { once: true, margin: '-80px' });
  const mediaInView = useInView(mediaRef, { once: true, margin: '-80px' });
  const pricingInView = useInView(pricingRef, { once: true, margin: '-80px' });

  return (
    <LazyMotion features={domAnimation}>
      <main className="bg-background text-foreground overflow-hidden">

        {/* ══════════ HERO ══════════ */}
        <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">

          {/* Animated ambient bg */}
          <div className="absolute inset-0 pointer-events-none">
            <m.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"
            />
            <m.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.22, 0.1] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/15 blur-[100px]"
            />
            {/* Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,53,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 md:px-8 pt-5  pb-24">
            <div className="max-w-4xl mx-auto text-center">

              {/* Eyebrow */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm text-[11px] font-black uppercase tracking-[0.25em] text-primary">
                  <m.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>●</m.span>
                  Now Open
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
              </m.div>

              {/* Headline */}
              <m.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-fluid-h1 font-black uppercase tracking-tighter leading-none mb-6"
              >
                <span className="block text-foreground">Gaming</span>
                <span className="block bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                  Arena
                </span>
              </m.h1>

              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <Gamepad2 className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-muted-foreground uppercase tracking-widest">Racing Simulator</span>
                <Gamepad2 className="w-5 h-5 text-primary" />
              </m.div>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-fluid-p text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                Strap in and feel every corner. Our full-spec car racing simulator lets kids and adults experience the thrill of motorsport — right inside ZARCZ.
              </m.p>

              {/* Price pill */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              >
                <div className="flex items-baseline gap-2 px-8 py-4 rounded-2xl bg-primary/10 border border-primary/30 backdrop-blur-xl">
                  <span className="text-4xl font-black text-primary">₹299</span>
                  <span className="text-muted-foreground font-semibold">/ hour</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Walk in anytime · No booking needed</span>
                </div>
              </m.div>

              {/* CTAs */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <a href="tel:+919567136395">
                  <m.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(255,107,53,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-black uppercase tracking-wider text-sm shadow-[0_0_24px_rgba(255,107,53,0.35)]"
                  >
                    Book a Session
                    <ArrowRight className="w-4 h-4" />
                  </m.button>
                </a>
                <m.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-card/30 backdrop-blur-xl text-foreground font-bold uppercase tracking-wider text-sm hover:border-primary/40 transition-colors"
                >
                  View Pricing
                  <ChevronRight className="w-4 h-4" />
                </m.button>
              </m.div>
            </div>
          </div>

          {/* Scroll cue */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground/40">Scroll</span>
            <m.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent" />
          </m.div>
        </section>

        {/* ══════════ MEDIA: VIDEO + IMAGES ══════════ */}
        <section ref={mediaRef} className="relative py-fluid-section">
          <div className="container mx-auto px-4 md:px-8">

            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={mediaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <SectionLabel text="See It In Action" />
              <h2 className="text-fluid-h2 font-black uppercase tracking-tighter">
                Feel The <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Rush</span>
              </h2>
            </m.div>

            {/* ── Main video ── */}
            <m.div
              initial={{ opacity: 0, y: 40 }}
              animate={mediaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative mb-6 rounded-3xl overflow-hidden border border-primary/20 shadow-[0_0_60px_rgba(255,107,53,0.12)] group"
            >
              {/* Glow border on hover */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-primary/0 group-hover:ring-primary/30 transition-all duration-500 z-10 pointer-events-none" />

              <video
                src="/racing-simulator1.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full aspect-video object-cover"
              />

              {/* Overlay label */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-xl border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-primary">Live Gameplay</span>
              </div>
            </m.div>

            {/* ── Two image panels ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid">
              {[
                {
                  src: '/racing-simulator-img1.jpg',
                  label: 'Driver In Action',
                  sub: 'Kids & adults welcome',
                },
                {
                  src: '/racing-simulator-img2.jpg',
                  label: 'Racing Setup',
                  sub: 'Full cockpit with wheel & pedals',
                },
              ].map(({ src, label, sub }, i) => (
                <m.div
                  key={label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={mediaInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.25 + i * 0.12 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/50 group shadow-2xl"
                >
                  <Image
                    src={src}
                    alt={label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">{label}</p>
                    <p className="text-sm text-white/70 font-medium">{sub}</p>
                  </div>
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
                </m.div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════ FEATURES ══════════ */}
        <section ref={featRef} className="relative py-fluid-section overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-card/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 md:px-8">

            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={featInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <SectionLabel text="What's Included" />
              <h2 className="text-fluid-h2 font-black uppercase tracking-tighter">
                Full <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Race Spec</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-4">
                Everything you need for a real motorsport experience — no compromises.
              </p>
            </m.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-fluid">
              {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                <m.div
                  key={title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={featInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className="group relative p-6 rounded-3xl border border-border/50 bg-card/20 backdrop-blur-xl hover:border-primary/30 hover:bg-card/40 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-black text-foreground mb-2 uppercase tracking-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ PRICING ══════════ */}
        <section id="pricing" ref={pricingRef} className="relative py-fluid-section">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">

            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <SectionLabel text="Pricing" />
              <h2 className="text-fluid-h2 font-black uppercase tracking-tighter mb-4">
                Simple & <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Honest</span>
              </h2>
              <p className="text-muted-foreground text-lg">Pay only for the time you play. No hidden fees.</p>
            </m.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-fluid mb-16">
              {PRICING.map(({ label, price, tag }, i) => {
                const isFeatured = tag === 'Best Value';
                return (
                  <m.div
                    key={label}
                    initial={{ opacity: 0, y: 40 }}
                    animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className={`relative p-8 rounded-3xl border backdrop-blur-xl flex flex-col items-center text-center transition-all duration-300 ${isFeatured
                      ? 'border-primary/50 bg-gradient-to-b from-primary/10 to-card/20 shadow-[0_0_40px_rgba(255,107,53,0.15)]'
                      : 'border-border/50 bg-card/20 hover:border-primary/30'
                      }`}
                  >
                    {tag && (
                      <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isFeatured ? 'bg-gradient-to-r from-primary to-orange-500 text-white' : 'bg-background border border-primary/30 text-primary'}`}>
                        {tag}
                      </span>
                    )}
                    <Timer className={`w-8 h-8 mb-4 ${isFeatured ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-black text-foreground">₹{price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{Math.round(price / parseInt(label))} / hr
                    </p>
                  </m.div>
                );
              })}
            </div>

            {/* What's included checklist */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="p-8 rounded-3xl border border-border/50 bg-card/20 backdrop-blur-xl"
            >
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-6">Every session includes</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INCLUSIONS.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </m.div>
          </div>
        </section>

        {/* ══════════ CTA BANNER ══════════ */}
        <section className="relative py-fluid-section overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-orange-500/5 to-primary/10 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,53,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,53,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
            <m.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <Flame className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-fluid-h2 font-black uppercase tracking-tighter mb-6">
                Ready to <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Race?</span>
              </h2>
              <p className="text-muted-foreground text-xl mb-10 max-w-lg mx-auto">
                Walk into ZARCZ and jump straight into the cockpit. No booking needed — just show up and play.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="tel:+919567136395">
                  <m.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(255,107,53,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white font-black uppercase tracking-wider shadow-[0_0_30px_rgba(255,107,53,0.4)]"
                  >
                    Get In Touch
                    <ArrowRight className="w-5 h-5" />
                  </m.button>
                </a>
                <Link href="/">
                  <m.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-10 py-5 rounded-2xl border border-border bg-card/30 backdrop-blur-xl text-foreground font-bold uppercase tracking-wider hover:border-primary/40 transition-colors"
                  >
                    Back to Home
                  </m.button>
                </Link>
              </div>
            </m.div>
          </div>
        </section>

      </main>
    </LazyMotion>
  );
}
