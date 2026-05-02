'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Activity, Flame, Trophy } from 'lucide-react';
import { CategoryCard } from '@/components/ui/category-card';
import { ServiceCard } from '@/components/ui/service-card';
import { useCategories } from '@/hooks/use-categories';
import { useServices } from '@/hooks/use-services';
import { useTestimonials } from '@/hooks/use-testimonials';
import { m, LazyMotion, domAnimation, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import HeroSection from '@/components/layout/HeroSection';
import { AnimatedBackground } from '@/components/ui/animated-background';

const FeaturedGearSection = dynamic(() => import('@/components/layout/FeaturedGearSection'), { ssr: false });

const FADE_UP_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0, duration: 0.8 } },
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();

  return (
    <LazyMotion features={domAnimation}>
      <div ref={containerRef} className="flex flex-col min-h-screen bg-background selection:bg-primary/30 relative">
        <AnimatedBackground />
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Products */}
        <FeaturedGearSection />


        {/* Categories */}
        <section className="py-fluid-section border-y border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="text-center mb-16 space-y-4"
            >
              <m.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-h2 font-black tracking-tight">Shop by Category</m.h2>
              <m.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-muted-foreground text-fluid-p max-w-[600px] mx-auto">Find exactly what you need for your specific training style.</m.p>
            </m.div>

            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-fluid"
            >
              {categoriesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-[2rem] bg-muted animate-pulse" />
                ))
              ) : (
                (categories ?? []).slice(0, 4).map((category) => (
                  <m.div key={category.id} variants={FADE_UP_ANIMATION_VARIANTS}>
                    <CategoryCard category={category} />
                  </m.div>
                ))
              )}
            </m.div>
          </div>
        </section>

        {/* Game-Play / Performance Section */}
        <section className="py-fluid-section relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="flex flex-col lg:flex-row gap-fluid items-center"
            >
              <m.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex-1 space-y-8">
                <div className="inline-flex items-center text-primary font-black tracking-widest uppercase text-sm">
                  <Activity className="mr-2 h-4 w-4" /> Track Your Progress
                </div>
                <h2 className="text-fluid-h1 font-black tracking-tight leading-tight">
                  Reach Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Fitness Goals</span>
                </h2>
                <p className="text-fluid-p text-muted-foreground leading-relaxed">
                  Consistent training leads to consistent results. Stay focused, stay active, and keep moving forward with gear you can rely on.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <div className="text-4xl font-black text-primary">+24%</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Endurance Boost</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-black text-primary">-15%</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fatigue Rate</div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2 shadow-[0_0_30px_rgba(255,107,53,0.3)] hover:scale-105 transition-all">
                    View Our Gear <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </m.div>

              <m.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex-1 relative w-full max-w-lg mx-auto">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden relative group border border-border/50 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-70" />
                  <Image
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
                    alt="Athlete in motion"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Overlay UI elements */}
                  <m.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="absolute top-8 left-8 z-20 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-2xl"
                  >
                    <Activity className="h-6 w-6 text-primary mb-2" />
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Heart Rate</div>
                    <div className="text-3xl font-black mt-1">168 <span className="text-sm">BPM</span></div>
                  </m.div>

                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="absolute bottom-8 right-8 z-20 bg-primary/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl text-white"
                  >
                    <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Output Level</div>
                    <div className="flex items-end gap-2">
                      <div className="text-4xl font-black">MAX</div>
                      <Flame className="w-6 h-6 animate-pulse" />
                    </div>
                  </m.div>
                </div>
              </m.div>
            </m.div>
          </div>
        </section>

        {/* About & Testimonials */}
        <section className="py-fluid-section border-y border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-fluid items-center">
              <m.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <m.div variants={FADE_UP_ANIMATION_VARIANTS} className="inline-flex items-center text-primary font-black tracking-widest uppercase text-sm">
                    <Trophy className="mr-2 h-4 w-4" /> Our Story
                  </m.div>
                  <m.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-h2 font-black tracking-tight">Quality Fitness Gear,<br />For Everyone.</m.h2>
                  <m.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-p text-muted-foreground leading-relaxed">
                    Founded in 2024, ZarcZ Fitness Solutions started with a simple belief: good fitness gear shouldn&apos;t be overpriced. We bridge the gap between quality equipment and everyday accessibility.
                  </m.p>
                  <m.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-p text-muted-foreground leading-relaxed">
                    We focus on providing durable, reliable equipment and accessories that offer great value for money on your fitness journey.
                  </m.p>
                </div>
                <m.div variants={FADE_UP_ANIMATION_VARIANTS}>
                  <Button size="lg" variant="outline" className="font-bold border-2 hover:bg-muted h-14 px-8">
                    Read Full Story
                  </Button>
                </m.div>
              </m.div>

              <m.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
                className="space-y-6"
              >
                {testimonialsLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-48 rounded-3xl bg-muted animate-pulse" />
                  ))
                ) : (
                  (testimonials ?? []).slice(0, 2).map((testimonial) => (
                    <m.div key={testimonial.id} variants={FADE_UP_ANIMATION_VARIANTS} className="bg-background p-8 md:p-10 rounded-3xl shadow-lg border border-border/50 relative hover:border-primary/50 transition-colors group">
                      <div className="absolute -left-2 -top-4 text-7xl text-primary/10 font-serif group-hover:text-primary/20 transition-colors">&quot;</div>
                      <div className="flex items-center gap-5 mb-6 relative z-10">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                          <div className="w-full h-full rounded-full border-2 border-primary bg-background flex items-center justify-center relative z-10 font-black text-2xl text-primary shadow-[inset_0_0_10px_rgba(255,107,53,0.1)] group-hover:scale-105 transition-transform duration-300">
                            {testimonial.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-xl">{testimonial.name}</h4>
                          <p className="text-sm text-primary font-bold uppercase tracking-wider">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground italic text-xl leading-relaxed relative z-10">&quot;{testimonial.content}&quot;</p>
                    </m.div>
                  ))
                )}
              </m.div>
            </div>
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="py-fluid-section relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

          <div className="container relative z-20 mx-auto px-4 md:px-6 text-center">
            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="max-w-3xl mx-auto space-y-10"
            >
              <m.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-h1 font-black text-foreground tracking-tight drop-shadow-lg">
                Ready to Crush Your Goals?
              </m.h2>
              <m.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-p text-muted-foreground font-medium">
                Join 50,000+ athletes receiving weekly training tips, exclusive gear drops, and nutritional guides.
              </m.p>
              <m.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 h-16 px-6 rounded-2xl border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 ring-primary outline-none backdrop-blur-xl transition-all font-medium text-lg shadow-inner"
                />
                <Button size="lg" className="h-16 px-10 font-bold text-lg shadow-2xl transition-transform hover:scale-105 rounded-2xl">
                  Subscribe
                </Button>
              </m.div>
              <m.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-sm text-muted-foreground font-medium tracking-wide">No spam. Unsubscribe at any time.</m.p>
            </m.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
