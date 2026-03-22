import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'ru', name: 'Русский' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setIsOpen(false);

    const currentPath = window.location.pathname;
    const codes = LANGUAGES.map(l => l.code) as readonly string[];
    const segments = currentPath.split('/');

    let pathWithoutLang = currentPath;
    if (segments[1] && codes.includes(segments[1])) {
      pathWithoutLang = '/' + segments.slice(2).join('/');
      if (!pathWithoutLang || pathWithoutLang === '/') pathWithoutLang = '/';
    }

    if (langCode === 'en') {
      window.location.href = pathWithoutLang;
    } else {
      window.location.href = `/${langCode}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-sr-danger/10 rounded transition-colors text-sr-dim hover:text-current"
        title="Language"
      >
        <Globe size={15} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-sr-surface border border-sr-border rounded shadow-lg z-50 min-w-[160px] overflow-hidden">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-sm font-mono transition-colors ${
                i18n.language === lang.code || i18n.language.startsWith(lang.code + '-')
                  ? 'text-sr-danger font-bold bg-sr-danger/5'
                  : 'text-sr-dim hover:bg-sr-danger/10 hover:text-current'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
