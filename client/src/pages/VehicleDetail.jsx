import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Star, Clock, Calendar, CalendarRange, CalendarCheck,
  Shield, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight,
  User, Phone, Mail, Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const VEHICLE_EMOJIS = {
  truck: '🚛', car: '🚗', tractor: '🚜', bus: '🚌',
  van: '🚐', motorcycle: '🏍️', crane: '🏗️', excavator: '🚧',
  pickup: '🛻', trailer: '🚚', other: '🚙',
};

const RENTAL_TYPES = [
  { key: 'hourly', label: 'Hourly', icon: Clock, unit: 'hour' },
  { key: 'daily', label: 'Daily', icon: Calendar, unit: 'day' },
  { key: 'monthly', label: 'Monthly', icon: CalendarRange, unit: 'month' },
  { key: 'yearly', label: 'Yearly', icon: CalendarCheck, unit: 'year' },
];

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const [form, setForm] = useState({
    seekerName: '', seekerPhone: '', seekerEmail: '',
    rentalType: 'daily', startDate: '', endDate: '',
    purpose: '', message: '',
  });

  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then(({ data }) => {
        setVehicle(data.vehicle);
        const available = RENTAL_TYPES.filter(r => data.vehicle.pricing?.[r.key] > 0);
        if (available.length) setForm(f => ({ ...f, rentalType: available[0].key }));
      })
      .catch(() => toast.error('Vehicle not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const calcTotal = () => {
    if (!form.startDate || !form.endDate || !vehicle) return 0;
    const diff = new Date(form.endDate) - new Date(form.startDate);
    if (diff <= 0) return 0;
    const price = vehicle.pricing[form.rentalType] || 0;
    const durations = {
      hourly: diff / (1000 * 60 * 60),
      daily: diff / (1000 * 60 * 60 * 24),
      monthly: diff / (1000 * 60 * 60 * 24 * 30),
      yearly: diff / (1000 * 60 * 60 * 24 * 365),
    };
    return Math.ceil(durations[form.rentalType]) * price;
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!form.seekerName || !form.seekerPhone || !form.seekerEmail)
      return toast.error('Please fill your name, phone, and email');
    if (!form.startDate || !form.endDate)
      return toast.error('Please select rental dates');
    if (new Date(form.endDate) <= new Date(form.startDate))
      return toast.error('End date must be after start date');

    setSubmitting(true);
    try {
      await api.post(`/inquiries/vehicle/${id}`, form);
      setSubmitted(true);
      toast.success('Inquiry submitted! Our team will contact you shortly.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <LoadingSpinner size="lg" text="Loading vehicle..." />
    </div>
  );
  if (!vehicle) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <p className="text-slate-400">Vehicle not found</p>
    </div>
  );

  const emoji = VEHICLE_EMOJIS[vehicle.type] || '🚙';
  const totalAmount = calcTotal();
  const today = new Date().toISOString().split('T')[0];
  const availableRentals = RENTAL_TYPES.filter(r => vehicle.pricing?.[r.key] > 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/browse" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Browse
          </Link>
          <a href="#inquiry-form" className="lg:hidden btn-primary text-xs py-2 px-4">
            Inquire Now
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — vehicle info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="card overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-slate-800 to-slate-900 relative">
                {vehicle.images?.length > 0 ? (
                  <>
                    <img src={vehicle.images[activeImage]} alt={vehicle.title} className="w-full h-full object-cover" />
                    {vehicle.images.length > 1 && (
                      <>
                        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                          {vehicle.images.map((_, i) => (
                            <button key={i} onClick={() => setActiveImage(i)}
                              className={`h-1.5 rounded-full transition-all ${i === activeImage ? 'bg-gold-400 w-5' : 'bg-white/40 w-1.5'}`} />
                          ))}
                        </div>
                        <button onClick={() => setActiveImage(Math.max(0, activeImage - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 glass rounded-full">
                          <ChevronLeft size={16} />
                        </button>
                        <button onClick={() => setActiveImage(Math.min(vehicle.images.length - 1, activeImage + 1))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 glass rounded-full">
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl opacity-50 animate-float">{emoji}</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="badge bg-slate-900/80 backdrop-blur-sm text-slate-200 capitalize border border-slate-700/50 text-sm">
                    {vehicle.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Info card */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{vehicle.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-slate-400 flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gold-400" />
                      {vehicle.location}
                    </div>
                    {vehicle.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-gold-400 fill-gold-400" />
                        {vehicle.rating.toFixed(1)}
                        <span className="text-slate-500">({vehicle.totalRatings})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {vehicle.description && (
                <p className="text-slate-300 text-sm leading-relaxed mb-5">{vehicle.description}</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Make', value: vehicle.make },
                  { label: 'Model', value: vehicle.model },
                  { label: 'Year', value: vehicle.year },
                  { label: 'Capacity', value: vehicle.capacity },
                  { label: 'Fuel', value: vehicle.fuelType },
                  { label: 'Transmission', value: vehicle.transmission },
                ].filter(i => i.value).map(item => (
                  <div key={item.label} className="bg-slate-800/50 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                    <div className="text-sm font-medium text-white capitalize">{item.value}</div>
                  </div>
                ))}
              </div>

              {vehicle.features?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map(f => (
                      <span key={f} className="flex items-center gap-1.5 px-3 py-1 bg-gold-500/10 text-gold-400 rounded-full text-xs font-medium">
                        <CheckCircle size={11} />{f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing overview */}
            {availableRentals.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-white mb-4">Rental Pricing</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availableRentals.map(({ key, label, icon: Icon, unit }) => (
                    <div key={key} className="bg-slate-800/50 rounded-xl p-3 text-center">
                      <Icon size={16} className="text-gold-400 mx-auto mb-1.5" />
                      <div className="text-xs text-slate-400 mb-0.5">{label}</div>
                      <div className="text-base font-bold text-white">₹{vehicle.pricing[key].toLocaleString()}</div>
                      <div className="text-xs text-slate-500">/{unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — inquiry form */}
          <div className="lg:col-span-1" id="inquiry-form">
            <div className="lg:sticky lg:top-28">
              {submitted ? (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Inquiry Submitted!</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">
                    Our team has received your request and will contact you within 24 hours to finalize the rental.
                  </p>
                  <div className="p-3 bg-gold-500/10 border border-gold-500/20 rounded-xl text-xs text-gold-300 mb-5">
                    <Shield size={12} className="inline mr-1" />
                    We handle all arrangements between you and the vehicle owner securely.
                  </div>
                  <Link to="/browse" className="btn-outline w-full block text-center text-sm">Browse More Vehicles</Link>
                </div>
              ) : (
                <div className="card p-6">
                  <h2 className="font-semibold text-white mb-1">Inquire About This Vehicle</h2>
                  <p className="text-xs text-slate-400 mb-5">No account needed — fill your details and we'll handle everything.</p>

                  <form onSubmit={handleInquiry} className="space-y-4">
                    {/* Contact details */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Contact Info</p>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Your full name *" value={form.seekerName}
                          onChange={(e) => setForm(f => ({ ...f, seekerName: e.target.value }))}
                          className="input-field pl-9 text-sm" required />
                      </div>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="tel" placeholder="Phone / WhatsApp *" value={form.seekerPhone}
                          onChange={(e) => setForm(f => ({ ...f, seekerPhone: e.target.value }))}
                          className="input-field pl-9 text-sm" required />
                      </div>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" placeholder="Email address *" value={form.seekerEmail}
                          onChange={(e) => setForm(f => ({ ...f, seekerEmail: e.target.value }))}
                          className="input-field pl-9 text-sm" required />
                      </div>
                    </div>

                    {/* Rental type */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Rental Duration</p>
                      <div className="grid grid-cols-2 gap-2">
                        {availableRentals.map(({ key, label, icon: Icon }) => (
                          <button key={key} type="button"
                            onClick={() => setForm(f => ({ ...f, rentalType: key }))}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              form.rentalType === key
                                ? 'border-gold-500/60 bg-gold-500/10 text-gold-400'
                                : 'border-slate-700/50 text-slate-400 hover:border-slate-600'
                            }`}>
                            <Icon size={14} className="mx-auto mb-1" />
                            <div className="text-xs font-medium">{label}</div>
                            <div className="text-xs opacity-70">₹{vehicle.pricing[key].toLocaleString()}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Start Date *</label>
                        <input type="datetime-local" min={today} value={form.startDate}
                          onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))}
                          className="input-field text-sm" required />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">End Date *</label>
                        <input type="datetime-local" min={form.startDate || today} value={form.endDate}
                          onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))}
                          className="input-field text-sm" required />
                      </div>
                    </div>

                    <div>
                      <input type="text" placeholder="Purpose (e.g. Construction, Farm work)"
                        value={form.purpose}
                        onChange={(e) => setForm(f => ({ ...f, purpose: e.target.value }))}
                        className="input-field text-sm" />
                    </div>

                    <div>
                      <textarea placeholder="Any additional message or requirements..."
                        value={form.message}
                        onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                        rows={2} className="input-field text-sm resize-none" />
                    </div>

                    {totalAmount > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gold-500/10 border border-gold-500/20 rounded-xl">
                        <span className="text-xs text-slate-300">Estimated Total</span>
                        <span className="text-base font-bold text-gold-400">₹{totalAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <button type="submit" disabled={submitting}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                      {submitting
                        ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                        : <><Send size={16} /><span>Send Inquiry</span></>
                      }
                    </button>
                  </form>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <Shield size={12} className="text-gold-400 flex-shrink-0" />
                    Your details are shared only with our admin team — not with the vehicle owner directly.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
