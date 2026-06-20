import { useState, useEffect } from 'react';
import { Users, Truck, MessageSquare, FileText, CheckCircle, Clock, Phone, Mail, Lock, Eye, EyeOff, LogOut, ShieldCheck, Trash2, ArrowRightLeft, MapPin, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomSelect from '../../components/CustomSelect';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { id: 'overview', label: 'Overview', short: 'Overview' },
  { id: 'inquiries', label: 'Inquiries', short: 'Inquiries' },
  { id: 'requests', label: 'Vehicle Requests', short: 'Requests' },
  { id: 'vehicles', label: 'Vehicles', short: 'Vehicles' },
  { id: 'owners', label: 'Owners', short: 'Owners' },
  { id: 'jobs', label: 'Driver Jobs', short: 'Jobs' },
  { id: 'driverProfiles', label: 'Driver Profiles', short: 'Drivers' },
  { id: 'enquiries', label: 'Self-Drive Enquiries', short: 'Enquiries' },
  { id: 'matches', label: 'Matched Profiles', short: 'Matched' },
];

const UPLOADS_BASE = api.defaults.baseURL.replace(/\/api\/?$/, '');
const fileUrl = (p) => {
  if (!p) return '';
  if (String(p).startsWith('http')) return p; // Cloudinary URL — use directly
  return `${UPLOADS_BASE}/${String(p).replace(/\\/g, '/')}`; // legacy local path
};

