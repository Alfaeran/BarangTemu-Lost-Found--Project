import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    try {
      setLoading(true);
      
      const response = await api.loginUser({
        email,
        password,
      });

      if (response.success && response.data) {
        // Store user info and token
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        navigate('/');
        window.location.reload();
      } else {
        setError(response.error || 'Login gagal');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Terjadi kesalahan saat login';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0080C8] to-[#0060A0] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#0080C8] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">BT</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#0080C8] mb-2">
          BarangTemu
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Platform Kehilangan & Penemuan Barang ITS
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email / NRP
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email atau NRP Anda"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0080C8] hover:bg-[#0060A0] disabled:bg-blue-300 text-white font-bold rounded-lg transition mt-6 shadow-md"
          >
            {loading ? 'Sedang Masuk...' : 'Masuk'}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-[#0080C8] hover:text-[#0060A0] font-semibold transition"
            >
              Daftar di sini
            </button>
          </p>
        </div>

        {/* Back Button */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-[#0080C8] hover:text-[#0060A0] font-semibold transition"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};
