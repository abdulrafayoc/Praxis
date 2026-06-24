interface StatusBadgeProps { status: string; size?: 'sm' | 'md'; }

const statusConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
  confirmed:   { label: 'Confirmed',      bg: 'rgba(16,185,129,0.15)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
  cancelled:   { label: 'Cancelled',      bg: 'rgba(239,68,68,0.15)',  color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  rescheduled: { label: 'Rescheduled',    bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  completed:   { label: 'Completed',      bg: 'rgba(6,182,212,0.15)',  color: '#06B6D4', border: 'rgba(6,182,212,0.3)' },
  no_show:     { label: 'No Show',        bg: 'rgba(107,114,128,0.15)',color: '#9CA3AF', border: 'rgba(107,114,128,0.3)' },
  pending:     { label: 'Pending',        bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  sent:        { label: 'Sent',           bg: 'rgba(6,182,212,0.15)',  color: '#06B6D4', border: 'rgba(6,182,212,0.3)' },
  delivered:   { label: 'Delivered',      bg: 'rgba(16,185,129,0.15)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
  failed:      { label: 'Failed',         bg: 'rgba(239,68,68,0.15)',  color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  full:        { label: 'Full',           bg: 'rgba(16,185,129,0.15)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
  partial:     { label: 'Partial',        bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  low:         { label: 'Low Confidence', bg: 'rgba(239,68,68,0.15)',  color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  active:      { label: 'Active',         bg: 'rgba(16,185,129,0.15)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
  inactive:    { label: 'Inactive',       bg: 'rgba(107,114,128,0.15)',color: '#9CA3AF', border: 'rgba(107,114,128,0.3)' },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || {
    label: status, bg: 'rgba(107,114,128,0.15)', color: '#9CA3AF', border: 'rgba(107,114,128,0.3)'
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: size === 'md' ? '0.25rem 0.75rem' : '0.125rem 0.5rem',
      borderRadius: '0.375rem',
      border: `1px solid ${config.border}`,
      backgroundColor: config.bg,
      color: config.color,
      fontSize: size === 'md' ? '0.875rem' : '0.75rem',
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {config.label}
    </span>
  );
}
