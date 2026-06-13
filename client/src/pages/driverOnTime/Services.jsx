import { Link } from 'react-router-dom';
import { Car, Clock, Building2, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const WHATSAPP_NUMBER = '919876543210';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    { icon: <Car size={36} />, title: t('services.onDemand'), desc: t('services.onDemandDesc'), features: t('services.onDemandFeatures') },
    { icon: <Clock size={36} />, title: t('services.monthly'), desc: t('services.monthlyDesc'), features: t('services.monthlyFeatures') },
    { icon: <Building2 size={36} />, title: t('services.corporate'), desc: t('services.corporateDesc'), features: t('services.corporateFeatures') },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 text-center mb-12">
        <h1 className="section-title mb-3">{t('services.title')}</h1>
        <div className="divider mx-auto mb-4" />
        <p className="text-slate-400">{t('services.subtitle')}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {services.map((service, idx) => (
          <div
            key={service.title}
            className={`card p-6 flex flex-col md:flex-row gap-8 items-start ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="w-20 h-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0 text-gold-400">
              {service.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-3">{service.title}</h2>
              <p className="text-slate-400 mb-5 leading-relaxed">{service.desc}</p>
              {Array.isArray(service.features) && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle size={16} className="text-gold-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in ${service.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex text-sm"
              >
                {t('services.cta')} →
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-600/20 to-gold-500/10 backdrop-blur-sm border border-gold-500/20" />
          <div className="relative z-10 p-10 md:p-16 text-center">
            <h2 className="section-title mb-3">{t('home.ctaTitle')}</h2>
            <p className="text-slate-300 max-w-lg mx-auto mb-8">{t('home.ctaSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
                {t('home.ctaWhatsApp')}
              </a>
              <Link to="/driver-on-time/become-driver" className="btn-outline">
                {t('nav.becomeDriver')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
