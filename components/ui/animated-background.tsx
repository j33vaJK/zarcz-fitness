"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/** Canvas particle field — draws small floating orange dots */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 65 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      a:  Math.random() * 0.45 + 0.12,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x = (p.x + p.vx + canvas.width)  % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,107,53,${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.38,
      }}
    />
  );
}

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* ── Layered background ── */}
      <motion.div
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {/* Subtle grid */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: [
              'linear-gradient(rgba(255,107,53,0.035) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(255,107,53,0.035) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '64px 64px',
          }}
        />

        {/* Right glow — orange */}
        <div
          style={{
            position: 'absolute',
            top: '5%', left: '42%',
            width: '60%', height: '75%',
            background: 'radial-gradient(ellipse at center, rgba(255,107,53,0.11) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Bottom-left glow — blue (can be updated to orange if needed, leaving as blue/purple for depth) */}
        <div
          style={{
            position: 'absolute',
            bottom: '-5%', left: '-5%',
            width: '45%', height: '55%',
            background: 'radial-gradient(ellipse at center, rgba(30,100,220,0.12) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_85%_85%_at_50%_50%,transparent_45%,var(--background)_100%)] opacity-75 pointer-events-none"
        />
      </motion.div>

      {/* Particles */}
      <ParticleField />
    </div>
  );
}
