import { useState } from 'react';
import { Badge } from './ui/Badge';
import { AddressDisplay } from './ui/AddressDisplay';
import type { BanRecord } from '../types';

interface TopFrozenWalletsProps {
  records: BanRecord[];
  loading: boolean;
}

export function TopFrozenWallets({ records, loading }: TopFrozenWalletsProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? records : records.slice(0, 10);

  if (loading) {
    return (
      <section>
        <h2 className="text-sm font-bold text-sr-dim uppercase tracking-wider mb-4">Top Frozen Wallets</h2>
        <div className="text-center text-[10px] text-sr-dim animate-pulse uppercase tracking-widest font-bold py-8">
          Loading wallets...
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-sr-dim uppercase tracking-wider">Top Frozen Wallets</h2>
        <span className="text-[9px] text-sr-dim">
          Highest value wallets ever blacklisted
        </span>
      </div>

      <div className="border border-sr-border rounded-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2rem_1fr_4rem_4rem_6rem_5rem] md:grid-cols-[2rem_1fr_4rem_4rem_7rem_6rem] gap-2 px-4 py-2 bg-sr-base text-[9px] text-sr-dim uppercase font-bold tracking-wider border-b border-sr-border">
          <span>#</span>
          <span>Address</span>
          <span>Token</span>
          <span>Chain</span>
          <span className="text-right">Frozen</span>
          <span className="text-right">Date</span>
        </div>

        {/* Table Body */}
        {visible.map((r, i) => {
          const bal = parseFloat(r.frozen_balance || '0');
          return (
            <div
              key={`${r.id}-${r.chain}`}
              className="grid grid-cols-[2rem_1fr_4rem_4rem_6rem_5rem] md:grid-cols-[2rem_1fr_4rem_4rem_7rem_6rem] gap-2 px-4 py-2.5 bg-sr-surface border-b border-sr-border/30 hover:bg-sr-danger/[0.02] transition-colors items-center"
            >
              <span className="text-[10px] text-sr-dim font-mono">{i + 1}</span>
              <AddressDisplay address={r.address} chain={r.chain} />
              <Badge type="asset" value={r.asset} />
              <Badge type="chain" value={r.chain} />
              <span className="text-xs font-bold text-sr-danger text-right tabular-nums">
                ${bal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] text-sr-dim text-right">
                {new Date(r.banned_at).toLocaleDateString()}
              </span>
            </div>
          );
        })}
      </div>

      {records.length > 10 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-3 py-2.5 text-[10px] text-sr-dim font-bold uppercase tracking-widest hover:text-sr-danger transition-colors border border-sr-border/30 rounded-sm"
        >
          Show all {records.length} wallets
        </button>
      )}
    </section>
  );
}
