import { Lock, Gavel, TrendingUp, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ExplainerProps {
  totalFrozen: number;
}

export function Explainer({ totalFrozen }: ExplainerProps) {
  const { t } = useTranslation();

  const fmtTotal = totalFrozen >= 1e9
    ? `$${(totalFrozen / 1e9).toFixed(1)}B`
    : `$${(totalFrozen / 1e6).toFixed(0)}M`;

  const cards = [
    {
      icon: Lock,
      title: t('explainer.card_freeze_title'),
      body: t('explainer.card_freeze_body'),
    },
    {
      icon: Gavel,
      title: t('explainer.card_blacklisted_title'),
      body: t('explainer.card_blacklisted_body'),
    },
    {
      icon: TrendingUp,
      title: t('explainer.card_scale_title'),
      body: t('explainer.card_scale_body', { amount: fmtTotal }),
    },
    {
      icon: Shield,
      title: t('explainer.card_protect_title'),
      body: t('explainer.card_protect_body'),
    },
  ];

  return (
    <section>
      <h2 className="font-display text-xl md:text-2xl font-extrabold mb-2">
        {t('explainer.title_1')}{' '}
        <span className="text-sr-danger">{t('explainer.title_kill_switch')}</span>.
      </h2>
      <p className="text-xs text-sr-dim mb-8 max-w-lg leading-relaxed">
        {t('explainer.subtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="border border-sr-border rounded-sm p-5 bg-sr-surface hover:border-sr-danger/30 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-sr-danger/10 rounded-sm border border-sr-danger/10 group-hover:border-sr-danger/20 transition-colors">
                  <Icon size={16} className="text-sr-danger" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold mb-2">{card.title}</h3>
                  <p className="text-[11px] text-sr-dim leading-relaxed">{card.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
