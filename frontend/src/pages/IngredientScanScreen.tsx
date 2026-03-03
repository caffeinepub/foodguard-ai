import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, AlertTriangle, CheckCircle2, Loader2, RotateCcw, Leaf, Info } from 'lucide-react';
import { useScanIngredients } from '@/hooks/useQueries';
import type { ProcessedIngredient } from '../backend';

const EXAMPLE_INGREDIENTS = `Water, Sugar, High Fructose Corn Syrup, Citric Acid, Natural Flavors, Sodium Benzoate, Red 40, Yellow 5, BHA, Monosodium Glutamate (MSG)`;

export function IngredientScanScreen() {
  const navigate = useNavigate();
  const [ingredientText, setIngredientText] = useState('');
  const [result, setResult] = useState<{ processedIngredients: ProcessedIngredient[]; harmfulCount: bigint } | null>(null);
  const scanMutation = useScanIngredients();

  const handleScan = async () => {
    if (!ingredientText.trim()) return;
    const ingredients = ingredientText
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const res = await scanMutation.mutateAsync(ingredients);
    setResult(res);
  };

  const handleReset = () => {
    setResult(null);
    setIngredientText('');
    scanMutation.reset();
  };

  const harmfulCount = result ? Number(result.harmfulCount) : 0;

  return (
    <div className="app-container flex flex-col min-h-screen bg-background screen-enter">
      {/* Header */}
      <header className="gradient-hero px-5 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/home' })}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'oklch(0.99 0 0 / 0.15)' }}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white font-extrabold text-xl">Ingredient Scanner</h1>
            <p className="text-sm" style={{ color: 'oklch(0.88 0.04 155)' }}>
              Detect harmful additives
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-5 flex flex-col gap-4">
        {!result ? (
          <>
            {/* Info */}
            <div className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: 'oklch(0.93 0.04 155)', border: '1px solid oklch(0.85 0.06 155)' }}>
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.38 0.12 155)' }} />
              <p className="text-sm font-medium" style={{ color: 'oklch(0.32 0.1 155)' }}>
                Paste or type the ingredients list from a food package label. Separate items with commas or new lines.
              </p>
            </div>

            {/* Textarea */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground">Ingredients List</label>
                <button
                  onClick={() => setIngredientText(EXAMPLE_INGREDIENTS)}
                  className="text-xs font-semibold"
                  style={{ color: 'oklch(0.38 0.12 155)' }}
                >
                  Use Example
                </button>
              </div>
              <textarea
                value={ingredientText}
                onChange={(e) => setIngredientText(e.target.value)}
                placeholder="e.g. Water, Sugar, Sodium Benzoate, Red 40, MSG…"
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                style={{ '--tw-ring-color': 'oklch(0.38 0.12 155)' } as React.CSSProperties}
              />
            </div>

            {/* Detected harmful keywords info */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Detects These Harmful Ingredients
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {['High Sugar', 'MSG', 'Red 40', 'Yellow 5', 'Sodium Benzoate', 'BHA', 'BHT', 'Artificial Colors', 'Preservatives'].map((item) => (
                  <span key={item}
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: 'oklch(0.96 0.06 25)', color: 'oklch(0.45 0.18 25)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Scan button */}
            <button
              onClick={handleScan}
              disabled={!ingredientText.trim() || scanMutation.isPending}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-base text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, oklch(0.38 0.12 155), oklch(0.48 0.16 148))' }}
            >
              {scanMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning…
                </>
              ) : (
                <>
                  <Leaf className="w-5 h-5" />
                  Scan Ingredients
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Summary banner */}
            <div className={`rounded-2xl p-4 flex items-center gap-3 ${harmfulCount > 0 ? '' : ''}`}
              style={{
                background: harmfulCount > 0 ? 'oklch(0.96 0.06 25)' : 'oklch(0.94 0.06 145)',
                border: `1px solid ${harmfulCount > 0 ? 'oklch(0.88 0.1 25)' : 'oklch(0.82 0.1 145)'}`,
              }}>
              {harmfulCount > 0 ? (
                <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: 'oklch(0.58 0.22 25)' }} />
              ) : (
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: 'oklch(0.45 0.16 145)' }} />
              )}
              <div>
                <p className="font-bold text-sm"
                  style={{ color: harmfulCount > 0 ? 'oklch(0.45 0.18 25)' : 'oklch(0.35 0.14 145)' }}>
                  {harmfulCount > 0
                    ? `⚠️ ${harmfulCount} harmful ingredient${harmfulCount > 1 ? 's' : ''} detected!`
                    : '✅ No harmful ingredients detected'}
                </p>
                <p className="text-xs mt-0.5"
                  style={{ color: harmfulCount > 0 ? 'oklch(0.55 0.14 25)' : 'oklch(0.5 0.1 145)' }}>
                  {harmfulCount > 0
                    ? 'This product contains potentially harmful additives.'
                    : 'This product appears to be free of common harmful additives.'}
                </p>
              </div>
            </div>

            {/* Ingredients list */}
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">Ingredient Analysis</h3>
                <span className="text-xs text-muted-foreground font-medium">
                  {result.processedIngredients.length} items
                </span>
              </div>
              <div className="divide-y divide-border max-h-72 overflow-y-auto">
                {result.processedIngredients.map((ingredient, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground flex-1">{ingredient.name}</span>
                    {ingredient.isHarmful ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
                        style={{ background: 'oklch(0.96 0.06 25)', color: 'oklch(0.45 0.18 25)' }}>
                        <AlertTriangle className="w-3 h-3" />
                        Harmful
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
                        style={{ background: 'oklch(0.94 0.06 145)', color: 'oklch(0.35 0.14 145)' }}>
                        <CheckCircle2 className="w-3 h-3" />
                        Safe
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-border bg-card hover:bg-accent transition-colors"
                style={{ color: 'oklch(0.38 0.12 155)' }}
              >
                <RotateCcw className="w-4 h-4" />
                Scan Another
              </button>
              <button
                onClick={() => navigate({ to: '/home' })}
                className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-white transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, oklch(0.38 0.12 155), oklch(0.48 0.16 148))' }}
              >
                Done
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
