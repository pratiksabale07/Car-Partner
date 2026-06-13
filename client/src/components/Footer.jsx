import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Share2, Heart, Link2, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WHATSAPP_NUMBER = '919876543210';

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
      <span className="text-slate-900 font-bold text-lg">C</span>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-display font-semibold text-white text-lg">Car</span>
      <span className="font-display font-semibold gradient-text text-lg -mt-1">Partner</span>
    </div>
  </div>
);

function CarPartnerFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              The premium vehicle rental marketplace connecting owners and renters seamlessly through our trusted admin-managed platform.
            </p>
            <div className="flex gap-3 mt-5">
              {[Share2, Globe, Heart, Link2].map((Icon, i) => (
                <button key={i} className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/30 transition-all duration-200">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              {[
                { label: 'Browse Vehicles', to: '/browse' },
                { label: 'List Your Vehicle', to: '/register' },
                { label: 'Request a Vehicle', to: '/request' },
                { label: 'How It Works', to: '/#how-it-works' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-gold-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Vehicle Types</h4>
            <ul className="space-y-3">
              {['Trucks', 'Tractors', 'Cars & Vans', 'Buses', 'Cranes', 'Excavators', 'Motorcycles', 'Trailers'].map(v => (
                <li key={v}>
                  <Link to={`/browse?type=${v.toLowerCase()}`} className="text-sm text-slate-400 hover:text-gold-400 transition-colors duration-200">
                    {v}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-400">123 Business Hub, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-400 flex-shrink-0" />
                <span className="text-sm text-slate-400">+91 7602050606</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-400 flex-shrink-0" />
                <span className="text-sm text-slate-400">support@carpartner.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} CarPartner. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <button key={item} className="text-sm text-slate-500 hover:text-gold-400 transition-colors duration-200">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function DriverOnTimeFooter() {
  const { t } = useLanguage();

  const quickLinks = [
    { to: '/driver-on-time', label: t('nav.home') },
    { to: '/driver-on-time/services', label: t('nav.services') },
    { to: '/driver-on-time/why-us', label: t('nav.whyUs') },
    { to: '/driver-on-time/post-job', label: t('nav.postJob') },
    { to: '/driver-on-time/become-driver', label: t('nav.becomeDriver') },
    { to: '/driver-on-time/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">{t('footer.tagline')}</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I need a driver`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors mt-5"
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </a>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-gold-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-sm text-slate-400 hover:text-gold-400 transition-colors">{t('footer.phone')}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-400 flex-shrink-0" />
                <a href="mailto:info@driverontime.com" className="text-sm text-slate-400 hover:text-gold-400 transition-colors">{t('footer.email')}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-400">Pune, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/50 text-center">
          <p className="text-sm text-slate-500">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  const location = useLocation();
  const isDOT = location.pathname.startsWith('/driver-on-time');
  return isDOT ? <DriverOnTimeFooter /> : <CarPartnerFooter />;
}
