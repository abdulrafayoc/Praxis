import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, CheckCircle2, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPrompts } from '../lib/api';

const S = {
  heading: { color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700, margin: 0 } as React.CSSProperties,
  subheading: { color: '#94A3B8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' } as React.CSSProperties,
  tableHeader: { color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '0.75rem 1rem', textAlign: 'left' as const, borderBottom: '1px solid #1E293B' },
  tableCell: { padding: '0.875rem 1rem', color: '#F1F5F9', fontSize: '0.875rem', verticalAlign: 'middle' as const },
};

const AGENTS = [
  { id: 'orchestrator', name: 'Orchestrator' },
  { id: 'booking', name: 'Booking' },
  { id: 'knowledge', name: 'Knowledge' },
  { id: 'triage', name: 'Triage' },
  { id: 'escalation', name: 'Escalation' },
  { id: 'summarizer', name: 'Summarizer' },
];

export default function Prompts() {
  const [activeTab, setActiveTab] = useState('orchestrator');
  const [viewingPrompt, setViewingPrompt] = useState<any | null>(null);

  const { data: prompts = [], isLoading } = useQuery({ queryKey: ['prompts'], queryFn: getPrompts });

  const activeVersions = prompts.filter((p: any) => p.agent_id === activeTab);

  if (isLoading) return <div style={{ color: '#F1F5F9', padding: '2rem' }}>Loading prompts...</div>;

  const handleActivate = () => {
    alert('Toast: Prompt would be activated for the next call.');
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={S.heading}>Prompt Engineering</h1>
        <p style={S.subheading}>Manage versioned and tested LLM system prompts for specialized agents</p>
      </div>

      <div style={{ 
        background: 'rgba(6,182,212,0.05)', 
        border: '1px solid rgba(6,182,212,0.2)', 
        borderRadius: '0.5rem', 
        padding: '1rem', 
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        <div style={{ color: '#06B6D4', marginTop: '0.125rem' }}>ℹ️</div>
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', color: '#F1F5F9', fontSize: '0.875rem', fontWeight: 600 }}>Architecture Note: Deterministic Validation</h4>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.8125rem', lineHeight: 1.5 }}>
            Following SRD Principle 8, every prompt modification must be version-controlled and pass rigorous regression testing against a baseline dataset of call transcripts before it can be deployed to production.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {AGENTS.map(agent => (
          <button
            key={agent.id}
            onClick={() => setActiveTab(agent.id)}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid',
              borderColor: activeTab === agent.id ? '#06B6D4' : '#1E293B',
              backgroundColor: activeTab === agent.id ? 'rgba(6,182,212,0.1)' : '#111827',
              color: activeTab === agent.id ? '#06B6D4' : '#94A3B8',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {agent.name}
          </button>
        ))}
      </div>

      {/* Version Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={S.tableHeader}>Version</th>
              <th style={S.tableHeader}>Author</th>
              <th style={S.tableHeader}>Date</th>
              <th style={S.tableHeader}>Change Notes</th>
              <th style={S.tableHeader}>Test Coverage</th>
              <th style={S.tableHeader}>Status</th>
              <th style={S.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeVersions.map((prompt: any) => {
              const isActive = prompt.is_active;
              return (
                <tr 
                  key={prompt.id} 
                  className="table-row"
                  style={isActive ? { background: 'rgba(6,182,212,0.03)', borderLeft: '3px solid #06B6D4' } : {}}
                >
                  <td style={S.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'monospace', color: '#F1F5F9', fontWeight: 600 }}>v{prompt.version}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>{prompt.prompt_id}</span>
                    </div>
                  </td>
                  <td style={S.tableCell}>{prompt.author}</td>
                  <td style={S.tableCell}>{format(new Date(prompt.created_at), 'dd MMM yyyy')}</td>
                  <td style={S.tableCell}>{prompt.change_notes}</td>
                  <td style={S.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#10B981', fontSize: '0.8125rem', fontWeight: 500 }}>
                      <CheckCircle2 size={14} /> {prompt.test_coverage}
                    </div>
                  </td>
                  <td style={S.tableCell}>
                    {isActive ? (
                      <span style={{ 
                        background: 'rgba(6,182,212,0.1)', color: '#06B6D4', padding: '0.125rem 0.5rem', 
                        borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' 
                      }}>ACTIVE</span>
                    ) : (
                      <span style={{ 
                        background: '#1E293B', color: '#94A3B8', padding: '0.125rem 0.5rem', 
                        borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' 
                      }}>ARCHIVED</span>
                    )}
                  </td>
                  <td style={S.tableCell}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setViewingPrompt(prompt)}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                      >
                        <Eye size={14} /> View
                      </button>
                      {!isActive && (
                        <button
                          onClick={handleActivate}
                          className="btn-primary"
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {activeVersions.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>No prompt versions found for this agent.</div>
        )}
      </div>

      {/* Prompt Modal */}
      {viewingPrompt && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#0F172A', border: '1px solid #1E293B', borderRadius: '0.75rem',
            width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            animation: 'scaleIn 0.2s ease-out'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#F1F5F9', fontSize: '1.125rem' }}>{viewingPrompt.prompt_id} (v{viewingPrompt.version})</h3>
                <p style={{ margin: '0.25rem 0 0 0', color: '#94A3B8', fontSize: '0.875rem' }}>Agent: {AGENTS.find(a => a.id === viewingPrompt.agent_id)?.name}</p>
              </div>
              <button 
                onClick={() => setViewingPrompt(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.5rem' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto', background: '#0B0F19' }}>
              <pre style={{ 
                margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                color: '#E2E8F0', fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: '0.875rem', lineHeight: 1.6
              }}>
                {viewingPrompt.content}
              </pre>
            </div>
            
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1E293B', display: 'flex', justifyContent: 'flex-end', background: '#0F172A', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
              <button onClick={() => setViewingPrompt(null)} className="btn-secondary">Close</button>
            </div>
          </div>
          <style>{`
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
