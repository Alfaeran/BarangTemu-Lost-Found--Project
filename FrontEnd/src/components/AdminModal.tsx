import { useState, useEffect } from 'react';
import { Item } from '../types';
import api from '../services/api';
import { X, Trash2, Edit2, Loader } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemUpdated: () => void;
}

export const AdminModal = ({ isOpen, onClose, onItemUpdated }: AdminModalProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Item>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const user = localStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;

  useEffect(() => {
    if (isOpen) {
      loadUserItems();
    }
  }, [isOpen]);

  const loadUserItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getItems({
        userId: userData?.id,
        limit: 50,
      });
      setItems(response.data || []);
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      setLoading(true);
      setError('');
      await api.updateItem(editingId, editForm);
      setEditingId(null);
      setEditForm({});
      loadUserItems();
      onItemUpdated();
    } catch (err) {
      setError('Failed to update item');
      console.error('Error updating item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      setLoading(true);
      setError('');
      setDeletingId(itemId);
      await api.deleteItem(itemId);
      loadUserItems();
      onItemUpdated();
    } catch (err) {
      setError('Failed to delete item');
      console.error('Error deleting item:', err);
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Manage Your Items</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading && !editingId ? (
            <div className="flex justify-center py-12">
              <Loader className="animate-spin text-[#0080C8]" size={32} />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No items found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  {editingId === item.id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0080C8]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editForm.description || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0080C8]"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editForm.location || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, location: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0080C8]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Contact Info
                        </label>
                        <input
                          type="text"
                          value={editForm.contactInfo || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, contactInfo: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0080C8]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={loading}
                          className="flex-1 bg-[#0080C8] text-white py-2 rounded-lg hover:bg-[#0060A0] disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.type === 'LOST'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        )}
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <p><strong>Location:</strong> {item.location}</p>
                          <p><strong>Date:</strong> {new Date(item.dateIncident).toLocaleDateString('id-ID')}</p>
                          <p><strong>Contact:</strong> {item.contactInfo}</p>
                          <p><strong>Status:</strong> {item.status}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Edit item"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                          title="Delete item"
                        >
                          {deletingId === item.id ? (
                            <Loader size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
