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
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#0080C8] shadow-md text-sm">
              ITS
            </div>
            <span className="text-xl font-bold whitespace-nowrap">BarangTemu</span>
          </Link>

          {/* Navigation - Center */}
          <nav className="flex items-center gap-4 flex-1 justify-center">
            <Link to="/" className="px-4 py-1 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-sm">
              Beranda
            </Link>
            <button
              onClick={() => navigate('/kehilangan')}
              className="px-4 py-1 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-sm"
            >
              Kehilangan
            </button>
            <button
              onClick={() => navigate('/ditemukan')}
              className="px-4 py-1 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-sm"
            >
              Ditemukan
            </button>
          </nav>

          {/* Login Button - Right */}
          <div className="flex-shrink-0">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-1 bg-[#D4AF37] text-gray-800 hover:bg-[#C9A227] rounded-lg font-semibold transition duration-200 text-sm"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-1 bg-[#D4AF37] text-gray-800 hover:bg-[#C9A227] rounded-lg font-semibold transition duration-200 text-sm"
              >
                Masuk / Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
