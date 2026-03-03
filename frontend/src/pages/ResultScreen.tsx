import React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, ScanLine, User, AlertTriangle, Flame, Droplets, Zap, CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { HealthScoreGauge } from '@/components/HealthScoreGauge';
import { useAnalyzeFood, useGetHealthWarnings } from '@/hooks/useQueries';
import type { Level, HealthStatus } from '../backend';

function LevelBadge({ level, label }: { level: Level; label: string }) {
  const colors = {
    Low: { bg: 'oklch(0.94 0.06 145)', text: 'oklch(0.35 0.14 145)', dot: '#22c55e' },
    Medium: { bg: 'oklch(0.96 0.06 75)', text: 'oklch(0.5 0.14 75)', dot: '#f59e0b' },
    High: { bg: 'oklch(0.96 0.06 25)', text: 'oklch(0.45 0.18 25)', dot: '#ef4444' },
  };
  const c = colors[level] || colors.Medium;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ background: c.bg }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      <span className="text-xs font-bold" style={{ color: c.text }}>{level}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: HealthStatus }) {
  const config = {
    safe: { icon: CheckCircle2, label: 'Safe', bg: 'oklch(0.94 0.06 145)', text: 'oklch(0.35 0.14 145)', border: 'oklch(0.82 0.1 145)' },
    moderate: { icon: AlertCircle, label: 'Moderate', bg: 'oklch(0.96 0.06 75)', text: 'oklch(0.5 0.14 75)', border: 'oklch(0.85 0.1 75)' },
    harmful: { icon: XCircle, label: 'Harmful', bg: 'oklch(0.96 0.06 25)', text: 'oklch(0.45 0.18 25)', border: 'oklch(0.85 0.1 25)' },
  };
  const c = config[status] || config.moderate;
  const Icon = c.icon;
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border"
      style={{ background: c.bg, borderColor: c.border }}>
      <Icon className="w-4 h-4" style={{ color: c.text }} />
      <span className="text-sm font-bold" style={{ color: c.text }}>{c.label}</span>
    </div>
  );
}

