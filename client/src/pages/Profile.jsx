import { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const setP = (field) => (e) => setProfileForm({ ...profileForm, [field]: e.target.value });
  const setPw = (field) => (e) => setPwForm({ ...pwForm, [field]: e.target.value });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return toast.error('New passwords do not match');
    if (pwForm.newPassword.length < 6)
      return toast.error('Password must be at least 6 characters');

    setPwLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>

        {/* Profile info card */}
        <div className="card p-8">
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-700/50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-slate-900 font-bold text-2xl shadow-gold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <span className="badge bg-gold-500/20 text-gold-400 mt-1.5 capitalize">{user?.role}</span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={profileForm.name} onChange={setP('name')} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={user?.email} disabled className="input-field pl-10 opacity-40 cursor-not-allowed" />
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" value={profileForm.phone} onChange={setP('phone')} className="input-field pl-10" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">City / Address</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={profileForm.address} onChange={setP('address')} className="input-field pl-10" placeholder="City, State" />
              </div>
            </div>
            <button type="submit" disabled={profileLoading} className="btn-primary flex items-center gap-2 py-3">
              {profileLoading
                ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                : <Save size={16} />}
              Save Changes
            </button>
          </form>
        </div>

        {/* Change password card */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
              <ShieldCheck size={18} className="text-gold-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Change Password</h3>
              <p className="text-xs text-slate-400">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={pwForm.currentPassword}
                  onChange={setPw('currentPassword')}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter current password"
                  required
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={pwForm.newPassword}
                  onChange={setPw('newPassword')}
                  className="input-field pl-10 pr-10"
                  placeholder="Min 6 characters"
                  required
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={pwForm.confirmPassword}
                  onChange={setPw('confirmPassword')}
                  className="input-field pl-10"
                  placeholder="Repeat new password"
                  required
                />
              </div>
              {pwForm.newPassword && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                <p className="text-xs text-red-400 mt-1 ml-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={pwLoading || (pwForm.newPassword && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword)}
              className="btn-primary flex items-center gap-2 py-3"
            >
              {pwLoading
                ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                : <ShieldCheck size={16} />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
