import React, { useEffect, useRef } from 'react';
import { ThemeMode, AppMode } from '../../types';

interface BackgroundParticlesProps {
  theme: ThemeMode;
  mode?: AppMode;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ theme, mode = 'passenger' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palettes for particles based on both mode and theme
    let colors: string[];
    let lineStrokeBase: string;

    if (mode === 'authority') {
      // Operations / Command Center: Blues, Indigos, Cobalts, Ambers
      colors =
        theme === 'dark'
          ? ['#3b82f6', '#6366f1', '#06b6d4', '#f59e0b', '#818cf8']
          : ['#2563eb', '#4f46e5', '#0284c7', '#d97706', '#6366f1'];
      lineStrokeBase = theme === 'dark' ? 'rgba(59, 130, 246' : 'rgba(37, 99, 235';
    } else if (mode === 'landing') {
      // Dual-Persona Fusion: Emerald, Indigo, Teal, Purple
      colors =
        theme === 'dark'
          ? ['#10b981', '#3b82f6', '#8b5cf6', '#06b6d4', '#14b8a6']
          : ['#059669', '#2563eb', '#7c3aed', '#0891b2', '#0d9488'];
      lineStrokeBase = theme === 'dark' ? 'rgba(20, 184, 166' : 'rgba(13, 148, 136';
    } else {
      // Passenger Mobility: Emeralds, Mints, Teals, Cyans
      colors =
        theme === 'dark'
          ? ['#10b981', '#14b8a6', '#06b6d4', '#34d399', '#2dd4bf']
          : ['#059669', '#0d9488', '#0891b2', '#10b981', '#14b8a6'];
      lineStrokeBase = theme === 'dark' ? 'rgba(16, 185, 129' : 'rgba(5, 150, 105';
    }

    const particleCount = Math.min(32, Math.floor((width * height) / 35000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting lines
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * (theme === 'dark' ? 0.09 : 0.05);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${lineStrokeBase}, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = theme === 'dark' ? p.alpha * 0.75 : p.alpha * 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity"
      aria-hidden="true"
    />
  );
};

