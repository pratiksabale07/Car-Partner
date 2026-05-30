import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus, Truck, FileText, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_CONFIG = {
  pending: { color: 'text-yellow-400 bg-yellow-500/20', icon: AlertCircle, label: 'Pending' },
  approved: { color: 'text-blue-400 bg-blue-500/20', icon: CheckCircle, label: 'Approved' },
  active: { color: 'text-emerald-400 bg-emerald-500/20', icon: CheckCircle, label: 'Active' },
  completed: { color: 'text-slate-400 bg-slate-500/20', icon: CheckCircle, label: 'Completed' },
  rejected: { color: 'text-red-400 bg-red-500/20', icon: XCircle, label: 'Rejected' },
  cancelled: { color: 'text-red-400 bg-red-500/20', icon: XCircle, label: 'Cancelled' },
};

function BookingCard({ booking, onCancel }) {
  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const vehicle = booking.vehicle;

  return (
    <div className="card p-5 hover:border-slate-600/50 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
            {vehicle ? '🚗' : '❓'}
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">{vehicle?.title || 'Vehicle'}</h4>
            <p className="text-xs text-slate-400 capitalize">{vehicle?.type}</p>
          </div>
        </div>
        <span className={`badge ${cfg.color} capitalize`}>
          <Icon size={11} />
          {cfg.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-slate-800/50 rounded-lg p-2 text-center">
          <div className="text-xs text-slate-500 mb-0.5">Rental</div>
          <div className="text-xs font-medium text-white capitalize">{booking.rentalType}</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2 text-center">
          <div className="text-xs text-slate-500 mb-0.5">Start</div>
          <div className="text-xs font-medium text-white">{new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2 text-center">
          <div className="text-xs text-slate-500 mb-0.5">Amount</div>
          <div className="text-xs font-bold text-gold-400">₹{booking.totalAmount?.toLocaleString()}</div>
        </div>
      </div>

      {booking.adminNote && (
        <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg p-2 mb-3">
          <span className="text-slate-500">Admin note: </span>{booking.adminNote}
        </div>
      )}

      <div className="flex gap-2">
        {vehicle && (
          <Link to={`/vehicles/${vehicle._id}`} className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
            View Vehicle
          </Link>
        )}
        {['pending', 'approved'].includes(booking.status) && (
          <button onClick={() => onCancel(booking._id)} className="text-xs text-red-400 hover:text-red-300 ml-auto transition-colors">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function RequestCard({ request }) {
  const STATUS = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    'in-progress': 'bg-blue-500/20 text-blue-400',
    fulfilled: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="font-semibold text-white text-sm capitalize">{request.vehicleType} Required</h4>
          <p className="text-xs text-slate-400 mt-0.5">{request.purpose}</p>
        </div>
        <span className={`badge ${STATUS[request.status] || 'bg-slate-500/20 text-slate-400'} capitalize`}>
          {request.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-slate-800/50 rounded-lg p-2">
          <div className="text-xs text-slate-500">Duration</div>
          <div className="text-xs font-medium text-white capitalize">{request.rentalType}</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2">
          <div className="text-xs text-slate-500">Date</div>
          <div className="text-xs font-medium text-white">{new Date(request.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
        </div>
      </div>

      {request.adminResponse && (
        <div className="text-xs p-2 bg-gold-500/5 border border-gold-500/20 rounded-lg text-gold-300">
          <span className="text-gold-500">Admin: </span>{request.adminResponse}
        </div>
      )}
    </div>
  );
}

export default function RenterDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    Promise.all([
      api.get('/bookings/my'),
      api.get('/requests/my'),
    ]).then(([b, r]) => {
      setBookings(b.data.bookings);
      setRequests(r.data.requests);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => ['active', 'approved'].includes(b.status)).length,
    pending: bookings.filter(b => b.status === 'pending').length,
    spent: bookings.filter(b => ['active', 'completed'].includes(b.status)).reduce((acc, b) => acc + (b.totalAmount || 0), 0),
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><LoadingSpinner size="lg" text="Loading dashboard..." /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">My Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/browse" className="btn-outline flex items-center gap-2 text-sm py-2">
              <Truck size={16} /> Browse Vehicles
            </Link>
            <Link to="/request" className="btn-primary flex items-center gap-2 text-sm py-2">
              <Plus size={16} /> Request Vehicle
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total, icon: Calendar, color: 'text-blue-400' },
            { label: 'Active/Approved', value: stats.active, icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-400' },
            { label: 'Total Spent', value: `₹${stats.spent.toLocaleString()}`, icon: Star, color: 'text-gold-400' },
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

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass-dark rounded-xl mb-6 w-fit">
          {[
            { id: 'bookings', label: 'Bookings', count: bookings.length },
            { id: 'requests', label: 'Requests', count: requests.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id ? 'bg-gold-500 text-slate-900 shadow-gold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${activeTab === tab.id ? 'bg-slate-900/30' : 'bg-slate-700'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'bookings' && (
          bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-30">🚗</div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No Bookings Yet</h3>
              <p className="text-slate-500 mb-4">Start by browsing our available vehicles.</p>
              <Link to="/browse" className="btn-primary">Browse Vehicles</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map(b => <BookingCard key={b._id} booking={b} onCancel={cancelBooking} />)}
            </div>
          )
        )}

        {activeTab === 'requests' && (
          requests.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-30">📋</div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No Requests Yet</h3>
              <p className="text-slate-500 mb-4">Can't find a vehicle? Submit a request.</p>
              <Link to="/request" className="btn-primary">Submit Request</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map(r => <RequestCard key={r._id} request={r} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
}
