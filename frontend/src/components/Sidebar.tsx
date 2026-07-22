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
      background: 'rgba(14, 19, 38, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #06B6D4, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6,182,212,0.3)',
          }}>
            <Activity size={18} color="white" />
          </div>
          <div>
            <h1 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1.125rem', margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>Praxis</h1>
            <p style={{ color: '#64748B', fontSize: '0.75rem', margin: '0.25rem 0 0 0', fontWeight: 500 }}>City Care Clinic</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0.875rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              background: isActive ? 'linear-gradient(90deg, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.02) 100%)' : 'transparent',
              border: isActive ? '1px solid rgba(6,182,212,0.15)' : '1px solid transparent',
              color: isActive ? '#06B6D4' : '#94A3B8',
              boxShadow: isActive ? '0 4px 12px -5px rgba(6,182,212,0.1)' : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} style={{
                  color: isActive ? '#06B6D4' : '#94A3B8',
                  filter: isActive ? 'drop-shadow(0 0 4px rgba(6,182,212,0.3))' : 'none',
                  transition: 'all 0.2s',
                }} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1.25rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.8125rem', fontWeight: 700,
            textTransform: 'uppercase',
            boxShadow: '0 2px 8px rgba(124,58,237,0.2)',
          }}>{(role || 'a')[0]}</div>
          <div>
            <p style={{ color: '#F8FAFC', fontSize: '0.875rem', fontWeight: 600, margin: 0, textTransform: 'capitalize' }}>
              {role === 'admin' ? 'Administrator' : role || 'User'}
            </p>
            <p style={{ color: '#64748B', fontSize: '0.75rem', margin: 0, textTransform: 'capitalize', fontWeight: 500 }}>
              {role || 'Role'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            width: '100%', padding: '0.625rem 0.75rem',
            borderRadius: '0.75rem', border: 'none',
            backgroundColor: 'transparent', cursor: 'pointer',
            color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8'; (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
