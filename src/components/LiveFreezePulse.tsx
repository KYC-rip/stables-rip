import { useEffect, useState } from 'react';
import { api } from '../services/client';

interface RealtimeResponse {
  ok: boolean;
  latest_significant: {
    address: string;
    asset: string;
    chain: string;
    frozen_usd: number;
    banned_at: string;
    tx_hash: string;
    seconds_ago: number | null;
  } | null;
  window_1h: { total_usd: number; count: number };
  window_24h: { total_usd: number; count: number };
}

function fmtUsd(v: number) {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtAgo(sec: number | null | undefined) {
  if (sec == null || sec < 0) return null;
  if (sec < 60) return `${sec}s ago`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function LiveFreezePulse() {
  const [data, setData] = useState<RealtimeResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const d = await api<RealtimeResponse>('/v1/tools/ban-list/realtime');
        if (!cancelled) setData(d);
      } catch {}
    };
    load();
    const i = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(i); };
  }, []);

  if (!data?.ok) return null;
  const { window_24h, window_1h, latest_significant } = data;
  if (window_24h.total_usd < 100000) return null;

  const hot = window_1h.total_usd >= 1_000_000;

  return (
    <div className={`mt-8 border rounded-sm px-5 py-4 bg-sr-surface max-w-2xl w-full ${hot ? 'border-sr-danger/50' : 'border-sr-border'}`}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${hot ? 'bg-sr-danger animate-pulse' : 'bg-sr-green animate-pulse'}`} />
          <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${hot ? 'text-sr-danger' : 'text-sr-dim'}`}>
            {hot ? 'Freeze wave · last 1h' : 'Last 24h'}
          </span>
        </div>
        <span className="text-[9px] text-sr-dim">Updates every 30s</span>
      </div>

      <div className="flex items-baseline gap-4 mt-3 flex-wrap">
        <div className="text-2xl md:text-3xl font-black text-sr-danger tabular-nums">
          {fmtUsd(hot ? window_1h.total_usd : window_24h.total_usd)}
        </div>
        <div className="text-[11px] text-sr-dim">
          across {hot ? window_1h.count : window_24h.count} wallets
        </div>
      </div>

      {latest_significant && (
        <div className="mt-3 pt-3 border-t border-sr-border/50 flex items-center justify-between gap-3 flex-wrap text-[11px]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sr-dim/70">Latest:</span>
            <span className="font-bold text-sr-danger tabular-nums">
              {fmtUsd(latest_significant.frozen_usd)}
            </span>
            <span className="text-sr-dim">·</span>
            <span className="text-sr-dim">{latest_significant.chain} {latest_significant.asset}</span>
          </div>
          <div className="text-sr-dim font-medium tabular-nums">
            {fmtAgo(latest_significant.seconds_ago)}
          </div>
        </div>
      )}
    </div>
  );
}
