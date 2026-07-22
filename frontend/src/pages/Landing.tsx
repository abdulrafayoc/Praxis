import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Bot, Play, RefreshCw, ArrowRight, Radio, Lock, ShieldCheck,
  Check, Copy, Server
} from 'lucide-react';
import { useAuth } from '../lib/auth';

interface DemoScenario {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  userUtterance: string;
  intent: string;
  confidence: number;
  activeAgent: string;
  fillerAudio: string | null;
  toolsCalled: string[];
  ragChunksUsed: number;
  agentResponse: string;
  latencyBreakdown: { stt: number; langgraph: number; tts: number; total: number };
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'booking',
    title: 'Patient Appointment Booking',
    badge: 'Phase-2 LLM Tool Execution',
    badgeColor: '#06B6D4',
    userUtterance: "Hi, I need to schedule a comprehensive health checkup with Dr. Sarah Smith for next Monday at 10:00 AM.",
    intent: 'BOOK',
    confidence: 0.99,
    activeAgent: 'Booking Specialist',
    fillerAudio: 'let_me_check_that_for_you.mp3',
    toolsCalled: ['check_availability', 'book_appointment', 'send_sms'],
    ragChunksUsed: 0,
    agentResponse: "I have confirmed your appointment with Dr. Sarah Smith for Monday, July 14th at 10:00 AM. A calendar invitation and SMS confirmation have been dispatched.",
    latencyBreakdown: { stt: 130, langgraph: 195, tts: 140, total: 465 }
  },
  {
    id: 'faq',
    title: 'Clinic FAQ & Policies (RAG)',
    badge: 'ChromaDB HNSW Vector RAG',
    badgeColor: '#10B981',
    userUtterance: "What insurance providers do you accept and what is your cancellation policy?",
    intent: 'FAQ',
    confidence: 0.97,
    activeAgent: 'Knowledge Specialist',
    fillerAudio: null,
    toolsCalled: [],
    ragChunksUsed: 2,
    agentResponse: "We accept BlueCross, Aetna, Cigna, and Medicare. Cancellations made 24 hours prior to your scheduled slot incur no fee.",
    latencyBreakdown: { stt: 115, langgraph: 175, tts: 145, total: 435 }
  },
  {
    id: 'triage',
    title: 'Emergency Triage Protocol',
    badge: 'High-Priority Safety Node',
    badgeColor: '#EF4444',
    userUtterance: "I'm experiencing intense chest pressure, radiating arm pain, and dizziness.",
    intent: 'TRIAGE',
    confidence: 0.99,
    activeAgent: 'Clinical Triage Specialist',
    fillerAudio: null,
    toolsCalled: [],
    ragChunksUsed: 0,
    agentResponse: "EMERGENCY ALERT: Your reported symptoms require immediate emergency care. Please hang up and dial 911 or go to the nearest ER. I have notified our on-call physician.",
    latencyBreakdown: { stt: 105, langgraph: 135, tts: 125, total: 365 }
  },
  {
    id: 'escalation',
    title: 'Warm Human Desk Handover',
    badge: 'Receptionist Bridge',
    badgeColor: '#F59E0B',
    userUtterance: "I need to speak directly with the clinic manager regarding a complex billing inquiry.",
    intent: 'ESCALATE',
    confidence: 0.96,
    activeAgent: 'Warm Escalation Specialist',
    fillerAudio: 'just_a_moment.mp3',
    toolsCalled: ['store_callback_request'],
    ragChunksUsed: 0,
    agentResponse: "I am initializing a warm transfer to the clinic management desk. If all lines remain occupied, an urgent callback ticket has been queued in Celery.",
    latencyBreakdown: { stt: 120, langgraph: 160, tts: 135, total: 415 }
  }
];

