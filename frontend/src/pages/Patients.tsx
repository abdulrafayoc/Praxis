import { useState } from 'react';
import { format } from 'date-fns';
import { Search, Eye, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPatients, getCallLogs } from '../lib/api';

const S = {
  heading: { color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700, margin: 0 } as React.CSSProperties,
  subheading: { color: '#94A3B8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' } as React.CSSProperties,
  tableHeader: { color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '0.75rem 1rem', textAlign: 'left' as const, borderBottom: '1px solid #1E293B' },
  tableCell: { padding: '0.875rem 1rem', color: '#F1F5F9', fontSize: '0.875rem', verticalAlign: 'middle' as const },
};

type Patient = any;

export default function Patients() {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({ queryKey: ['patients'], queryFn: getPatients });
  const { data: callLogs = [], isLoading: isLoadingCalls } = useQuery({ queryKey: ['callLogs'], queryFn: getCallLogs });

  const filtered = patients.filter((p: any) => 
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone_number.includes(search)
  );

  if (isLoadingPatients || isLoadingCalls) return <div style={{ color: '#F1F5F9', padding: '2rem' }}>Loading patients...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={S.heading}>Patients</h1>
          <p style={S.subheading}>Manage patient records and interaction history</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ color: '#94A3B8', fontSize: '0.8125rem' }}>{filtered.length} patients</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="input-field"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={S.tableHeader}>Name</th>
              <th style={S.tableHeader}>Phone</th>
              <th style={S.tableHeader}>DOB</th>
              <th style={S.tableHeader}>Last Call</th>
              <th style={S.tableHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((patient: any) => {
              const patientCalls = callLogs.filter((c: any) => c.patient.phone_number === patient.phone_number);
              const lastCall = patientCalls.length > 0 ? patientCalls[patientCalls.length - 1] : null;

              return (
                <tr key={patient.id} className="table-row">
                  <td style={S.tableCell}>
                    <p style={{ margin: 0, fontWeight: 500 }}>{patient.full_name}</p>
                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.75rem' }}>ID: {patient.id}</p>
                  </td>
                  <td style={S.tableCell}>{patient.phone_number}</td>
                  <td style={S.tableCell}>{format(new Date(patient.date_of_birth), 'dd MMM yyyy')}</td>
                  <td style={S.tableCell}>
                    {lastCall ? (
                      <span style={{ color: '#94A3B8' }}>{format(new Date(lastCall.started_at), 'dd MMM, HH:mm')}</span>
                    ) : (
                      <span style={{ color: '#475569', fontStyle: 'italic' }}>No calls</span>
                    )}
                  </td>
                  <td style={S.tableCell}>
                    <button
                      onClick={() => setSelectedPatient(patient)}
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
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>No patients match your search.</div>
        )}
      </div>

      {/* Side Drawer */}
      {selectedPatient && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
            onClick={() => setSelectedPatient(null)}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px',
            background: '#0F172A', borderLeft: '1px solid #1E293B',
            zIndex: 50, padding: '1.5rem', overflowY: 'auto',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, color: '#F1F5F9', fontSize: '1.25rem' }}>Patient Details</h2>
              <button 
                onClick={() => setSelectedPatient(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.5rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#1E293B', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#F1F5F9', fontSize: '1.125rem', fontWeight: 600 }}>{selectedPatient.full_name}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone</p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#F1F5F9', fontSize: '0.875rem' }}>{selectedPatient.phone_number}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase' }}>DOB</p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#F1F5F9', fontSize: '0.875rem' }}>{format(new Date(selectedPatient.date_of_birth), 'dd MMM yyyy')}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email</p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#F1F5F9', fontSize: '0.875rem' }}>{selectedPatient.email}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Registered</p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#F1F5F9', fontSize: '0.875rem' }}>{format(new Date(selectedPatient.created_at), 'dd MMM yyyy')}</p>
                </div>
              </div>
            </div>

            <h3 style={{ color: '#F1F5F9', fontSize: '1rem', marginBottom: '1rem' }}>Call History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {callLogs.filter((c: any) => c.patient.phone_number === selectedPatient.phone_number).map((call: any) => (
                <div key={call.id} style={{ background: '#111827', border: '1px solid #1E293B', borderRadius: '0.5rem', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{format(new Date(call.started_at), 'dd MMM yyyy, HH:mm')}</span>
                    <span style={{ color: '#06B6D4', fontSize: '0.75rem', fontFamily: 'monospace' }}>{call.call_session_id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {call.intent_sequence.map((intent: any) => (
                      <span key={intent} style={{
                        padding: '0.125rem 0.375rem', borderRadius: '0.25rem',
                        background: intent === 'ESCALATE' ? 'rgba(239,68,68,0.12)' : 'rgba(6,182,212,0.12)',
                        color: intent === 'ESCALATE' ? '#EF4444' : '#06B6D4',
                        fontSize: '0.65rem', fontWeight: 600,
                      }}>{intent}</span>
                    ))}
                  </div>
                </div>
              ))}
              {callLogs.filter((c: any) => c.patient.phone_number === selectedPatient.phone_number).length === 0 && (
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', fontStyle: 'italic' }}>No calls recorded yet.</p>
              )}
            </div>
          </div>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