function StatCard({ label, value, icon: Icon, color, bg, sub }) {
  return (
    <div className={`card p-5 border-l-2 ${bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wide">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800/80">
          <Icon size={18} className={color} />
        </div>
      </div>
    </div>
  );
}

function ContactCard({ label, name, phone, email, color = 'text-slate-300' }) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-3 space-y-1">
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{name}</p>
      <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-400 transition-colors">
        <Phone size={11} className="text-gold-400" />{phone}
      </a>
      {email && (
        <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-400 transition-colors">
          <Mail size={11} className="text-gold-400" />{email}
        </a>
      )}
    </div>
  );
}

function StatusSelect({ current, options, onChange }) {
  return (
    <CustomSelect
      value={current}
      onChange={onChange}
      options={options}
      className="w-40"
    />
  );
}

function StatusBadge({ status }) {
  const cfg = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    contacted: 'bg-blue-500/20 text-blue-400',
    'deal-done': 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
    approved: 'bg-emerald-500/20 text-emerald-400',
    'in-progress': 'bg-blue-500/20 text-blue-400',
    fulfilled: 'bg-emerald-500/20 text-emerald-400',
    active: 'bg-emerald-500/20 text-emerald-400',
    matched: 'bg-purple-500/20 text-purple-400',
    closed: 'bg-slate-500/20 text-slate-400',
    inactive: 'bg-slate-500/20 text-slate-400',
    verified: 'bg-emerald-500/20 text-emerald-400',
    new: 'bg-blue-500/20 text-blue-400',
    booked: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };
  return <span className={`badge capitalize ${cfg[status] || 'bg-slate-500/20 text-slate-400'}`}>{status?.replace('-', ' ')}</span>;
}

function AdminLoginGate({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return toast.error('Enter username and password');
    setSubmitting(true);
    try {
      await onLogin(form.username, form.password);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-4 shadow-gold">
            <ShieldCheck size={32} className="text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Panel</h1>
          <p className="text-slate-400 text-sm">Car Partner &amp; Driver on Time</p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input-field pl-10"
                  placeholder="admin"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  placeholder="Admin password"
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
              {submitting
                ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                : 'Sign In to Admin Panel'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading, login: authLogin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [owners, setOwners] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [driverProfiles, setDriverProfiles] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;
    api.get('/admin/dashboard').then(({ data }) => {
      setStats(data.stats);
      setRecentInquiries(data.recentInquiries);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const qs = filterStatus ? `?status=${filterStatus}` : '';
    if (activeTab === 'inquiries') {
      api.get(`/inquiries/all${qs}`).then(({ data }) => setInquiries(data.inquiries)).catch(() => {});
    } else if (activeTab === 'requests') {
      api.get(`/requests/all${qs}`).then(({ data }) => setRequests(data.requests)).catch(() => {});
    } else if (activeTab === 'vehicles') {
      api.get(`/admin/vehicles${qs}`).then(({ data }) => setVehicles(data.vehicles)).catch(() => {});
    } else if (activeTab === 'owners') {
      api.get('/admin/users').then(({ data }) => setOwners(data.users)).catch(() => {});
    } else if (activeTab === 'jobs') {
      api.get('/jobs').then(({ data }) => setJobs(data.jobs)).catch(() => {});
    } else if (activeTab === 'driverProfiles') {
      api.get('/drivers').then(({ data }) => setDriverProfiles(data.drivers)).catch(() => {});
    } else if (activeTab === 'enquiries') {
      api.get('/enquiries').then(({ data }) => setEnquiries(data.enquiries)).catch(() => {});
    } else if (activeTab === 'matches') {
      api.get('/admin/matches').then(({ data }) => setMatches(data.matches)).catch(() => {});
    }
  }, [activeTab, filterStatus, isAdmin]);

  const updateInquiry = async (id, status) => {
    try {
      const { data } = await api.put(`/inquiries/${id}`, { status });
      setInquiries(prev => prev.map(i => i._id === id ? data.inquiry : i));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const updateRequest = async (id, status) => {
    try {
      const { data } = await api.put(`/requests/${id}`, { status });
      setRequests(prev => prev.map(r => r._id === id ? data.request : r));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const updateVehicle = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/vehicles/${id}/status`, { status });
      setVehicles(prev => prev.map(v => v._id === id ? data.vehicle : v));
      toast.success(`Vehicle ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const toggleOwner = async (id, isActive) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/status`, { isActive: !isActive });
      setOwners(prev => prev.map(u => u._id === id ? data.user : u));
      toast.success(`Owner ${!isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed'); }
  };

  const updateJob = async (id, status) => {
    try {
      const { data } = await api.patch(`/jobs/${id}/status`, { status });
      setJobs(prev => prev.map(j => j._id === id ? data.job : j));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const updateDriverProfile = async (id, status) => {
    try {
      const { data } = await api.patch(`/drivers/${id}/status`, { status });
      setDriverProfiles(prev => prev.map(d => d._id === id ? data.driver : d));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const updateEnquiry = async (id, status) => {
    try {
      const { data } = await api.patch(`/enquiries/${id}/status`, { status });
      setEnquiries(prev => prev.map(e => e._id === id ? data.enquiry : e));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const confirmDelete = (label, action) => {
    if (window.confirm(`Delete this ${label}? This cannot be undone.`)) action();
  };

  const deleteVehicle = async (id) => {
    try {
      await api.delete(`/admin/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v._id !== id));
      toast.success('Vehicle deleted');
    } catch { toast.error('Delete failed'); }
  };

  const deleteOwner = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setOwners(prev => prev.filter(u => u._id !== id));
      toast.success('Owner deleted');
    } catch { toast.error('Delete failed'); }
  };

  const deleteJob = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Delete failed'); }
  };

  const deleteDriverProfile = async (id) => {
    try {
      await api.delete(`/drivers/${id}`);
      setDriverProfiles(prev => prev.filter(d => d._id !== id));
      toast.success('Driver profile deleted');
    } catch { toast.error('Delete failed'); }
  };

  const deleteEnquiry = async (id) => {
    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries(prev => prev.filter(e => e._id !== id));
      toast.success('Enquiry deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleAdminLogin = async (email, password) => {
    const loggedInUser = await authLogin(email, password);
    if (loggedInUser.role !== 'admin') {
      logout();
      throw { response: { data: { message: 'This account does not have admin access.' } } };
    }
    toast.success('Welcome, Admin!');
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!isAdmin) return <AdminLoginGate onLogin={handleAdminLogin} />;
  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><LoadingSpinner size="lg" text="Loading admin panel..." /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <ShieldCheck size={18} className="text-gold-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Control Panel</h1>
                <p className="text-slate-400 text-xs">Car Partner &amp; Driver on Time · {user.email}</p>
              </div>
            </div>
            <button onClick={() => { logout(); }} className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm">
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-5 sm:flex gap-1 p-1 glass-dark rounded-xl mb-8 sm:overflow-x-auto sm:scrollbar-hide">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setFilterStatus(''); }}
              className={`py-2 px-1 sm:px-5 rounded-lg text-[11px] sm:text-sm font-medium transition-all duration-200 text-center sm:flex-shrink-0 sm:whitespace-nowrap leading-tight ${
                activeTab === tab.id ? 'bg-gold-500 text-slate-900 shadow-gold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="sm:hidden block">{tab.short}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.id === 'inquiries' && stats?.pendingInquiries > 0 && (
                <span className={`ml-1 px-1 py-0.5 rounded text-[10px] sm:text-xs ${activeTab === tab.id ? 'bg-slate-900/30' : 'bg-gold-500/20 text-gold-400'}`}>
                  {stats.pendingInquiries}
                </span>
              )}
              {tab.id === 'vehicles' && stats?.pendingVehicles > 0 && (
                <span className={`ml-1 px-1 py-0.5 rounded text-[10px] sm:text-xs ${activeTab === tab.id ? 'bg-slate-900/30' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {stats.pendingVehicles}
                </span>
              )}
              {tab.id === 'matches' && matches.length > 0 && (
                <span className={`ml-1 px-1 py-0.5 rounded text-[10px] sm:text-xs ${activeTab === tab.id ? 'bg-slate-900/30' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {matches.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Vehicle Owners" value={stats.totalOwners} icon={Users} color="text-blue-400" bg="border-blue-500/40" />
              <StatCard label="Live Vehicles" value={stats.totalVehicles} icon={Truck} color="text-emerald-400" bg="border-emerald-500/40" />
              <StatCard label="Total Inquiries" value={stats.totalInquiries} icon={MessageSquare} color="text-purple-400" bg="border-purple-500/40" />
              <StatCard label="Pending Inquiries" value={stats.pendingInquiries} icon={Clock} color="text-gold-400" bg="border-gold-500/40" />
              <StatCard label="Vehicle Requests" value={stats.totalRequests} icon={FileText} color="text-orange-400" bg="border-orange-500/40" />
              <StatCard label="Pending Vehicles" value={stats.pendingVehicles} icon={Truck} color="text-yellow-400" bg="border-yellow-500/40" />
            </div>

            {stats.pendingInquiries > 0 && (
              <div className="p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-gold-300 font-semibold text-sm">{stats.pendingInquiries} new inquir{stats.pendingInquiries > 1 ? 'ies' : 'y'} awaiting your action</p>
                  <p className="text-slate-400 text-xs mt-0.5">Contact the vehicle owners and arrange the rental.</p>
                </div>
                <button onClick={() => setActiveTab('inquiries')} className="btn-primary text-sm py-2 flex-shrink-0 w-full sm:w-auto text-center">View Inquiries</button>
              </div>
            )}

            <div>
              <h2 className="text-base font-semibold text-white mb-4">Recent Inquiries</h2>
              <div className="space-y-3">
                {recentInquiries.map(inq => (
                  <div key={inq._id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{inq.seekerName}</p>
                      <p className="text-xs text-slate-400">{inq.vehicle?.title} · {inq.rentalType}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                      <a href={`tel:${inq.seekerPhone}`} className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300">
                        <Phone size={12} />{inq.seekerPhone}
                      </a>
                      <StatusBadge status={inq.status} />
                    </div>
                  </div>
                ))}
                {recentInquiries.length === 0 && <p className="text-center text-slate-500 py-6">No inquiries yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* Inquiries — the core admin view */}
        {activeTab === 'inquiries' && (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {['', 'pending', 'contacted', 'deal-done', 'rejected'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filterStatus === s ? 'bg-gold-500 text-slate-900' : 'glass text-slate-400 hover:text-white'
                  }`}
                >
                  {s === '' ? 'All' : s === 'deal-done' ? 'Deal Done' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {inquiries.map(inq => (
                <div key={inq._id} className="card p-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{inq.vehicle?.title || 'Vehicle'}</h3>
                      <p className="text-xs text-slate-400 capitalize">
                        {inq.vehicle?.type} · {inq.rentalType} ·{' '}
                        {new Date(inq.startDate).toLocaleDateString('en-IN')} → {new Date(inq.endDate).toLocaleDateString('en-IN')}
                      </p>
                      {inq.purpose && <p className="text-xs text-slate-500 mt-0.5">Purpose: {inq.purpose}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <StatusBadge status={inq.status} />
                      <StatusSelect
                        current={inq.status}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'contacted', label: 'Contacted' },
                          { value: 'deal-done', label: 'Deal Done' },
                          { value: 'rejected', label: 'Reject' },
                        ]}
                        onChange={(val) => updateInquiry(inq._id, val)}
                      />
                    </div>
                  </div>

                  {/* The key section — seeker vs owner contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ContactCard
                      label="🙋 Person Who Wants Vehicle"
                      name={inq.seekerName}
                      phone={inq.seekerPhone}
                      email={inq.seekerEmail}
                      color="text-blue-300"
                    />
                    {inq.owner && (
                      <ContactCard
                        label="🚛 Vehicle Owner"
                        name={inq.owner.name}
                        phone={inq.owner.phone || 'Not provided'}
                        email={inq.owner.email}
                        color="text-gold-300"
                      />
                    )}
                  </div>

                  {inq.message && (
                    <p className="text-xs text-slate-400 mt-3 p-2 bg-slate-800/50 rounded-lg italic">"{inq.message}"</p>
                  )}
                </div>
              ))}
              {inquiries.length === 0 && (
                <div className="text-center py-12 text-slate-400">No inquiries found</div>
              )}
            </div>
          </div>
        )}

        {/* Vehicle Requests */}
        {activeTab === 'requests' && (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {['', 'pending', 'in-progress', 'fulfilled', 'rejected'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filterStatus === s ? 'bg-gold-500 text-slate-900' : 'glass text-slate-400 hover:text-white'
                  }`}
                >
                  {s === '' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {requests.map(r => (
                <div key={r._id} className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white capitalize">{r.vehicleType} Required</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {r.rentalType} · {new Date(r.startDate).toLocaleDateString('en-IN')} → {new Date(r.endDate).toLocaleDateString('en-IN')}
                        {r.location && ` · ${r.location}`}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Purpose: {r.purpose}</p>
                      {r.budget && <p className="text-xs text-gold-400 mt-0.5">Budget: ₹{Number(r.budget).toLocaleString()}</p>}
                      {r.additionalDetails && <p className="text-xs text-slate-500 mt-1 italic">"{r.additionalDetails}"</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <StatusBadge status={r.status} />
                      <StatusSelect
                        current={r.status}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'in-progress', label: 'In Progress' },
                          { value: 'fulfilled', label: 'Fulfilled' },
                          { value: 'rejected', label: 'Reject' },
                        ]}
                        onChange={(val) => updateRequest(r._id, val)}
                      />
                    </div>
                  </div>

                  <ContactCard
                    label="🙋 Requested By"
                    name={r.seekerName}
                    phone={r.seekerPhone}
                    email={r.seekerEmail}
                    color="text-blue-300"
                  />
                </div>
              ))}
              {requests.length === 0 && <div className="text-center py-12 text-slate-400">No requests found</div>}
            </div>
          </div>
        )}

        {/* Vehicles */}
        {activeTab === 'vehicles' && (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {['', 'pending', 'approved', 'rejected'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filterStatus === s ? 'bg-gold-500 text-slate-900' : 'glass text-slate-400 hover:text-white'
                  }`}
                >
                  {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {vehicles.map(v => (
                <div key={v._id} className="card p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                        {v.images?.[0] ? <img src={v.images[0]} className="w-full h-full object-cover" alt="" /> : '🚗'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{v.title}</p>
                        <p className="text-xs text-slate-400 capitalize">{v.type} · {v.location}</p>
                        <p className="text-xs text-slate-500">Owner: {v.owner?.name} ·
                          <a href={`tel:${v.owner?.phone}`} className="text-gold-400 hover:text-gold-300 ml-1">{v.owner?.phone}</a>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={v.status} />
                      <StatusSelect
                        current={v.status}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'approved', label: 'Approve' },
                          { value: 'rejected', label: 'Reject' },
                        ]}
                        onChange={(val) => updateVehicle(v._id, val)}
                      />
                      <button onClick={() => confirmDelete('vehicle', () => deleteVehicle(v._id))}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete vehicle">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {vehicles.length === 0 && <div className="text-center py-12 text-slate-400">No vehicles found</div>}
            </div>
          </div>
        )}

        {/* Owners */}
        {activeTab === 'owners' && (
          <div className="space-y-3">
            {owners.map(u => (
              <div key={u._id} className="card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm">{u.name}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                        <a href={`mailto:${u.email}`} className="hover:text-gold-400 truncate max-w-[220px]">{u.email}</a>
                        {u.phone && <a href={`tel:${u.phone}`} className="text-gold-400 hover:text-gold-300 flex-shrink-0">{u.phone}</a>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ${u.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button onClick={() => toggleOwner(u._id, u.isActive)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        u.isActive ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => confirmDelete('owner', () => deleteOwner(u._id))}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete owner">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {owners.length === 0 && <div className="text-center py-12 text-slate-400">No owners registered yet</div>}
          </div>
        )}

        {/* Driver Jobs (Driver on Time) */}
        {activeTab === 'jobs' && (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {['', 'pending', 'active', 'matched', 'closed'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filterStatus === s ? 'bg-gold-500 text-slate-900' : 'glass text-slate-400 hover:text-white'
                  }`}
                >
                  {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {jobs.filter(j => !filterStatus || j.status === filterStatus).map(j => (
                <div key={j._id} className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white capitalize">{j.carType} · {j.jobType?.replace('-', ' ')}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 capitalize">
                        {j.area} · {j.timing}
                        {j.salary && ` · ₹${j.salary}`}
                      </p>
                      {j.requirements && <p className="text-xs text-slate-500 mt-1 italic">"{j.requirements}"</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <StatusBadge status={j.status} />
                      <StatusSelect
                        current={j.status}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'active', label: 'Active' },
                          { value: 'matched', label: 'Matched' },
                          { value: 'closed', label: 'Closed' },
                        ]}
                        onChange={(val) => updateJob(j._id, val)}
                      />
                      <button onClick={() => confirmDelete('job', () => deleteJob(j._id))}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete job">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <ContactCard
                    label="🙋 Posted By"
                    name={j.name}
                    phone={j.phone}
                    email={j.email}
                    color="text-blue-300"
                  />
                </div>
              ))}
              {jobs.length === 0 && <div className="text-center py-12 text-slate-400">No job postings found</div>}
            </div>
          </div>
        )}

        {/* Driver Profiles (Driver on Time) */}
        {activeTab === 'driverProfiles' && (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {['', 'pending', 'verified', 'matched', 'inactive'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filterStatus === s ? 'bg-gold-500 text-slate-900' : 'glass text-slate-400 hover:text-white'
                  }`}
                >
                  {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {driverProfiles.filter(d => !filterStatus || d.status === filterStatus).map(d => (
                <div key={d._id} className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{d.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        License: {d.licenseNumber}{d.experience && ` · ${d.experience} yrs exp`}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 capitalize">
                        Area: {d.preferredArea} · {d.availability?.replace('-', ' ')}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{d.address}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <StatusBadge status={d.status} />
                      <StatusSelect
                        current={d.status}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'verified', label: 'Verify' },
                          { value: 'matched', label: 'Matched' },
                          { value: 'inactive', label: 'Inactive' },
                        ]}
                        onChange={(val) => updateDriverProfile(d._id, val)}
                      />
                      <button onClick={() => confirmDelete('driver profile', () => deleteDriverProfile(d._id))}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete driver">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <ContactCard
                    label="🙋 Driver"
                    name={d.name}
                    phone={d.phone}
                    email={d.email}
                    color="text-blue-300"
                  />

                  {(d.documents?.drivingLicense || d.documents?.aadhaarCard || d.documents?.policeVerification) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {d.documents?.drivingLicense && (
                        <a href={fileUrl(d.documents.drivingLicense)} target="_blank" rel="noopener noreferrer"
                          className="badge bg-slate-800 text-gold-400 hover:bg-slate-700 transition-colors">
                          <FileText size={12} /> Driving License
                        </a>
                      )}
                      {d.documents?.aadhaarCard && (
                        <a href={fileUrl(d.documents.aadhaarCard)} target="_blank" rel="noopener noreferrer"
                          className="badge bg-slate-800 text-gold-400 hover:bg-slate-700 transition-colors">
                          <FileText size={12} /> Aadhaar Card
                        </a>
                      )}
                      {d.documents?.policeVerification && (
                        <a href={fileUrl(d.documents.policeVerification)} target="_blank" rel="noopener noreferrer"
                          className="badge bg-slate-800 text-gold-400 hover:bg-slate-700 transition-colors">
                          <FileText size={12} /> Police Verification
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {driverProfiles.length === 0 && <div className="text-center py-12 text-slate-400">No driver profiles found</div>}
            </div>
          </div>
        )}

        {/* Self-Drive Enquiries (Driver on Time) */}
        {activeTab === 'enquiries' && (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {['', 'new', 'contacted', 'booked', 'cancelled'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filterStatus === s ? 'bg-gold-500 text-slate-900' : 'glass text-slate-400 hover:text-white'
                  }`}
                >
                  {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {enquiries.filter(e => !filterStatus || e.status === filterStatus).map(e => (
                <div key={e._id} className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white capitalize">{e.vehicleType} Car · Self Drive</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Date: {new Date(e.date).toLocaleDateString('en-IN')} · Destination: {e.destination}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <StatusBadge status={e.status} />
                      <StatusSelect
                        current={e.status}
                        options={[
                          { value: 'new', label: 'New' },
                          { value: 'contacted', label: 'Contacted' },
                          { value: 'booked', label: 'Booked' },
                          { value: 'cancelled', label: 'Cancel' },
                        ]}
                        onChange={(val) => updateEnquiry(e._id, val)}
                      />
                      <button onClick={() => confirmDelete('enquiry', () => deleteEnquiry(e._id))}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete enquiry">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <ContactCard
                    label="🙋 Enquired By"
                    name={e.name}
                    phone={e.phone}
                    color="text-blue-300"
                  />
                </div>
              ))}
              {enquiries.length === 0 && <div className="text-center py-12 text-slate-400">No enquiries found</div>}
            </div>
          </div>
        )}

        {/* Matched Profiles */}
        {activeTab === 'matches' && (
          <div>
            <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <ArrowRightLeft size={18} className="text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-emerald-300 font-semibold text-sm">Auto-matched based on location</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Drivers whose preferred area overlaps with a job's location. Contact both parties to arrange the placement.
                </p>
              </div>
              <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-sm font-bold px-3 py-1 rounded-full flex-shrink-0">
                {matches.length} match{matches.length !== 1 ? 'es' : ''}
              </span>
            </div>

            {matches.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ArrowRightLeft size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-medium">No matches found yet</p>
                <p className="text-sm mt-1 text-slate-500">Matches appear when a driver's preferred area overlaps with an active job location.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((m, i) => (
                  <div key={i} className="card p-5 border-l-2 border-emerald-500/40">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Driver side */}
                      <div className="bg-slate-800/60 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Users size={13} className="text-blue-400" />
                          </div>
                          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Driver</span>
                          <StatusBadge status={m.driver.status} />
                        </div>
                        <p className="font-semibold text-white text-sm">{m.driver.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{m.driver.experience} yrs · {m.driver.availability?.replace('-', ' ')}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                          <MapPin size={11} className="text-gold-400" />
                          <span>Prefers: <span className="text-white">{m.driver.preferredArea}</span></span>
                        </div>
                        <div className="flex flex-col gap-1 mt-3">
                          <a href={`tel:${m.driver.phone}`} className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300">
                            <Phone size={11} />{m.driver.phone}
                          </a>
                          {m.driver.email && (
                            <a href={`mailto:${m.driver.email}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-400">
                              <Mail size={11} />{m.driver.email}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Job side */}
                      <div className="bg-slate-800/60 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center">
                            <Briefcase size={13} className="text-gold-400" />
                          </div>
                          <span className="text-xs font-semibold text-gold-400 uppercase tracking-wide">Job Opening</span>
                          <StatusBadge status={m.job.status} />
                        </div>
                        <p className="font-semibold text-white text-sm capitalize">{m.job.carType} · {m.job.jobType?.replace('-', ' ')}</p>
                        <p className="text-xs text-slate-400 mt-0.5 capitalize">{m.job.timing}{m.job.salary && ` · ₹${m.job.salary}`}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                          <MapPin size={11} className="text-gold-400" />
                          <span>Location: <span className="text-white">{m.job.area}</span></span>
                        </div>
                        <div className="flex flex-col gap-1 mt-3">
                          <p className="text-xs text-slate-500">Posted by: <span className="text-slate-300">{m.job.name}</span></p>
                          <a href={`tel:${m.job.phone}`} className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300">
                            <Phone size={11} />{m.job.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-400">
                      <ArrowRightLeft size={12} />
                      <span>Location match — call both parties to confirm placement</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