const CODE_EXAMPLES = {
  python: `# Praxis Enterprise SDK Integration
from praxis_sdk import PraxisVoiceClient

client = PraxisVoiceClient(
    api_key="px_live_9f82a1b9472e",
    environment="production"
)

# Initialize Pipecat + LangGraph Call Session
call_session = client.calls.create(
    patient_phone="+13128471928",
    receptionist_extension="104",
    initial_agent="orchestrator",
    context_budget=3000
)

print(f"Call Live: {call_session.id} | Pipeline: Pipecat-v0.45")`,

  node: `// Praxis Node.js Enterprise Client
import { PraxisClient } from '@praxis/voice-sdk';

const praxis = new PraxisClient({
  apiKey: process.env.PRAXIS_API_KEY,
  region: 'us-east-1'
});

const session = await praxis.pipelines.dispatch({
  transport: 'twilio-websocket',
  stt: 'deepgram-nova-2',
  graph: 'praxis_graph_v2',
  tts: 'elevenlabs-pcm'
});

console.log('Session Dispatched:', session.status);`,

  webhook: `// Praxis Real-time Webhook Event Payload
{
  "event": "call.completed",
  "session_id": "px_sess_8942a17b",
  "duration_seconds": 142,
  "intent_sequence": ["FAQ", "BOOK", "CONFIRM"],
  "agents_invoked": ["orchestrator", "knowledge", "booking"],
  "latency": {
    "stt_ms": 125,
    "graph_ms": 180,
    "tts_ms": 140,
    "total_ms": 445
  },
  "transcript_reliability_flag": "full"
}`
};

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'node' | 'webhook'>('python');
  const [copiedCode, setCopiedCode] = useState(false);

  // ROI Calculator State
  const [dailyCalls, setDailyCalls] = useState(120);
  const [receptionistCost, setReceptionistCost] = useState(4500);

  // Math for ROI Calculation
  const monthlyCallVolume = dailyCalls * 22;
  const automatedCalls = Math.round(monthlyCallVolume * 0.78);
  const estimatedSavings = Math.round((automatedCalls * 3.50) + (receptionistCost * 0.45));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      if (simStep < 4) {
        timer = setTimeout(() => {
          setSimStep((prev) => prev + 1);
        }, 750);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, simStep]);

  const handleStartSim = () => {
    setSimStep(0);
    setIsPlaying(true);
  };

  const handleSelectScenario = (sc: DemoScenario) => {
    setSelectedScenario(sc);
    setSimStep(0);
    setIsPlaying(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[codeLanguage]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#F8FAFC', overflowX: 'hidden', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      
      {/* --- DETACHED FLOATING ISLAND NAVBAR --- */}
      <div style={{ position: 'fixed', top: '1.25rem', left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'center', padding: '0 1rem' }}>
        <header style={{
          width: '100%', maxWidth: '1100px',
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '9999px',
          padding: '0.625rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
        }}>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #06B6D4, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(6,182,212,0.4)'
            }}>
              <Activity size={20} color="white" />
            </div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                PRAXIS
              </span>
              <span style={{ fontSize: '0.65rem', color: '#06B6D4', fontWeight: 700, marginLeft: '0.5rem', padding: '0.15rem 0.5rem', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: '9999px', letterSpacing: '0.05em' }}>
                ENTERPRISE v2.1
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'none', gap: '2rem', fontSize: '0.875rem', fontWeight: 600, color: '#94A3B8' }} className="md:flex">
            <a href="#simulator" style={{ color: '#F8FAFC', textDecoration: 'none', transition: 'color 0.2s' }}>Live Engine</a>
            <a href="#architecture" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Architecture</a>
            <a href="#compliance" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>HIPAA & Security</a>
            <a href="#roi" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>ROI Calculator</a>
            <a href="#developer" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s' }}>Developer API</a>
          </nav>

          {/* Action Button-in-Button CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              style={{
                background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                color: 'white', fontWeight: 700, fontSize: '0.85rem',
                padding: '0.375rem 0.375rem 0.375rem 1.25rem', borderRadius: '9999px',
                border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                boxShadow: '0 4px 20px rgba(6,182,212,0.4)', transition: 'all 0.25s ease'
              }}
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Enterprise Portal'}</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={15} color="white" />
              </div>
            </button>
          </div>
        </header>
      </div>

      {/* --- HERO SECTION --- */}
      <section style={{
        position: 'relative', paddingTop: '9rem', paddingBottom: '6rem',
        maxWidth: '1280px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem'
      }}>
        {/* Background Mesh Glow */}
        <div style={{
          position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '350px',
          background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.15), rgba(124,58,237,0.08), transparent 70%)',
          pointerEvents: 'none', zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '960px', margin: '0 auto' }}>
          
          {/* Eyebrow Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 1.25rem', borderRadius: '9999px',
            background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)',
            color: '#06B6D4', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: '1.75rem'
          }}>
            <ShieldCheck size={14} />
            <span>HIPAA-COMPLIANT · PIPECAT + LANGGRAPH VOICE INFRASTRUCTURE</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)', fontWeight: 800,
            lineHeight: 1.05, letterSpacing: '-0.04em', margin: '0 0 1.5rem 0',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Autonomous Voice Operations for Enterprise Healthcare
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: '1.15rem', color: '#94A3B8', lineHeight: 1.6,
            maxWidth: '680px', margin: '0 auto 2.5rem auto', fontWeight: 400
          }}>
            Sub-500ms voice response agent handling triage, appointment scheduling, and patient FAQs via Pipecat and LangGraph.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              style={{
                background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                color: 'white', fontWeight: 700, fontSize: '1rem',
                padding: '0.5rem 0.5rem 0.5rem 1.5rem', borderRadius: '9999px',
                border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '1rem',
                boxShadow: '0 6px 25px rgba(6,182,212,0.4)', transition: 'all 0.25s ease'
              }}
            >
              <span>Launch Admin Dashboard</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={18} color="white" />
              </div>
            </button>

            <a href="#simulator" className="btn-secondary" style={{ padding: '0.875rem 1.75rem', borderRadius: '9999px', fontSize: '0.95rem', textDecoration: 'none' }}>
              <Play size={16} color="#06B6D4" /> Explore Interactive Engine
            </a>
          </div>

          {/* Doppelrand (Double-Bezel) Telemetry Banner */}
          <div style={{
            marginTop: '4rem', padding: '0.375rem', borderRadius: '2rem',
            background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              background: '#0B0F1F', borderRadius: 'calc(2rem - 0.375rem)',
              padding: '1.5rem 2rem', display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06B6D4' }}>480 ms</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Voice E2E Latency</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981' }}>99.4%</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Intent Precision</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7C3AED' }}>5 Nodes</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>LangGraph State Engine</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B' }}>99.99%</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Target Uptime SLA</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- LIVE INTERACTIVE ENGINE SIMULATOR --- */}
      <section id="simulator" style={{
        paddingTop: '6rem', paddingBottom: '6rem',
        background: '#060913', borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#06B6D4', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Enterprise Sandbox
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Interactive Voice & State Machine Engine
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto' }}>
              Inspect how Pipecat audio streaming, LangGraph state machine logic, and ChromaDB vector RAG operate in real time.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {DEMO_SCENARIOS.map((sc) => {
              const active = selectedScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  style={{
                    padding: '0.625rem 1.25rem', borderRadius: '9999px',
                    background: active ? 'rgba(6,182,212,0.15)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${active ? '#06B6D4' : 'rgba(255,255,255,0.08)'}`,
                    color: active ? '#06B6D4' : '#94A3B8',
                    fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                    transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.6rem'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: sc.badgeColor }} />
                  {sc.title}
                </button>
              );
            })}
          </div>

          {/* Doppelrand (Double-Bezel) Container for Simulator */}
          <div style={{
            padding: '0.375rem', borderRadius: '2rem',
            background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              background: '#0B0F1F', borderRadius: 'calc(2rem - 0.375rem)', padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.06)', display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem'
            }}>

              {/* Left Column: Live Audio Dialogue Stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>
                    CALL STREAM SIMULATION
                  </span>
                  <span style={{
                    fontSize: '0.75rem', padding: '0.2rem 0.75rem', borderRadius: '9999px',
                    background: `${selectedScenario.badgeColor}20`, color: selectedScenario.badgeColor,
                    fontWeight: 700, border: `1px solid ${selectedScenario.badgeColor}40`
                  }}>
                    {selectedScenario.badge}
                  </span>
                </div>

                {/* Patient Audio Bubble */}
                <div style={{ background: 'rgba(3, 7, 18, 0.8)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Radio size={15} /> INBOUND VOICE INPUT (DEEPGRAM STT)
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#F8FAFC', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{selectedScenario.userUtterance}"
                  </p>
                </div>

                {/* Run Simulation Action */}
                <button
                  onClick={handleStartSim}
                  disabled={isPlaying}
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                    color: 'white', fontWeight: 700, fontSize: '0.9rem',
                    padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    boxShadow: '0 4px 16px rgba(6,182,212,0.3)', opacity: isPlaying ? 0.7 : 1
                  }}
                >
                  {isPlaying ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                  {isPlaying ? 'Executing LangGraph Pipeline...' : 'Run Pipeline Simulation'}
                </button>

                {/* Voice Response Output Bubble */}
                <div style={{
                  background: 'rgba(124, 58, 237, 0.08)', borderRadius: '1rem', padding: '1.25rem',
                  border: '1px solid rgba(124, 58, 237, 0.25)', opacity: simStep >= 3 ? 1 : 0.4, transition: 'all 0.3s'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#A78BFA', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bot size={15} /> PRAXIS VOICE RESPONSE (ELEVENLABS TTS)
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#F8FAFC', fontWeight: 500, lineHeight: 1.5 }}>
                    {simStep >= 3 ? selectedScenario.agentResponse : 'Awaiting state execution completion...'}
                  </p>
                </div>
              </div>

              {/* Right Column: LangGraph Telemetry & Latency */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '2rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>
                  LANGGRAPH STATE TELEMETRY
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: simStep >= 1 ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Intent Classification</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#06B6D4' }}>
                      {selectedScenario.intent} ({selectedScenario.confidence * 100}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: simStep >= 2 ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Active LangGraph Node</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#A78BFA' }}>
                      {selectedScenario.activeAgent}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: simStep >= 2 ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Executed Tools</span>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#10B981' }}>
                      {selectedScenario.toolsCalled.length > 0 ? selectedScenario.toolsCalled.join(', ') : 'None (FAQ)'}
                    </span>
                  </div>
                </div>

                {/* Latency Meter */}
                <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#94A3B8' }}>Pipeline Latency</span>
                    <span style={{ fontWeight: 800, color: '#10B981' }}>{selectedScenario.latencyBreakdown.total} ms</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: '28%', background: '#06B6D4' }} />
                    <div style={{ width: '42%', background: '#7C3AED' }} />
                    <div style={{ width: '30%', background: '#10B981' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem' }}>
                    <span>STT ({selectedScenario.latencyBreakdown.stt}ms)</span>
                    <span>Graph ({selectedScenario.latencyBreakdown.langgraph}ms)</span>
                    <span>TTS ({selectedScenario.latencyBreakdown.tts}ms)</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --- HIPAA & ENTERPRISE SECURITY COMPLIANCE --- */}
      <section id="compliance" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '1280px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Enterprise Trust & Security
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.75rem' }}>
            Healthcare Security & Regulatory Compliance
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto' }}>
            Built from the ground up for strict healthcare privacy standards, auditing, and multi-tenant safety.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '0.25rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ background: '#0B0F1F', borderRadius: 'calc(1.5rem - 0.25rem)', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
              <Lock size={26} color="#10B981" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>HIPAA & BAA Ready</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                PHI/PII auto-redaction before storage. Zero-data-retention options for STT and TTS streaming layers.
              </p>
            </div>
          </div>

          <div style={{ padding: '0.25rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ background: '#0B0F1F', borderRadius: 'calc(1.5rem - 0.25rem)', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
              <ShieldCheck size={26} color="#06B6D4" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dual-Track Audit Logging</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                Immutable audio ground truth logging paired with separated text-only transcript audit trails.
              </p>
            </div>
          </div>

          <div style={{ padding: '0.25rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ background: '#0B0F1F', borderRadius: 'calc(1.5rem - 0.25rem)', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
              <Server size={26} color="#7C3AED" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>RBAC & OAuth2 Security</h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                Strict Role-Based Access Control enforcing distinct permissions for Admins, Physicians, and Receptionists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ENTERPRISE ROI & COST SAVINGS CALCULATOR --- */}
      <section id="roi" style={{ paddingTop: '6rem', paddingBottom: '6rem', background: '#0B0F1F', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: '#06B6D4', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Operational Impact
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Enterprise Clinic ROI Calculator
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto' }}>
              Estimate monthly cost reduction and capacity unlocked by automating front-desk phone operations.
            </p>
          </div>

          <div style={{
            padding: '0.375rem', borderRadius: '2rem',
            background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
            maxWidth: '1000px', margin: '0 auto'
          }}>
            <div style={{
              background: '#030712', borderRadius: 'calc(2rem - 0.375rem)', padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.06)', display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center'
            }}>
              
              {/* Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    <span style={{ color: '#F8FAFC' }}>Daily Inbound Phone Calls</span>
                    <span style={{ color: '#06B6D4', fontSize: '1.1rem', fontWeight: 800 }}>{dailyCalls} calls/day</span>
                  </div>
                  <input
                    type="range" min="30" max="500" value={dailyCalls}
                    onChange={(e) => setDailyCalls(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#06B6D4', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    <span style={{ color: '#F8FAFC' }}>Front-Desk Staffing Cost</span>
                    <span style={{ color: '#10B981', fontSize: '1.1rem', fontWeight: 800 }}>${receptionistCost.toLocaleString()}/mo</span>
                  </div>
                  <input
                    type="range" min="2000" max="15000" step="500" value={receptionistCost}
                    onChange={(e) => setReceptionistCost(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Calculated Outputs */}
              <div style={{
                background: 'rgba(6,182,212,0.06)', borderRadius: '1.5rem', padding: '2rem',
                border: '1px solid rgba(6,182,212,0.2)', textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#06B6D4', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  ESTIMATED MONTHLY SAVINGS
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#10B981', margin: '0.5rem 0 1rem 0' }}>
                  ${estimatedSavings.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  Automates roughly <strong style={{ color: '#F8FAFC' }}>{automatedCalls.toLocaleString()} calls/month</strong>, eliminating call holds and missed appointment revenue.
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --- DEVELOPER API & SDK PLAYGROUND --- */}
      <section id="developer" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '1280px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ color: '#7C3AED', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Developer SDK & API
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.75rem' }}>
            Enterprise Integration Code
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto' }}>
            Integrate Praxis into existing Electronic Health Record (EHR) platforms via clean SDKs and webhooks.
          </p>
        </div>

        <div style={{
          padding: '0.375rem', borderRadius: '2rem',
          background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
          maxWidth: '900px', margin: '0 auto'
        }}>
          <div style={{
            background: '#0B0F1F', borderRadius: 'calc(2rem - 0.375rem)', padding: '1.75rem',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            {/* Header Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['python', 'node', 'webhook'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setCodeLanguage(lang)}
                    style={{
                      padding: '0.4rem 1rem', borderRadius: '0.5rem',
                      background: codeLanguage === lang ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                      border: `1px solid ${codeLanguage === lang ? '#7C3AED' : 'transparent'}`,
                      color: codeLanguage === lang ? '#A78BFA' : '#94A3B8',
                      fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    {lang === 'python' ? 'Python SDK' : lang === 'node' ? 'Node.js Client' : 'Webhook Payload'}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#CBD5E1', fontSize: '0.8rem', padding: '0.4rem 0.85rem', borderRadius: '0.5rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                {copiedCode ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copiedCode ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>

            {/* Code Block */}
            <pre style={{
              margin: 0, padding: '1.25rem', background: '#030712', borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto',
              fontFamily: 'monospace', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6
            }}>
              <code>{CODE_EXAMPLES[codeLanguage]}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA SECTION --- */}
      <footer style={{ padding: '5rem 1.5rem', background: '#030712', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Deploy Autonomous Voice Operations?
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Access the production-ready Praxis administrative portal with full RBAC, prompt versioning, and call logs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              style={{
                background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                color: 'white', fontWeight: 700, fontSize: '1rem',
                padding: '0.5rem 0.5rem 0.5rem 1.5rem', borderRadius: '9999px',
                border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '1rem',
                boxShadow: '0 6px 25px rgba(6,182,212,0.4)'
              }}
            >
              <span>Launch Enterprise Portal</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={18} color="white" />
              </div>
            </button>
          </div>
          <div style={{ marginTop: '4rem', fontSize: '0.85rem', color: '#64748B' }}>
            Praxis Healthcare Platform &copy; 2026 · Enterprise Pipecat + LangGraph Architecture · Developed by Abdul Rafay
          </div>
        </div>
      </footer>

    </div>
  );
}
