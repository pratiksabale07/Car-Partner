import { Link } from 'react-router-dom';
import { Shield, Star, Users, CheckCircle, Clock, Headphones } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const features = [
    { icon: <Shield size={30} />, title: t('whyUs.policeVerified'), desc: t('whyUs.policeVerifiedDesc') },
    { icon: <Star size={30} />, title: t('whyUs.experienced'), desc: t('whyUs.experiencedDesc') },
    { icon: <Users size={30} />, title: t('whyUs.uniform'), desc: t('whyUs.uniformDesc') },
    { icon: <CheckCircle size={30} />, title: t('whyUs.trusted'), desc: t('whyUs.trustedDesc') },
    { icon: <Clock size={30} />, title: t('whyUs.fast'), desc: t('whyUs.fastDesc') },
    { icon: <Headphones size={30} />, title: t('whyUs.support'), desc: t('whyUs.supportDesc') },
  ];

  const stats = [
    { value: t('home.stats.drivers'), label: t('home.stats.driversLabel') },
    { value: t('home.stats.jobs'), label: t('home.stats.jobsLabel') },
    { value: t('home.stats.matched'), label: t('home.stats.matchedLabel') },
    { value: t('home.stats.available'), label: t('home.stats.availableLabel') },
  ];

  const steps = [
    { n: '01', title: 'Post a Job or Register', desc: 'Car owners post their job requirements. Drivers register their profile with experience and preferred area.' },
    { n: '02', title: 'Admin Verifies', desc: 'Our admin manually reviews every job posting and every driver profile to ensure authenticity and quality.' },
    { n: '03', title: 'Admin Matches', desc: "When a driver's area and availability matches a job posting, the admin identifies the right fit." },
    { n: '04', title: 'We Connect You', desc: 'Admin contacts both the car owner and the driver manually to facilitate the introduction and next steps.' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 text-center mb-12">
        <h1 className="section-title mb-3">{t('whyUs.title')}</h1>
        <div className="divider mx-auto mb-4" />
        <p className="text-slate-400">{t('whyUs.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map((s) => (
            <div key={s.label} className="card p-4">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{s.value}</p>
              <p className="text-slate-400 text-xs md:text-sm mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div key={feature.title} className="card p-6 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4 text-gold-400">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-4 text-center mb-20">
        <h2 className="section-title mb-3">How It Works</h2>
        <div className="divider mx-auto mb-4" />
        <p className="text-slate-400 mb-10 text-sm md:text-base max-w-xl mx-auto">
          A simple 4-step process — no automated booking, admin personally handles every match.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div key={item.n} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center text-xl font-extrabold mb-4 flex-shrink-0">
                {item.n}
              </div>
              <h3 className="font-semibold text-base text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-600/20 to-gold-500/10 backdrop-blur-sm border border-gold-500/20" />
          <div className="relative z-10 p-10 md:p-16 text-center">
            <h2 className="section-title mb-3">{t('home.ctaTitle')}</h2>
            <p className="text-slate-300 max-w-lg mx-auto mb-8">{t('home.ctaSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/driver-on-time/post-job" className="btn-primary">{t('nav.postJob')}</Link>
              <Link to="/driver-on-time/become-driver" className="btn-outline">{t('nav.becomeDriver')}</Link>
              <Link to="/driver-on-time/contact" className="btn-ghost">{t('nav.contact')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
