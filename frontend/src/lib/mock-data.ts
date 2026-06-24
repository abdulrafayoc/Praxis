/**
 * @deprecated This mock data is no longer used. Fetch real data from the API using axios/react-query in api.ts instead.
 */
export const mockStats = {
  totalCallsToday: 47,
  totalCallsDelta: +12,
  appointmentsBooked: 31,
  bookingRate: 65.9,
  bookingRateDelta: +4.2,
  escalations: 4,
  escalationRate: 8.5,
  avgDuration: '3m 42s',
  avgDurationSeconds: 222,
  liveCalls: 2,
};

export const mockCallsChartData = [
  { day: 'Mon', calls: 38, booked: 24 },
  { day: 'Tue', calls: 52, booked: 35 },
  { day: 'Wed', calls: 44, booked: 29 },
  { day: 'Thu', calls: 61, booked: 41 },
  { day: 'Fri', calls: 55, booked: 38 },
  { day: 'Sat', calls: 28, booked: 18 },
  { day: 'Today', calls: 47, booked: 31 },
];

export const mockDoctors = [
  { id: '1', full_name: 'Dr. Aisha Khan', specialty: 'General Practice', is_active: true, email: 'a.khan@citycare.com', phone_extension: '101', bio: 'MBBS, MRCGP. 12 years of experience in general practice.' },
  { id: '2', full_name: 'Dr. James Mitchell', specialty: 'Internal Medicine', is_active: true, email: 'j.mitchell@citycare.com', phone_extension: '102', bio: 'MD, FACP. Specializes in complex chronic diseases.' },
  { id: '3', full_name: 'Dr. Priya Patel', specialty: 'Cardiology', is_active: true, email: 'p.patel@citycare.com', phone_extension: '103', bio: 'MBBS, MD (Cardiology). Cardiac imaging specialist.' },
  { id: '4', full_name: 'Dr. Omar Hassan', specialty: 'Paediatrics', is_active: true, email: 'o.hassan@citycare.com', phone_extension: '104', bio: 'MBBS, DCH, MRCPCH. Experienced paediatrician.' },
  { id: '5', full_name: 'Dr. Sarah Williams', specialty: 'Dermatology', is_active: false, email: 's.williams@citycare.com', phone_extension: '105', bio: 'MD (Dermatology). On sabbatical.' },
];

export const mockPatients = [
  { id: '1', full_name: 'Mohammed Ahmed', phone_number: '+447700900001', date_of_birth: '1985-03-14', email: 'm.ahmed@email.com', created_at: '2024-01-10' },
  { id: '2', full_name: 'Sarah Connor', phone_number: '+447700900002', date_of_birth: '1990-07-22', email: 's.connor@email.com', created_at: '2024-02-15' },
  { id: '3', full_name: 'James Wilson', phone_number: '+447700900003', date_of_birth: '1975-11-05', email: 'j.wilson@email.com', created_at: '2024-03-01' },
  { id: '4', full_name: 'Fatima Al-Rashid', phone_number: '+447700900004', date_of_birth: '1998-05-28', email: 'f.alrashid@email.com', created_at: '2024-03-20' },
  { id: '5', full_name: 'David Chen', phone_number: '+447700900005', date_of_birth: '1962-09-17', email: 'd.chen@email.com', created_at: '2024-04-05' },
];

