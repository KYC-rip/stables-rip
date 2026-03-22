import { Lock, Gavel, TrendingUp, Shield } from 'lucide-react';

interface ExplainerProps {
  totalFrozen: number;
}

const cards = [
  {
    icon: Lock,
    title: 'What is a stablecoin freeze?',
    body: 'Stablecoin issuers like Circle (USDC) and Tether (USDT) hold master keys to their smart contracts. A single function call can blacklist any address, permanently freezing all tokens held there.',
  },
  {
    icon: Gavel,
    title: 'Who gets blacklisted?',
    body: 'OFAC-sanctioned entities, law enforcement requests, "suspicious activity" flags, and sometimes by mistake. The process is opaque — there is no public appeal mechanism.',
  },
  {
    icon: TrendingUp,
    title: 'The scale of the problem',
    body: null, // dynamic
  },
  {
    icon: Shield,
    title: 'What can you do?',
    body: 'Privacy-preserving cryptocurrencies like Monero (XMR) have no freeze function, no blacklist, and no central issuer. Your keys, your coins — for real.',
  },
];

export function Explainer({ totalFrozen }: ExplainerProps) {
  const fmtTotal = totalFrozen >= 1e9
    ? `$${(totalFrozen / 1e9).toFixed(1)}B`
    : `$${(totalFrozen / 1e6).toFixed(0)}M`;

  return (
    <section>
      <h2 className="font-display text-xl md:text-2xl font-extrabold mb-2">
        Stablecoins come with a{' '}
        <span className="text-sr-danger">kill switch</span>.
      </h2>
      <p className="text-xs text-sr-dim mb-8 max-w-lg leading-relaxed">
        Unlike ETH or BTC, stablecoins are issued by private companies who retain privileged access
        to their smart contracts. Any wallet holding USDC or USDT is subject to this power.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const body = card.body || `Over ${fmtTotal} has been frozen across Ethereum and TRON. Every address on this page was neutralized by a centralized entity with a single transaction.`;
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
                  <p className="text-[11px] text-sr-dim leading-relaxed">{body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
