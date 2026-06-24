import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  isLive?: boolean;
}

export default function KPICard({ title, value, delta, deltaLabel, icon: Icon, iconColor, iconBg, isLive }: KPICardProps) {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div className="card glass-hover" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Subtle top gradient line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)`,
        opacity: 0.4,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{title}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <p style={{ color: '#F1F5F9', fontSize: '2rem', fontWeight: 700, margin: 0, lineHeight: 1 }}>{value}</p>
            {isLive && (
              <span className="live-dot" />
            )}
          </div>
          {delta !== undefined && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              marginTop: '0.375rem', fontSize: '0.75rem', fontWeight: 500,
              color: isPositive ? '#10B981' : '#EF4444',
            }}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{isPositive ? '+' : ''}{delta}{deltaLabel || ''}</span>
              <span style={{ color: '#94A3B8' }}>vs yesterday</span>
            </div>
          )}
        </div>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={22} color={iconColor} />
        </div>
      </div>
    </div>
  );
}
