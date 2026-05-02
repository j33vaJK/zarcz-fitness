"use client";

import { m, LazyMotion, domAnimation, Variants } from "framer-motion";
import { Activity, Shield, Trophy, Zap, ChevronRight, Dumbbell, MapPin, Users } from "lucide-react";
import { useTestimonials } from "@/hooks/use-testimonials";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AnimatedBackground } from "@/components/ui/animated-background";

const FADE_UP_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0, duration: 0.8 } },
};

export default function AboutPage() {
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background selection:bg-primary/30 relative">
        <AnimatedBackground />

        {/* Hero Section */}
        <section className="relative py-fluid-section overflow-hidden border-b border-border/50">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/4" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid items-center">
              {/* Text Content */}
              <m.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
                className="max-w-2xl"
              >
                <m.div variants={FADE_UP_ANIMATION_VARIANTS} className="inline-flex items-center text-primary font-black tracking-widest uppercase text-sm mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl shadow-[0_0_20px_rgba(255,107,53,0.15)]">
                  <Activity className="mr-2 h-4 w-4" /> Who We Are
                </m.div>
                <m.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-h1 font-black tracking-tighter leading-[0.9] uppercase overflow-hidden drop-shadow-xl">
                  <span className="block opacity-20 text-foreground">Everyday</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 drop-shadow-lg block">Fitness.</span>
                </m.h1>
                <m.p variants={FADE_UP_ANIMATION_VARIANTS} className="mt-8 text-fluid-p text-muted-foreground leading-relaxed font-medium">
                  ZARCZ was built on a simple idea: good fitness gear shouldn't be a luxury. We provide reliable, durable equipment and accessories at honest prices for your everyday workouts.
                </m.p>
              </m.div>

              {/* Image Collage Placeholder */}
              <m.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="relative hidden md:block h-[500px] w-full"
              >
                {/* Image 1 (Main) */}
                <div className="absolute top-0 right-0 w-[65%] h-[75%] rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl group z-20">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-30" />
                  <Image
                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80"
                    alt="Gym Equipment"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>

                {/* Image 2 (Bottom Left) */}
                <div className="absolute bottom-0 left-[10%] w-[45%] h-[55%] rounded-[2rem] overflow-hidden border border-border/50 shadow-xl group z-30">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-30" />
                  <Image
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80"
                    alt="Fitness Accessories"
                    fill
                    sizes="(max-width: 1024px) 100vw, 300px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>

                {/* Image 3 (Background Accent) */}
                <div className="absolute top-[10%] left-0 w-[40%] h-[45%] rounded-[2rem] overflow-hidden border border-border/50 shadow-lg group z-10 opacity-80">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-40" />
                  <Image
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"
                    alt="Store Environment"
                    fill
                    sizes="(max-width: 1024px) 100vw, 300px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 grayscale hover:grayscale-0"
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl z-0" />
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl z-0" />
              </m.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-12 flex items-center gap-4 text-xs font-bold tracking-widest text-muted-foreground uppercase pointer-events-none hidden md:flex"
          >
            <div className="h-[1px] w-12 bg-gradient-to-r from-muted-foreground to-transparent" />
            <span>Scroll to uncover</span>
          </m.div>
        </section>

        {/* Values Section */}
        <section className="py-fluid-section relative border-b border-border/50 overflow-hidden">
          <div className="absolute left-0 top-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="mb-16 md:mb-24"
            >
              <m.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-h2 font-black uppercase tracking-tight text-foreground">Our Core Values</m.h2>
              <m.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-p text-muted-foreground mt-4 max-w-2xl font-medium">The fundamental principles that guide our products and community.</m.p>
            </m.div>

            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
              className="grid grid-cols-1 md:grid-cols-3 gap-fluid"
            >
              {[
                { icon: Shield, title: "Reliable Quality", desc: "We ensure our gear is durable and built to last through your daily workouts without breaking the bank." },
                { icon: Zap, title: "Practical Design", desc: "Functional and comfortable fitness gear designed specifically for everyday gym-goers and fitness enthusiasts." },
                { icon: Trophy, title: "Value for Money", desc: "We believe fitness should be accessible to everyone, offering great quality at affordable Indian prices." }
              ].map((value, i) => (
                <m.div key={i} variants={FADE_UP_ANIMATION_VARIANTS} className="group relative">
                  <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-b from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 blur-md" />
                  <div className="space-y-6 p-8 md:p-10 rounded-[2rem] bg-card/95 backdrop-blur-xl border border-border/50 relative shadow-2xl h-full flex flex-col justify-between overflow-hidden group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110" />
                    <div>
                      <div className="h-16 w-16 mb-8 rounded-2xl bg-background flex items-center justify-center border border-border shadow-inner group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                        <value.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-fluid-h3 font-black uppercase tracking-tight leading-none mb-4 text-foreground">{value.title}</h3>
                      <m.p className="text-muted-foreground text-fluid-p leading-relaxed font-medium">{value.desc}</m.p>
                    </div>
                    <div className="pt-8 w-full">
                      <Button variant="ghost" className="font-bold text-primary group-hover:translate-x-2 transition-transform p-0 hover:bg-transparent">
                        Explore specs <ChevronRight className="w-5 h-5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </m.div>
              ))}
            </m.div>
          </div>
        </section>

        {/* ZARCZ Gym Section */}
        <section className="py-fluid-section relative border-b border-border/50 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="flex flex-col lg:flex-row gap-fluid items-center"
            >
              <m.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex-1 space-y-8">
                <div className="inline-flex items-center text-primary font-black tracking-widest uppercase text-sm mb-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                  <Dumbbell className="mr-2 h-4 w-4" /> Physical Location
                </div>
                <h2 className="text-fluid-h2 font-black tracking-tight leading-tight uppercase text-foreground">
                  The ZARCZ <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Gym Facility</span>
                </h2>
                <p className="text-fluid-p text-muted-foreground leading-relaxed font-medium">
                  More than just an equipment brand, ZARCZ is a growing local fitness community. Our neighborhood gym facility provides a welcoming space to work out, stay fit, and connect with like-minded people.
                </p>
                <p className="text-fluid-p text-muted-foreground leading-relaxed">
                  It's a practical, friendly environment equipped with all the essential gear you need for a solid daily workout, whether you're just starting out or keeping up with your routine.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm font-bold uppercase tracking-wider text-foreground">Central Hub</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm font-bold uppercase tracking-wider text-foreground">Driven Community</div>
                  </div>
                </div>
              </m.div>

              <m.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex-1 w-full relative">
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative border border-border/50 shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-40" />
                  <Image
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
                    alt="ZARCZ Training Facility"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-10 pointer-events-none" />
                </div>
              </m.div>
            </m.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-fluid-section relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="text-center mb-20 space-y-6"
            >
              <m.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-h1 font-black uppercase tracking-tighter text-foreground">What Our Community Says</m.h2>
              <m.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-fluid-p text-muted-foreground max-w-3xl mx-auto font-medium">Honest feedback from everyday fitness enthusiasts who use our gear.</m.p>
            </m.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fluid mt-16">
              {testimonialsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-[2rem] bg-muted animate-pulse" />
                ))
              ) : (
                (testimonials ?? []).map((testimonial, i) => (
                  <m.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    key={testimonial.id}
                    className={`bg-card/95 backdrop-blur-xl p-10 rounded-[2rem] border border-border/50 shadow-2xl relative hover:border-primary/50 transition-colors group ${i === 1 ? 'lg:-translate-y-12' : ''} ${i === 2 ? 'lg:translate-y-12' : ''}`}
                  >
                    <div className="absolute top-6 right-8 text-[8rem] text-primary/10 font-serif leading-none group-hover:text-primary/20 transition-colors">&quot;</div>
                    <div className="flex items-center gap-5 mb-8 relative z-10">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity" />
                        <div className="w-full h-full rounded-full border-2 border-primary bg-background flex items-center justify-center relative z-10 font-black text-2xl text-primary shadow-[inset_0_0_10px_rgba(255,107,53,0.1)] group-hover:scale-105 transition-transform duration-300">
                          {testimonial.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-xl uppercase tracking-tight text-foreground">{testimonial.name}</h4>
                      </div>
                    </div>
                    <m.p className="text-muted-foreground font-medium text-fluid-p leading-relaxed relative z-10">&quot;{testimonial.content}&quot;</m.p>
                  </m.div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
