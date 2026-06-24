import { format } from 'date-fns';
import { PhoneCall, Calendar, AlertTriangle, Clock, Radio } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { getStats, getCallsChartData, getCallLogs } from '../lib/api';
const S = {
  heading: { color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700, margin: 0 } as React.CSSProperties,
  subheading: { color: '#94A3B8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' } as React.CSSProperties,
  sectionTitle: { color: '#F1F5F9', fontWeight: 600, fontSize: '1rem', margin: '0 0 1rem 0' } as React.CSSProperties,
  tableHeader: { color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '0.75rem 1rem', textAlign: 'left' as const, borderBottom: '1px solid #1E293B' },
  tableCell: { padding: '0.875rem 1rem', color: '#F1F5F9', fontSize: '0.875rem', verticalAlign: 'middle' as const },
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1E2433', border: '1px solid #1E293B', borderRadius: '0.5rem',
        padding: '0.75rem 1rem', fontSize: '0.8125rem',
      }}>
        <p style={{ color: '#94A3B8', margin: '0 0 0.25rem' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, margin: '0.1rem 0', fontWeight: 600 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data: mockStats, isLoading: isLoadingStats } = useQuery({ queryKey: ['stats'], queryFn: getStats });
  const { data: mockCallsChartData, isLoading: isLoadingChart } = useQuery({ queryKey: ['callsChartData'], queryFn: getCallsChartData });
  const { data: mockCallLogs, isLoading: isLoadingLogs } = useQuery({ queryKey: ['callLogs'], queryFn: getCallLogs });

  const now = new Date();

  if (isLoadingStats || isLoadingChart || isLoadingLogs) {
    return <div style={{ color: '#F1F5F9', padding: '2rem' }}>Loading dashboard data...</div>;
  }

  // Fallback for empty data
  if (!mockStats || !mockCallsChartData || !mockCallLogs) {
    return <div style={{ color: '#F1F5F9', padding: '2rem' }}>Error loading data.</div>;
  }

  const DONUT_DATA = [
    { name: 'Booked', value: mockStats.bookingRate },
    { name: 'Not Booked', value: 100 - mockStats.bookingRate },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={S.heading}>Dashboard</h1>
        <p style={S.subheading}>{format(now, 'EEEE, MMMM do yyyy')} · City Care Clinic</p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <KPICard
          title="Total Calls Today"
          value={mockStats.totalCallsToday}
          delta={mockStats.totalCallsDelta}
          icon={PhoneCall}
          iconColor="#06B6D4"
          iconBg="rgba(6,182,212,0.12)"
        />
        <KPICard
          title="Appointments Booked"
          value={mockStats.appointmentsBooked}
          delta={mockStats.bookingRateDelta}
          deltaLabel="%"
          icon={Calendar}
          iconColor="#10B981"
          iconBg="rgba(16,185,129,0.12)"
        />
        <KPICard
          title="Escalations"
          value={mockStats.escalations}
          delta={-2}
          icon={AlertTriangle}
          iconColor="#F59E0B"
          iconBg="rgba(245,158,11,0.12)"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <KPICard
          title="Avg Call Duration"
          value={mockStats.avgDuration}
          icon={Clock}
          iconColor="#7C3AED"
          iconBg="rgba(124,58,237,0.12)"
        />
        <KPICard
          title="Live Calls Right Now"
          value={mockStats.liveCalls}
          icon={Radio}
          iconColor="#EF4444"
          iconBg="rgba(239,68,68,0.12)"
          isLive
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Bar Chart */}
        <div className="card">
          <h3 style={S.sectionTitle}>Calls This Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockCallsChartData} barGap={4}>
              <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="calls" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Total Calls" />
              <Bar dataKey="booked" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Booked" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#06B6D4' }} />
              <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Total Calls</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#7C3AED' }} />
              <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Appointments Booked</span>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ ...S.sectionTitle, textAlign: 'center', width: '100%' }}>Booking Rate</h3>
          <div style={{ position: 'relative', width: 180, height: 180 }}>
            <PieChart width={180} height={180}>
              <Pie
                data={DONUT_DATA}
                cx={85}
                cy={85}
                innerRadius={60}
                outerRadius={85}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                <Cell fill="#06B6D4" />
                <Cell fill="#1E293B" />
              </Pie>
            </PieChart>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}>
              <span style={{ color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700 }}>{mockStats.bookingRate}%</span>
              <p style={{ color: '#94A3B8', fontSize: '0.7rem', margin: '0.1rem 0 0' }}>of calls booked</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
            <span style={{ color: '#10B981', fontSize: '0.875rem', fontWeight: 600 }}>↑ +{mockStats.bookingRateDelta}%</span>
            <span style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>vs last week</span>
          </div>
        </div>
      </div>

      {/* Recent Calls Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ ...S.sectionTitle, margin: 0 }}>Recent Calls</h3>
          <span style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>Today, {format(now, 'HH:mm')}</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={S.tableHeader}>Patient</th>
              <th style={S.tableHeader}>Duration</th>
              <th style={S.tableHeader}>Intent</th>
              <th style={S.tableHeader}>Reliability</th>
              <th style={S.tableHeader}>Time</th>
            </tr>
          </thead>
          <tbody>
            {mockCallLogs.slice(0, 3).map((call: any) => (
              <tr key={call.id} className="table-row">
                <td style={S.tableCell}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500 }}>{call.patient.full_name}</p>
                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.75rem' }}>{call.patient.phone_number}</p>
                  </div>
                </td>
                <td style={S.tableCell}>{Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s</td>
                <td style={S.tableCell}>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {call.intent_sequence.map((intent: any) => (
                      <span key={intent} style={{
                        padding: '0.125rem 0.5rem', borderRadius: '0.25rem',
                        background: 'rgba(6,182,212,0.12)', color: '#06B6D4',
                        fontSize: '0.75rem', fontWeight: 600,
                      }}>{intent}</span>
                    ))}
                  </div>
                </td>
                <td style={S.tableCell}><StatusBadge status={call.transcript_reliability_flag} /></td>
                <td style={S.tableCell}>
                  <span style={{ color: '#94A3B8' }}>{format(new Date(call.started_at), 'HH:mm')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live Calls Banner */}
      {mockStats.liveCalls > 0 && (
        <div style={{
          marginTop: '1.5rem',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '0.75rem',
          padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
          <span className="live-dot" />
          <span style={{ color: '#EF4444', fontWeight: 600, fontSize: '0.9375rem' }}>
            {mockStats.liveCalls} active call{mockStats.liveCalls > 1 ? 's' : ''} in progress
          </span>
          <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
            · Agents handling calls in real time
          </span>
        </div>
      )}
    </div>
  );
}
