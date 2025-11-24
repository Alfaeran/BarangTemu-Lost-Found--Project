import { useState, useEffect } from 'react';
import { Item, ItemStatus, ItemType } from '../types';
import api from '../services/api';
import { X, Trash2, Edit2 } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemUpdated: () => void;
}

type TabType = 'view' | 'edit';

export const AdminModal = ({ isOpen, onClose, onItemUpdated }: AdminModalProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('view');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    contactInfo: '',
    status: ItemStatus.OPEN,
  });

  useEffect(() => {
    if (isOpen) {
      loadAllItems();
    }
  }, [isOpen]);

  const loadAllItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getItems({ limit: 100 });
      setItems(response.data || []);
    } catch (err) {
      setError('Gagal memuat items');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSelect = (item: Item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      location: item.location || '',
      contactInfo: item.contactInfo || '',
      status: item.status || 'OPEN',
    });
    setActiveTab('edit');
    setError('');
  };

  const handleSaveEdit = async () => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      setError('');
      await api.updateItem(selectedItem.id, formData);
      loadAllItems();
      onItemUpdated();
      setActiveTab('view');
      setSelectedItem(null);
    } catch (err) {
      setError('Gagal mengupdate item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;

    try {
      setLoading(true);
      setError('');
      await api.deleteItem(itemId);
      loadAllItems();
      onItemUpdated();
    } catch (err) {
      setError('Gagal menghapus item');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-[#0080C8] to-[#0060A0] text-white">
          <h2 className="text-2xl font-bold">Admin Dashboard - Kelola Items</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-3 px-4 font-semibold transition ${
              activeTab === 'view'
                ? 'text-[#0080C8] border-b-2 border-[#0080C8] bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 Lihat Items ({items.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4">
              ⚠️ {error}
            </div>
          )}

          {activeTab === 'view' ? (
            <>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#0080C8]"></div>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Tidak ada items</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#0080C8] transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-bold ${
                                item.type === 'LOST'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {item.type === 'LOST' ? 'HILANG' : 'DITEMUKAN'}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-bold ${
                                item.status === 'OPEN'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {item.status === 'OPEN' ? 'TERBUKA' : 'SELESAI'}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                          )}
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <p><strong>Lokasi:</strong> {item.location}</p>
                            <p><strong>Tanggal:</strong> {new Date(item.dateIncident).toLocaleDateString('id-ID')}</p>
                            <p><strong>Kontak:</strong> {item.contactInfo}</p>
                            <p><strong>Pembuat:</strong> {item.user?.username || 'Unknown'}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditSelect(item)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={loading}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="max-w-2xl">
              {selectedItem && (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">✏️ Edit Item</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Judul</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0080C8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0080C8] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0080C8] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Info Kontak</label>
                        <input
                          type="text"
                          value={formData.contactInfo}
                          onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0080C8] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value as ItemStatus)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0080C8] focus:outline-none"
                      >
                        <option value={ItemStatus.OPEN}>Terbuka</option>
                        <option value={ItemStatus.RESOLVED}>Selesai</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={loading}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                      >
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                      <button
                        onClick={() => setActiveTab('view')}
                        disabled={loading}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
