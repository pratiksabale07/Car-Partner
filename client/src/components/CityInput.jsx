import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const CITIES = [
  'Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur',
  'Thane', 'Navi Mumbai', 'Pimpri-Chinchwad', 'Sangli', 'Satara', 'Ratnagiri',
  'Ahmednagar', 'Latur', 'Nanded', 'Akola', 'Amravati', 'Jalgaon', 'Dhule',
  'Chandrapur', 'Osmanabad', 'Parbhani', 'Hingoli', 'Buldhana', 'Washim',
  'Yavatmal', 'Wardha', 'Gadchiroli', 'Gondia', 'Bhandara', 'Raigad',
  'Sindhudurg', 'Alibag', 'Panvel', 'Kalyan', 'Dombivli', 'Ulhasnagar',
  'Vasai', 'Virar', 'Mira Road', 'Bhiwandi', 'Badlapur', 'Ambernath',
  // Pune areas
  'Hinjewadi', 'Kothrud', 'Baner', 'Aundh', 'Wakad', 'Hadapsar', 'Magarpatta',
  'Kondhwa', 'Katraj', 'Swargate', 'Shivajinagar', 'Deccan', 'Kharadi',
  'Viman Nagar', 'Kalyani Nagar', 'Koregaon Park', 'Undri', 'Pisoli',
  'Pimple Saudagar', 'Pimple Nilakh', 'Chinchwad', 'Akurdi', 'Nigdi',
  'Bhosari', 'Wagholi', 'Mundhwa', 'Wanowrie', 'NIBM', 'Bibwewadi',
  // Mumbai areas
  'Andheri', 'Bandra', 'Borivali', 'Dadar', 'Worli', 'Kurla', 'Ghatkopar',
  'Mulund', 'Kandivali', 'Malad', 'Goregaon', 'Jogeshwari', 'Santacruz',
  'Vile Parle', 'Chembur', 'Wadala', 'Sion', 'Matunga', 'Dharavi',
  // Other major cities
  'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad',
  'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Indore', 'Bhopal', 'Vadodara',
  'Coimbatore', 'Visakhapatnam', 'Patna', 'Ludhiana', 'Agra', 'Varanasi',
];

export default function CityInput({ value, onChange, placeholder, className = '', required }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    if (val.trim().length >= 1) {
      const q = val.toLowerCase();
      const filtered = CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 6);
      setSuggestions(filtered);
      setOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  };

  const select = (city) => {
    onChange(city);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => value.length >= 1 && suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        required={required}
        className={`input-field pl-10 ${className}`}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-50 left-0 right-0 top-full mt-1 glass-dark border border-slate-700/50 rounded-xl overflow-hidden shadow-glass">
          {suggestions.map(city => (
            <li key={city}>
              <button
                type="button"
                onMouseDown={() => select(city)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-gold-500/10 hover:text-gold-400 transition-colors flex items-center gap-2"
              >
                <MapPin size={13} className="text-gold-500 flex-shrink-0" />
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
