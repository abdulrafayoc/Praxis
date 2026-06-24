import { useState } from 'react';
import { format } from 'date-fns';
import { Search, Eye } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import TranscriptModal from '../components/TranscriptModal';
import { useQuery } from '@tanstack/react-query';
import { getCallLogs } from '../lib/api';

const S = {
  heading: { color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700, margin: 0 } as React.CSSProperties,
  subheading: { color: '#94A3B8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' } as React.CSSProperties,
  tableHeader: { color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '0.75rem 1rem', textAlign: 'left' as const, borderBottom: '1px solid #1E293B' },
  tableCell: { padding: '0.875rem 1rem', color: '#F1F5F9', fontSize: '0.875rem', verticalAlign: 'middle' as const },
};

type CallLog = any;

export default function Calls() {
  const [search, setSearch] = useState('');
  const [reliabilityFilter, setReliabilityFilter] = useState('all');
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);

  const { data: callLogs = [], isLoading } = useQuery({ queryKey: ['callLogs'], queryFn: getCallLogs });

  const filtered = callLogs.filter((call: any) => {
    const matchSearch = call.patient.full_name.toLowerCase().includes(search.toLowerCase()) ||
      call.call_session_id.toLowerCase().includes(search.toLowerCase());
    const matchReliability = reliabilityFilter === 'all' || call.transcript_reliability_flag === reliabilityFilter;
    return matchSearch && matchReliability;
  });

  if (isLoading) return <div style={{ color: '#F1F5F9', padding: '2rem' }}>Loading calls...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={S.heading}>Call Logs</h1>
          <p style={S.subheading}>All recorded Praxis voice agent sessions</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>{filtered.length} calls</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="input-field"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by patient or session ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={reliabilityFilter}
          onChange={e => setReliabilityFilter(e.target.value)}
          style={{
            backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: '0.5rem',
            color: '#F1F5F9', padding: '0.625rem 0.875rem', fontSize: '0.875rem',
            outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="all">All Reliability</option>
          <option value="full">Full</option>
          <option value="partial">Partial</option>
          <option value="low">Low Confidence</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={S.tableHeader}>Session ID</th>
              <th style={S.tableHeader}>Patient</th>
              <th style={S.tableHeader}>Date / Time</th>
              <th style={S.tableHeader}>Duration</th>
              <th style={S.tableHeader}>Intents</th>
              <th style={S.tableHeader}>Agents</th>
              <th style={S.tableHeader}>Reliability</th>
              <th style={S.tableHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((call: any) => {
              const isLow = call.transcript_reliability_flag === 'low';
              return (
                <tr
                  key={call.id}
                  className="table-row"
                  style={isLow ? { borderLeft: '3px solid rgba(245,158,11,0.6)' } : {}}
                >
                  <td style={S.tableCell}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '0.75rem',
                      color: '#06B6D4', background: 'rgba(6,182,212,0.08)',
                      padding: '0.125rem 0.5rem', borderRadius: '0.25rem',
                    }}>{call.call_session_id}</span>
                  </td>
                  <td style={S.tableCell}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500 }}>{call.patient.full_name}</p>
                      <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.75rem' }}>{call.patient.phone_number}</p>
                    </div>
                  </td>
                  <td style={S.tableCell}>
                    <span style={{ color: '#94A3B8' }}>{format(new Date(call.started_at), 'dd MMM, HH:mm')}</span>
                  </td>
                  <td style={S.tableCell}>
                    {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                  </td>
                  <td style={S.tableCell}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {call.intent_sequence.map((intent: any) => (
                        <span key={intent} style={{
                          padding: '0.125rem 0.5rem', borderRadius: '0.25rem',
                          background: intent === 'ESCALATE' ? 'rgba(239,68,68,0.12)' : 'rgba(6,182,212,0.12)',
                          color: intent === 'ESCALATE' ? '#EF4444' : '#06B6D4',
                          fontSize: '0.75rem', fontWeight: 600,
                        }}>{intent}</span>
                      ))}
                    </div>
                  </td>
                  <td style={S.tableCell}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {call.agents_invoked.map((agent: any) => (
                        <span key={agent} style={{
                          padding: '0.1rem 0.4rem', borderRadius: '0.25rem',
                          background: 'rgba(124,58,237,0.1)', color: '#A78BFA',
                          fontSize: '0.7rem', fontWeight: 500,
                        }}>{agent}</span>
                      ))}
                    </div>
                  </td>
                  <td style={S.tableCell}><StatusBadge status={call.transcript_reliability_flag} /></td>
                  <td style={S.tableCell}>
                    <button
                      onClick={() => setSelectedCall(call)}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>No calls match your filters.</div>
        )}
      </div>

      <TranscriptModal call={selectedCall} onClose={() => setSelectedCall(null)} />
    </div>
  );
}
