import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const languages = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
];

export default function LanguageModal() {
  const { showModal, changeLanguage } = useLanguage();
  const [selected, setSelected] = useState('en');

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="glass-dark rounded-2xl shadow-glass p-8 max-w-sm w-full animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 mb-4 shadow-gold">
            <span className="text-3xl">🚗</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-white">Car Partner</h2>
          <p className="text-slate-400 mt-2 text-sm">Please select your preferred language</p>
          <p className="text-slate-400 text-sm">कृपया अपनी भाषा चुनें</p>
          <p className="text-slate-400 text-sm">कृपया भाषा निवडा</p>
        </div>

        <div className="space-y-3 mb-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                selected === lang.code
                  ? 'border-gold-500/60 bg-gold-500/10'
                  : 'border-slate-700/60 hover:border-slate-600 hover:bg-white/5'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div>
                <p className={`font-semibold ${selected === lang.code ? 'text-gold-400' : 'text-white'}`}>
                  {lang.native}
                </p>
                <p className="text-sm text-slate-400">{lang.label}</p>
              </div>
              {selected === lang.code && (
                <div className="ml-auto w-5 h-5 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => changeLanguage(selected)}
          className="w-full btn-primary text-center block"
        >
          Continue / जारी रखें / पुढे जा
        </button>
      </div>
    </div>
  );
}
