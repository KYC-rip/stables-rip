import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LangRouter } from './i18n/LangRouter';
import { SUPPORTED_LANGS } from './i18n/config';
import HomePage from './pages/HomePage';
import FAQ from './pages/FAQ';
import StatsPage from './pages/StatsPage';
import Blacklist from './pages/Blacklist';

const langPrefix = SUPPORTED_LANGS.filter(l => l !== 'en').map(l => `/${l}`);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/blacklist" element={<Blacklist />} />
      {langPrefix.map(prefix => [
        <Route key={`${prefix}/`} path={prefix} element={<HomePage />} />,
        <Route key={`${prefix}/faq`} path={`${prefix}/faq`} element={<FAQ />} />,
        <Route key={`${prefix}/stats`} path={`${prefix}/stats`} element={<StatsPage />} />,
        <Route key={`${prefix}/blacklist`} path={`${prefix}/blacklist`} element={<Blacklist />} />,
      ])}
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LangRouter>
        <AppRoutes />
      </LangRouter>
    </BrowserRouter>
  );
}
