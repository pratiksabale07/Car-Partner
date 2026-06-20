import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LanguageModal from './components/LanguageModal';
import WhatsAppButton from './components/WhatsAppButton';

import Home from './pages/Home';
import Contact from './pages/Contact';
import Browse from './pages/Browse';
import VehicleDetail from './pages/VehicleDetail';
import RequestVehicle from './pages/RequestVehicle';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

import DOTHome from './pages/driverOnTime/Home';
import DOTServices from './pages/driverOnTime/Services';
import DOTWhyChooseUs from './pages/driverOnTime/WhyChooseUs';
import DOTPostJob from './pages/driverOnTime/PostJob';
import DOTBecomeDriver from './pages/driverOnTime/BecomeDriver';
import DOTContact from './pages/driverOnTime/Contact';

function Layout({ children, hideFooter }) {
  const location = useLocation();
  const isDOT = location.pathname.startsWith('/driver-on-time');
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <WhatsAppButton />
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
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
          <LanguageModal />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/browse" element={<Layout><Browse /></Layout>} />
            <Route path="/vehicles/:id" element={<Layout><VehicleDetail /></Layout>} />
            <Route path="/request" element={<Layout><RequestVehicle /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/driver-on-time" element={<Layout><DOTHome /></Layout>} />
            <Route path="/driver-on-time/services" element={<Layout><DOTServices /></Layout>} />
            <Route path="/driver-on-time/why-us" element={<Layout><DOTWhyChooseUs /></Layout>} />
            <Route path="/driver-on-time/post-job" element={<Layout><DOTPostJob /></Layout>} />
            <Route path="/driver-on-time/become-driver" element={<Layout><DOTBecomeDriver /></Layout>} />
            <Route path="/driver-on-time/contact" element={<Layout><DOTContact /></Layout>} />
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
                <AdminDashboard />
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
    </LanguageProvider>
  );
}
