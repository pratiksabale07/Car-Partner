import { Link } from 'react-router-dom';
import { Shield, Star, CheckCircle, Users, Car, Clock, Building2, ArrowRight, UserCheck, Briefcase } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PHONE_NUMBER = '+919876543210';
const WHATSAPP_NUMBER = '919876543210';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-gold-500/20 text-sm text-gold-400 font-medium mb-6">
            <Shield size={14} />
            Police Verified Drivers
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-4xl mx-auto">
            {t('home.hero')}
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">{t('home.subHero')}</p>

          <p className="text-xl font-semibold text-white mb-2">{t('home.pathTitle')}</p>
          <p className="text-sm text-slate-400 mb-8">{t('home.pathSubtitle')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="card p-8 flex flex-col items-center text-center hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5">
                <Briefcase size={32} className="text-gold-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">{t('home.pathNeedDriver')}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{t('home.pathNeedDriverDesc')}</p>
              <Link to="/driver-on-time/post-job" className="btn-primary w-full flex items-center justify-center gap-2">
                {t('home.pathNeedDriverCta')} <ArrowRight size={18} />
              </Link>
            </div>

            <div className="card p-8 flex flex-col items-center text-center hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5">
                <UserCheck size={32} className="text-gold-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">{t('home.pathBecomeDriver')}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{t('home.pathBecomeDriverDesc')}</p>
              <Link to="/driver-on-time/become-driver" className="btn-primary w-full flex items-center justify-center gap-2">
                {t('home.pathBecomeDriverCta')} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: t('home.stats.drivers'), label: t('home.stats.driversLabel') },
              { value: t('home.stats.jobs'), label: t('home.stats.jobsLabel') },
              { value: t('home.stats.matched'), label: t('home.stats.matchedLabel') },
              { value: t('home.stats.available'), label: t('home.stats.availableLabel') },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{s.value}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-3">How It Works</h2>
          <div className="divider mx-auto mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                  <Briefcase size={20} className="text-gold-400" />
                </div>
                <h3 className="font-semibold text-lg text-white">{t('home.pathNeedDriver')}</h3>
              </div>
              <ol className="space-y-3">
                {[t('job.step1'), t('job.step2'), t('job.step3'), t('job.step4')].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-6 h-6 bg-gold-500/10 border border-gold-500/30 text-gold-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <Link to="/driver-on-time/post-job" className="btn-primary inline-flex mt-6 text-sm">
                {t('home.pathNeedDriverCta')} →
              </Link>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                  <UserCheck size={20} className="text-gold-400" />
                </div>
                <h3 className="font-semibold text-lg text-white">{t('home.pathBecomeDriver')}</h3>
              </div>
              <ol className="space-y-3">
                {[
                  'Register your profile with license & experience details',
                  'Upload required documents for verification',
                  'Admin verifies your profile',
                  'Admin contacts you when a matching job is found',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-6 h-6 bg-gold-500/10 border border-gold-500/30 text-gold-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <Link to="/driver-on-time/become-driver" className="btn-primary inline-flex mt-6 text-sm">
                {t('home.pathBecomeDriverCta')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-3">{t('home.servicesTitle')}</h2>
          <div className="divider mx-auto mb-4" />
          <p className="text-slate-400 max-w-xl mx-auto mb-12">{t('home.servicesSubtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Car size={28} />, title: t('services.onDemand'), desc: t('services.onDemandDesc') },
              { icon: <Clock size={28} />, title: t('services.monthly'), desc: t('services.monthlyDesc') },
              { icon: <Building2 size={28} />, title: t('services.corporate'), desc: t('services.corporateDesc') },
            ].map((card) => (
              <Link key={card.title} to="/driver-on-time/services" className="card p-6 text-left hover:-translate-y-1 group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4 text-gold-400 group-hover:bg-gold-500 group-hover:text-slate-900 transition-colors">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">{t('whyUs.title')}</h2>
            <div className="divider mx-auto mb-4" />
            <p className="text-slate-400 max-w-xl mx-auto">{t('whyUs.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={24} />, title: t('whyUs.policeVerified'), desc: t('whyUs.policeVerifiedDesc') },
              { icon: <Star size={24} />, title: t('whyUs.experienced'), desc: t('whyUs.experiencedDesc') },
              { icon: <Users size={24} />, title: t('whyUs.uniform'), desc: t('whyUs.uniformDesc') },
              { icon: <CheckCircle size={24} />, title: t('whyUs.trusted'), desc: t('whyUs.trustedDesc') },
            ].map((item) => (
              <div key={item.title} className="card p-6 text-center hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4 text-gold-400">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-600/20 to-gold-500/10 backdrop-blur-sm border border-gold-500/20" />
            <div className="relative z-10 p-10 md:p-16 text-center">
              <h2 className="section-title mb-3">{t('home.ctaTitle')}</h2>
              <p className="text-slate-300 max-w-lg mx-auto mb-8">{t('home.ctaSubtitle')}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
                  {t('home.ctaWhatsApp')}
                </a>
                <a href={`tel:${PHONE_NUMBER}`} className="btn-outline flex items-center gap-2">
                  {t('home.ctaCall')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
