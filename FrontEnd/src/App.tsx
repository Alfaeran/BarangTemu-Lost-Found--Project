import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { KehilanganPage } from './pages/KehilanganPage';
import { PenemuanPage } from './pages/PenemuanPage';
import './index.css';

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login';

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
        <Route path="/kehilangan" element={<KehilanganPage />} />
        <Route path="/ditemukan" element={<PenemuanPage />} />
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
