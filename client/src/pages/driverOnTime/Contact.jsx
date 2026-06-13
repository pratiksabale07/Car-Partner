import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const WHATSAPP_NUMBER = '919876543210';
const PHONE = '+919876543210';

const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242118.06782370477!2d73.72288540000001!3d18.524564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin';

export default function Contact() {
  const { t } = useLanguage();

  const contactCards = [
    {
      icon: <Phone size={24} />,
      label: t('contact.phone'),
      value: t('contact.phoneValue'),
      href: `tel:${PHONE}`,
    },
    {
      icon: <Mail size={24} />,
      label: t('contact.email'),
      value: t('contact.emailValue'),
      href: `mailto:${t('contact.emailValue')}`,
    },
    {
      icon: <MapPin size={24} />,
      label: t('contact.address'),
      value: t('contact.addressValue'),
      href: null,
    },
    {
      icon: <Clock size={24} />,
      label: t('contact.hours'),
      value: t('contact.hoursValue'),
      href: null,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 text-center mb-12">
        <h1 className="section-title mb-3">{t('contact.title')}</h1>
        <div className="divider mx-auto mb-4" />
        <p className="text-slate-400">{t('contact.subtitle')}</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactCards.map((card) => (
            <div key={card.label} className="card p-6 text-center hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4 text-gold-400">
                {card.icon}
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
              {card.href ? (
                <a href={card.href} className="font-semibold text-white hover:text-gold-400 transition-colors text-sm break-all">
                  {card.value}
                </a>
              ) : (
                <p className="font-semibold text-white text-sm">{card.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I need to book a driver.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <MessageCircle size={20} />
            {t('contact.whatsapp')}
          </a>
          <a href={`tel:${PHONE}`} className="btn-outline flex items-center gap-2">
            <Phone size={20} />
            {t('contact.callUs')}
          </a>
        </div>

        {/* Google Maps */}
        <div className="card p-0 overflow-hidden">
          <div className="bg-gold-500/10 border-b border-gold-500/20 text-gold-400 px-6 py-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <MapPin size={20} />
              {t('contact.mapTitle')}
            </h2>
          </div>
          <div className="h-80 w-full">
            <iframe
              src={MAP_EMBED_SRC}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Driver on Time Location"
            />
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          To show your exact location, replace the map embed URL in <code className="bg-slate-800 px-1 rounded">Contact.jsx</code> with your Google Maps embed link.
        </p>
      </div>
    </div>
  );
}
