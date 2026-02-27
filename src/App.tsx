import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { ProfileDetailPage } from './pages/ProfileDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { AdminPage } from './pages/AdminPage';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes with Main Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="profile/:id" element={<ProfileDetailPage />} />

            {/* Protected Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Auth Routes (No Navbar/Footer) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
