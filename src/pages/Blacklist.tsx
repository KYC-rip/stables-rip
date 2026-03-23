import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function Blacklist() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center min-h-screen font-mono antialiased text-current">
      <SEO
        title={t('blacklist_page.seo_title')}
        description={t('blacklist_page.seo_description')}
        path="/blacklist"
      />
      <div className="scanlines" />
      <div className="vignette" />
      <Header />

      <main className="w-full max-w-3xl px-4 md:px-6 pb-12 relative z-10 space-y-12">
        <div className="mt-4">
          <h1 className="font-display text-2xl md:text-3xl font-black mb-2">
            {t('blacklist_page.title')}
          </h1>
          <p className="text-xs text-sr-dim max-w-lg leading-relaxed mb-8">
            {t('blacklist_page.subtitle')}
          </p>
        </div>

        {/* USDC Section */}
        <section className="border border-sr-border rounded-sm bg-sr-surface p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-sm">USDC</span>
            <span className="font-display text-lg font-bold">{t('blacklist_page.usdc_title')}</span>
          </div>
          <div className="space-y-4 text-[12px] text-sr-dim leading-relaxed">
            <p>{t('blacklist_page.usdc_p1')}</p>
            <p>{t('blacklist_page.usdc_p2')}</p>
            <p>{t('blacklist_page.usdc_p3')}</p>
          </div>
        </section>

        {/* USDT Section */}
        <section className="border border-sr-border rounded-sm bg-sr-surface p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-sm">USDT</span>
            <span className="font-display text-lg font-bold">{t('blacklist_page.usdt_title')}</span>
          </div>
          <div className="space-y-4 text-[12px] text-sr-dim leading-relaxed">
            <p>{t('blacklist_page.usdt_p1')}</p>
            <p>{t('blacklist_page.usdt_p2')}</p>
            <p>{t('blacklist_page.usdt_p3')}</p>
          </div>
        </section>

        {/* Technical */}
        <section className="border border-sr-border rounded-sm bg-sr-surface p-6 md:p-8">
          <h2 className="font-display text-lg font-bold mb-4">{t('blacklist_page.technical_title')}</h2>
          <div className="space-y-4 text-[12px] text-sr-dim leading-relaxed">
            <p>{t('blacklist_page.technical_p1')}</p>
            <p>{t('blacklist_page.technical_p2')}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t('blacklist_page.technical_li1')}</li>
              <li>{t('blacklist_page.technical_li2')}</li>
              <li>{t('blacklist_page.technical_li3')}</li>
              <li>{t('blacklist_page.technical_li4')}</li>
            </ul>
            <p>{t('blacklist_page.technical_p3')}</p>
          </div>
        </section>

        {/* Why it matters */}
        <section className="border border-sr-danger/20 rounded-sm bg-sr-danger/5 p-6 md:p-8">
          <h2 className="font-display text-lg font-bold mb-4 text-sr-danger">{t('blacklist_page.why_title')}</h2>
          <div className="space-y-4 text-[12px] text-sr-dim leading-relaxed">
            <p>{t('blacklist_page.why_p1')}</p>
            <p>{t('blacklist_page.why_p2')}</p>
            <p>{t('blacklist_page.why_p3')}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