export const mockCallLogs = [
  {
    id: '1',
    call_session_id: 'sess_abc123',
    patient: { full_name: 'Mohammed Ahmed', phone_number: '+447700900001' },
    started_at: '2025-01-15T09:23:00Z',
    duration_seconds: 187,
    intent_sequence: ['BOOK'],
    agents_invoked: ['orchestrator', 'booking'],
    transcript_reliability_flag: 'full',
    audio_recording_url: 'https://api.twilio.com/recordings/RE123',
    escalation_reason: null,
    transcript_json: [
      { role: 'agent', content: 'Hello, this is Praxis at City Care Clinic. How can I help you today?', agent: 'orchestrator', intent: null, timestamp: '09:23:01', confidence: null },
      { role: 'user', content: "Hi, I'd like to book an appointment with Doctor Khan for next Monday", timestamp: '09:23:05' },
      { role: 'agent', content: 'Let me check that for you...', agent: 'booking', intent: 'BOOK', timestamp: '09:23:07', confidence: 0.97 },
      { role: 'tool_call', content: 'check_availability(doctor_id: "1", date: "2025-01-20")', timestamp: '09:23:08', latency_ms: 145 },
      { role: 'tool_result', content: '[{slot: "10:00", available: true}, {slot: "14:00", available: true}]', timestamp: '09:23:09' },
      { role: 'agent', content: 'I have two openings with Doctor Khan next Monday. I can offer you ten in the morning or two in the afternoon. Which works better for you?', agent: 'booking', timestamp: '09:23:10' },
      { role: 'user', content: 'Two in the afternoon works great', timestamp: '09:23:18' },
      { role: 'agent', content: "Perfect. To confirm, I'll book you in with Doctor Khan next Monday at two in the afternoon. Shall I go ahead?", agent: 'booking', timestamp: '09:23:20' },
      { role: 'user', content: 'Yes please', timestamp: '09:23:24' },
      { role: 'tool_call', content: 'book_appointment(patient_id: "1", doctor_id: "1", slot: "2025-01-20T14:00")', timestamp: '09:23:25', latency_ms: 198 },
      { role: 'tool_result', content: '{appointment_id: "appt_xyz", status: "confirmed"}', timestamp: '09:23:26' },
      { role: 'agent', content: "Your appointment with Doctor Khan next Monday at two in the afternoon is confirmed. You'll receive an SMS confirmation shortly. Is there anything else I can help you with?", agent: 'booking', timestamp: '09:23:27' },
    ],
    tts_text_log: [
      'Hello, this is Praxis at City Care Clinic. How can I help you today?',
      'Let me check that for you...',
      'I have two openings with Doctor Khan next Monday...',
    ],
    prompt_versions: { orchestrator: 'SYS-ORCH-001', booking: 'SYS-BOOK-001' },
    tool_calls_log: [
      { tool_name: 'check_availability', input: { doctor_id: '1', date: '2025-01-20' }, result: [{ slot: '10:00' }, { slot: '14:00' }], latency_ms: 145 },
      { tool_name: 'book_appointment', input: { patient_id: '1', doctor_id: '1', slot_datetime: '2025-01-20T14:00' }, result: { appointment_id: 'appt_xyz', status: 'confirmed' }, latency_ms: 198 },
    ],
  },
  {
    id: '2',
    call_session_id: 'sess_def456',
    patient: { full_name: 'Sarah Connor', phone_number: '+447700900002' },
    started_at: '2025-01-15T10:05:00Z',
    duration_seconds: 94,
    intent_sequence: ['FAQ'],
    agents_invoked: ['orchestrator', 'knowledge'],
    transcript_reliability_flag: 'partial',
    audio_recording_url: 'https://api.twilio.com/recordings/RE456',
    escalation_reason: null,
    transcript_json: [
      { role: 'agent', content: 'Hello, this is Praxis at City Care Clinic. How can I help you today?', agent: 'orchestrator', timestamp: '10:05:01', confidence: null },
      { role: 'user', content: 'What time do you open on Saturdays?', timestamp: '10:05:06' },
      { role: 'agent', content: 'We are open on Saturdays from nine in the morning until one in the afternoon.', agent: 'knowledge', intent: 'FAQ', timestamp: '10:05:08', confidence: 0.98 },
    ],
    tts_text_log: ['Hello, this is Praxis at City Care Clinic...', 'We are open on Saturdays from nine in the morning until one in the afternoon.'],
    prompt_versions: { orchestrator: 'SYS-ORCH-001', knowledge: 'SYS-KNOW-001' },
    tool_calls_log: [],
  },
  {
    id: '3',
    call_session_id: 'sess_ghi789',
    patient: { full_name: 'James Wilson', phone_number: '+447700900003' },
    started_at: '2025-01-15T11:30:00Z',
    duration_seconds: 312,
    intent_sequence: ['TRIAGE', 'ESCALATE'],
    agents_invoked: ['orchestrator', 'triage', 'escalation'],
    transcript_reliability_flag: 'low',
    audio_recording_url: 'https://api.twilio.com/recordings/RE789',
    escalation_reason: 'emergency',
    transcript_json: [
      { role: 'user', content: 'I have chest pains and difficulty breathing', timestamp: '11:30:05' },
      { role: 'agent', content: 'Please note that I am not a medical professional and cannot provide medical advice. What you are describing sounds serious. Please call nine nine nine or your local emergency services immediately.', agent: 'triage', intent: 'TRIAGE', timestamp: '11:30:07', confidence: 0.99 },
    ],
    tts_text_log: [],
    prompt_versions: { orchestrator: 'SYS-ORCH-001', triage: 'SYS-TRIAGE-001' },
    tool_calls_log: [],
  },
];

