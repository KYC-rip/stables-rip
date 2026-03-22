import { Sun, Moon, Monitor, Eye, EyeOff, ALargeSmall, Palette } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SUPPORTED_LANGS } from '../i18n/config';

function useLangPrefix() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  if (lang === 'en' || !(SUPPORTED_LANGS as readonly string[]).includes(lang)) return '';
  return `/${lang}`;
}

export function Header() {
  const { t } = useTranslation();
  const {
    mode, cycleTheme,
    contrast, toggleContrast,
    fontScale, cycleFontScale,
    skin, skinLabel, cycleSkin,
  } = useTheme();
  const { pathname } = useLocation();
  const prefix = useLangPrefix();

  const NAV = [
    { path: `${prefix}/`, label: t('header.nav_tracker') },
    { path: `${prefix}/stats`, label: t('header.nav_stats') },
    { path: `${prefix}/blacklist`, label: t('header.nav_blacklist') },
    { path: `${prefix}/faq`, label: t('header.nav_faq') },
  ];

  return (
    <header className="w-full max-w-6xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between relative z-20">
      {/* Logo + Nav */}
      <div className="flex items-center gap-6">
        <Link to={`${prefix}/`} className="flex items-center gap-0.5 group shrink-0">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sr-danger opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sr-danger" />
          </span>
          <span className="text-sm font-extrabold tracking-tight">STABLES</span>
          <span className="text-sm font-extrabold tracking-tight text-sr-dim">.RIP</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-sm transition-colors ${
                pathname === item.path
                  ? 'text-sr-danger bg-sr-danger/10'
                  : 'text-sr-dim hover:text-current hover:bg-sr-danger/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <a
          href="https://kyc.rip/swap?from=usdt&from_network=TRC20&to=xmr&to_network=Mainnet&amount=1000"
          target="_blank"
          rel="noreferrer"
          className="hidden lg:inline-flex text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border border-sr-danger/30 text-sr-danger hover:bg-sr-danger hover:text-white dark:hover:text-black transition-all rounded-sm mr-2"
        >
          {t('header.escape_kill_switch')}
        </a>

        <LanguageSwitcher />

        <button
          onClick={toggleContrast}
          className="p-2 hover:bg-sr-danger/10 rounded transition-colors text-sr-dim hover:text-current"
          title={`Contrast: ${contrast}`}
        >
          {contrast === 'high' ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>

        <button
          onClick={cycleFontScale}
          className={`p-2 hover:bg-sr-danger/10 rounded transition-colors relative ${fontScale !== 'default' ? 'text-sr-danger' : 'text-sr-dim hover:text-current'}`}
          title={`Font size: ${fontScale === 'default' ? '100%' : fontScale === 'large' ? '115%' : '130%'}`}
        >
          <ALargeSmall size={15} />
          {fontScale !== 'default' && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-sr-danger rounded-full" />
          )}
        </button>

        <button
          onClick={cycleSkin}
          className={`p-2 hover:bg-sr-danger/10 rounded transition-colors relative ${skin !== 'terminal' ? 'text-sr-danger' : 'text-sr-dim hover:text-current'}`}
          title={`Skin: ${skinLabel}`}
        >
          <Palette size={15} />
          {skin !== 'terminal' && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-sr-danger rounded-full" />
          )}
        </button>

        <button
          onClick={cycleTheme}
          className="p-2 hover:bg-sr-danger/10 rounded transition-colors text-sr-dim hover:text-current"
          title={`Theme: ${mode}`}
        >
          {mode === 'light' && <Sun size={15} />}
          {mode === 'dark' && <Moon size={15} />}
          {mode === 'system' && <Monitor size={15} />}
        </button>
      </div>
    </header>
  );
}
