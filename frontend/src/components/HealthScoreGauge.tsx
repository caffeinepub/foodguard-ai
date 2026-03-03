import React from 'react';

interface HealthScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function getScoreColor(score: number): { stroke: string; text: string; label: string } {
  if (score >= 80) {
    return { stroke: '#22c55e', text: '#16a34a', label: 'Safe' };
  } else if (score >= 50) {
    return { stroke: '#f59e0b', text: '#d97706', label: 'Moderate' };
  } else {
    return { stroke: '#ef4444', text: '#dc2626', label: 'Harmful' };
  }
}

export function HealthScoreGauge({ score, size = 160, strokeWidth = 12 }: HealthScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Arc spans 240 degrees (from 150deg to 390deg / -210deg to 30deg)
  const startAngle = -210;
  const totalAngle = 240;
  const circumference = (totalAngle / 360) * 2 * Math.PI * radius;
  const progress = (clampedScore / 100) * circumference;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const startX = center + radius * Math.cos(toRad(startAngle));
  const startY = center + radius * Math.sin(toRad(startAngle));
  const endAngle = startAngle + totalAngle;
  const endX = center + radius * Math.cos(toRad(endAngle));
  const endY = center + radius * Math.sin(toRad(endAngle));

  const largeArcFlag = totalAngle > 180 ? 1 : 0;

  const trackPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

  // Progress arc
  const progressEndAngle = startAngle + (clampedScore / 100) * totalAngle;
  const progressEndX = center + radius * Math.cos(toRad(progressEndAngle));
  const progressEndY = center + radius * Math.sin(toRad(progressEndAngle));
  const progressLargeArc = (clampedScore / 100) * totalAngle > 180 ? 1 : 0;

  const progressPath =
    clampedScore === 0
      ? ''
      : `M ${startX} ${startY} A ${radius} ${radius} 0 ${progressLargeArc} 1 ${progressEndX} ${progressEndY}`;

  const colors = getScoreColor(clampedScore);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress */}
        {clampedScore > 0 && (
          <path
            d={progressPath}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${colors.stroke}60)`,
            }}
          />
        )}
        {/* Score text */}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.22}
          fontWeight="800"
          fill={colors.text}
          fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
        >
          {clampedScore}
        </text>
        <text
          x={center}
          y={center + size * 0.14}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.1}
          fontWeight="600"
          fill="#9ca3af"
          fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
        >
          / 100
        </text>
      </svg>
      <span
        className="text-sm font-700 px-3 py-1 rounded-full"
        style={{
          color: colors.text,
          backgroundColor: `${colors.stroke}20`,
          fontWeight: 700,
        }}
      >
        {colors.label}
      </span>
    </div>
  );
}
