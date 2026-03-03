import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Search, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useActor } from '@/hooks/useActor';
import type { FoodAnalysisResult } from '../backend';

const FOOD_SUGGESTIONS = [
  'Apple', 'Banana', 'Chicken Breast', 'French Fries', 'Soda',
  'Salmon', 'Pizza', 'Broccoli', 'Ice Cream', 'Oatmeal',
  'Steak', 'Chocolate Bar', 'Carrots', 'Potato Chips', 'Pasta',
  'Yogurt', 'Burger', 'Rice', 'Orange Juice', 'Avocado',
];

export function FoodInputScreen() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [foodName, setFoodName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtered, setFiltered] = useState<string[]>([]);

  const handleInputChange = (value: string) => {
    setFoodName(value);
    setError(null);
    if (value.trim().length > 0) {
      setFiltered(
        FOOD_SUGGESTIONS.filter((f) =>
          f.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 6)
      );
    } else {
      setFiltered([]);
    }
  };

  const handleAnalyze = async (name: string = foodName) => {
    if (!name.trim()) return;
    if (!actor) {
      setError('App is still loading. Please try again.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result: FoodAnalysisResult | null = await actor.analyzeFood(name.trim());
      if (result) {
        navigate({
          to: '/result',
          search: { foodName: name.trim() },
        });
      } else {
        setError(`"${name}" not found in our database. Try a common food name like "Apple" or "Pizza".`);
      }
    } catch {
      setError('Failed to analyze food. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container flex flex-col min-h-screen bg-background screen-enter">
      {/* Header */}
      <header className="gradient-hero px-5 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/camera' })}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'oklch(0.99 0 0 / 0.15)' }}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white font-extrabold text-xl">Identify Food</h1>
            <p className="text-sm" style={{ color: 'oklch(0.88 0.04 155)' }}>
              Enter the food name to analyze
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 flex flex-col gap-5">
        {/* Info card */}
        <div className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: 'oklch(0.93 0.04 155)', border: '1px solid oklch(0.85 0.06 155)' }}>
          <Search className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.38 0.12 155)' }} />
          <p className="text-sm font-medium" style={{ color: 'oklch(0.32 0.1 155)' }}>
            After capturing a photo, enter the food name below to get a full health analysis.
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-foreground">Food Name</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={foodName}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="e.g. Apple, Pizza, Salmon…"
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ '--tw-ring-color': 'oklch(0.38 0.12 155)' } as React.CSSProperties}
              autoFocus
            />
          </div>

          {/* Suggestions dropdown */}
          {filtered.length > 0 && (
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              {filtered.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setFoodName(suggestion);
                    setFiltered([]);
                    handleAnalyze(suggestion);
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors border-b border-border last:border-0"
                >
                  <span className="text-sm font-medium text-foreground">{suggestion}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl p-3.5 flex items-start gap-2.5"
            style={{ background: 'oklch(0.96 0.04 25)', border: '1px solid oklch(0.88 0.08 25)' }}>
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.58 0.22 25)' }} />
            <p className="text-sm font-medium" style={{ color: 'oklch(0.45 0.18 25)' }}>{error}</p>
          </div>
        )}

        {/* Analyze button */}
        <button
          onClick={() => handleAnalyze()}
          disabled={!foodName.trim() || isLoading}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-base text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, oklch(0.38 0.12 155), oklch(0.48 0.16 148))' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Analyze Food
            </>
          )}
        </button>

        {/* Popular foods */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Popular Foods</h3>
          <div className="flex flex-wrap gap-2">
            {FOOD_SUGGESTIONS.slice(0, 12).map((food) => (
              <button
                key={food}
                onClick={() => {
                  setFoodName(food);
                  setFiltered([]);
                  handleAnalyze(food);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-card hover:bg-accent transition-colors"
                style={{ color: 'oklch(0.38 0.12 155)' }}
              >
                {food}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
