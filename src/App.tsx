import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './router/ProtectedRoute';
import CreateLorePage from './pages/CreateLorePage';
import LorePage from './pages/LorePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lore/new"
        element={
          <ProtectedRoute>
            <CreateLorePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lore/:id"
        element={
          <ProtectedRoute>
            <LorePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
