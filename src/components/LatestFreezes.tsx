import { useTranslation } from 'react-i18next';
import { Badge } from './ui/Badge';
import { AddressDisplay } from './ui/AddressDisplay';
import type { BanRecord } from '../types';

interface LatestFreezesProps {
  records: BanRecord[];
  loading: boolean;
}

function useRelativeTime() {
  return (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    const months = Math.floor(days / 30);
    return `${months}mo`;
  };
}

export function LatestFreezes({ records, loading }: LatestFreezesProps) {
  const { t } = useTranslation();
  const relativeTime = useRelativeTime();

  if (loading) {
    return (
      <section>
        <h2 className="text-sm font-bold text-sr-dim uppercase tracking-wider mb-4">{t('latest_freezes.title')}</h2>
        <div className="text-center text-[10px] text-sr-dim animate-pulse uppercase tracking-widest font-bold py-8">
          {t('latest_freezes.loading')}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-sr-dim uppercase tracking-wider">{t('latest_freezes.title')}</h2>
        <span className="text-[9px] text-sr-dim">
          {t('latest_freezes.showing', { count: records.length })}
        </span>
      </div>

      <div className="border border-sr-border rounded-sm overflow-hidden divide-y divide-sr-border/50">
        {records.map((r) => {
          const bal = parseFloat(r.frozen_balance || '0');
          return (
            <div
              key={`${r.id}-${r.chain}-${r.asset}`}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-sr-surface hover:bg-sr-danger/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${bal > 0 ? 'bg-sr-danger' : 'bg-sr-dim/30'}`} />
                <Badge type="asset" value={r.asset} />
                <Badge type="chain" value={r.chain} />
                <AddressDisplay address={r.address} chain={r.chain} />
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-xs font-bold tabular-nums ${bal > 0 ? 'text-sr-danger' : 'text-sr-dim/40'}`}>
                  {bal > 0 ? `-$${bal.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '$0'}
                </span>
                <span className="text-[9px] text-sr-dim w-14 text-right">
                  {relativeTime(r.banned_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
