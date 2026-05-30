import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Clock, Calendar, CalendarRange, CalendarCheck, MapPin, IndianRupee, Truck, User, Phone, Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import CustomSelect from '../components/CustomSelect';

const VEHICLE_TYPES = ['truck', 'car', 'tractor', 'bus', 'van', 'motorcycle', 'crane', 'excavator', 'pickup', 'trailer', 'other'];

export default function RequestVehicle() {
  const [form, setForm] = useState({
    seekerName: '', seekerPhone: '', seekerEmail: '',
    vehicleType: '', purpose: '', rentalType: 'daily',
    startDate: '', endDate: '', location: '', budget: '', quantity: 1, additionalDetails: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.seekerName || !form.seekerPhone || !form.seekerEmail)
      return toast.error('Please fill your name, phone, and email');
    if (!form.vehicleType || !form.purpose || !form.startDate || !form.endDate)
      return toast.error('Please fill all required fields');

    setLoading(true);
    try {
      await api.post('/requests', form);
      setSubmitted(true);
      toast.success('Request submitted! We will find a vehicle for you.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="card p-6 sm:p-10">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Request Submitted!</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Our team has received your vehicle request. We'll search our network and contact you within 24 hours.
            </p>
            <div className="p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl text-sm text-gold-300 mb-6 text-left space-y-1">
              <p><span className="text-slate-400">Vehicle:</span> <span className="capitalize font-medium">{form.vehicleType}</span></p>
              <p><span className="text-slate-400">Contact:</span> {form.seekerPhone}</p>
              <p><span className="text-slate-400">Email:</span> {form.seekerEmail}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/browse" className="btn-outline flex-1 text-center text-sm">Browse Available</Link>
              <button onClick={() => setSubmitted(false)} className="btn-primary flex-1 text-sm">New Request</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/browse" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Browse
        </Link>

        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
            <Truck size={28} className="text-gold-400" />
          </div>
          <h1 className="section-title mb-3">Request a Vehicle</h1>
          <div className="divider mx-auto mb-4" />
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Can't find what you need? Tell us what vehicle you need and we'll source it for you. No account required.
          </p>
        </div>

        <div className="card p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact info */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <User size={15} className="text-gold-400" /> Your Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={form.seekerName} onChange={set('seekerName')}
                    className="input-field pl-9 text-sm" placeholder="Full name *" required />
                </div>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="tel" value={form.seekerPhone} onChange={set('seekerPhone')}
                    className="input-field pl-9 text-sm" placeholder="Phone / WhatsApp *" required />
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={form.seekerEmail} onChange={set('seekerEmail')}
                    className="input-field pl-9 text-sm" placeholder="Email *" required />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700/50" />

            {/* Vehicle details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Type *</label>
                <CustomSelect
                  value={form.vehicleType}
                  onChange={(val) => setForm({ ...form, vehicleType: val })}
                  placeholder="Select vehicle type"
                  options={VEHICLE_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
                <input type="number" min="1" max="100" value={form.quantity} onChange={set('quantity')} className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Purpose *</label>
              <input type="text" value={form.purpose} onChange={set('purpose')} className="input-field"
                placeholder="e.g. Construction project, farm harvest, goods transport" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Rental Type *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'hourly', label: 'Hourly', icon: Clock },
                  { key: 'daily', label: 'Daily', icon: Calendar },
                  { key: 'monthly', label: 'Monthly', icon: CalendarRange },
                  { key: 'yearly', label: 'Yearly', icon: CalendarCheck },
                ].map(({ key, label, icon: Icon }) => (
                  <button key={key} type="button" onClick={() => setForm({ ...form, rentalType: key })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      form.rentalType === key
                        ? 'border-gold-500/60 bg-gold-500/10 text-gold-400'
                        : 'border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}>
                    <Icon size={18} className="mx-auto mb-1.5" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Start Date *</label>
                <input type="date" min={today} value={form.startDate} onChange={set('startDate')} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">End Date *</label>
                <input type="date" min={form.startDate || today} value={form.endDate} onChange={set('endDate')} className="input-field" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <MapPin size={14} className="inline text-gold-400 mr-1" />Location
                </label>
                <input type="text" value={form.location} onChange={set('location')} className="input-field" placeholder="City, State" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <IndianRupee size={14} className="inline text-gold-400 mr-1" />Budget (optional)
                </label>
                <input type="number" value={form.budget} onChange={set('budget')} className="input-field" placeholder="Max budget in ₹" min="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Additional Details</label>
              <textarea value={form.additionalDetails} onChange={set('additionalDetails')} rows={3}
                className="input-field resize-none"
                placeholder="Specific requirements, attachments needed, operating conditions, etc." />
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
              <strong className="text-blue-200">What happens next?</strong> Our admin team reviews your request and contacts vehicle owners in our network. We'll reach you on the phone/email provided above.
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
              {loading
                ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                : <><Send size={18} /><span>Submit Request</span></>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
