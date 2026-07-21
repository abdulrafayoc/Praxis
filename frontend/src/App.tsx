import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Calls from './pages/Calls';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import KnowledgeBase from './pages/KnowledgeBase';
import Patients from './pages/Patients';
import Notifications from './pages/Notifications';
import Prompts from './pages/Prompts';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // If not authorized for this route, fallback to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}><Dashboard /></ProtectedRoute>} />
        <Route path="calls" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}><Calls /></ProtectedRoute>} />
        <Route path="appointments" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}><Appointments /></ProtectedRoute>} />
        <Route path="doctors" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><Doctors /></ProtectedRoute>} />
        <Route path="knowledge-base" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><KnowledgeBase /></ProtectedRoute>} />
        <Route path="patients" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}><Patients /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><Notifications /></ProtectedRoute>} />
        <Route path="prompts" element={<ProtectedRoute allowedRoles={['admin']}><Prompts /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
