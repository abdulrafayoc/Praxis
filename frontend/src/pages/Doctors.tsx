// import { useState } from 'react';
import { Plus, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDoctors } from '../lib/api';
import toast from 'react-hot-toast';

const specialtyColors: Record<string, { bg: string; color: string }> = {
  'General Practice':  { bg: 'rgba(6,182,212,0.12)',   color: '#06B6D4' },
  'Internal Medicine': { bg: 'rgba(16,185,129,0.12)',  color: '#10B981' },
  'Cardiology':        { bg: 'rgba(239,68,68,0.12)',   color: '#EF4444' },
  'Paediatrics':       { bg: 'rgba(245,158,11,0.12)',  color: '#F59E0B' },
  'Dermatology':       { bg: 'rgba(124,58,237,0.12)',  color: '#A78BFA' },
};

function getInitials(name: string) {
  return name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2);
}

const gradients = [
  'linear-gradient(135deg, #06B6D4, #7C3AED)',
  'linear-gradient(135deg, #10B981, #06B6D4)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #EF4444, #7C3AED)',
  'linear-gradient(135deg, #7C3AED, #06B6D4)',
];

export default function Doctors() {
  const queryClient = useQueryClient();
  const { data: doctors = [], isLoading } = useQuery({ queryKey: ['doctors'], queryFn: getDoctors });

  const toggleActive = async (id: string) => {
    // Optimistic update
    queryClient.setQueryData(['doctors'], (old: any) => 
      old?.map((d: any) => d.id === id ? { ...d, is_active: !d.is_active } : d)
    );
    const doc = doctors.find((d: any) => d.id === id);
    toast.success(`${doc?.full_name} ${!doc?.is_active ? 'activated' : 'deactivated'}`);
  };

  if (isLoading) return <div style={{ color: '#F1F5F9', padding: '2rem' }}>Loading doctors...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Doctors</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Manage clinic practitioners and their profiles</p>
        </div>
        <button className="btn-primary" onClick={() => toast.success('Add Doctor modal — connect to API')}>
          <Plus size={16} /> Add Doctor
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {doctors.map((doc: any, i: number) => {
          const specialty = specialtyColors[doc.specialty] || { bg: 'rgba(6,182,212,0.12)', color: '#06B6D4' };
          return (
            <div
              key={doc.id}
              className="card glass-hover"
              style={{ opacity: doc.is_active ? 1 : 0.6 }}
            >
              {/* Avatar + active toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: gradients[i % gradients.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '1.125rem', fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}>
                  {getInitials(doc.full_name)}
                </div>
                <button
                  onClick={() => toggleActive(doc.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: doc.is_active ? '#10B981' : '#475569' }}
                  title={doc.is_active ? 'Deactivate' : 'Activate'}
                >
                  {doc.is_active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>

              {/* Info */}
              <h3 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '1.0625rem', margin: '0 0 0.375rem' }}>
                {doc.full_name}
              </h3>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: '0.375rem',
                background: specialty.bg, color: specialty.color,
                fontSize: '0.75rem', fontWeight: 600,
              }}>{doc.specialty}</span>

              <p style={{ color: '#94A3B8', fontSize: '0.8125rem', margin: '0.875rem 0 0', lineHeight: 1.5 }}>
                {doc.bio}
              </p>

              <div style={{ borderTop: '1px solid #1E293B', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: 0 }}>Ext. {doc.phone_extension}</p>
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: '0.2rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.email}</p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => toast.success(`Edit ${doc.full_name} — connect to API`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                >
                  <Edit size={13} /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
