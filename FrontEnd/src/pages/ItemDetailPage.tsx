import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Item, ItemStatus } from '../types';
import api from '../services/api';
import { 
  MapPin, 
  Calendar, 
  User, 
  Tag, 
  Phone, 
  ArrowLeft, 
  MessageCircle,
  Shield,
  Clock
} from 'lucide-react';

export const ItemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    loadItemDetail();
  }, [id]);

  const loadItemDetail = async () => {
    try {
      setLoading(true);
      setError('');
      if (!id) {
        setError('ID item tidak valid');
        return;
      }
      const response = await api.getItemById(Number(id));
      if (response.data) {
        setItem(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memuat detail item');
      console.error('Error loading item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Contact message:', contactMessage);
    alert('Pesan akan dikirim ke pemilik item');
    setContactMessage('');
    setShowContactForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0080C8] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail item...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Item tidak ditemukan'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#0080C8] text-white px-6 py-2 rounded-lg hover:bg-[#0060A0] transition"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  const isLost = item.type === 'LOST';
  const statusBg = isLost ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
  const statusLabel = isLost ? 'Hilang' : 'Ditemukan';
  const isResolved = item.status === ItemStatus.RESOLVED;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#0080C8] hover:text-[#0060A0] mb-6 font-semibold transition"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Basic Info */}
          <div className="lg:col-span-2">
            {/* Image Container */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 aspect-video">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    📦
                  </div>
                )}
                
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 ${statusBg} text-sm font-bold px-4 py-2 rounded-full shadow-lg`}>
                  {statusLabel}
                </div>

                {/* Resolved Badge */}
                {isResolved && (
                  <div className="absolute top-4 left-4 bg-blue-100 text-blue-700 text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Shield size={16} />
                    Terselesaikan
                  </div>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{item.title}</h1>
              
              {item.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Deskripsi</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              )}

              {/* Category & Additional Data */}
              {item.category && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={20} className="text-[#D4AF37]" />
                    <span className="text-gray-700 font-semibold">Kategori:</span>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                      {item.category.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Additional Data */}
              {item.additionalData && Object.keys(item.additionalData).length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Informasi Tambahan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(item.additionalData).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm font-medium">{key}</p>
                        <p className="text-gray-800 text-lg font-semibold mt-1">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location & Date Info */}
            <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={20} className="text-[#0080C8]" />
                  <h3 className="text-lg font-semibold text-gray-700">Lokasi</h3>
                </div>
                <p className="text-gray-600 text-lg ml-8">{item.location}</p>
              </div>

              {/* Date Incident */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={20} className="text-[#0080C8]" />
                  <h3 className="text-lg font-semibold text-gray-700">Tanggal Kejadian</h3>
                </div>
                <p className="text-gray-600 text-lg ml-8">
                  {new Date(item.dateIncident).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Post Date */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={20} className="text-[#D4AF37]" />
                  <h3 className="text-lg font-semibold text-gray-700">Tanggal Posting</h3>
                </div>
                <p className="text-gray-600 text-lg ml-8">
                  {new Date(item.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={20} className="text-[#10B981]" />
                  <h3 className="text-lg font-semibold text-gray-700">Status</h3>
                </div>
                <p className={`text-lg font-semibold ml-8 ${isResolved ? 'text-green-600' : 'text-orange-600'}`}>
                  {isResolved ? 'Terselesaikan' : 'Terbuka'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Info & CTA */}
          <div>
            {/* Contact Card */}
            <div className="bg-gradient-to-br from-[#0080C8] to-[#0060A0] rounded-xl shadow-md p-6 text-white mb-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Kontak Pemilik</h2>

              {/* User Info */}
              {item.user && (
                <div className="mb-6 pb-6 border-b border-white border-opacity-20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{item.user.username}</p>
                      <p className="text-sm opacity-90">{item.user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Method */}
              <div className="bg-[#D4AF37] bg-opacity-20 rounded-lg p-4 mb-6 border border-[#D4AF37] border-opacity-40">
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={18} />
                  <span className="text-sm opacity-90">Nomor Telepon</span>
                </div>
                <p className="text-xl font-bold break-all text-yellow-50">{item.contactInfo}</p>
              </div>

              {/* Action Buttons */}
              {!isResolved && (
                <>
                  <button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="w-full bg-[#D4AF37] text-gray-800 hover:bg-[#C9A227] font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 mb-3 shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
                  >
                    <MessageCircle size={18} />
                    Hubungi Pemilik
                  </button>

                  <a
                    href={`https://wa.me/${item.contactInfo.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#D4AF37] hover:bg-[#C9A227] text-gray-800 font-bold py-3 rounded-lg transition text-center block shadow-md hover:shadow-lg transform hover:scale-105 duration-200 flex items-center justify-center gap-2"
                  >
                    <svg 
                      className="w-5 h-5" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.006c-1.446 0-2.59.737-2.8 1.72.24.016 1.016.058 1.796-.222.606-.208 1.396-.515 2.158-1.013-.444-.361-1.268-.485-2.148-.485z"/>
                      <path d="M20.52 3.449C18.24 1.245 15.589 0 12.765 0 6.48 0 1.467 5.013 1.467 11.25c0 1.977.501 3.906 1.452 5.627L1.348 23.789c-.145.545.132 1.112.677 1.257.145.038.29.056.436.056.395 0 .768-.165 1.025-.472l3.756-3.756h.005c1.594.905 3.416 1.382 5.297 1.382 6.285 0 11.298-5.013 11.298-11.25 0-3.021-1.225-5.866-3.451-8.029z"/>
                    </svg>
                    WhatsApp
                  </a>
                </>
              )}

              {isResolved && (
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                  <p className="text-sm opacity-90">✓ Item ini telah ditandai sebagai terselesaikan</p>
                </div>
              )}
            </div>

            {/* Similar Items Widget */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Tambahan</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-[#0080C8] font-bold">•</span>
                  <span>ID Item: <strong className="text-gray-800">{item.id}</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#0080C8] font-bold">•</span>
                  <span>Tipe: <strong className="text-gray-800">{isLost ? 'Barang Hilang' : 'Barang Ditemukan'}</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#0080C8] font-bold">•</span>
                  <span>User ID: <strong className="text-gray-800">{item.userId}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && !isResolved && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Hubungi Pemilik</h3>
              
              <form onSubmit={handleContactSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Pesan Anda</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0080C8] resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#0080C8] text-white font-bold py-2 rounded-lg hover:bg-[#0060A0] transition"
                  >
                    Kirim Pesan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Related/Similar Items - Future Enhancement */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Item Serupa Lainnya</h2>
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-600">
            <p>Fitur item serupa akan segera hadir</p>
          </div>
        </div>
      </div>
    </div>
  );
};
