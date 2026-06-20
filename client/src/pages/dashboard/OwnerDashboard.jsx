import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Truck, CheckCircle, Clock, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomSelect from '../../components/CustomSelect';

const STATUS_BADGE = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/20',
};

function AddVehicleModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '', type: 'truck', description: '', make: '', model: '', year: '',
    capacity: '', fuelType: 'diesel', transmission: 'manual', location: '',
    registrationNumber: '', features: '',
    pricing: { hourly: '', daily: '', monthly: '', yearly: '' },
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setPrice = (key) => (e) => setForm({ ...form, pricing: { ...form.pricing, [key]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        pricing: {
          hourly: Number(form.pricing.hourly) || 0,
          daily: Number(form.pricing.daily) || 0,
          monthly: Number(form.pricing.monthly) || 0,
          yearly: Number(form.pricing.yearly) || 0,
        },
      };
      const { data } = await api.post('/vehicles', payload);
      toast.success('Vehicle listed! Awaiting admin approval.');
      onSave(data.vehicle);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-dark rounded-2xl border border-slate-700/50 shadow-glass">
        <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 p-5 flex items-center justify-between">
          <h2 className="font-semibold text-white">List New Vehicle</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Vehicle Title *</label>
              <input type="text" value={form.title} onChange={set('title')} className="input-field" placeholder="e.g. 2022 Tata Prima Truck" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Type *</label>
              <CustomSelect
                value={form.type}
                onChange={(val) => setForm({ ...form, type: val })}
                options={['truck', 'car', 'tractor', 'bus', 'van', 'motorcycle', 'crane', 'excavator', 'pickup', 'trailer', 'other'].map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Location *</label>
              <input type="text" value={form.location} onChange={set('location')} className="input-field" placeholder="City, State" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Make</label>
              <input type="text" value={form.make} onChange={set('make')} className="input-field" placeholder="e.g. Tata" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Model</label>
              <input type="text" value={form.model} onChange={set('model')} className="input-field" placeholder="e.g. Prima" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Year</label>
              <input type="number" value={form.year} onChange={set('year')} className="input-field" placeholder="2022" min="1990" max="2025" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Capacity</label>
              <input type="text" value={form.capacity} onChange={set('capacity')} className="input-field" placeholder="e.g. 25 tons" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Fuel Type</label>
              <CustomSelect
                value={form.fuelType}
                onChange={(val) => setForm({ ...form, fuelType: val })}
                options={['diesel', 'petrol', 'electric', 'hybrid', 'cng'].map(f => ({ value: f, label: f.charAt(0).toUpperCase() + f.slice(1) }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Reg. Number</label>
              <input type="text" value={form.registrationNumber} onChange={set('registrationNumber')} className="input-field" placeholder="MH-01-AB-1234" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3} className="input-field resize-none" placeholder="Describe your vehicle, condition, etc." />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Features (comma-separated)</label>
            <input type="text" value={form.features} onChange={set('features')} className="input-field" placeholder="AC, GPS, Power Steering, ABS" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-3">Pricing (₹) — fill at least one</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[{ key: 'hourly', label: 'Per Hour' }, { key: 'daily', label: 'Per Day' }, { key: 'monthly', label: 'Per Month' }, { key: 'yearly', label: 'Per Year' }].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                    <input type="number" value={form.pricing[key]} onChange={setPrice(key)} className="input-field pl-7 text-sm" placeholder="0" min="0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Image URLs (one per line)</label>
            <textarea rows={3} className="input-field resize-none text-sm" placeholder="https://example.com/truck1.jpg"
              onChange={(e) => setForm({ ...form, images: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    api.get('/vehicles/my')
      .then(({ data }) => setVehicles(data.vehicles))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deleteVehicle = async (id) => {
    if (!confirm('Remove this vehicle listing?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v._id !== id));
      toast.success('Vehicle removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><LoadingSpinner size="lg" text="Loading dashboard..." /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Owner Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome, {user?.name}</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center justify-center gap-2 text-sm py-3 sm:py-2 w-full sm:w-auto">
            <Plus size={16} /> List New Vehicle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Listed Vehicles', value: vehicles.length, icon: Truck, color: 'text-blue-400' },
            { label: 'Approved', value: vehicles.filter(v => v.status === 'approved').length, icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Pending Approval', value: vehicles.filter(v => v.status === 'pending').length, icon: Clock, color: 'text-gold-400' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={stat.color} />
                  <span className="text-xs text-slate-400">{stat.label}</span>
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* Vehicle list */}
        {vehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-30">🚛</div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No Vehicles Listed</h3>
            <p className="text-slate-500 mb-4">List your first vehicle to start receiving inquiries.</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">List Vehicle</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map(v => (
              <div key={v._id} className="card p-5 hover:border-slate-600/50 transition-all">
                <div className="aspect-[16/9] bg-slate-800 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {v.images?.[0]
                    ? <img src={v.images[0]} alt={v.title} className="w-full h-full object-cover" />
                    : <span className="text-5xl">🚗</span>}
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm line-clamp-1">{v.title}</h4>
                  <span className={`badge border ${STATUS_BADGE[v.status]} capitalize text-xs ml-2 flex-shrink-0`}>{v.status}</span>
                </div>
                <p className="text-xs text-slate-400 mb-2 capitalize">{v.type} · {v.location}</p>
                <div className="flex gap-2 text-xs text-slate-400 mb-4">
                  {v.pricing?.daily > 0 && <span className="text-gold-400 font-medium">₹{v.pricing.daily}/day</span>}
                  {v.pricing?.monthly > 0 && <span className="text-gold-400/70">₹{v.pricing.monthly}/mo</span>}
                </div>
                {v.status === 'pending' && (
                  <p className="text-xs text-yellow-400/70 mb-3">Awaiting admin approval before going live.</p>
                )}
                <div className="flex gap-2">
                  <Link to={`/vehicles/${v._id}`} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-slate-700/60 text-xs text-slate-400 hover:text-white transition-all">
                    <Eye size={13} /> View
                  </Link>
                  <button onClick={() => deleteVehicle(v._id)} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddVehicleModal onClose={() => setShowAddModal(false)} onSave={(v) => setVehicles(prev => [v, ...prev])} />
      )}
    </div>
  );
}
