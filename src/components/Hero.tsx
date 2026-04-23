import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Counter } from './ui/Counter';
import { LiveFreezePulse } from './LiveFreezePulse';
import type { BanStats } from '../types';

interface HeroProps {
  stats: BanStats | null;
  loading: boolean;
  assetTotals: { usdt: { frozen: number; count: number }; usdc: { frozen: number; count: number } };
}

function fmtUsd(val: number) {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
}

export function Hero({ stats, loading, assetTotals }: HeroProps) {
  const { t } = useTranslation();
  const total = stats?.total_frozen || 0;

  function timeAgo(ts: number) {
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return t('hero.time_just_now');
    if (mins < 60) return t('hero.time_minutes_ago', { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('hero.time_hours_ago', { count: hours });
    return t('hero.time_days_ago', { count: Math.floor(hours / 24) });
  }

  return (
    <section className="flex flex-col items-center text-center pt-8 md:pt-16 pb-8">
      {/* Tagline */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] text-sr-dim font-bold tracking-[0.3em] uppercase">
          {t('hero.chains')}
        </span>
        <span className="text-[10px] text-sr-dim/40">|</span>
        <div className="flex items-center gap-1.5">
          <Activity size={10} className="text-sr-danger animate-pulse" />
          <span className="text-[10px] text-sr-dim font-bold tracking-[0.3em] uppercase">{t('hero.live_intel')}</span>
        </div>
      </div>

      <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-2 max-w-3xl">
        {t('hero.title_1')}{' '}
        <br className="hidden md:block" />
        {t('hero.title_2')}{' '}
        <span className="text-sr-danger relative">
          {t('hero.title_censorship')}
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sr-danger/30" />
        </span>
        .
      </h1>

      <p className="text-xs text-sr-dim max-w-md mt-3 leading-relaxed">
        {t('hero.subtitle')}
      </p>

      {/* Live freeze pulse — surfaces the last 1h wave when ≥ $1M */}
      <LiveFreezePulse />

      {/* Stats container — on mobile: total first, cards second; on desktop: cards first, total second */}
      <div className="flex flex-col mt-10 w-full max-w-2xl">
        {/* Total + Meta — order-first on mobile, order-last on desktop */}
        <div className="order-first md:order-last mt-0 md:mt-8 mb-8 md:mb-0 flex flex-col items-center gap-3">
          <div className="text-4xl md:text-6xl font-black text-sr-danger drop-shadow-[0_0_20px_rgba(239,68,68,0.2)] dark:drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            {loading ? '...' : (
              <>$<Counter value={total} formatter={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })} /></>
            )}
          </div>
          <span className="text-[10px] text-sr-danger/60 font-bold tracking-[0.4em] uppercase">
            {t('hero.total_value_frozen')}
          </span>
        </div>

        {/* Stat Cards */}
        <div className="order-last md:order-first grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* USDC */}
          <div className="border border-blue-500/20 rounded-sm p-6 bg-sr-surface relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <span className="text-[9px] text-blue-400 font-bold tracking-[0.2em] uppercase">{t('hero.usdc_frozen')}</span>
            <div className="text-2xl md:text-3xl font-extrabold mt-2 text-blue-400">
              {loading ? '...' : (
                <Counter value={assetTotals.usdc.frozen} formatter={fmtUsd} />
              )}
            </div>
            <div className="flex items-center justify-between mt-3 text-[9px] text-sr-dim font-medium">
              <span>{t('hero.wallets_blacklisted', { count: assetTotals.usdc.count })}</span>
              <span className="text-blue-400/60">{assetTotals.usdc.count > 0 && assetTotals.usdc.frozen === 0 ? t('hero.balances_drained') : ''}</span>
            </div>
          </div>

          {/* USDT */}
          <div className="border border-emerald-500/20 rounded-sm p-6 bg-sr-surface relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <span className="text-[9px] text-emerald-400 font-bold tracking-[0.2em] uppercase">{t('hero.usdt_frozen')}</span>
            <div className="text-2xl md:text-3xl font-extrabold mt-2 text-emerald-400">
              {loading ? '...' : (
                <Counter value={assetTotals.usdt.frozen} formatter={fmtUsd} />
              )}
            </div>
            <div className="flex items-center justify-between mt-3 text-[9px] text-sr-dim font-medium">
              <span>{t('hero.wallets_blacklisted', { count: assetTotals.usdt.count })}</span>
              <span>{t('hero.eth_tron')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sync meta */}
      {stats?.last_sync && (
        <div className="mt-6 flex items-center gap-3 text-[9px] text-sr-dim font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sr-green animate-pulse" />
            {t('hero.last_scan', { time: timeAgo(stats.last_sync) })}
          </span>
          {stats.earliest_date && (
            <>
              <span className="text-sr-border">|</span>
              <span>{t('hero.tracking_since', { date: new Date(stats.earliest_date).toLocaleDateString() })}</span>
            </>
          )}
          <span className="text-sr-border">|</span>
          <span>{t('hero.addresses_count', { count: stats.total_records })}</span>
        </div>
      )}
    </section>
  );
}
