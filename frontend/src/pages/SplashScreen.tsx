import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShieldCheck } from 'lucide-react';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: '/home' });
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="app-container gradient-splash flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full opacity-10"
        style={{ background: 'oklch(0.85 0.12 140)' }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full opacity-10"
        style={{ background: 'oklch(0.85 0.12 140)' }} />
      <div className="absolute top-1/3 left-[-40px] w-32 h-32 rounded-full opacity-5"
        style={{ background: 'oklch(0.9 0.1 140)' }} />

      {/* Logo area */}
      <div className="flex flex-col items-center gap-6 animate-scale-in z-10">
        {/* Logo */}
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-glow"
            style={{ background: 'oklch(0.99 0 0 / 0.15)', backdropFilter: 'blur(12px)', border: '1.5px solid oklch(0.99 0 0 / 0.25)' }}>
            <img
              src="/assets/generated/foodguard-logo.dim_256x256.png"
              alt="FoodGuard AI Logo"
              className="w-20 h-20 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.removeAttribute('style');
              }}
            />
            <ShieldCheck
              className="w-16 h-16 text-white"
              style={{ display: 'none' }}
            />
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-3xl pulse-ring"
            style={{ border: '2px solid oklch(0.99 0 0 / 0.3)' }} />
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
            FoodGuard
          </h1>
          <span className="text-2xl font-extrabold tracking-widest"
            style={{ color: 'oklch(0.85 0.18 140)' }}>
            AI
          </span>
        </div>

        {/* Tagline */}
        <p className="text-center text-base font-medium max-w-[220px] leading-relaxed"
          style={{ color: 'oklch(0.9 0.04 155)' }}>
          Scan smarter. Eat healthier. Live better.
        </p>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: 'oklch(0.9 0.06 145)',
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
