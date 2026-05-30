import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Calendar, Fuel, Settings2 } from 'lucide-react';

const VEHICLE_EMOJIS = {
  truck: '🚛', car: '🚗', tractor: '🚜', bus: '🚌',
  van: '🚐', motorcycle: '🏍️', crane: '🏗️', excavator: '🚧',
  pickup: '🛻', trailer: '🚚', other: '🚙',
};

const STATUS_COLORS = {
  approved: 'bg-emerald-500/20 text-emerald-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  rejected: 'bg-red-500/20 text-red-400',
};

export default function VehicleCard({ vehicle, showStatus = false }) {
  const emoji = VEHICLE_EMOJIS[vehicle.type] || '🚙';
  const lowestPrice = Math.min(
    ...[vehicle.pricing?.hourly, vehicle.pricing?.daily, vehicle.pricing?.monthly, vehicle.pricing?.yearly]
      .filter(Boolean)
  );

  return (
    <Link to={`/vehicles/${vehicle._id}`} className="block group">
      <div className="card hover:shadow-gold hover:-translate-y-1 transition-all duration-300">
        <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden rounded-t-2xl">
          {vehicle.images?.length > 0 ? (
            <img
              src={vehicle.images[0]}
              alt={vehicle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl opacity-60 group-hover:scale-110 transition-transform duration-300 animate-float">
                {emoji}
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="badge bg-slate-900/80 backdrop-blur-sm text-slate-200 capitalize border border-slate-700/50">
              {vehicle.type}
            </span>
            {showStatus && (
              <span className={`badge ${STATUS_COLORS[vehicle.status] || 'bg-slate-500/20 text-slate-400'} capitalize`}>
                {vehicle.status}
              </span>
            )}
          </div>

          {vehicle.isAvailable === false && !showStatus && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
              <span className="badge bg-red-500/80 text-white text-sm px-4 py-2">Unavailable</span>
            </div>
          )}

          {lowestPrice > 0 && (
            <div className="absolute bottom-3 right-3 bg-gold-500 text-slate-900 font-bold text-sm px-3 py-1.5 rounded-lg shadow-gold">
              From ₹{lowestPrice.toLocaleString()}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white text-base mb-1.5 line-clamp-1 group-hover:text-gold-400 transition-colors duration-200">
            {vehicle.title}
          </h3>

          {vehicle.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < Math.round(vehicle.rating) ? 'text-gold-400 fill-gold-400' : 'text-slate-600'} />
              ))}
              <span className="text-xs text-slate-400 ml-1">({vehicle.totalRatings})</span>
            </div>
          )}

          <div className="flex items-center gap-1 mb-3">
            <MapPin size={13} className="text-gold-400 flex-shrink-0" />
            <span className="text-xs text-slate-400 truncate">{vehicle.location}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {vehicle.pricing?.hourly > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={11} className="text-gold-400" />
                ₹{vehicle.pricing.hourly}/hr
              </div>
            )}
            {vehicle.pricing?.daily > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar size={11} className="text-gold-400" />
                ₹{vehicle.pricing.daily}/day
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-700/40">
            {vehicle.fuelType && (
              <div className="flex items-center gap-1 text-xs text-slate-500 capitalize">
                <Fuel size={11} />
                {vehicle.fuelType}
              </div>
            )}
            {vehicle.transmission && (
              <div className="flex items-center gap-1 text-xs text-slate-500 capitalize">
                <Settings2 size={11} />
                {vehicle.transmission}
              </div>
            )}
            {vehicle.totalBookings > 0 && (
              <span className="text-xs text-slate-500 ml-auto">{vehicle.totalBookings} trips</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
