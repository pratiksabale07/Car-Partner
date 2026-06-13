import { useState } from 'react';
import { CheckCircle, Upload, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

function FileUploadField({ label, name, hint, required, onChange, fileName }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-700/60 rounded-xl cursor-pointer hover:border-gold-500/50 hover:bg-white/5 transition-all bg-slate-900/40 group">
        <input type="file" name={name} accept=".jpg,.jpeg,.png,.pdf"
          onChange={onChange} className="hidden" required={required} />
        {fileName ? (
          <div className="text-center px-4">
            <CheckCircle size={24} className="text-gold-400 mx-auto mb-1" />
            <p className="text-sm text-slate-300 font-medium truncate max-w-xs">{fileName}</p>
          </div>
        ) : (
          <div className="text-center">
            <Upload size={24} className="text-slate-500 mx-auto mb-1 group-hover:text-gold-400" />
            <p className="text-sm text-slate-400">Click to upload</p>
            <p className="text-xs text-slate-500 mt-0.5">{hint}</p>
          </div>
        )}
      </label>
    </div>
  );
}

export default function BecomeDriver() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '',
    licenseNumber: '', experience: '', preferredArea: '', availability: 'flexible',
  });
  const [files, setFiles] = useState({ drivingLicense: null, aadhaarCard: null, policeVerification: null });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => {
    const { name, files: f } = e.target;
    setFiles((prev) => ({ ...prev, [name]: f[0] || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (files.drivingLicense) data.append('drivingLicense', files.drivingLicense);
    if (files.aadhaarCard) data.append('aadhaarCard', files.aadhaarCard);
    if (files.policeVerification) data.append('policeVerification', files.policeVerification);
    try {
      await api.post('/drivers', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus({ loading: false, success: true, error: '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.response?.data?.message || t('driver.error') });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 text-center mb-12">
        <h1 className="section-title mb-3">{t('driver.title')}</h1>
        <div className="divider mx-auto mb-4" />
        <p className="text-slate-400">{t('driver.subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Benefits sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-5">{t('driver.benefits')}</h2>
              <ul className="space-y-4">
                {[t('driver.benefit1'), t('driver.benefit2'), t('driver.benefit3'), t('driver.benefit4')].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-gold-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-400 text-sm">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-slate-700/50 text-sm text-slate-400">
                <p>Questions? Contact us:</p>
                <a href="tel:+919876543210" className="text-gold-400 font-semibold block mt-1">
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Registration form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">{t('driver.formTitle')}</h2>

              {status.success ? (
                <div className="text-center py-12">
                  <CheckCircle size={60} className="text-gold-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Profile Submitted!</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">{t('driver.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Personal info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('driver.name')}</label>
                      <input name="name" type="text" className="input-field"
                        placeholder={t('driver.namePlaceholder')}
                        value={form.name} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('driver.phone')}</label>
                      <input name="phone" type="tel" className="input-field"
                        placeholder={t('driver.phonePlaceholder')}
                        value={form.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('driver.address')}</label>
                    <textarea name="address" rows={2} className="input-field resize-none"
                      placeholder={t('driver.addressPlaceholder')}
                      value={form.address} onChange={handleChange} required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('driver.email')}</label>
                    <input name="email" type="email" className="input-field"
                      placeholder={t('driver.emailPlaceholder')}
                      value={form.email} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('driver.license')}</label>
                      <input name="licenseNumber" type="text" className="input-field"
                        placeholder={t('driver.licensePlaceholder')}
                        value={form.licenseNumber} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('driver.experience')}</label>
                      <input name="experience" type="number" min="0" max="50" className="input-field"
                        placeholder={t('driver.experiencePlaceholder')}
                        value={form.experience} onChange={handleChange} required />
                    </div>
                  </div>

                  {/* Work preference */}
                  <div className="pt-4 border-t border-slate-700/50">
                    <h3 className="text-base font-semibold text-white mb-4">Work Preferences</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">{t('driver.preferredArea')}</label>
                        <input name="preferredArea" type="text" className="input-field"
                          placeholder={t('driver.preferredAreaPlaceholder')}
                          value={form.preferredArea} onChange={handleChange} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">{t('driver.availability')}</label>
                        <select name="availability" className="select-field"
                          value={form.availability} onChange={handleChange} required>
                          <option value="full-time">{t('driver.fullTime')}</option>
                          <option value="part-time">{t('driver.partTime')}</option>
                          <option value="flexible">{t('driver.flexibleAvail')}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Document uploads */}
                  <div className="pt-4 border-t border-slate-700/50">
                    <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                      <Upload size={16} className="text-gold-400" /> {t('driver.docsTitle')}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                      <AlertCircle size={12} /> {t('driver.fileHint')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FileUploadField label={t('driver.dlUpload')} name="drivingLicense"
                        hint={t('driver.fileHint')} required onChange={handleFile} fileName={files.drivingLicense?.name} />
                      <FileUploadField label={t('driver.aadhaarUpload')} name="aadhaarCard"
                        hint={t('driver.fileHint')} required onChange={handleFile} fileName={files.aadhaarCard?.name} />
                      <FileUploadField label={t('driver.policeUpload')} name="policeVerification"
                        hint={t('driver.fileHint')} required={false} onChange={handleFile} fileName={files.policeVerification?.name} />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">{t('driver.required')}</p>

                  {status.error && (
                    <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg flex items-center gap-2">
                      <AlertCircle size={16} /> {status.error}
                    </p>
                  )}

                  <button type="submit" disabled={status.loading}
                    className="w-full btn-primary text-base disabled:opacity-60 disabled:cursor-not-allowed">
                    {status.loading ? t('driver.submitting') : t('driver.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
