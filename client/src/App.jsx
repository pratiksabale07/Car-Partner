import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Browse from './pages/Browse';
import VehicleDetail from './pages/VehicleDetail';
import RequestVehicle from './pages/RequestVehicle';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

function Layout({ children, hideFooter }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(71,85,105,0.5)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#f59e0b', secondary: '#0f172a' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/browse" element={<Layout><Browse /></Layout>} />
          <Route path="/vehicles/:id" element={<Layout><VehicleDetail /></Layout>} />
          <Route path="/request" element={<Layout><RequestVehicle /></Layout>} />
          <Route path="/profile" element={
            <Layout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/owner/dashboard" element={
            <Layout>
              <ProtectedRoute roles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/admin" element={
            <Layout hideFooter>
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="*" element={
            <Layout>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl font-bold text-slate-800 mb-4">404</div>
                  <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
                  <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary inline-flex">Go Home</a>
                </div>
              </div>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
