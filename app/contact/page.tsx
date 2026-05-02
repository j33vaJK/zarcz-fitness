"use client";

import { useRef, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Send, MapPin, Phone, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedBackground } from "@/components/ui/animated-background";

// Contact Information Placeholders
const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email Us",
    details: "zarczfitnesssolution26@gmail.com",
    description: "Drop us a line anytime. We usually reply within 24 hours.",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+91 95671 36395",
    description: "Mon-Sun from 10am to 9pm. Available for support and sales.",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "ZarcZ Fitness Solutions, Puthenkada, Thirumala, Trivandrum, Kerala 695006",
    description: "Our flagship store and main headquarters.",
  },
];

const FADE_UP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

const STAGGER_VARIANTS: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // NOTE: Replace these with your actual EmailJS credentials
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

      if (SERVICE_ID === "YOUR_SERVICE_ID" || !SERVICE_ID) {
        // Simulate a delay and success for demo purposes if keys are not set
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSuccess(true);
        formRef.current?.reset();
      } else {
        await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY);
        setIsSuccess(true);
        formRef.current?.reset();
      }
    } catch (err) {
      console.error("Failed to send email:", err);
      setError("Failed to send your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col py-fluid-section overflow-hidden selection:bg-primary/30">
      <AnimatedBackground />

      <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header Section */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isHeaderInView ? "show" : "hidden"}
          variants={STAGGER_VARIANTS}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-4"
        >
          <motion.div variants={FADE_UP_VARIANTS} className="inline-flex items-center gap-3 justify-center mb-4">
            <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-primary" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-primary">
              Contact Support
            </span>
            <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-primary" />
          </motion.div>

          <motion.h1
            variants={FADE_UP_VARIANTS}
            className="text-fluid-h1 font-black tracking-tight text-foreground"
          >
            Get in <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">Touch</span>
          </motion.h1>

          <motion.p
            variants={FADE_UP_VARIANTS}
            className="text-fluid-p text-muted-foreground"
          >
            Whether you have a question about our premium gear, need help with an order, or just want to say hi, our team is ready to assist you.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-fluid items-start">

          {/* Left Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden group"
          >
            {/* Form ambient glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black mb-8 text-foreground">Send a Message</h2>

              <form ref={formRef} onSubmit={handleSendEmail} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="user_name" className="text-sm font-bold text-foreground/80 ml-1">Full Name</label>
                    <Input
                      id="user_name"
                      name="user_name"
                      placeholder="John Doe"
                      required
                      className="h-14 bg-background/50 border-border/50 focus-visible:ring-primary/50 rounded-2xl px-5 text-base shadow-inner transition-all hover:bg-background/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="user_email" className="text-sm font-bold text-foreground/80 ml-1">Email Address</label>
                    <Input
                      id="user_email"
                      type="email"
                      name="user_email"
                      placeholder="john@gmail.com"
                      required
                      className="h-14 bg-background/50 border-border/50 focus-visible:ring-primary/50 rounded-2xl px-5 text-base shadow-inner transition-all hover:bg-background/80"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold text-foreground/80 ml-1">Subject</label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help you?"
                    required
                    className="h-14 bg-background/50 border-border/50 focus-visible:ring-primary/50 rounded-2xl px-5 text-base shadow-inner transition-all hover:bg-background/80"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-foreground/80 ml-1">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Type your message here..."
                    required
                    className="min-h-[160px] bg-background/50 border-border/50 focus-visible:ring-primary/50 rounded-2xl p-5 text-base resize-y shadow-inner transition-all hover:bg-background/80"
                  />
                </div>

                {error && (
                  <p className="text-sm font-bold text-red-500 animate-in fade-in slide-in-from-bottom-2">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-wider relative overflow-hidden group shadow-[0_0_30px_rgba(255,107,53,0.2)] hover:shadow-[0_0_40px_rgba(255,107,53,0.4)] transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-orange-400 to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Contact Info Cards */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={STAGGER_VARIANTS}
            className="space-y-6 flex flex-col justify-center h-full"
          >
            {CONTACT_INFO.map((info, i) => (
              <motion.div
                key={i}
                variants={FADE_UP_VARIANTS}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group p-6 sm:p-8 rounded-3xl bg-card/20 backdrop-blur-md border border-border/40 hover:border-primary/40 hover:bg-card/40 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/10 transition-colors" />

                <div className="flex gap-4 sm:gap-6 items-start relative z-10">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-xl font-black text-foreground">{info.title}</h3>
                    <p className="font-medium text-foreground/90 break-all">{info.details}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
