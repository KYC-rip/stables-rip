import type { BanStats, BanRecord } from '../types';

interface QuickFactsProps {
  stats: BanStats | null;
  topWallets: BanRecord[];
}

export function QuickFacts({ stats, topWallets }: QuickFactsProps) {
  if (!stats) return null;

  // Largest single freeze = first in topWallets (already sorted by balance DESC)
  const largestFreeze = topWallets.length > 0 ? parseFloat(topWallets[0].frozen_balance || '0') : 0;

  // Most targeted chain
  const dist = stats.distribution || {};
  const topChain = Object.entries(dist).sort(([, a], [, b]) => b - a)[0];

  // Most targeted asset
  const assetCounts: Record<string, number> = {};
  for (const row of stats.breakdown || []) {
    assetCounts[row.asset] = (assetCounts[row.asset] || 0) + row.total_count;
  }
  const topAsset = Object.entries(assetCounts).sort(([, a], [, b]) => b - a)[0];

  const facts = [
    {
      label: 'Tracking Since',
      value: stats.earliest_date ? new Date(stats.earliest_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—',
    },
    {
      label: 'Total $ Frozen',
      value: stats.total_frozen >= 1e9
        ? `$${(stats.total_frozen / 1e9).toFixed(2)}B`
        : `$${(stats.total_frozen / 1e6).toFixed(0)}M`,
    },
    {
      label: 'Addresses Blacklisted',
      value: stats.total_records.toLocaleString(),
    },
    {
      label: 'Largest Single Freeze',
      value: largestFreeze >= 1e6
        ? `$${(largestFreeze / 1e6).toFixed(1)}M`
        : `$${largestFreeze.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    },
    {
      label: 'Most Targeted Chain',
      value: topChain ? `${topChain[0]} (${topChain[1]})` : '—',
    },
    {
      label: 'Most Targeted Asset',
      value: topAsset ? `${topAsset[0]} (${topAsset[1]})` : '—',
    },
  ];

  return (
    <section>
      <h2 className="text-sm font-bold text-sr-dim uppercase tracking-wider mb-4">Quick Facts</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {facts.map((f) => (
          <div key={f.label} className="border border-sr-border rounded-sm p-4 bg-sr-surface">
            <span className="text-[9px] text-sr-dim uppercase tracking-wider font-medium block mb-1">{f.label}</span>
            <span className="text-sm font-bold">{f.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
