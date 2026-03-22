import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FAQ from './pages/FAQ';
import StatsPage from './pages/StatsPage';
import Blacklist from './pages/Blacklist';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/blacklist" element={<Blacklist />} />
      </Routes>
    </BrowserRouter>
  );
}