export const mockAppointments = [
  { id: '1', patient: { full_name: 'Mohammed Ahmed' }, doctor: { full_name: 'Dr. Aisha Khan' }, scheduled_at: '2025-01-20T14:00:00Z', duration_minutes: 30, status: 'confirmed', appointment_type: 'general' },
  { id: '2', patient: { full_name: 'Sarah Connor' }, doctor: { full_name: 'Dr. James Mitchell' }, scheduled_at: '2025-01-21T10:30:00Z', duration_minutes: 45, status: 'confirmed', appointment_type: 'follow-up' },
  { id: '3', patient: { full_name: 'Fatima Al-Rashid' }, doctor: { full_name: 'Dr. Priya Patel' }, scheduled_at: '2025-01-19T09:00:00Z', duration_minutes: 30, status: 'cancelled', appointment_type: 'cardiology' },
  { id: '4', patient: { full_name: 'David Chen' }, doctor: { full_name: 'Dr. Aisha Khan' }, scheduled_at: '2025-01-22T15:00:00Z', duration_minutes: 30, status: 'rescheduled', appointment_type: 'general' },
  { id: '5', patient: { full_name: 'James Wilson' }, doctor: { full_name: 'Dr. Omar Hassan' }, scheduled_at: '2025-01-15T11:00:00Z', duration_minutes: 30, status: 'completed', appointment_type: 'paediatric' },
];

export const mockNotifications = [
  { id: '1', patient: { full_name: 'Mohammed Ahmed' }, notification_type: 'booking_confirmed', channel: 'sms', recipient_phone: '+447700900001', message_body: 'Your appointment with Dr. Khan on Monday January 20th at 2pm is confirmed.', status: 'delivered', sent_at: '2025-01-15T09:23:30Z', delivered_at: '2025-01-15T09:23:35Z' },
  { id: '2', patient: { full_name: 'Fatima Al-Rashid' }, notification_type: 'cancelled', channel: 'sms', recipient_phone: '+447700900004', message_body: 'Your appointment with Dr. Patel has been cancelled.', status: 'failed', sent_at: '2025-01-19T09:05:00Z', delivered_at: null },
  { id: '3', patient: { full_name: 'David Chen' }, notification_type: 'reminder', channel: 'sms', recipient_phone: '+447700900005', message_body: 'Reminder: Appointment with Dr. Khan tomorrow at 3pm.', status: 'sent', sent_at: '2025-01-21T15:00:00Z', delivered_at: null },
];

export const mockKnowledgeDocs = [
  { id: '1', title: 'Clinic Opening Hours', category: 'hours', content: 'City Care Clinic is open Monday to Friday from 8am to 6pm, and Saturday from 9am to 1pm. We are closed on Sundays and bank holidays.', is_active: true, created_at: '2025-01-01' },
  { id: '2', title: 'Dr. Aisha Khan - Profile', category: 'doctors', content: 'Dr. Aisha Khan is a General Practitioner with 12 years experience. Available Monday, Wednesday, and Friday. MBBS, MRCGP.', is_active: true, created_at: '2025-01-01' },
  { id: '3', title: 'Clinic Location and Parking', category: 'location', content: 'City Care Clinic is located at 45 Medical Quarter, London EC1A 1BB. Free parking is available in the adjacent multi-storey car park.', is_active: true, created_at: '2025-01-01' },
  { id: '4', title: 'Pre-Appointment Instructions', category: 'instructions', content: 'Please arrive 10 minutes before your appointment. Bring a valid photo ID and your NHS number if known. For blood tests, fast for 12 hours beforehand.', is_active: true, created_at: '2025-01-01' },
  { id: '5', title: 'Emergency Guidance', category: 'emergency', content: 'For life-threatening emergencies, call 999 immediately. For urgent medical concerns outside clinic hours, call NHS 111.', is_active: true, created_at: '2025-01-01' },
];

