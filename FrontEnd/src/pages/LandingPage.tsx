import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemCard } from '../components/ItemCard';
import { AdminModal } from '../components/AdminModal';
import { Item, ItemType, Category } from '../types';
import api from '../services/api';
import { ChevronDown, Settings } from 'lucide-react';

type FilterType = 'all' | 'lost' | 'found';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'location' | 'title'>('title');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);


  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    loadCategories();

    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.role);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [filter, searchQuery, searchType, selectedCategory, dateFrom, dateTo]);

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: 1,
        limit: 12,
      };

      if (filter === 'lost') {
        params.type = ItemType.LOST;
      } else if (filter === 'found') {
        params.type = ItemType.FOUND;
      }

      if (searchQuery) {
        if (searchType === 'location') {
          params.location = searchQuery;
        } else {
          params.title = searchQuery;
        }
      }

      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }

      if (dateFrom) {
        params.dateFrom = dateFrom;
      }

      if (dateTo) {
        params.dateTo = dateTo;
      }

      const response = await api.getItems(params);
      setItems(response.data || []);
    } catch (error) {
      console.error('Error loading items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string, type: 'location' | 'title') => {
    setSearchQuery(query);
    setSearchType(type);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#E8F4F8]">
      <section className="bg-gradient-to-r from-[#0080C8] via-[#0070B8] to-[#0060A0] text-white py-12 md:py-24 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 md:mb-8 text-center">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
              Temukan Barang Hilang Anda
            </h1>
            <p className="text-sm md:text-lg lg:text-xl mb-6 md:mb-8 text-blue-100 max-w-2xl mx-auto">
              Platform terpercaya untuk melaporkan dan mencari barang yang hilang atau ditemukan di sekitar ITS. Kami membantu Anda menemukan apa yang Anda cari.
            </p>
          </div>

          <div className="flex gap-2 md:gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate('/kehilangan')}
              className="px-4 md:px-8 py-2 md:py-3 bg-[#D4AF37] text-gray-800 hover:bg-[#C9A227] font-bold rounded-lg transition shadow-lg duration-200 transform hover:scale-105 text-xs md:text-base"
            >
              Lapor Kehilangan
            </button>
            <button
              onClick={() => navigate('/ditemukan')}
              className="px-4 md:px-8 py-2 md:py-3 bg-[#D4AF37] text-gray-800 hover:bg-[#C9A227] font-bold rounded-lg transition shadow-lg duration-200 transform hover:scale-105 text-xs md:text-base"
            >
              Lapor Penemuan
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 bg-white rounded-lg md:rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 hover:shadow-xl transition duration-300">
          <div className="flex gap-2 md:gap-4 border-b-2 border-gray-200 pb-3 md:pb-4 mb-4 md:mb-6 overflow-x-auto flex-wrap items-end">
            <button
              onClick={() => setFilter('all')}
              className={`pb-2 md:pb-3 font-semibold transition px-2 md:px-4 whitespace-nowrap text-xs md:text-base ${
                filter === 'all'
                  ? 'text-[#0080C8] border-b-3 border-[#0080C8]'
                  : 'text-gray-600 hover:text-[#0080C8]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('lost')}
              className={`pb-2 md:pb-3 font-semibold transition px-2 md:px-4 whitespace-nowrap text-xs md:text-base ${
                filter === 'lost'
                  ? 'text-[#EF4444] border-b-3 border-[#EF4444]'
                  : 'text-gray-600 hover:text-[#EF4444]'
              }`}
            >
              Hilang
            </button>
            <button
              onClick={() => setFilter('found')}
              className={`pb-2 md:pb-3 font-semibold transition px-2 md:px-4 whitespace-nowrap text-xs md:text-base ${
                filter === 'found'
                  ? 'text-[#10B981] border-b-3 border-[#10B981]'
                  : 'text-gray-600 hover:text-[#10B981]'
              }`}
            >
              Temuan
            </button>

            <div className="ml-auto w-full md:w-auto flex gap-1 md:gap-2 mt-2 md:mt-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari..."
                className="flex-1 md:flex-none px-2 md:px-4 py-1.5 md:py-2 md:w-48 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080C8] focus:border-[#0080C8] text-xs md:text-sm shadow-sm hover:shadow-md transition"
              />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'location' | 'title')}
                className="px-2 md:px-3 py-1.5 md:py-2 border-2 border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#0080C8] focus:border-[#0080C8] shadow-sm hover:shadow-md transition bg-white"
              >
                <option value="title">Nama</option>
                <option value="location">Lokasi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-end">
            <div className="transform transition hover:scale-105">
              <label className="block text-xs font-bold text-gray-800 mb-1 md:mb-2 uppercase tracking-wider">
                Kategori
              </label>
              <div className="relative">
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-2 md:px-4 py-2 md:py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080C8] focus:border-[#0080C8] appearance-none bg-white cursor-pointer text-xs md:text-sm font-medium shadow-sm hover:shadow-md transition"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 md:right-3 top-2.5 md:top-3 text-[#0080C8] pointer-events-none" size={16} />
              </div>
            </div>

            <div className="transform transition hover:scale-105">
              <label className="block text-xs font-bold text-gray-800 mb-1 md:mb-2 uppercase tracking-wider">
                Dari
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                max={getTodayDate()}
                className="w-full px-2 md:px-4 py-2 md:py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080C8] focus:border-[#0080C8] text-xs md:text-sm shadow-sm hover:shadow-md transition"
              />
            </div>

            <div className="transform transition hover:scale-105">
              <label className="block text-xs font-bold text-gray-800 mb-1 md:mb-2 uppercase tracking-wider">
                Hingga
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                max={getTodayDate()}
                className="w-full px-2 md:px-4 py-2 md:py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080C8] focus:border-[#0080C8] text-xs md:text-sm shadow-sm hover:shadow-md transition"
              />
            </div>

            {(selectedCategory || dateFrom || dateTo || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 rounded-lg font-semibold transition duration-200 text-xs md:text-sm h-fit shadow-md hover:shadow-lg transform hover:scale-105 col-span-1 md:col-span-1"
              >
                Bersihkan
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 md:py-16">
            <div className="inline-block animate-spin rounded-full h-12 md:h-16 w-12 md:w-16 border-4 border-gray-300 border-t-[#0080C8]"></div>
            <p className="text-gray-600 mt-4 md:mt-6 text-base md:text-lg font-medium">Memuat data barang terbaru...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fadeIn">
            {items.map((item) => (
              <div key={item.id} className="transform transition hover:scale-105 hover:shadow-xl">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16 bg-white rounded-lg md:rounded-xl shadow-md border-2 border-dashed border-gray-300">
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">📭</div>
            <p className="text-gray-600 text-base md:text-lg font-medium">
              Tidak ada barang {filter === 'lost' ? 'hilang' : filter === 'found' ? 'ditemukan' : ''} untuk ditampilkan
            </p>
            <p className="text-gray-500 text-xs md:text-sm mt-2">Coba ubah filter atau kategori untuk melihat lebih banyak barang</p>
          </div>
        )}
      </section>

      {userRole === 'ADMIN' && (
        <>
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="fixed bottom-4 md:bottom-8 right-4 md:right-8 w-14 md:w-16 h-14 md:h-16 bg-gradient-to-r from-[#0080C8] to-[#0060A0] text-white rounded-full shadow-lg hover:shadow-2xl transition duration-300 flex items-center justify-center hover:scale-110 group z-40"
            title="Admin Panel"
          >
            <Settings size={24} className="md:w-8 md:h-8 group-hover:rotate-90 transition duration-300" />
          </button>

          <AdminModal
            isOpen={isAdminModalOpen}
            onClose={() => setIsAdminModalOpen(false)}
            onItemUpdated={loadItems}
          />
        </>
      )}
    </div>
  );
};
