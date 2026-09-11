'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  phase: number;
  pulseSpeed: number;
}

export function ParticleCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = 1;
    let width = 0;
    let height = 0;

    let isDark = document.documentElement.classList.contains('dark');

    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
      updateColors();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const getColors = () => {
      if (isDark) {
        return {
          particles: ['#38bdf8', '#60a5fa', '#34d399', '#ffffff', '#818cf8'],
          lineRgb: '56, 189, 248',
          mouseRgb: '96, 165, 250',
        };
      } else {
        return {
          particles: ['#1d4ed8', '#0f172a', '#059669', '#2563eb', '#475569'],
          lineRgb: '29, 78, 216',
          mouseRgb: '15, 23, 42',
        };
      }
    };

    let colors = getColors();
    const particles: Particle[] = [];

    const createParticle = (w: number, h: number): Particle => {
      const palette = colors.particles;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2 + 1.2,
        color: palette[Math.floor(Math.random() * palette.length)],
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.0015 + Math.random() * 0.002,
      };
    };

    const setupCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = width < 768;
      const targetCount = isMobile
        ? Math.min(Math.max(Math.floor((width * height) / 6500), 40), 55)
        : Math.min(Math.floor((width * height) / 11000), 80);

      if (particles.length === 0) {
        for (let i = 0; i < targetCount; i++) {
          particles.push(createParticle(width, height));
        }
      } else if (particles.length < targetCount) {
        while (particles.length < targetCount) {
          particles.push(createParticle(width, height));
        }
      } else if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    };

    setupCanvas();

    function updateColors() {
      colors = getColors();
      particles.forEach((p) => {
        p.color = colors.particles[Math.floor(Math.random() * colors.particles.length)];
      });
    }

    const mouse = { x: -9999, y: -9999, radius: 140 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 768;
      const maxDistance = isMobile ? 120 : 130;
      const touchRadius = isMobile ? 160 : mouse.radius;

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic ambient drift for lively organic motion
        const harmonicX = Math.sin(time * 0.0009 + p.phase) * (isMobile ? 0.35 : 0.18);
        const harmonicY = Math.cos(time * 0.0009 + p.phase) * (isMobile ? 0.35 : 0.18);

        p.x += p.vx + harmonicX;
        p.y += p.vy + harmonicY;

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        const pulsedRadius = Math.max(0.8, p.radius + Math.sin(time * p.pulseSpeed + p.phase) * 0.45);

        // Particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = isDark ? (isMobile ? 10 : 8) : 0;
        ctx.shadowColor = p.color;
        ctx.fill();

        // Connect particles with network lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? (isMobile ? 0.34 : 0.28) : 0.18);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${colors.lineRgb}, ${alpha})`;
            ctx.lineWidth = isMobile ? 1.1 : 1;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }

        // Connect to touch / pointer
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < touchRadius) {
          const mAlpha = (1 - mdist / touchRadius) * (isDark ? 0.55 : 0.35);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${colors.mouseRgb}, ${mAlpha})`;
          ctx.lineWidth = isMobile ? 1.5 : 1.2;
          ctx.shadowBlur = isDark ? 6 : 0;
          ctx.shadowColor = `rgba(${colors.mouseRgb}, 0.5)`;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
}
