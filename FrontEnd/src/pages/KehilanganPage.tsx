import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemType, Category } from '../types';
import api from '../services/api';

export const KehilanganPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = localStorage.getItem('user');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    location: '',
    dateIncident: '',
    contactInfo: '',
    additionalData: {} as any,
  });

  const [dynamicFields, setDynamicFields] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCategories();
  }, [user, navigate]);

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData({ ...formData, categoryId });

    // Get dynamic fields based on category
    const selectedCategory = categories.find(c => c.id === parseInt(categoryId));
    if (selectedCategory?.formSchema?.fields) {
      setDynamicFields(selectedCategory.formSchema.fields);
    } else {
      setDynamicFields([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDynamicFieldChange = (fieldName: string, value: string) => {
    setFormData({
      ...formData,
      additionalData: {
        ...formData.additionalData,
        [fieldName]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.location || !formData.dateIncident || !formData.contactInfo) {
      setError('Semua field wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const userData = JSON.parse(user);

      const response = await api.createItem({
        userId: userData.id,
        type: ItemType.LOST,
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        location: formData.location,
        dateIncident: formData.dateIncident,
        contactInfo: formData.contactInfo,
        additionalData: Object.keys(formData.additionalData).length > 0 ? formData.additionalData : undefined,
      });

      if (response.success) {
        navigate('/');
      } else {
        setError(response.error || 'Gagal membuat laporan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat membuat laporan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEE2E2] py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#EF4444]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#EF4444] mb-2">Lapor Barang Hilang</h1>
            <p className="text-gray-600">
              Isi formulir berikut untuk melaporkan barang yang Anda hilang
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#FEE2E2] border-2 border-[#EF4444] text-[#DC2626] px-4 py-3 rounded-lg mb-6 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nama Barang <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Contoh: iPhone 14 Pro"
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444] focus:ring-opacity-20 transition-colors duration-200"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Jelaskan ciri-ciri barang secara detail..."
                rows={4}
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444] focus:ring-opacity-20 transition-colors duration-200 resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Kategori
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444] focus:ring-opacity-20 transition-colors duration-200"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Fields */}
            {dynamicFields.length > 0 && (
              <div className="bg-[#FEE2E2] p-4 rounded-lg border-2 border-[#FECACA]">
                <h3 className="font-semibold text-[#DC2626] mb-4">📋 Data Spesifik Barang</h3>
                <div className="space-y-4">
                  {dynamicFields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-gray-700 font-semibold mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        value={formData.additionalData[field.name] || ''}
                        onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
                        className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444] focus:ring-opacity-20 transition-colors duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Lokasi Terakhir Dilihat <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Contoh: Gedung Teknik Mesin, ITS"
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444] focus:ring-opacity-20 transition-colors duration-200"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tanggal Kehilangan <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="date"
                name="dateIncident"
                value={formData.dateIncident}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444] focus:ring-opacity-20 transition-colors duration-200"
                required
              />
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nomor Kontak <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="tel"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="Contoh: 08123456789"
                className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444] focus:ring-opacity-20 transition-colors duration-200"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-red-300 text-white font-bold rounded-lg transition duration-200 shadow-md"
              >
                {loading ? 'Mengirim...' : '📢 Lapor Kehilangan'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition duration-200"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
