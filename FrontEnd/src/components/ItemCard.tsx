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
      <div className="bg-white rounded-lg md:rounded-xl shadow-md hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-[#0080C8] group">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-40 md:h-52">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl">
              📦
            </div>
          )}
          
          <div className={`absolute top-2 md:top-3 right-2 md:right-3 bg-gradient-to-r ${statusBg} text-white text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg transform hover:scale-110 transition`}>
            {statusLabel}
          </div>
        </div>

        <div className="p-3 md:p-5">
          <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2 line-clamp-2 text-gray-800 group-hover:text-[#0080C8] transition">
            {item.title}
          </h3>

          {item.description && (
            <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="space-y-1.5 md:space-y-2.5 mb-3 md:mb-4">
            <div className="flex items-center gap-2 text-gray-700 text-xs md:text-sm">
              <MapPin size={14} className="text-[#0080C8] flex-shrink-0 md:w-4 md:h-4" />
              <span className="line-clamp-1 font-medium">{item.location}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 text-xs md:text-sm">
              <Calendar size={14} className="text-[#0080C8] flex-shrink-0 md:w-4 md:h-4" />
              <span className="font-medium">{new Date(item.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>

            {item.category && (
              <div className="flex items-center gap-2 text-gray-700 text-xs md:text-sm">
                <Tag size={14} className="text-[#D4AF37] flex-shrink-0 md:w-4 md:h-4" />
                <span className="font-medium">{item.category.name}</span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 my-2 md:my-4"></div>

          <div className="flex items-start gap-2">
            <User size={14} className="text-[#0080C8] flex-shrink-0 mt-0.5 md:w-4 md:h-4" />
            <div className="min-w-0 flex-1">
              <p className="text-gray-800 text-xs md:text-sm font-semibold line-clamp-1">
                {item.user?.username || 'Pengguna'}
              </p>
              <p className="text-gray-500 text-xs line-clamp-1">
                {item.contactInfo || 'Hubungi melalui platform'}
              </p>
            </div>
          </div>

          <button className="w-full mt-3 md:mt-4 bg-gradient-to-r from-[#0080C8] to-[#0060A0] text-white font-semibold py-2 rounded-lg hover:shadow-lg transition duration-200 transform hover:scale-105 text-xs md:text-sm">
            Lihat Detail
          </button>
        </div>
      </div>
    </Link>
  );
};
