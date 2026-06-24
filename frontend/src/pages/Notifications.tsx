import { useState } from 'react';
import { format } from 'date-fns';
import StatusBadge from '../components/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../lib/api';

const S = {
  heading: { color: '#F1F5F9', fontSize: '1.5rem', fontWeight: 700, margin: 0 } as React.CSSProperties,
  subheading: { color: '#94A3B8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' } as React.CSSProperties,
  tableHeader: { color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '0.75rem 1rem', textAlign: 'left' as const, borderBottom: '1px solid #1E293B' },
  tableCell: { padding: '0.875rem 1rem', color: '#F1F5F9', fontSize: '0.875rem', verticalAlign: 'middle' as const },
};

export default function Notifications() {
  const [filter, setFilter] = useState<'All' | 'SMS' | 'Failed'>('All');

  const { data: notifications = [], isLoading } = useQuery({ queryKey: ['notifications'], queryFn: getNotifications });

  const filtered = notifications.filter((n: any) => {
    if (filter === 'SMS') return n.channel === 'sms';
    if (filter === 'Failed') return n.status === 'failed';
    return true;
  });

  if (isLoading) return <div style={{ color: '#F1F5F9', padding: '2rem' }}>Loading notifications...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={S.heading}>Notifications</h1>
          <p style={S.subheading}>System-generated outbound messages and alerts</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['All', 'SMS', 'Failed'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: filter === tab ? '#1E293B' : 'transparent',
              color: filter === tab ? '#F1F5F9' : '#94A3B8',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={S.tableHeader}>Patient</th>
              <th style={S.tableHeader}>Type</th>
              <th style={S.tableHeader}>Message</th>
              <th style={S.tableHeader}>Status</th>
              <th style={S.tableHeader}>Sent At</th>
              <th style={S.tableHeader}>Delivered At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((notification: any) => {
              const isFailed = notification.status === 'failed';
              return (
                <tr 
                  key={notification.id} 
                  className="table-row"
                  style={isFailed ? { background: 'rgba(239, 68, 68, 0.05)', borderLeft: '3px solid #EF4444' } : {}}
                >
                  <td style={S.tableCell}>
                    <p style={{ margin: 0, fontWeight: 500 }}>{notification.patient.full_name}</p>
                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.75rem' }}>{notification.recipient_phone}</p>
                  </td>
                  <td style={S.tableCell}>
                    <span style={{
                      padding: '0.125rem 0.5rem', borderRadius: '0.25rem',
                      background: 'rgba(139,92,246,0.1)', color: '#C4B5FD',
                      fontSize: '0.75rem', fontWeight: 600,
                    }}>
                      {notification.notification_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={S.tableCell}>
                    <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={notification.message_body}>
                      {notification.message_body}
                    </div>
                  </td>
                  <td style={S.tableCell}><StatusBadge status={notification.status} /></td>
                  <td style={S.tableCell}>
                    <span style={{ color: '#94A3B8' }}>{format(new Date(notification.sent_at), 'dd MMM, HH:mm')}</span>
                  </td>
                  <td style={S.tableCell}>
                    {notification.delivered_at ? (
                      <span style={{ color: '#94A3B8' }}>{format(new Date(notification.delivered_at), 'dd MMM, HH:mm')}</span>
                    ) : (
                      <span style={{ color: '#475569' }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>No notifications found.</div>
        )}
      </div>
    </div>
  );
}
