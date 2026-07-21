import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PhoneCall, Calendar, Stethoscope,
  BookOpen, Users, Bell, Code, LogOut, Activity
} from 'lucide-react';
import { useAuth } from '../lib/auth';

const allNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'doctor', 'receptionist'] },
  { to: '/calls', icon: PhoneCall, label: 'Call Logs', roles: ['admin', 'doctor', 'receptionist'] },
  { to: '/appointments', icon: Calendar, label: 'Appointments', roles: ['admin', 'doctor', 'receptionist'] },
  { to: '/doctors', icon: Stethoscope, label: 'Doctors', roles: ['admin', 'receptionist'] },
  { to: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base', roles: ['admin', 'receptionist'] },
  { to: '/patients', icon: Users, label: 'Patients', roles: ['admin', 'doctor', 'receptionist'] },
  { to: '/notifications', icon: Bell, label: 'Notifications', roles: ['admin', 'receptionist'] },
  { to: '/prompts', icon: Code, label: 'Prompts', roles: ['admin'] },
];

export default function Sidebar() {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = allNavItems.filter(item => item.roles.includes(role || 'admin'));

  return (
    <aside style={{
      width: '256px',
      height: '100vh',
      background: 'rgba(30, 36, 51, 0.7)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #06B6D4, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(6,182,212,0.2)',
          }}>
            <Activity size={18} color="white" />
          </div>
          <div>
            <h1 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '1.125rem', margin: 0, lineHeight: 1 }}>Praxis</h1>
            <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>City Care Clinic</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.75rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              borderLeft: isActive ? '2px solid #06B6D4' : '2px solid transparent',
              backgroundColor: isActive ? 'rgba(6,182,212,0.1)' : 'transparent',
              color: isActive ? '#06B6D4' : '#94A3B8',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} color={isActive ? '#06B6D4' : '#94A3B8'} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem', borderTop: '1px solid #1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.75rem', fontWeight: 700,
            textTransform: 'uppercase'
          }}>{(role || 'a')[0]}</div>
          <div>
            <p style={{ color: '#F1F5F9', fontSize: '0.875rem', fontWeight: 500, margin: 0, textTransform: 'capitalize' }}>
              {role === 'admin' ? 'Administrator' : role || 'User'}
            </p>
            <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: 0, textTransform: 'capitalize' }}>
              {role || 'Role'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            width: '100%', padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem', border: 'none',
            backgroundColor: 'transparent', cursor: 'pointer',
            color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
