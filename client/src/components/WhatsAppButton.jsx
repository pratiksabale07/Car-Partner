import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const WHATSAPP_NUMBER = '917602050606';

export default function WhatsAppButton() {
  const { t } = useLanguage();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I need to book a driver.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
      title={t('whatsapp.tooltip')}
    >
      <span className="hidden group-hover:block glass-dark text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
        {t('whatsapp.tooltip')}
      </span>
      <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:scale-110">
        <MessageCircle size={26} className="text-slate-900" fill="currentColor" />
      </div>
    </a>
  );
}
