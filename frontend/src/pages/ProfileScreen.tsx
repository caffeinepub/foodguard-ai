import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, User, Save, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useGetUserProfile, useSaveUserProfile } from '@/hooks/useQueries';
import { HealthCondition } from '../backend';

const HEALTH_CONDITIONS: { value: HealthCondition; label: string; desc: string }[] = [
  { value: HealthCondition.diabetes, label: 'Diabetes', desc: 'High sugar warnings' },
  { value: HealthCondition.highBloodPressure, label: 'High Blood Pressure', desc: 'Sodium & sugar alerts' },
  { value: HealthCondition.highCholesterol, label: 'High Cholesterol', desc: 'Fat content warnings' },
  { value: HealthCondition.heartDisease, label: 'Heart Disease', desc: 'Fat & calorie alerts' },
  { value: HealthCondition.obesity, label: 'Obesity', desc: 'High-calorie warnings' },
  { value: HealthCondition.none, label: 'None', desc: 'No specific conditions' },
];

export function ProfileScreen() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetUserProfile();
  const saveProfile = useSaveUserProfile();

  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<HealthCondition[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setAge(String(Number(profile.age)));
      setWeight(String(Number(profile.weight)));
      setSelectedConditions(profile.healthConditions);
    }
  }, [profile]);

  const toggleCondition = (condition: HealthCondition) => {
    if (condition === HealthCondition.none) {
      setSelectedConditions([HealthCondition.none]);
      return;
    }
    setSelectedConditions((prev) => {
      const withoutNone = prev.filter((c) => c !== HealthCondition.none);
      if (withoutNone.includes(condition)) {
        return withoutNone.filter((c) => c !== condition);
      }
      return [...withoutNone, condition];
    });
  };

  const handleSave = async () => {
    if (!age || !weight) return;
    try {
      await saveProfile.mutateAsync({
        age: BigInt(parseInt(age, 10)),
        weight: BigInt(parseInt(weight, 10)),
        healthConditions: selectedConditions.length > 0 ? selectedConditions : [HealthCondition.none],
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // error handled by mutation state
    }
  };

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
            <h1 className="text-white font-extrabold text-xl">My Health Profile</h1>
            <p className="text-sm" style={{ color: 'oklch(0.88 0.04 155)' }}>
              Personalize your food warnings
            </p>
          </div>
        </div>

        {/* Avatar */}
        <div className="mt-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'oklch(0.99 0 0 / 0.15)', border: '1.5px solid oklch(0.99 0 0 / 0.25)' }}>
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base">
              {age && weight ? `${age} yrs · ${weight} kg` : 'Set up your profile'}
            </p>
            <p className="text-sm" style={{ color: 'oklch(0.88 0.04 155)' }}>
              {selectedConditions.length > 0 && !selectedConditions.includes(HealthCondition.none)
                ? `${selectedConditions.length} condition${selectedConditions.length > 1 ? 's' : ''} tracked`
                : 'No conditions set'}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-5 flex flex-col gap-4">
        {profileLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'oklch(0.38 0.12 155)' }} />
          </div>
        ) : (
          <>
            {/* Basic info */}
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-bold text-sm text-foreground">Basic Information</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 28"
                    min="1"
                    max="120"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{ '--tw-ring-color': 'oklch(0.38 0.12 155)' } as React.CSSProperties}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    min="1"
                    max="500"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{ '--tw-ring-color': 'oklch(0.38 0.12 155)' } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>

            {/* Health conditions */}
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-bold text-sm text-foreground">Health Conditions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select all that apply for personalized warnings
                </p>
              </div>
              <div className="p-3 grid grid-cols-1 gap-2">
                {HEALTH_CONDITIONS.map(({ value, label, desc }) => {
                  const isSelected = selectedConditions.includes(value);
                  return (
                    <button
                      key={value}
                      onClick={() => toggleCondition(value)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl border transition-all text-left"
                      style={{
                        background: isSelected ? 'oklch(0.93 0.04 155)' : 'transparent',
                        borderColor: isSelected ? 'oklch(0.72 0.1 155)' : 'oklch(0.88 0.02 155)',
                      }}
                    >
                      <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          borderColor: isSelected ? 'oklch(0.38 0.12 155)' : 'oklch(0.72 0.04 155)',
                          background: isSelected ? 'oklch(0.38 0.12 155)' : 'transparent',
                        }}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {saveProfile.isError && (
              <div className="rounded-xl p-3.5 flex items-start gap-2.5"
                style={{ background: 'oklch(0.96 0.04 25)', border: '1px solid oklch(0.88 0.08 25)' }}>
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.58 0.22 25)' }} />
                <p className="text-sm font-medium" style={{ color: 'oklch(0.45 0.18 25)' }}>
                  Failed to save profile. Please try again.
                </p>
              </div>
            )}

            {/* Success */}
            {saved && (
              <div className="rounded-xl p-3.5 flex items-center gap-2.5"
                style={{ background: 'oklch(0.94 0.06 145)', border: '1px solid oklch(0.82 0.1 145)' }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'oklch(0.45 0.16 145)' }} />
                <p className="text-sm font-medium" style={{ color: 'oklch(0.35 0.14 145)' }}>
                  Profile saved successfully!
                </p>
              </div>
            )}

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={!age || !weight || saveProfile.isPending}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-base text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, oklch(0.38 0.12 155), oklch(0.48 0.16 148))' }}
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
          </>
        )}
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
