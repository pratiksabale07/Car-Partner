import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-shadow duration-300">
      <span className="text-slate-900 font-bold text-lg leading-none">C</span>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-display font-semibold text-white text-lg tracking-tight">Car</span>
      <span className="font-display font-semibold gradient-text text-lg tracking-tight -mt-1">Partner</span>
    </div>
  </Link>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => user?.role === 'admin' ? '/admin' : '/owner/dashboard';

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Browse', to: '/browse' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || mobileOpen ? 'glass-dark shadow-glass py-3' : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-gold-400 bg-gold-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-slate-900 font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white font-medium max-w-24 truncate">{user.name}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-xl shadow-glass border border-slate-700/50 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-700/50">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      <span className="badge bg-gold-500/20 text-gold-400 mt-1 capitalize">{user.role}</span>
                    </div>
                    <div className="p-1">
                      <Link to={getDashboardPath()} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <User size={15} />
                        Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg glass text-slate-300 hover:text-white transition-all"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-700/50 pt-4 animate-slide-up space-y-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="block px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="px-4 py-2 border-b border-slate-700/50 mb-1">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                </div>
                <Link to={getDashboardPath()} className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                  <LayoutDashboard size={15} className="text-slate-400" /> Dashboard
                </Link>
                <Link to="/profile" className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                  <User size={15} className="text-slate-400" /> Profile
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" className="btn-outline text-sm text-center py-3">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm text-center py-3">Get Started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
