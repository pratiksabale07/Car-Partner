import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to the page they were trying to reach (e.g. /admin)
  const from = location.state?.from?.pathname;
  const getDashboardPath = (role) => from || (role === 'admin' ? '/admin' : '/owner/dashboard');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(getDashboardPath(user.role));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-slate-900" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/8 rounded-full blur-3xl animate-float" />
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-16 w-full">
          <div className="text-8xl mb-6 animate-float">🔑</div>
          <h2 className="font-display text-3xl font-bold text-white mb-4">Welcome Back</h2>
          <p className="text-slate-400 max-w-xs leading-relaxed">
            Sign in to access your CarPartner dashboard — admin panel or vehicle owner portal.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-10 w-full max-w-xs">
            {['🚛', '🚜', '🚗', '🚌', '🏗️', '🚚'].map((e, i) => (
              <div key={i} className="glass rounded-xl p-3 text-2xl text-center">{e}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xl">C</span>
              </div>
              <span className="font-display text-2xl font-semibold gradient-text">CarPartner</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
            <p className="text-slate-400 text-sm">Admin panel · Vehicle owner portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-10" placeholder="Your password" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
              {loading
                ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                : <><span>Sign In</span><ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">Register as vehicle owner</Link>
          </p>

          <div className="mt-4 p-3 glass rounded-xl text-center">
            <p className="text-xs text-slate-500">
              Want to rent a vehicle?{' '}
              <Link to="/browse" className="text-gold-400 hover:text-gold-300 transition-colors">Browse here</Link>
              {' '}— no account needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
