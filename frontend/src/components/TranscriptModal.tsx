import { useState, useEffect } from 'react';
import { X, Wrench, AlertTriangle, Volume2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';

interface TranscriptTurn {
  role: 'agent' | 'user' | 'tool_call' | 'tool_result';
  content: string;
  agent?: string;
  intent?: string | null;
  timestamp?: string;
  confidence?: number | null;
  latency_ms?: number;
}

interface CallLog {
  id: string;
  call_session_id: string;
  patient: { full_name: string; phone_number: string };
  started_at: string;
  duration_seconds: number;
  intent_sequence: string[];
  agents_invoked: string[];
  transcript_reliability_flag: string;
  audio_recording_url: string;
  escalation_reason: string | null;
  transcript_json: TranscriptTurn[];
  tts_text_log: string[];
  prompt_versions: Record<string, string>;
  tool_calls_log: Array<{ tool_name: string; input: object; result: object; latency_ms: number }>;
}

interface Props { call: CallLog | null; onClose: () => void; }

export default function TranscriptModal({ call, onClose }: Props) {
  const [expandedTools, setExpandedTools] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!call) return null;

  const toggleTool = (idx: number) => {
    setExpandedTools(prev => {
      const n = new Set(prev);
      n.has(idx) ? n.delete(idx) : n.add(idx);
      return n;
    });
  };

  const agentColors: Record<string, string> = {
    orchestrator: '#06B6D4',
    booking: '#10B981',
    knowledge: '#7C3AED',
    triage: '#F59E0B',
    escalation: '#EF4444',
    summarizer: '#94A3B8',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90vw', height: '90vh',
          background: '#111827',
          border: '1px solid #1E293B',
          borderRadius: '1rem',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #1E293B',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(30,36,51,0.8)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 style={{ color: '#F1F5F9', fontWeight: 700, margin: 0, fontSize: '1.125rem' }}>
              Call Recording &amp; Transcript
            </h2>
            <span style={{
              padding: '0.2rem 0.6rem', borderRadius: '0.375rem',
              background: 'rgba(6,182,212,0.1)', color: '#06B6D4',
              fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace',
            }}>{call.call_session_id}</span>
            <StatusBadge status={call.transcript_reliability_flag} />
            {call.escalation_reason && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.2rem 0.6rem', borderRadius: '0.375rem',
                background: 'rgba(239,68,68,0.1)', color: '#EF4444',
                fontSize: '0.75rem', fontWeight: 600,
              }}>
                <AlertTriangle size={12} /> ESCALATED
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid #1E293B',
              borderRadius: '0.5rem', cursor: 'pointer', color: '#94A3B8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', transition: 'all 0.15s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Panel: Transcript (60%) */}
          <div style={{
            flex: '0 0 60%',
            borderRight: '1px solid #1E293B',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1E293B', flexShrink: 0 }}>
              <h3 style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Conversation Transcript
              </h3>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              {call.transcript_json.map((turn, idx) => {
                if (turn.role === 'tool_call' || turn.role === 'tool_result') {
                  const isExpanded = expandedTools.has(idx);
                  return (
                    <div key={idx} style={{ marginBottom: '0.75rem' }}>
                      <button
                        onClick={() => toggleTool(idx)}
                        style={{
                          width: '100%', textAlign: 'left',
                          background: 'rgba(124,58,237,0.08)',
                          border: '1px solid rgba(124,58,237,0.2)',
                          borderRadius: '0.5rem', padding: '0.625rem 0.875rem',
                          color: '#7C3AED', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          fontSize: '0.8125rem', fontWeight: 500,
                          fontFamily: 'monospace',
                        }}
                      >
                        <Wrench size={13} />
                        <span>{turn.role === 'tool_call' ? '⚙ TOOL CALL' : '↩ TOOL RESULT'}</span>
                        <span style={{ color: '#94A3B8', marginLeft: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {turn.content.slice(0, 60)}...
                        </span>
                        {turn.latency_ms && (
                          <span style={{ marginLeft: 'auto', color: '#94A3B8', fontSize: '0.75rem' }}>{turn.latency_ms}ms</span>
                        )}
                      </button>
                      {isExpanded && (
                        <pre style={{
                          background: '#0A0F1E', border: '1px solid #1E293B',
                          borderRadius: '0 0 0.5rem 0.5rem', padding: '0.75rem',
                          color: '#94A3B8', fontSize: '0.75rem', overflowX: 'auto',
                          margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                        }}>{turn.content}</pre>
                      )}
                    </div>
                  );
                }

                const isUser = turn.role === 'user';
                const agentColor = turn.agent ? (agentColors[turn.agent] || '#06B6D4') : '#06B6D4';

                return (
                  <div key={idx} style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    marginBottom: '1rem',
                  }}>
                    {/* Agent label */}
                    {!isUser && turn.agent && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                          color: agentColor, letterSpacing: '0.05em',
                        }}>
                          {turn.agent}
                        </span>
                        {turn.confidence != null && (
                          <span style={{
                            fontSize: '0.7rem', padding: '0.1rem 0.4rem',
                            borderRadius: '0.25rem',
                            background: 'rgba(6,182,212,0.1)', color: '#06B6D4',
                            fontWeight: 600,
                          }}>
                            {Math.round(turn.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    )}
                    {isUser && (
                      <div style={{ marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>PATIENT</span>
                      </div>
                    )}

                    {/* Bubble */}
                    <div style={{
                      maxWidth: '78%',
                      padding: '0.625rem 0.875rem',
                      borderRadius: isUser ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                      background: isUser
                        ? 'rgba(100,116,139,0.2)'
                        : `rgba(${agentColor === '#10B981' ? '16,185,129' : agentColor === '#F59E0B' ? '245,158,11' : agentColor === '#EF4444' ? '239,68,68' : agentColor === '#7C3AED' ? '124,58,237' : '6,182,212'},0.12)`,
                      border: `1px solid ${isUser ? 'rgba(100,116,139,0.2)' : `${agentColor}22`}`,
                      color: '#F1F5F9',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                    }}>
                      {turn.content}
                    </div>

                    {/* Timestamp */}
                    {turn.timestamp && (
                      <span style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.25rem' }}>
                        {turn.timestamp}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Metadata (40%) */}
          <div style={{ flex: '0 0 40%', overflowY: 'auto', padding: '1.25rem' }}>
            {/* Recording */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Volume2 size={13} /> Recording
              </h3>
              <audio
                controls
                src={call.audio_recording_url}
                style={{
                  width: '100%', height: '40px',
                  accentColor: '#06B6D4', filter: 'invert(1) hue-rotate(180deg)',
                }}
              />
              <p style={{ color: '#475569', fontSize: '0.7rem', marginTop: '0.5rem' }}>
                * Audio from Twilio recording API — requires valid authentication in production
              </p>
            </div>

            {/* Metadata Table */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
                Call Metadata
              </h3>
              <div style={{ background: 'rgba(30,36,51,0.5)', border: '1px solid #1E293B', borderRadius: '0.5rem', overflow: 'hidden' }}>
                {[
                  { label: 'Duration', value: `${Math.floor(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s` },
                  { label: 'Started At', value: format(new Date(call.started_at), 'dd MMM yyyy, HH:mm:ss') },
                  { label: 'Patient', value: call.patient.full_name },
                  { label: 'Phone', value: call.patient.phone_number },
                  { label: 'Agents Invoked', value: call.agents_invoked.join(', ') },
                  { label: 'Escalation', value: call.escalation_reason || 'None' },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', padding: '0.625rem 0.875rem',
                    borderBottom: i < 5 ? '1px solid #1E293B' : 'none',
                  }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.8125rem', width: '120px', flexShrink: 0 }}>{row.label}</span>
                    <span style={{ color: '#F1F5F9', fontSize: '0.8125rem', fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt Versions */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
                Prompt Versions Used
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {Object.entries(call.prompt_versions).map(([agent, version]) => (
                  <div key={agent} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(30,36,51,0.5)', border: '1px solid #1E293B', borderRadius: '0.375rem',
                  }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.8125rem', textTransform: 'capitalize' }}>{agent}</span>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '0.75rem',
                      color: '#06B6D4', background: 'rgba(6,182,212,0.1)',
                      padding: '0.1rem 0.4rem', borderRadius: '0.25rem',
                    }}>{version}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TTS Text Log */}
            {call.tts_text_log.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
                  TTS Text Log (ElevenLabs)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {call.tts_text_log.map((text, i) => (
                    <div key={i} style={{
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)',
                      borderRadius: '0.375rem',
                      color: '#94A3B8', fontSize: '0.8125rem', fontStyle: 'italic',
                    }}>
                      "{text}"
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Low reliability warning */}
            {call.transcript_reliability_flag === 'low' && (
              <div style={{
                padding: '0.875rem 1rem',
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              }}>
                <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <p style={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.8125rem', margin: '0 0 0.25rem' }}>
                    Dual-Track Divergence Detected
                  </p>
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: 0 }}>
                    The STT transcript shows significant divergence from the TTS text log. This call may contain transcription errors. Review audio recording directly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