export function ResultScreen() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/result' }) as { foodName?: string };
  const foodName = search?.foodName || null;

  const { data: foodResult, isLoading: foodLoading, error: foodError } = useAnalyzeFood(foodName);
  const { data: warningsData, isLoading: warningsLoading } = useGetHealthWarnings(foodName);

  const warnings = warningsData?.warnings?.filter(w =>
    w !== 'Safe' && w !== 'Moderate' && w !== 'Harmful'
  ) || [];

  if (!foodName) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-screen gap-4 px-5">
        <AlertCircle className="w-16 h-16" style={{ color: 'oklch(0.58 0.22 25)' }} />
        <p className="text-foreground font-bold text-lg text-center">No food selected</p>
        <button
          onClick={() => navigate({ to: '/home' })}
          className="px-6 py-3 rounded-xl text-white font-semibold"
          style={{ background: 'oklch(0.38 0.12 155)' }}
        >
          Go Home
        </button>
      </div>
    );
  }

  if (foodLoading) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'oklch(0.38 0.12 155)' }} />
        <p className="text-muted-foreground font-medium">Analyzing {foodName}…</p>
      </div>
    );
  }

  if (foodError || !foodResult) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-screen gap-4 px-5">
        <XCircle className="w-16 h-16" style={{ color: 'oklch(0.58 0.22 25)' }} />
        <p className="text-foreground font-bold text-lg text-center">Food not found</p>
        <p className="text-muted-foreground text-sm text-center">
          "{foodName}" is not in our database. Try a different food name.
        </p>
        <button
          onClick={() => navigate({ to: '/food-input' })}
          className="px-6 py-3 rounded-xl text-white font-semibold"
          style={{ background: 'oklch(0.38 0.12 155)' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const score = Number(foodResult.healthScore);

  return (
    <div className="app-container flex flex-col min-h-screen bg-background screen-enter">
      {/* Header */}
      <header className="gradient-hero px-5 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/food-input' })}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'oklch(0.99 0 0 / 0.15)' }}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-extrabold text-xl">Analysis Result</h1>
          <button
            onClick={() => navigate({ to: '/profile' })}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'oklch(0.99 0 0 / 0.15)' }}
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Score gauge */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <HealthScoreGauge score={score} size={160} />
          <StatusBadge status={foodResult.status} />
          <h2 className="text-white font-extrabold text-2xl mt-1">{foodResult.foodName}</h2>
        </div>
      </header>

      <main className="flex-1 px-5 py-5 flex flex-col gap-4">
        {/* Nutrition stats */}
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-bold text-sm text-foreground">Nutritional Overview</h3>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="flex flex-col items-center py-4 gap-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                style={{ background: 'oklch(0.96 0.06 25)' }}>
                <Flame className="w-4 h-4" style={{ color: 'oklch(0.58 0.22 25)' }} />
              </div>
              <span className="text-xl font-extrabold text-foreground">{Number(foodResult.calories)}</span>
              <span className="text-xs text-muted-foreground font-medium">Calories</span>
            </div>
            <div className="flex flex-col items-center py-4 gap-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                style={{ background: 'oklch(0.96 0.06 75)' }}>
                <Droplets className="w-4 h-4" style={{ color: 'oklch(0.58 0.16 75)' }} />
              </div>
              <LevelBadge level={foodResult.sugarLevel} label="Sugar" />
              <span className="text-xs text-muted-foreground font-medium">Sugar</span>
            </div>
            <div className="flex flex-col items-center py-4 gap-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                style={{ background: 'oklch(0.94 0.06 145)' }}>
                <Zap className="w-4 h-4" style={{ color: 'oklch(0.38 0.12 155)' }} />
              </div>
              <LevelBadge level={foodResult.fatLevel} label="Fat" />
              <span className="text-xs text-muted-foreground font-medium">Fat</span>
            </div>
          </div>
        </div>

        {/* Health score breakdown */}
        <div className="bg-card rounded-2xl shadow-card border border-border p-4">
          <h3 className="font-bold text-sm text-foreground mb-3">Score Breakdown</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Base Score', value: 100, color: 'oklch(0.38 0.12 155)' },
              ...(foodResult.sugarLevel === 'High' ? [{ label: 'High Sugar Penalty', value: -20, color: 'oklch(0.58 0.22 25)' }] : []),
              ...(foodResult.fatLevel === 'High' ? [{ label: 'High Fat Penalty', value: -15, color: 'oklch(0.58 0.22 25)' }] : []),
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <span className="text-xs font-bold" style={{ color }}>
                  {value > 0 ? `+${value}` : value}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Final Score</span>
              <span className="text-sm font-extrabold" style={{ color: 'oklch(0.38 0.12 155)' }}>
                {score} / 100
              </span>
            </div>
          </div>
        </div>

        {/* Personalized warnings */}
        {!warningsLoading && warnings.length > 0 && (
          <div className="rounded-2xl border overflow-hidden"
            style={{ background: 'oklch(0.97 0.04 75)', borderColor: 'oklch(0.88 0.08 75)' }}>
            <div className="px-4 py-3 border-b flex items-center gap-2"
              style={{ borderColor: 'oklch(0.88 0.08 75)', background: 'oklch(0.94 0.06 75)' }}>
              <AlertTriangle className="w-4 h-4" style={{ color: 'oklch(0.55 0.16 75)' }} />
              <h3 className="font-bold text-sm" style={{ color: 'oklch(0.45 0.14 75)' }}>
                Personalized Health Warnings
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {warnings.map((warning, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.55 0.16 75)' }} />
                  <p className="text-sm font-medium" style={{ color: 'oklch(0.4 0.12 75)' }}>{warning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={() => navigate({ to: '/camera' })}
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-border bg-card hover:bg-accent transition-colors"
            style={{ color: 'oklch(0.38 0.12 155)' }}
          >
            <ScanLine className="w-4 h-4" />
            Scan Again
          </button>
          <button
            onClick={() => navigate({ to: '/profile' })}
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-white transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, oklch(0.38 0.12 155), oklch(0.48 0.16 148))' }}
          >
            <User className="w-4 h-4" />
            My Profile
          </button>
        </div>
      </main>
    </div>
  );
}
