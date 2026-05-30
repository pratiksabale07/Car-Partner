import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import VehicleCard from '../components/VehicleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CustomSelect from '../components/CustomSelect';

const TYPES = ['all', 'truck', 'car', 'tractor', 'bus', 'van', 'motorcycle', 'crane', 'excavator', 'pickup', 'trailer', 'other'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'bookings', label: 'Most Booked' },
];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || 'all',
    rentalType: searchParams.get('rentalType') || '',
    location: searchParams.get('location') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.type && filters.type !== 'all') params.set('type', filters.type);
      if (filters.rentalType) params.set('rentalType', filters.rentalType);
      if (filters.location) params.set('location', filters.location);
      params.set('page', filters.page);
      params.set('limit', '12');

      const { data } = await api.get(`/vehicles?${params}`);
      setVehicles(data.vehicles);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', type: 'all', rentalType: '', location: '', page: 1 });
  };

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.rentalType || filters.location;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">Browse Vehicles</h1>
          <div className="divider mb-3" />
          <p className="text-slate-400 text-sm">{total > 0 ? `${total} vehicles available` : 'Find your perfect rental'}</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Search vehicles, location..."
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              filtersOpen || hasActiveFilters
                ? 'border-gold-500/60 bg-gold-500/10 text-gold-400'
                : 'border-slate-700/60 text-slate-300 hover:border-slate-600'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline text-sm font-medium">Filters</span>
            {hasActiveFilters && <span className="w-2 h-2 bg-gold-400 rounded-full" />}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm">
              <X size={14} />
              Clear
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="glass-dark rounded-2xl p-5 mb-6 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Vehicle Type</label>
                <CustomSelect
                  value={filters.type}
                  onChange={(val) => setFilter('type', val)}
                  options={TYPES.map(t => ({ value: t, label: t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1) }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Rental Type</label>
                <CustomSelect
                  value={filters.rentalType}
                  onChange={(val) => setFilter('rentalType', val)}
                  placeholder="Any Duration"
                  options={[
                    { value: '', label: 'Any Duration' },
                    { value: 'hourly', label: 'Hourly' },
                    { value: 'daily', label: 'Daily' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'yearly', label: 'Yearly' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Location</label>
                <input type="text" value={filters.location} onChange={(e) => setFilter('location', e.target.value)}
                  className="input-field text-sm" placeholder="e.g. Mumbai" />
              </div>
            </div>
          </div>
        )}

        {/* Type Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TYPES.map(type => (
            <button
              key={type}
              onClick={() => setFilter('type', type)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filters.type === type
                  ? 'bg-gold-500 text-slate-900 shadow-gold'
                  : 'glass text-slate-400 hover:text-white hover:border-gold-500/30'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Vehicle Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Finding vehicles..." />
          </div>
        ) : vehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {vehicles.map(vehicle => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setFilter('page', filters.page - 1)}
                  disabled={filters.page === 1}
                  className="w-11 h-11 flex items-center justify-center rounded-lg glass disabled:opacity-30 hover:border-gold-500/30 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilter('page', i + 1)}
                    className={`w-11 h-11 rounded-lg text-sm font-medium transition-all ${
                      filters.page === i + 1 ? 'bg-gold-500 text-slate-900 shadow-gold' : 'glass text-slate-400 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setFilter('page', filters.page + 1)}
                  disabled={filters.page === pages}
                  className="w-11 h-11 flex items-center justify-center rounded-lg glass disabled:opacity-30 hover:border-gold-500/30 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-7xl mb-4 opacity-30">🔍</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Vehicles Found</h3>
            <p className="text-slate-500 mb-6">Can't find what you need? Submit a request and we'll find it for you.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
              <Link to="/request" className="btn-primary">Request a Vehicle</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
