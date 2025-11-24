import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string, searchType: 'location' | 'title') => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'location' | 'title'>('title');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery, searchType);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0080C8] text-white shadow-lg">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between gap-6 mb-3">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition flex-shrink-0">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center font-bold text-[#0080C8] shadow-md text-lg">
              ITS
            </div>
            <span className="text-2xl font-bold whitespace-nowrap">BarangTemu</span>
          </Link>

          {/* Navigation - Left Center */}
          <nav className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="px-5 py-2 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-base">
              Beranda
            </Link>
            <button
              onClick={() => navigate('/kehilangan')}
              className="px-5 py-2 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-base"
            >
              Hilang
            </button>
            <button
              onClick={() => navigate('/ditemukan')}
              className="px-5 py-2 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-base"
            >
              Temuan
            </button>
          </nav>

          {/* Auth Buttons - Right */}
          <div className="flex-shrink-0 flex gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg font-semibold transition duration-200 text-base"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-base"
                >
                  Daftar
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 bg-[#D4AF37] text-gray-800 hover:bg-[#C9A227] rounded-lg font-semibold transition duration-200 text-base"
                >
                  Masuk
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
