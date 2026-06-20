import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Globe, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Logo = ({ isDOT }) => (
  <Link to={isDOT ? '/driver-on-time' : '/'} className="flex items-center gap-2.5 group">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-shadow duration-300">
      <span className="text-slate-900 font-bold text-lg leading-none">{isDOT ? 'D' : 'C'}</span>
    </div>
    <div className="flex flex-col leading-none">
      {isDOT ? (
        <>
          <span className="font-display font-semibold text-white text-lg tracking-tight">Driver</span>
          <span className="font-display font-semibold gradient-text text-lg tracking-tight -mt-1">on Time</span>
        </>
      ) : (
        <>
          <span className="font-display font-semibold text-white text-lg tracking-tight">Car</span>
          <span className="font-display font-semibold gradient-text text-lg tracking-tight -mt-1">Partner</span>
        </>
      )}
    </div>
  </Link>
);

const languageLabels = { en: 'EN', hi: 'हि', mr: 'म' };
const languageNames = { en: 'English', hi: 'हिंदी', mr: 'मराठी' };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isDOT = location.pathname.startsWith('/driver-on-time');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setLangOpen(false);
  }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };
  const getDashboardPath = () => user?.role === 'admin' ? '/admin' : '/owner/dashboard';

  const navLinks = isDOT
    ? [
        { label: t('nav.home'), to: '/driver-on-time' },
        { label: t('nav.services'), to: '/driver-on-time/services' },
        { label: t('nav.whyUs'), to: '/driver-on-time/why-us' },
        { label: t('nav.contact'), to: '/driver-on-time/contact' },
      ]
    : [
        { label: t('cp.nav.home'), to: '/' },
        { label: t('cp.nav.browse'), to: '/browse' },
        { label: t('cp.nav.contact'), to: '/contact' },
      ];

  const switchTo = isDOT ? '/' : '/driver-on-time';
  const switchLabel = isDOT ? 'Car Partner' : 'Driver on Time';

  const LanguageDropdown = ({ mobile }) => mobile ? (
    <div className="flex items-center gap-2">
      {Object.entries(languageNames).map(([code, name]) => (
        <button key={code} onClick={() => changeLanguage(code)}
          className={`flex-1 text-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            language === code ? 'bg-gold-500/10 text-gold-400 border border-gold-500/40' : 'text-slate-300 border border-slate-700/60 hover:text-white'
          }`}>
          {name}
        </button>
      ))}
    </div>
  ) : (
    <div className="relative">
      <button onClick={() => setLangOpen(!langOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-slate-300 hover:text-white text-sm font-medium transition-all duration-200">
        <Globe size={14} />
        <span>{languageLabels[language] || 'EN'}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
      </button>
      {langOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 glass-dark rounded-xl shadow-glass border border-slate-700/50 overflow-hidden animate-fade-in py-1">
          {Object.entries(languageNames).map(([code, name]) => (
            <button key={code} onClick={() => { changeLanguage(code); setLangOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                language === code ? 'bg-gold-500/10 text-gold-400 font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}>
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || mobileOpen ? 'glass-dark shadow-glass py-3' : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main bar */}
        <div className="flex items-center justify-between gap-2">
          <Logo isDOT={isDOT} />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to ? 'text-gold-400 bg-gold-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link to={switchTo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-slate-300 hover:text-gold-400 text-xs font-semibold whitespace-nowrap transition-all duration-200">
              <ArrowLeftRight size={13} />
              {switchLabel}
            </Link>

            <LanguageDropdown />

            {!isDOT && !user && (
              <Link to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl btn-primary text-sm font-semibold transition-all duration-200">
                <User size={14} /> {t('cp.nav.signIn')}
              </Link>
            )}

            {!isDOT && user && (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all duration-200">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-slate-900 font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white font-medium max-w-24 truncate">{user.name}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-xl shadow-glass border border-slate-700/50 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-700/50">
                      <p className="text-xs text-slate-400">{t('cp.nav.signedInAs')}</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      <span className="badge bg-gold-500/20 text-gold-400 mt-1 capitalize">{user.role}</span>
                    </div>
                    <div className="p-1">
                      <Link to={getDashboardPath()} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <LayoutDashboard size={15} /> {t('cp.nav.dashboard')}
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <User size={15} /> {t('cp.nav.profile')}
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                        <LogOut size={15} /> {t('cp.nav.signOut')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile right side: mode switch + hamburger always visible */}
          <div className="md:hidden flex items-center gap-2">
            <Link to={switchTo}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg glass text-slate-300 hover:text-gold-400 text-[11px] font-semibold whitespace-nowrap transition-all">
              <ArrowLeftRight size={11} />
              {switchLabel}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg glass text-slate-300 hover:text-white transition-all">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-700/50 pt-4 animate-slide-up space-y-1">
            {/* Language switcher */}
            <div className="mb-3">
              <LanguageDropdown mobile />
            </div>

            {/* Nav links */}
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`block px-4 py-2.5 rounded-lg text-sm transition-all ${
                  location.pathname === link.to ? 'text-gold-400 bg-gold-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                {link.label}
              </Link>
            ))}

            {/* CP sign in (when not logged in) */}
            {!isDOT && !user && (
              <Link to="/login"
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm btn-primary mt-2 justify-center">
                <User size={15} /> {t('cp.nav.signIn')}
              </Link>
            )}

            {/* CP auth (only when logged in, hidden on DOT) */}
            {!isDOT && user && (
              <>
                <div className="px-4 py-2 border-t border-slate-700/50 mt-2 pt-3">
                  <p className="text-xs text-slate-500">{t('cp.nav.signedInAs')}</p>
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                </div>
                <Link to={getDashboardPath()} className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                  <LayoutDashboard size={15} className="text-slate-400" /> {t('cp.nav.dashboard')}
                </Link>
                <Link to="/profile" className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                  <User size={15} className="text-slate-400" /> {t('cp.nav.profile')}
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut size={15} /> {t('cp.nav.signOut')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