export const mockPromptVersions = [
  { id: '1', prompt_id: 'SYS-ORCH-001', agent_id: 'orchestrator', version: 1, author: 'Abdul', change_notes: 'Initial version', test_coverage: '22/22', is_active: true, created_at: '2025-01-15', content: `You are the Praxis Orchestrator, the primary voice AI agent for City Care Clinic. Your role is to understand patient intent from a phone call and route to the appropriate specialist sub-agent.

AVAILABLE INTENTS:
- BOOK: Patient wants to book, reschedule, or cancel an appointment
- FAQ: Patient has a general question about the clinic
- TRIAGE: Patient describes symptoms that may require urgent attention
- ESCALATE: Patient requests to speak with a human

RULES:
1. Always greet warmly but concisely.
2. Identify intent from the first 1-2 patient utterances.
3. Delegate to the correct sub-agent immediately.
4. Never guess medical information; always route to TRIAGE for symptom queries.
5. Keep your direct utterances under 25 words.

SAFETY CONSTRAINT: If a patient mentions chest pain, difficulty breathing, or any life-threatening symptom, immediately invoke the TRIAGE agent without further conversation.` },
  { id: '2', prompt_id: 'SYS-BOOK-001', agent_id: 'booking', version: 1, author: 'Abdul', change_notes: 'Initial version', test_coverage: '22/22', is_active: true, created_at: '2025-01-15', content: `You are the Praxis Booking Agent for City Care Clinic. You handle all appointment booking, rescheduling, and cancellations.

TOOLS AVAILABLE:
- check_availability(doctor_id, date): Returns available slots
- book_appointment(patient_id, doctor_id, slot_datetime): Creates a booking
- cancel_appointment(appointment_id): Cancels a booking
- reschedule_appointment(appointment_id, new_slot): Reschedules

WORKFLOW:
1. Identify which doctor the patient wants (or ask)
2. Ask for preferred date/time
3. Call check_availability
4. Offer up to 3 slot options
5. Confirm patient choice
6. Call book_appointment
7. Confirm the booking verbally with full details

CONFIRMATION FORMAT: "Your appointment with [Doctor] on [Day] at [Time] is confirmed. You will receive an SMS shortly."` },
  { id: '3', prompt_id: 'SYS-KNOW-001', agent_id: 'knowledge', version: 1, author: 'Abdul', change_notes: 'Initial version', test_coverage: '22/22', is_active: true, created_at: '2025-01-15', content: `You are the Praxis Knowledge Agent. You answer frequently asked questions about City Care Clinic using only the information in the retrieved knowledge base documents.

RULES:
1. Only answer based on retrieved context. Never hallucinate.
2. If the answer is not in the retrieved documents, say "I'm sorry, I don't have that information. Would you like me to transfer you to a receptionist?"
3. Keep answers concise (under 40 words).
4. For opening hours, always provide the specific day requested.

RETRIEVED CONTEXT WILL BE INJECTED BELOW:
---
{retrieved_context}
---` },
  { id: '4', prompt_id: 'SYS-TRIAGE-001', agent_id: 'triage', version: 1, author: 'Abdul', change_notes: 'Initial version', test_coverage: '22/22', is_active: true, created_at: '2025-01-15', content: `You are the Praxis Triage Agent. You handle calls where a patient describes symptoms.

CRITICAL RULES:
1. You are NOT a medical professional and must NEVER provide medical advice.
2. Always open with: "Please note I am not a medical professional."
3. For EMERGENCY symptoms (chest pain, difficulty breathing, unconsciousness, severe bleeding): Immediately direct to 999.
4. For URGENT symptoms (high fever, severe pain): Direct to NHS 111 or advise coming to clinic.
5. For NON-URGENT symptoms: Offer to book a GP appointment.

EMERGENCY KEYWORDS: chest pain, heart attack, stroke, can't breathe, unconscious, severe bleeding, anaphylaxis` },
  { id: '5', prompt_id: 'SYS-ESC-001', agent_id: 'escalation', version: 1, author: 'Abdul', change_notes: 'Initial version', test_coverage: '10/10', is_active: true, created_at: '2025-01-15', content: `You are the Praxis Escalation Agent. A patient has requested to speak with a human or the system has determined escalation is necessary.

ACTIONS:
1. Acknowledge the request warmly.
2. Inform the patient they will be transferred.
3. Log the escalation reason.
4. Transfer the call to the receptionist queue.

SCRIPT: "Of course, let me transfer you to one of our receptionists now. Please hold for just a moment."` },
  { id: '6', prompt_id: 'SYS-SUM-001', agent_id: 'summarizer', version: 1, author: 'Abdul', change_notes: 'Initial version', test_coverage: '10/10', is_active: true, created_at: '2025-01-15', content: `You are the Praxis Summarizer. After each call completes, you generate a structured summary.

OUTPUT FORMAT (JSON):
{
  "call_summary": "<2-3 sentence summary of the call>",
  "intent_detected": "<primary intent>",
  "outcome": "<what was achieved>",
  "action_items": ["<list of follow-up actions if any>"],
  "escalation_required": false,
  "sentiment": "positive|neutral|negative"
}

Analyse the provided call transcript and generate the summary. Be factual and concise.` },
];
