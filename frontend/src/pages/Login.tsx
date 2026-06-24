import { useState } from 'react';
import { Activity, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Try admin / admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F1E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background blobs */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'fadeIn 2s ease-out',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      {/* Card */}
      <div style={{
        background: 'rgba(30, 36, 51, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '1.25rem',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
        margin: '1rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        animation: 'fadeIn 0.4s ease-out',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #06B6D4, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(6,182,212,0.3)',
          }}>
            <Activity size={28} color="white" />
          </div>
          <h1 style={{ color: '#F1F5F9', fontWeight: 800, fontSize: '1.75rem', margin: '0 0 0.25rem' }}>Praxis</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: 0 }}>Healthcare Voice Agent Admin</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                style={{
                  width: '100%', backgroundColor: '#111827',
                  border: '1px solid #1E293B', borderRadius: '0.5rem',
                  padding: '0.625rem 1rem 0.625rem 2.5rem',
                  color: '#F1F5F9', fontSize: '0.875rem',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#06B6D4'}
                onBlur={e => e.target.style.borderColor = '#1E293B'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', backgroundColor: '#111827',
                  border: '1px solid #1E293B', borderRadius: '0.5rem',
                  padding: '0.625rem 2.5rem 0.625rem 2.5rem',
                  color: '#F1F5F9', fontSize: '0.875rem',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#06B6D4'}
                onBlur={e => e.target.style.borderColor = '#1E293B'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1rem', borderRadius: '0.5rem',
              backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', fontSize: '0.875rem', marginBottom: '1rem',
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.75rem',
              background: loading ? '#0891B2' : 'linear-gradient(135deg, #06B6D4, #0891B2)',
              color: 'white', fontWeight: 700, fontSize: '0.9375rem',
              border: 'none', borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(6,182,212,0.3)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Hint */}
        <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.75rem', marginTop: '1.5rem', marginBottom: 0 }}>
          Demo credentials: <span style={{ color: '#06B6D4' }}>admin</span> / <span style={{ color: '#06B6D4' }}>admin</span>
        </p>
      </div>
    </div>
  );
}
