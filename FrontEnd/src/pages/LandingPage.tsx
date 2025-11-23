import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemCard } from '../components/ItemCard';
import { Item, ItemType, Category } from '../types';
import api from '../services/api';
import { ChevronDown } from 'lucide-react';

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

  useEffect(() => {
    loadCategories();
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0080C8] via-[#0070B8] to-[#0060A0] text-white py-24 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Temukan Barang Hilang Anda
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl">
              Platform terpercaya untuk melaporkan dan mencari barang yang hilang atau ditemukan di sekitar ITS. Kami membantu Anda menemukan apa yang Anda cari.
            </p>
          </div>

          {/* Hero Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/kehilangan')}
              className="px-8 py-3 bg-white text-[#EF4444] hover:bg-gray-50 font-bold rounded-lg transition shadow-lg duration-200 transform hover:scale-105"
            >
              Lapor Kehilangan
            </button>
            <button
              onClick={() => navigate('/ditemukan')}
              className="px-8 py-3 bg-[#D4AF37] text-gray-800 hover:bg-[#C9A227] font-bold rounded-lg transition shadow-lg duration-200 transform hover:scale-105"
            >
              Lapor Penemuan
            </button>
          </div>
        </div>
      </section>

      {/* Main Feed */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Tabs and Advanced Filters Combined */}
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition duration-300">
          {/* Filter Tabs */}
          <div className="flex gap-4 border-b-2 border-gray-200 pb-4 mb-6 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`pb-3 font-semibold transition px-4 whitespace-nowrap ${
                filter === 'all'
                  ? 'text-[#0080C8] border-b-3 border-[#0080C8] text-lg'
                  : 'text-gray-600 hover:text-[#0080C8]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('lost')}
              className={`pb-3 font-semibold transition px-4 whitespace-nowrap ${
                filter === 'lost'
                  ? 'text-[#EF4444] border-b-3 border-[#EF4444] text-lg'
                  : 'text-gray-600 hover:text-[#EF4444]'
              }`}
            >
              Barang Hilang Terbaru
            </button>
            <button
              onClick={() => setFilter('found')}
              className={`pb-3 font-semibold transition px-4 whitespace-nowrap ${
                filter === 'found'
                  ? 'text-[#10B981] border-b-3 border-[#10B981] text-lg'
                  : 'text-gray-600 hover:text-[#10B981]'
              }`}
            >
              Barang Ditemukan Terbaru
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Category Filter */}
            <div className="transform transition hover:scale-105">
              <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">
                Kategori
              </label>
              <div className="relative">
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080C8] focus:border-[#0080C8] appearance-none bg-white cursor-pointer text-sm font-medium shadow-sm hover:shadow-md transition"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 text-[#0080C8] pointer-events-none" size={18} />
              </div>
            </div>

            {/* Date From Filter */}
            <div className="transform transition hover:scale-105">
              <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080C8] focus:border-[#0080C8] text-sm shadow-sm hover:shadow-md transition"
              />
            </div>

            {/* Date To Filter */}
            <div className="transform transition hover:scale-105">
              <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">
                Hingga Tanggal
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080C8] focus:border-[#0080C8] text-sm shadow-sm hover:shadow-md transition"
              />
            </div>

            {/* Clear Filters Button */}
            {(selectedCategory || dateFrom || dateTo || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 rounded-lg font-semibold transition duration-200 text-sm h-fit shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Bersihkan Filter
              </button>
            )}
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#0080C8]"></div>
            <p className="text-gray-600 mt-6 text-lg font-medium">Memuat data barang terbaru...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {items.map((item) => (
              <div key={item.id} className="transform transition hover:scale-105 hover:shadow-xl">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600 text-lg font-medium">
              Tidak ada barang {filter === 'lost' ? 'hilang' : filter === 'found' ? 'ditemukan' : ''} untuk ditampilkan
            </p>
            <p className="text-gray-500 text-sm mt-2">Coba ubah filter atau kategori untuk melihat lebih banyak barang</p>
          </div>
        )}
      </section>
    </div>
  );
};
