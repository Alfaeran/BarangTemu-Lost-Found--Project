import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string, searchType: 'location' | 'title') => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0080C8] text-white shadow-lg">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition flex-shrink-0">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center font-bold text-[#0080C8] shadow-md text-xs md:text-lg">
              ITS
            </div>
            <span className="text-lg md:text-2xl font-bold whitespace-nowrap">BarangTemu</span>
          </Link>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-blue-700 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <Link to="/" className="px-3 lg:px-5 py-2 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-sm lg:text-base">
              Beranda
            </Link>
            <button
              onClick={() => handleNavClick('/kehilangan')}
              className="px-3 lg:px-5 py-2 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-sm lg:text-base"
            >
              Hilang
            </button>
            <button
              onClick={() => handleNavClick('/ditemukan')}
              className="px-3 lg:px-5 py-2 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-sm lg:text-base"
            >
              Temuan
            </button>
          </nav>

          <div className="hidden md:flex flex-shrink-0 gap-2 lg:gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-3 lg:px-5 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg font-semibold transition duration-200 text-sm lg:text-base"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="px-3 lg:px-5 py-2 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-sm lg:text-base"
                >
                  Daftar
                </button>
                <button
                  onClick={() => handleNavClick('/login')}
                  className="px-3 lg:px-5 py-2 bg-[#D4AF37] text-gray-800 hover:bg-[#C9A227] rounded-lg font-semibold transition duration-200 text-sm lg:text-base"
                >
                  Masuk
                </button>
              </>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-blue-400 pt-4">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-4 py-3 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200 text-center"
            >
              Beranda
            </Link>
            <button
              onClick={() => handleNavClick('/kehilangan')}
              className="w-full px-4 py-3 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200"
            >
              Hilang
            </button>
            <button
              onClick={() => handleNavClick('/ditemukan')}
              className="w-full px-4 py-3 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200"
            >
              Temuan
            </button>
            <div className="flex flex-col gap-2 pt-2 border-t border-blue-400">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-lg font-semibold transition duration-200"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('/register')}
                    className="w-full px-4 py-3 border-2 border-white text-white hover:bg-white hover:text-[#0080C8] rounded-lg font-semibold transition duration-200"
                  >
                    Daftar
                  </button>
                  <button
                    onClick={() => handleNavClick('/login')}
                    className="w-full px-4 py-3 bg-[#D4AF37] text-gray-800 hover:bg-[#C9A227] rounded-lg font-semibold transition duration-200"
                  >
                    Masuk
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
