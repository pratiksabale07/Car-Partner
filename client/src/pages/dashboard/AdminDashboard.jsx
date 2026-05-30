import { useState, useEffect } from 'react';
import { Users, Truck, MessageSquare, FileText, CheckCircle, Clock, Phone, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import CustomSelect from '../../components/CustomSelect';

const TABS = [
  { id: 'overview', label: 'Overview', short: 'Overview' },
  { id: 'inquiries', label: 'Inquiries', short: 'Inquiries' },
  { id: 'requests', label: 'Vehicle Requests', short: 'Requests' },
  { id: 'vehicles', label: 'Vehicles', short: 'Vehicles' },
  { id: 'owners', label: 'Owners', short: 'Owners' },
];

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800`}>
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
      <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold-400 transition-colors">
        <Mail size={11} className="text-gold-400" />{email}
      </a>
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
  };
  return <span className={`badge capitalize ${cfg[status] || 'bg-slate-500/20 text-slate-400'}`}>{status?.replace('-', ' ')}</span>;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => {
      setStats(data.stats);
      setRecentInquiries(data.recentInquiries);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const qs = filterStatus ? `?status=${filterStatus}` : '';
    if (activeTab === 'inquiries') {
      api.get(`/inquiries/all${qs}`).then(({ data }) => setInquiries(data.inquiries)).catch(() => {});
    } else if (activeTab === 'requests') {
      api.get(`/requests/all${qs}`).then(({ data }) => setRequests(data.requests)).catch(() => {});
    } else if (activeTab === 'vehicles') {
      api.get(`/admin/vehicles${qs}`).then(({ data }) => setVehicles(data.vehicles)).catch(() => {});
    } else if (activeTab === 'owners') {
      api.get('/admin/users').then(({ data }) => setOwners(data.users)).catch(() => {});
    }
  }, [activeTab, filterStatus]);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><LoadingSpinner size="lg" text="Loading admin panel..." /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <span className="text-gold-400 text-lg">⚙</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Control Panel</h1>
          </div>
          <p className="text-slate-400 text-sm ml-12">Manage inquiries, requests, vehicles and owners</p>
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
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Vehicle Owners" value={stats.totalOwners} icon={Users} color="text-blue-400" />
              <StatCard label="Live Vehicles" value={stats.totalVehicles} icon={Truck} color="text-emerald-400" />
              <StatCard label="Total Inquiries" value={stats.totalInquiries} icon={MessageSquare} color="text-purple-400" />
              <StatCard label="Pending Inquiries" value={stats.pendingInquiries} icon={Clock} color="text-gold-400" />
              <StatCard label="Vehicle Requests" value={stats.totalRequests} icon={FileText} color="text-orange-400" />
              <StatCard label="Pending Vehicles" value={stats.pendingVehicles} icon={Truck} color="text-yellow-400" />
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
                    <div className="flex items-center gap-3 flex-shrink-0">
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
                  <div className="flex items-center gap-3 flex-shrink-0">
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
                  </div>
                </div>
              </div>
            ))}
            {owners.length === 0 && <div className="text-center py-12 text-slate-400">No owners registered yet</div>}
          </div>
        )}
      </div>
    </div>
  );
}
