import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" />} />
        <Route path="dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="editor" element={isAuthenticated ? <EditorPage /> : <Navigate to="/login" />} />
        <Route path="progress" element={isAuthenticated ? <ProgressPage /> : <Navigate to="/login" />} />
      </Route>
    </Routes>
  );
}

export default App;
