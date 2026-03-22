import { Activity } from 'lucide-react';
import { Counter } from './ui/Counter';
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

function timeAgo(ts: number) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function Hero({ stats, loading, assetTotals }: HeroProps) {
  const total = stats?.total_frozen || 0;

  return (
    <section className="flex flex-col items-center text-center pt-8 md:pt-16 pb-8">
      {/* Tagline */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] text-sr-dim font-bold tracking-[0.3em] uppercase">
          Ethereum & TRON
        </span>
        <span className="text-[10px] text-sr-dim/40">|</span>
        <div className="flex items-center gap-1.5">
          <Activity size={10} className="text-sr-danger animate-pulse" />
          <span className="text-[10px] text-sr-dim font-bold tracking-[0.3em] uppercase">Live Intel</span>
        </div>
      </div>

      <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-2 max-w-3xl">
        The on-chain record of{' '}
        <br className="hidden md:block" />
        stablecoin{' '}
        <span className="text-sr-danger relative">
          censorship
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sr-danger/30" />
        </span>
        .
      </h1>

      <p className="text-xs text-sr-dim max-w-md mt-3 leading-relaxed">
        Every freeze and unfreeze, tracked the moment it happens. No obfuscation. No delay.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-10">
        {/* USDC */}
        <div className="border border-blue-500/20 rounded-sm p-6 bg-sr-surface relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <span className="text-[9px] text-blue-400 font-bold tracking-[0.2em] uppercase">USDC Frozen</span>
          <div className="text-2xl md:text-3xl font-extrabold mt-2 text-blue-400">
            {loading ? '...' : (
              <Counter value={assetTotals.usdc.frozen} formatter={fmtUsd} />
            )}
          </div>
          <div className="flex items-center justify-between mt-3 text-[9px] text-sr-dim font-medium">
            <span>{assetTotals.usdc.count} wallets blacklisted</span>
            <span className="text-blue-400/60">{assetTotals.usdc.count > 0 && assetTotals.usdc.frozen === 0 ? 'Balances drained' : ''}</span>
          </div>
        </div>

        {/* USDT */}
        <div className="border border-emerald-500/20 rounded-sm p-6 bg-sr-surface relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <span className="text-[9px] text-emerald-400 font-bold tracking-[0.2em] uppercase">USDT Frozen</span>
          <div className="text-2xl md:text-3xl font-extrabold mt-2 text-emerald-400">
            {loading ? '...' : (
              <Counter value={assetTotals.usdt.frozen} formatter={fmtUsd} />
            )}
          </div>
          <div className="flex items-center justify-between mt-3 text-[9px] text-sr-dim font-medium">
            <span>{assetTotals.usdt.count} wallets blacklisted</span>
            <span>ETH + TRON</span>
          </div>
        </div>
      </div>

      {/* Total + Meta */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="text-4xl md:text-6xl font-black text-sr-danger drop-shadow-[0_0_20px_rgba(239,68,68,0.2)] dark:drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          {loading ? '...' : (
            <>$<Counter value={total} formatter={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })} /></>
          )}
        </div>
        <span className="text-[10px] text-sr-danger/60 font-bold tracking-[0.4em] uppercase">
          Total Value Frozen
        </span>
      </div>

      {/* Sync meta */}
      {stats?.last_sync && (
        <div className="mt-6 flex items-center gap-3 text-[9px] text-sr-dim font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sr-green animate-pulse" />
            Last scan: {timeAgo(stats.last_sync)}
          </span>
          {stats.earliest_date && (
            <>
              <span className="text-sr-border">|</span>
              <span>Tracking since {new Date(stats.earliest_date).toLocaleDateString()}</span>
            </>
          )}
          <span className="text-sr-border">|</span>
          <span>{stats.total_records} addresses</span>
        </div>
      )}
    </section>
  );
}
