import { SEO } from '../components/SEO';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FrozenSupplyChart } from '../components/FrozenSupplyChart';
import { useBanData } from '../hooks/useBanData';

export default function StatsPage() {
  const { stats, loading, chartData, monthlyData } = useBanData();

  // Per-chain from breakdown
  const chainStats: [string, { count: number; volume: number }][] = [];
  const assetStats: [string, { count: number; volume: number; chains: string[] }][] = [];

  if (stats?.breakdown) {
    const chains: Record<string, { count: number; volume: number }> = {};
    const assets: Record<string, { count: number; volume: number; chains: Set<string> }> = {};

    for (const row of stats.breakdown) {
      // chains
      if (!chains[row.chain]) chains[row.chain] = { count: 0, volume: 0 };
      chains[row.chain].count += row.total_count;
      chains[row.chain].volume += row.total_frozen;
      // assets
      if (!assets[row.asset]) assets[row.asset] = { count: 0, volume: 0, chains: new Set() };
      assets[row.asset].count += row.total_count;
      assets[row.asset].volume += row.total_frozen;
      assets[row.asset].chains.add(row.chain);
    }

    chainStats.push(...Object.entries(chains).sort(([, a], [, b]) => b.volume - a.volume));
    assetStats.push(
      ...Object.entries(assets)
        .sort(([, a], [, b]) => b.volume - a.volume)
        .map(([k, v]) => [k, { count: v.count, volume: v.volume, chains: Array.from(v.chains) }] as [string, { count: number; volume: number; chains: string[] }])
    );
  }

  const fmtUsd = (v: number) => {
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
    return `$${v.toFixed(0)}`;
  };

  const maxMonthlyCount = Math.max(...monthlyData.map(d => d.count), 1);

  return (
    <div className="flex flex-col items-center min-h-screen font-mono antialiased text-current">
      <SEO
        title="Statistics — stables.rip"
        description="Stablecoin freeze statistics: monthly trends, per-chain breakdown, and cumulative frozen supply over time."
        path="/stats"
      />
      <div className="scanlines" />
      <div className="vignette" />
      <Header />

      <main className="w-full max-w-6xl px-4 md:px-6 pb-12 space-y-12 relative z-10">
        <div className="mt-4">
          <h1 className="font-display text-2xl md:text-3xl font-black mb-2">
            Freeze Statistics
          </h1>
          <p className="text-xs text-sr-dim max-w-lg leading-relaxed">
            Breakdown of stablecoin censorship activity across chains, assets, and time.
          </p>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border border-sr-border rounded-sm p-4 bg-sr-surface">
            <span className="text-[9px] text-sr-dim uppercase tracking-wider font-medium block mb-1">Total Frozen</span>
            <span className="font-display text-lg font-bold text-sr-danger">{loading ? '...' : fmtUsd(stats?.total_frozen || 0)}</span>
          </div>
          <div className="border border-sr-border rounded-sm p-4 bg-sr-surface">
            <span className="text-[9px] text-sr-dim uppercase tracking-wider font-medium block mb-1">Addresses</span>
            <span className="font-display text-lg font-bold">{loading ? '...' : (stats?.total_records || 0).toLocaleString()}</span>
          </div>
          <div className="border border-sr-border rounded-sm p-4 bg-sr-surface">
            <span className="text-[9px] text-sr-dim uppercase tracking-wider font-medium block mb-1">Chains Monitored</span>
            <span className="font-display text-lg font-bold">{chainStats.length || '—'}</span>
          </div>
          <div className="border border-sr-border rounded-sm p-4 bg-sr-surface">
            <span className="text-[9px] text-sr-dim uppercase tracking-wider font-medium block mb-1">Assets Tracked</span>
            <span className="font-display text-lg font-bold">{assetStats.length || '—'}</span>
          </div>
        </div>

        {/* Chart */}
        <FrozenSupplyChart data={chartData} loading={loading} />

        {/* Per-asset breakdown */}
        <section>
          <h2 className="text-sm font-bold text-sr-dim uppercase tracking-wider mb-4">By Asset</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assetStats.map(([asset, data]) => (
              <div key={asset} className="border border-sr-border rounded-sm p-5 bg-sr-surface">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${asset === 'USDT' ? 'text-emerald-400' : 'text-blue-400'}`}>{asset}</span>
                  <span className="text-[9px] text-sr-dim">{data.chains.join(', ')}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] text-sr-dim uppercase block mb-0.5">Volume Frozen</span>
                    <span className="text-sm font-bold">{fmtUsd(data.volume)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-sr-dim uppercase block mb-0.5">Addresses</span>
                    <span className="text-sm font-bold">{data.count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Per-chain breakdown */}
        <section>
          <h2 className="text-sm font-bold text-sr-dim uppercase tracking-wider mb-4">By Chain</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chainStats.map(([chain, data]) => (
              <div key={chain} className="border border-sr-border rounded-sm p-5 bg-sr-surface">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${chain === 'ETH' ? 'text-blue-400' : 'text-red-400'}`}>{chain}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] text-sr-dim uppercase block mb-0.5">Volume Frozen</span>
                    <span className="text-sm font-bold">{fmtUsd(data.volume)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-sr-dim uppercase block mb-0.5">Addresses</span>
                    <span className="text-sm font-bold">{data.count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly breakdown */}
        <section>
          <h2 className="text-sm font-bold text-sr-dim uppercase tracking-wider mb-4">Monthly Freeze Activity</h2>
          <div className="border border-sr-border rounded-sm overflow-hidden">
            <div className="grid grid-cols-[6rem_1fr_6rem] gap-2 px-4 py-2 bg-sr-base text-[9px] text-sr-dim uppercase font-bold tracking-wider border-b border-sr-border">
              <span>Month</span>
              <span>Addresses Frozen</span>
              <span className="text-right">Volume</span>
            </div>
            {monthlyData.map((d) => (
              <div
                key={d.month}
                className="grid grid-cols-[6rem_1fr_6rem] gap-2 px-4 py-2.5 bg-sr-surface border-b border-sr-border/30 items-center"
              >
                <span className="text-xs font-medium">{d.month}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 bg-sr-danger/30 rounded-sm"
                    style={{ width: `${Math.min(100, (d.count / maxMonthlyCount) * 100)}%` }}
                  />
                  <span className="text-[10px] text-sr-dim">{d.count}</span>
                </div>
                <span className="text-xs font-bold text-right">{fmtUsd(d.volume)}</span>
              </div>
            ))}
            {monthlyData.length === 0 && (
              <div className="px-4 py-8 text-center text-sr-dim text-xs">
                {loading ? 'Loading...' : 'No data yet'}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
