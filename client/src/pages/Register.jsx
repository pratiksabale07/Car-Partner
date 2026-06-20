import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Truck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CityInput from '../components/CityInput';

const PERKS = [
  'List unlimited vehicles',
  'Set your own pricing',
  'Inquiries managed by our team',
  'Secure & verified platform',
];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli', 'Daman & Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', city: '', state: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: [form.city, form.state].filter(Boolean).join(', '),
      };
      const user = await register(payload);
      toast.success(`Welcome to CarPartner, ${user.name}!`);
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-16">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-slate-900" />
        <div className="absolute top-1/3 left-1/3 w-56 h-56 bg-gold-500/8 rounded-full blur-3xl animate-float" />
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 w-full">
          <div className="text-7xl mb-5 animate-float">🚛</div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">List Your Vehicles</h2>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-8">
            Create an account to list your vehicles on CarPartner. Our admin team handles all inquiries — you just provide the vehicle.
          </p>
          <div className="w-full max-w-xs space-y-3">
            {PERKS.map((perk) => (
              <div key={perk} className="glass rounded-xl p-3 flex items-center gap-3 text-left">
                <CheckCircle size={15} className="text-gold-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full mb-4">
              <Truck size={14} className="text-gold-400" />
              <span className="text-xs text-gold-400 font-medium">Vehicle Owner Registration</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-slate-400 text-sm">Register to start listing your vehicles</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={form.name} onChange={set('name')}
                    className="input-field pl-9 py-2.5 text-sm" placeholder="Your name" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="tel" value={form.phone} onChange={set('phone')}
                    className="input-field pl-9 py-2.5 text-sm" placeholder="+91 XXXXX" required />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={set('email')}
                  className="input-field pl-9 py-2.5 text-sm" placeholder="you@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">City</label>
                <CityInput
                  value={form.city}
                  onChange={(val) => setForm({ ...form, city: val })}
                  placeholder="Search city..."
                  className="py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">State</label>
                <select value={form.state} onChange={set('state')} className="select-field py-2.5 text-sm">
                  <option value="">Select state</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
                    className="input-field pl-9 pr-9 py-2.5 text-sm" placeholder="Min 6 chars" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')}
                    className="input-field pl-9 py-2.5 text-sm" placeholder="Repeat password" required />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                : <><span>Create Account</span><ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">Sign in</Link>
          </p>

          <div className="mt-6 p-3 glass rounded-xl text-center">
            <p className="text-xs text-slate-500">
              Just looking to rent a vehicle?{' '}
              <Link to="/browse" className="text-gold-400 hover:text-gold-300 transition-colors">Browse vehicles</Link>
              {' '}— no account needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
