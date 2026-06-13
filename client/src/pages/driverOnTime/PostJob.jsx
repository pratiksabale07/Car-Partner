import { useState } from 'react';
import { CheckCircle, AlertCircle, Briefcase } from 'lucide-react';
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

export default function PostJob() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    area: '', carType: '', jobType: '', timing: '',
    salary: '', requirements: '',
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      await api.post('/jobs', form);
      setStatus({ loading: false, success: true, error: '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.response?.data?.message || t('job.error') });
    }
  };

  const steps = [t('job.step1'), t('job.step2'), t('job.step3'), t('job.step4')];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 text-center mb-12">
        <h1 className="section-title mb-3">{t('job.pageTitle')}</h1>
        <div className="divider mx-auto mb-4" />
        <p className="text-slate-400">{t('job.pageSubtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* How it works sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <Briefcase size={20} className="text-gold-400" />
                {t('job.sideTitle')}
              </h2>
              <ol className="space-y-4">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-slate-400 text-sm leading-snug pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 pt-6 border-t border-slate-700/50 text-sm text-slate-400">
                <p>Questions? Contact us:</p>
                <a href="tel:+919876543210" className="text-gold-400 font-semibold block mt-1">
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Job posting form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">{t('job.formTitle')}</h2>

              {status.success ? (
                <div className="text-center py-12">
                  <CheckCircle size={60} className="text-gold-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Job Posted!</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">{t('job.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('job.name')}</label>
                      <input name="name" type="text" className="input-field"
                        placeholder={t('job.namePlaceholder')}
                        value={form.name} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('job.phone')}</label>
                      <input name="phone" type="tel" className="input-field"
                        placeholder={t('job.phonePlaceholder')}
                        value={form.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('job.email')}</label>
                    <input name="email" type="email" className="input-field"
                      placeholder={t('job.emailPlaceholder')}
                      value={form.email} onChange={handleChange} />
                  </div>

                  {/* Job Details */}
                  <div className="pt-4 border-t border-slate-700/50 space-y-4">
                    <h3 className="text-base font-semibold text-white">Job Details</h3>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('job.area')}</label>
                      <input name="area" type="text" className="input-field"
                        placeholder={t('job.areaPlaceholder')}
                        value={form.area} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">{t('job.carType')}</label>
                        <select name="carType" className="select-field"
                          value={form.carType} onChange={handleChange} required>
                          <option value="">{t('job.carTypePlaceholder')}</option>
                          <option value="sedan">{t('job.sedan')}</option>
                          <option value="suv">{t('job.suv')}</option>
                          <option value="hatchback">{t('job.hatchback')}</option>
                          <option value="luxury">{t('job.luxury')}</option>
                          <option value="commercial">{t('job.commercial')}</option>
                          <option value="other">{t('job.otherCar')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">{t('job.jobType')}</label>
                        <select name="jobType" className="select-field"
                          value={form.jobType} onChange={handleChange} required>
                          <option value="">{t('job.jobTypePlaceholder')}</option>
                          <option value="full-time">{t('job.fullTime')}</option>
                          <option value="part-time">{t('job.partTime')}</option>
                          <option value="monthly">{t('job.monthly')}</option>
                          <option value="temporary">{t('job.temporary')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">{t('job.timing')}</label>
                        <select name="timing" className="select-field"
                          value={form.timing} onChange={handleChange} required>
                          <option value="">{t('job.timingPlaceholder')}</option>
                          <option value="morning">{t('job.morning')}</option>
                          <option value="evening">{t('job.evening')}</option>
                          <option value="night">{t('job.night')}</option>
                          <option value="flexible">{t('job.flexible')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">{t('job.salary')}</label>
                        <input name="salary" type="text" className="input-field"
                          placeholder={t('job.salaryPlaceholder')}
                          value={form.salary} onChange={handleChange} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('job.requirements')}</label>
                      <textarea name="requirements" rows={3} className="input-field resize-none"
                        placeholder={t('job.requirementsPlaceholder')}
                        value={form.requirements} onChange={handleChange} />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">{t('job.required')}</p>

                  {status.error && (
                    <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg flex items-center gap-2">
                      <AlertCircle size={16} /> {status.error}
                    </p>
                  )}

                  <button type="submit" disabled={status.loading}
                    className="w-full btn-primary text-base disabled:opacity-60 disabled:cursor-not-allowed">
                    {status.loading ? t('job.submitting') : t('job.submit')}
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
