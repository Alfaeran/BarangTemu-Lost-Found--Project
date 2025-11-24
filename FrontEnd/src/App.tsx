import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { KehilanganPage } from './pages/KehilanganPage';
import { PenemuanPage } from './pages/PenemuanPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import './index.css';

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';

  const handleSearch = (query: string, type: 'location' | 'title') => {
    // This search functionality is used in Header
    console.log('Search:', query, type);
  };

  return (
    <>
      {!hideHeader && <Header onSearch={handleSearch} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/kehilangan" element={<KehilanganPage />} />
        <Route path="/ditemukan" element={<PenemuanPage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
