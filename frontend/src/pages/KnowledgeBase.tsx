import { useState } from 'react';
import { Plus, Trash2, ToggleRight, ToggleLeft, Info } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getKnowledgeDocs } from '../lib/api';
import toast from 'react-hot-toast';

const categories = ['all', 'hours', 'doctors', 'location', 'instructions', 'emergency'];

const categoryColors: Record<string, { bg: string; color: string }> = {
  hours:        { bg: 'rgba(6,182,212,0.12)',  color: '#06B6D4' },
  doctors:      { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  location:     { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  instructions: { bg: 'rgba(124,58,237,0.12)', color: '#A78BFA' },
  emergency:    { bg: 'rgba(239,68,68,0.12)',  color: '#EF4444' },
};

export default function KnowledgeBase() {
  const queryClient = useQueryClient();
  const { data: docs = [], isLoading } = useQuery({ queryKey: ['knowledgeDocs'], queryFn: getKnowledgeDocs });
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = docs.filter((d: any) =>
    activeCategory === 'all' || d.category === activeCategory
  );

  const toggleDoc = (id: string) => {
    queryClient.setQueryData(['knowledgeDocs'], (old: any) =>
      old?.map((d: any) => d.id === id ? { ...d, is_active: !d.is_active } : d)
    );
  };

  if (isLoading) return <div style={{ color: '#F1F5F9', padding: '2rem' }}>Loading documents...</div>;

  const deleteDoc = (id: string) => {
    queryClient.setQueryData(['knowledgeDocs'], (old: any) =>
      old?.filter((d: any) => d.id !== id)
    );
    toast.success('Document removed from knowledge base');
  };

  const catChip = (active: boolean): React.CSSProperties => ({
    padding: '0.375rem 0.875rem',
    border: `1px solid ${active ? 'rgba(6,182,212,0.4)' : '#1E293B'}`,
    borderRadius: '9999px', cursor: 'pointer', fontWeight: 500, fontSize: '0.8125rem',
    background: active ? 'rgba(6,182,212,0.1)' : 'transparent',
    color: active ? '#06B6D4' : '#94A3B8', textTransform: 'capitalize' as const,
    transition: 'all 0.2s',
  });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Knowledge Base</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Documents retrieved by the AI during FAQ calls</p>
        </div>
        <button className="btn-primary" onClick={() => toast.success('Add Document modal — connect to API')}>
          <Plus size={16} /> Add Document
        </button>
      </div>

      {/* Threshold info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0.75rem 1rem', borderRadius: '0.625rem',
        background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)',
        marginBottom: '1.25rem', fontSize: '0.8125rem', color: '#94A3B8',
      }}>
        <Info size={15} color="#06B6D4" />
        <span>Semantic similarity threshold: <strong style={{ color: '#06B6D4' }}>0.75</strong> — documents below this score are not retrieved during calls.</span>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} style={catChip(activeCategory === c)} onClick={() => setActiveCategory(c)}>
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      {/* Document Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {filtered.map((doc: any) => {
          const catColor = categoryColors[doc.category] || { bg: 'rgba(6,182,212,0.12)', color: '#06B6D4' };
          return (
            <div
              key={doc.id}
              className="card glass-hover"
              style={{ opacity: doc.is_active ? 1 : 0.55 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.9375rem', margin: 0 }}>
                    {doc.title}
                  </h3>
                  <span style={{
                    padding: '0.125rem 0.5rem', borderRadius: '0.375rem',
                    background: catColor.bg, color: catColor.color,
                    fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{doc.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => toggleDoc(doc.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: doc.is_active ? '#10B981' : '#475569' }}
                  >
                    {doc.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                  <button
                    onClick={() => deleteDoc(doc.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#475569'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p style={{
                color: '#94A3B8', fontSize: '0.8125rem', lineHeight: 1.55,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                margin: '0 0 0.875rem',
              }}>
                {doc.content}
              </p>
              <p style={{ color: '#475569', fontSize: '0.75rem', margin: 0 }}>
                Last updated: {doc.created_at}
              </p>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>No documents in this category.</div>
      )}
    </div>
  );
}
