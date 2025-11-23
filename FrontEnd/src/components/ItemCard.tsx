import { Item, ItemType } from '../types';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, User, Tag } from 'lucide-react';

interface ItemCardProps {
  item: Item;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  const isLost = item.type === ItemType.LOST;
  const badgeColor = isLost 
    ? 'bg-red-100 text-red-700 border-l-4 border-red-500' 
    : 'bg-green-100 text-green-700 border-l-4 border-green-500';
  const statusLabel = isLost ? 'Hilang' : 'Ditemukan';
  const statusBg = isLost ? 'from-red-500 to-red-600' : 'from-green-500 to-green-600';

  return (
    <Link to={`/item/${item.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-[#0080C8] group">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-52">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              📦
            </div>
          )}
          
          {/* Status Badge - Floating */}
          <div className={`absolute top-3 right-3 bg-gradient-to-r ${statusBg} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform hover:scale-110 transition`}>
            {statusLabel}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-[#0080C8] transition">
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Info Grid */}
          <div className="space-y-2.5 mb-4">
            {/* Location */}
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <MapPin size={16} className="text-[#0080C8] flex-shrink-0" />
              <span className="line-clamp-1 font-medium">{item.location}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Calendar size={16} className="text-[#0080C8] flex-shrink-0" />
              <span className="font-medium">{new Date(item.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>

            {/* Category */}
            {item.category && (
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Tag size={16} className="text-[#D4AF37] flex-shrink-0" />
                <span className="font-medium">{item.category.name}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Contact Info */}
          <div className="flex items-start gap-2">
            <User size={16} className="text-[#0080C8] flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-gray-800 text-sm font-semibold line-clamp-1">
                {item.user?.username || 'Pengguna'}
              </p>
              <p className="text-gray-500 text-xs line-clamp-1">
                {item.contactInfo || 'Hubungi melalui platform'}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full mt-4 bg-gradient-to-r from-[#0080C8] to-[#0060A0] text-white font-semibold py-2 rounded-lg hover:shadow-lg transition duration-200 transform hover:scale-105 text-sm">
            Lihat Detail
          </button>
        </div>
      </div>
    </Link>
  );
};
