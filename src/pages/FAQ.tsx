import { useTranslation } from 'react-i18next';
import { SEO, buildFAQSchema } from '../components/SEO';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-sr-border/50 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="font-display text-sm font-semibold pr-4 group-hover:text-sr-danger transition-colors">{q}</span>
        <ChevronDown size={16} className={`text-sr-dim shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 text-[12px] text-sr-dim leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();

  const faqs = Array.from({ length: 14 }, (_, i) => ({
    q: t(`faq_page.q${i + 1}`),
    a: t(`faq_page.a${i + 1}`),
  }));

  return (
    <div className="flex flex-col items-center min-h-screen font-mono antialiased text-current">
      <SEO
        title={t('faq_page.seo_title')}
        description={t('faq_page.seo_description')}
        path="/faq"
        schema={buildFAQSchema(faqs.map(f => ({ question: f.q, answer: f.a })))}
      />
      <div className="scanlines" />
      <div className="vignette" />
      <Header />

      <main className="w-full max-w-3xl px-4 md:px-6 pb-12 relative z-10">
        <h1 className="font-display text-2xl md:text-3xl font-black mb-2 mt-4">
          {t('faq_page.title')}
        </h1>
        <p className="text-xs text-sr-dim mb-8 max-w-lg leading-relaxed">
          {t('faq_page.subtitle')}
        </p>

        <div className="border border-sr-border rounded-sm bg-sr-surface px-5">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
