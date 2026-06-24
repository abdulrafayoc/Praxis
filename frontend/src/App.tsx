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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
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
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calls" element={<Calls />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="patients" element={<Patients />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="prompts" element={<Prompts />} />
      </Route>
    </Routes>
  );
}
