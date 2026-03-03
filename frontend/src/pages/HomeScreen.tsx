import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ScanLine, User, ShieldCheck, Leaf, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HomeScreen() {
  const navigate = useNavigate();

  const features = [
    { icon: ScanLine, title: 'Smart Food Scan', desc: 'Identify any food instantly' },
    { icon: ShieldCheck, title: 'Health Score', desc: 'Get a 0–100 safety rating' },
    { icon: Leaf, title: 'Ingredient Check', desc: 'Detect harmful additives' },
  ];

  return (
    <div className="app-container flex flex-col min-h-screen bg-background screen-enter">
      {/* Header */}
      <header className="gradient-hero px-5 pt-12 pb-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-40px] right-[-40px] w-40 h-40 rounded-full opacity-10"
          style={{ background: 'oklch(0.85 0.12 140)' }} />
        <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full opacity-10"
          style={{ background: 'oklch(0.85 0.12 140)' }} />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'oklch(0.99 0 0 / 0.15)' }}>
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-extrabold text-lg leading-none">FoodGuard</span>
              <span className="font-extrabold text-lg leading-none ml-1"
                style={{ color: 'oklch(0.85 0.18 140)' }}>AI</span>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: '/profile' })}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: 'oklch(0.99 0 0 / 0.15)', border: '1.5px solid oklch(0.99 0 0 / 0.25)' }}
            aria-label="Go to Profile"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Hero content */}
        <div className="mt-8 relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'oklch(0.82 0.14 145)' }}>
            Your AI Food Guardian
          </p>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Know What's<br />In Your Food
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed"
            style={{ color: 'oklch(0.88 0.04 155)' }}>
            Scan any food item to get instant health insights, calorie counts, and personalized warnings.
          </p>
        </div>

        {/* Hero image */}
        <div className="mt-6 relative z-10 rounded-2xl overflow-hidden"
          style={{ height: '180px' }}>
          <img
            src="/assets/generated/home-hero.dim_800x600.png"
            alt="Food scanning illustration"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.parentElement!.style.display = 'none';
            }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, oklch(0.38 0.12 155 / 0.5), transparent)' }} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-5 py-6 flex flex-col gap-5">
        {/* Primary CTA */}
        <button
          onClick={() => navigate({ to: '/camera' })}
          className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg text-white shadow-glow transition-all active:scale-[0.98] hover:shadow-card-hover"
          style={{
            background: 'linear-gradient(135deg, oklch(0.38 0.12 155), oklch(0.48 0.16 148))',
          }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'oklch(0.99 0 0 / 0.15)' }}>
            <ScanLine className="w-6 h-6" />
          </div>
          Scan Food Now
          <ChevronRight className="w-5 h-5 ml-auto" />
        </button>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="bg-card rounded-2xl p-3 flex flex-col items-center text-center gap-2 shadow-card border border-border">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'oklch(0.93 0.04 155)' }}>
                <Icon className="w-5 h-5" style={{ color: 'oklch(0.38 0.12 155)' }} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground leading-tight">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-bold text-sm text-foreground">Quick Actions</h3>
          </div>
          <button
            onClick={() => navigate({ to: '/ingredient-scan' })}
            className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-accent transition-colors active:bg-accent border-b border-border"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'oklch(0.93 0.04 155)' }}>
              <Leaf className="w-4 h-4" style={{ color: 'oklch(0.38 0.12 155)' }} />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-foreground">Scan Ingredients Label</p>
              <p className="text-xs text-muted-foreground">Detect harmful additives</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => navigate({ to: '/profile' })}
            className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-accent transition-colors active:bg-accent"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'oklch(0.93 0.04 155)' }}>
              <Zap className="w-4 h-4" style={{ color: 'oklch(0.38 0.12 155)' }} />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-foreground">Personal Health Mode</p>
              <p className="text-xs text-muted-foreground">Set your health conditions</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Built with{' '}
          <span style={{ color: 'oklch(0.58 0.22 25)' }}>♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'foodguard-ai')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
            style={{ color: 'oklch(0.38 0.12 155)' }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
