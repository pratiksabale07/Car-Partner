import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Shield, CheckCircle, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import VehicleCard from '../components/VehicleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CustomSelect from '../components/CustomSelect';
import { useLanguage } from '../context/LanguageContext';

const VEHICLE_CATEGORIES = [
  { type: 'truck', label: 'Trucks', emoji: '🚛', desc: 'Heavy haulage & cargo transport' },
  { type: 'tractor', label: 'Tractors', emoji: '🚜', desc: 'Agricultural & construction use' },
  { type: 'car', label: 'Cars & Vans', emoji: '🚗', desc: 'Personal & small fleet needs' },
  { type: 'bus', label: 'Buses', emoji: '🚌', desc: 'Group & passenger transport' },
  { type: 'crane', label: 'Cranes', emoji: '🏗️', desc: 'Heavy lifting & construction' },
  { type: 'excavator', label: 'Excavators', emoji: '🚧', desc: 'Earthwork & site preparation' },
  { type: 'motorcycle', label: 'Motorcycles', emoji: '🏍️', desc: 'Quick delivery & personal use' },
  { type: 'trailer', label: 'Trailers', emoji: '🚚', desc: 'Long haul & bulk transport' },
];

const STATS = [
  { value: '500+', key: 'statsVerified' },
  { value: '10K+', key: 'statsRenters' },
  { value: '50+', key: 'statsCities' },
  { value: '4.9', key: 'statsRating' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const h = (k) => t(`cp.home.${k}`);

  const HOW_IT_WORKS = [
    { step: '01', title: h('step1Title'), desc: h('step1Desc'), icon: Search },
    { step: '02', title: h('step2Title'), desc: h('step2Desc'), icon: CheckCircle },
    { step: '03', title: h('step3Title'), desc: h('step3Desc'), icon: Shield },
    { step: '04', title: h('step4Title'), desc: h('step4Desc'), icon: ArrowRight },
  ];

  useEffect(() => {
    api.get('/vehicles/featured')
      .then(({ data }) => setFeatured(data.vehicles))
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (searchType !== 'all') params.set('type', searchType);
    navigate(`/browse?${params}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(245,158,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-gold-500/20 text-sm text-gold-400 font-medium mb-8">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              {h('badge')}
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {h('heroLine1')}{' '}
              <span className="gradient-text text-shadow-gold">{h('heroLine2')}</span>
              <br />{h('heroLine3')}
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {h('subtitle')}
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 p-2 glass rounded-2xl border border-white/10">
                <CustomSelect
                  value={searchType}
                  onChange={setSearchType}
                  className="hidden sm:block sm:w-44"
                  placeholder="All Types"
                  options={[
                    { value: 'all', label: 'All Types' },
                    ...VEHICLE_CATEGORIES.map(c => ({ value: c.type, label: c.label })),
                  ]}
                />
                <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-4">
                  <Search size={16} className="text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={h('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent py-3 text-white placeholder:text-slate-500 focus:outline-none text-sm"
                  />
                </div>
                <button type="submit" className="btn-primary px-6 py-3 flex items-center gap-2 justify-center">
                  <Search size={16} />
                  {h('searchBtn')}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {['Trucks', 'Tractors', 'Cranes', 'Buses', 'Excavators'].map(type => (
                <Link key={type} to={`/browse?type=${type.toLowerCase()}`}
                  className="px-4 py-1.5 rounded-full text-sm text-slate-400 bg-slate-900/80 border border-slate-700/50 hover:border-gold-500/50 hover:text-gold-400 transition-all duration-200">
                  {type}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="absolute top-1/3 left-8 text-6xl animate-float opacity-20">🚛</div>
            <div className="absolute top-2/3 left-16 text-5xl animate-float opacity-15" style={{ animationDelay: '1s' }}>🚜</div>
            <div className="absolute top-1/3 right-8 text-6xl animate-float opacity-20" style={{ animationDelay: '0.5s' }}>🚌</div>
            <div className="absolute top-2/3 right-16 text-5xl animate-float opacity-15" style={{ animationDelay: '1.5s' }}>🏗️</div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
          <span className="text-xs">{h('scrollText')}</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(stat => (
              <div key={stat.key} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{h(stat.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">{h('categoriesTitle')}</h2>
            <div className="divider mx-auto mb-4" />
            <p className="text-slate-400 max-w-xl mx-auto">{h('categoriesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {VEHICLE_CATEGORIES.map((cat) => (
              <Link key={cat.type} to={`/browse?type=${cat.type}`}
                className="card p-5 text-center hover:shadow-gold hover:-translate-y-1 group cursor-pointer">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 animate-float">
                  {cat.emoji}
                </div>
                <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-gold-400 transition-colors">{cat.label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title mb-3">{h('featuredTitle')}</h2>
              <div className="divider mb-4" />
              <p className="text-slate-400">{h('featuredSubtitle')}</p>
            </div>
            <Link to="/browse" className="hidden sm:flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
              {h('viewAll')} <ChevronRight size={16} />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" text="Loading vehicles..." />
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map(vehicle => <VehicleCard key={vehicle._id} vehicle={vehicle} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🚗</div>
              <p className="text-slate-400">{h('noVehicles')}</p>
              <Link to="/register" className="btn-primary inline-flex mt-4">{h('listVehicle')}</Link>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/browse" className="btn-outline inline-flex items-center gap-2">
              {h('browseAll')} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">{h('howTitle')}</h2>
            <div className="divider mx-auto mb-4" />
            <p className="text-slate-400 max-w-xl mx-auto">{h('howSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative">
                  <div className="card p-6 h-full">
                    <div className="text-6xl font-bold text-gold-500/10 font-display mb-4 leading-none">{step.step}</div>
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4">
                      <Icon size={18} className="text-gold-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center">
                      <ChevronRight size={20} className="text-gold-500/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-600/20 to-gold-500/10 backdrop-blur-sm border border-gold-500/20" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(245,158,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="section-title mb-4">{h('ctaTitle')}</h2>
                <p className="text-slate-300 max-w-lg leading-relaxed">{h('ctaSubtitle')}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link to="/browse" className="btn-primary flex items-center gap-2 whitespace-nowrap">
                  {h('ctaFind')} <ArrowRight size={16} />
                </Link>
                <Link to="/register" className="btn-outline flex items-center gap-2 whitespace-nowrap">
                  {h('ctaList')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
