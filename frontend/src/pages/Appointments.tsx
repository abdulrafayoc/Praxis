import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Calendar as CalIcon } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '../lib/api';
import toast from 'react-hot-toast';

const S = {
  heading: { color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700, margin: 0 } as React.CSSProperties,
  subheading: { color: '#94A3B8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' } as React.CSSProperties,
  tableHeader: { color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '0.75rem 1rem', textAlign: 'left' as const, borderBottom: '1px solid #1E293B' },
  tableCell: { padding: '0.875rem 1rem', color: '#F1F5F9', fontSize: '0.875rem', verticalAlign: 'middle' as const },
};

const statusFilters = ['all', 'confirmed', 'cancelled', 'rescheduled', 'completed'];

export default function Appointments() {
  const [activeTab, setActiveTab] = useState<'table' | 'calendar'>('table');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: appointments = [], isLoading } = useQuery({ queryKey: ['appointments'], queryFn: getAppointments });

  const filtered = appointments.filter((a: any) =>
    statusFilter === 'all' || a.status === statusFilter
  );

  if (isLoading) return <div style={{ color: '#F1F5F9', padding: '2rem' }}>Loading appointments...</div>;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.625rem 1.25rem',
    border: 'none', borderRadius: '0.5rem',
    cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
    transition: 'all 0.2s',
    background: active ? 'rgba(6,182,212,0.15)' : 'transparent',
    color: active ? '#06B6D4' : '#94A3B8',
  });

  const filterChipStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.375rem 0.875rem',
    border: `1px solid ${active ? 'rgba(6,182,212,0.4)' : '#1E293B'}`,
    borderRadius: '9999px', cursor: 'pointer', fontWeight: 500, fontSize: '0.8125rem',
    transition: 'all 0.2s', background: active ? 'rgba(6,182,212,0.1)' : 'transparent',
    color: active ? '#06B6D4' : '#94A3B8', textTransform: 'capitalize' as const,
  });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={S.heading}>Appointments</h1>
          <p style={S.subheading}>Manage all clinic bookings and schedules</p>
        </div>
        <button onClick={() => toast.success('Add Appointment modal — connect to API')} className="btn-primary">
          <Plus size={16} /> Add Appointment
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', background: 'rgba(30,36,51,0.5)', borderRadius: '0.625rem', padding: '0.25rem', width: 'fit-content' }}>
        <button style={tabStyle(activeTab === 'table')} onClick={() => setActiveTab('table')}>Table View</button>
        <button style={tabStyle(activeTab === 'calendar')} onClick={() => setActiveTab('calendar')}>
          <CalIcon size={14} style={{ marginRight: '0.375rem', display: 'inline', verticalAlign: 'middle' }} />
          Calendar View
        </button>
      </div>

      {/* Status Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {statusFilters.map(s => (
          <button key={s} style={filterChipStyle(statusFilter === s)} onClick={() => setStatusFilter(s)}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {activeTab === 'table' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.tableHeader}>Patient</th>
                <th style={S.tableHeader}>Doctor</th>
                <th style={S.tableHeader}>Date &amp; Time</th>
                <th style={S.tableHeader}>Type</th>
                <th style={S.tableHeader}>Duration</th>
                <th style={S.tableHeader}>Status</th>
                <th style={S.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt: any) => (
                <tr key={appt.id} className="table-row">
                  <td style={S.tableCell}><span style={{ fontWeight: 500 }}>{appt.patient.full_name}</span></td>
                  <td style={S.tableCell}><span style={{ color: '#06B6D4' }}>{appt.doctor.full_name}</span></td>
                  <td style={S.tableCell}>
                    <div>
                      <p style={{ margin: 0 }}>{format(new Date(appt.scheduled_at), 'dd MMM yyyy')}</p>
                      <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.75rem' }}>{format(new Date(appt.scheduled_at), 'HH:mm')}</p>
                    </div>
                  </td>
                  <td style={S.tableCell}>
                    <span style={{
                      padding: '0.125rem 0.5rem', borderRadius: '0.25rem',
                      background: 'rgba(124,58,237,0.1)', color: '#A78BFA',
                      fontSize: '0.75rem', fontWeight: 500, textTransform: 'capitalize',
                    }}>{appt.appointment_type}</span>
                  </td>
                  <td style={S.tableCell}>{appt.duration_minutes} min</td>
                  <td style={S.tableCell}><StatusBadge status={appt.status} /></td>
                  <td style={S.tableCell}>
                    <button
                      className="btn-secondary"
                      onClick={() => toast.success(`Edit appointment ${appt.id} — connect to API`)}
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.8125rem' }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>No appointments found.</div>
          )}
        </div>
      ) : (
        /* Calendar stub */
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <CalIcon size={48} color="#1E293B" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#94A3B8', fontWeight: 600, margin: '0 0 0.5rem' }}>January 2025</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', maxWidth: '560px', margin: '0 auto' }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                <div key={d} style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', padding: '0.5rem 0' }}>{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const hasAppt = [15, 19, 20, 21, 22].includes(day);
                return (
                  <div key={day} style={{
                    textAlign: 'center', padding: '0.5rem', borderRadius: '0.375rem',
                    background: hasAppt ? 'rgba(6,182,212,0.12)' : 'transparent',
                    color: hasAppt ? '#06B6D4' : '#94A3B8',
                    fontSize: '0.875rem', fontWeight: hasAppt ? 600 : 400,
                    cursor: hasAppt ? 'pointer' : 'default',
                    border: hasAppt ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
                  }}>
                    {day}
                    {hasAppt && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#06B6D4', margin: '0.1rem auto 0' }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
