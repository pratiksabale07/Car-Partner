import { Phone, Mail, Clock } from 'lucide-react';

const PHONE = '+917602050606';

const contactCards = [
  {
    icon: <Phone size={24} />,
    label: 'Phone',
    value: '+91 76020 50606',
    href: `tel:${PHONE}`,
  },
  {
    icon: <Mail size={24} />,
    label: 'Email',
    value: 'carpartner01@gmail.com',
    href: 'mailto:carpartner01@gmail.com',
  },
  {
    icon: <Clock size={24} />,
    label: 'Working Hours',
    value: 'Mon – Sat: 9:00 AM – 7:00 PM',
    href: null,
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 text-center mb-12">
        <h1 className="section-title mb-3">Contact Us</h1>
        <div className="divider mx-auto mb-4" />
        <p className="text-slate-400">Have a question or need help with a vehicle rental? Reach out to us through any of the channels below.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactCards.map((card) => (
            <div key={card.label} className="card p-6 text-center hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4 text-gold-400">
                {card.icon}
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
              {card.href ? (
                <a href={card.href} className="font-semibold text-white hover:text-gold-400 transition-colors text-sm break-all">
                  {card.value}
                </a>
              ) : (
                <p className="font-semibold text-white text-sm">{card.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <a href={`tel:${PHONE}`} className="btn-primary flex items-center gap-2 px-8 py-3">
            <Phone size={20} />
            Call Us Now
          </a>
        </div>
      </div>
    </div>
  );
}
