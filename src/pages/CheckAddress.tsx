import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ShieldCheck, ShieldAlert, ExternalLink, Copy, Check, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/client';
import type { BanRecord } from '../types';

interface BanListResponse {
  ok: boolean;
  data: BanRecord[];
  total?: number;
}

function txExplorerUrl(chain: string, txHash: string): string {
  if (chain === 'TRON') return `https://tronscan.org/#/transaction/${txHash}`;
  return `https://etherscan.io/tx/${txHash}`;
}

function addrExplorerUrl(chain: string, address: string): string {
  if (chain === 'TRON') return `https://tronscan.org/#/address/${address}`;
  return `https://etherscan.io/address/${address}`;
}

function issuerInfo(asset: 'USDC' | 'USDT'): { name: string; site: string; blacklist_doc: string } {
  if (asset === 'USDC')
    return {
      name: 'Circle Internet Financial',
      site: 'https://www.circle.com/',
      blacklist_doc: 'https://www.circle.com/blog/sanctions',
    };
  return {
    name: 'Tether Operations Ltd',
    site: 'https://tether.to/',
    blacklist_doc: 'https://tether.to/en/legal',
  };
}

function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const ms = Date.now() - t;
  const d = Math.floor(ms / 86_400_000);
  if (d > 365) return `${Math.floor(d / 365)}y ago`;
  if (d > 30) return `${Math.floor(d / 30)}mo ago`;
  if (d > 0) return `${d}d ago`;
  const h = Math.floor(ms / 3_600_000);
  if (h > 0) return `${h}h ago`;
  const m = Math.floor(ms / 60_000);
  return `${Math.max(1, m)}m ago`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-sr-dim hover:text-sr-info transition-colors"
      title="Copy"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

function ResultRow({ r }: { r: BanRecord }) {
  const issuer = issuerInfo(r.asset);
  const balance = parseFloat(r.frozen_balance || '0');
  const isDrained = balance === 0;

  return (
    <div className="border border-sr-danger/30 rounded-sm bg-sr-danger/5 p-4 space-y-4">
      {/* Header — chain + asset + status */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-sr-danger/10">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-sr-danger" />
          <span className="text-sm font-bold text-sr-danger uppercase tracking-wider">
            Blacklisted
          </span>
          <Badge type="chain" value={r.chain} />
          <Badge type="asset" value={r.asset} />
        </div>
        <span className="text-[10px] text-sr-dim">
          {new Date(r.banned_at).toUTCString()}  ·  {relativeTime(r.banned_at)}
        </span>
      </div>

      {/* Grid of facts */}
      <dl className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-y-2 gap-x-4 text-[11px]">
        <dt className="text-sr-dim uppercase tracking-wider">Address</dt>
        <dd className="flex items-center gap-2 flex-wrap">
          <code className="font-mono break-all text-sr-info">{r.address}</code>
          <CopyButton text={r.address} />
          <a
            href={addrExplorerUrl(r.chain, r.address)}
            target="_blank"
            rel="noreferrer"
            className="text-sr-dim hover:text-sr-info inline-flex items-center gap-1"
            title="View address on explorer"
          >
            <ExternalLink size={11} /> address
          </a>
        </dd>

        <dt className="text-sr-dim uppercase tracking-wider">Frozen balance</dt>
        <dd className={`font-bold ${isDrained ? 'text-sr-dim' : 'text-sr-danger'}`}>
          {isDrained ? (
            <span>0.00 {r.asset} <span className="text-sr-dim font-normal">(drained / never funded post-blacklist)</span></span>
          ) : (
            <>
              ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
              <span className="text-sr-dim font-normal">{r.asset}</span>
            </>
          )}
        </dd>

        <dt className="text-sr-dim uppercase tracking-wider">Banned at</dt>
        <dd>
          <span className="font-mono">{r.banned_at}</span>
          <span className="text-sr-dim ml-2">({relativeTime(r.banned_at)})</span>
        </dd>

        <dt className="text-sr-dim uppercase tracking-wider">Freeze TX</dt>
        <dd className="flex items-center gap-2 flex-wrap">
          <code className="font-mono break-all text-sr-info">{r.tx_hash}</code>
          <CopyButton text={r.tx_hash} />
          <a
            href={txExplorerUrl(r.chain, r.tx_hash)}
            target="_blank"
            rel="noreferrer"
            className="text-sr-dim hover:text-sr-info inline-flex items-center gap-1"
            title="View transaction on explorer"
          >
            <ExternalLink size={11} /> tx
          </a>
        </dd>

        <dt className="text-sr-dim uppercase tracking-wider">Issuer</dt>
        <dd>
          <a
            href={issuer.site}
            target="_blank"
            rel="noreferrer"
            className="hover:text-sr-info"
          >
            {issuer.name}
          </a>
          {' · '}
          <a
            href={issuer.blacklist_doc}
            target="_blank"
            rel="noreferrer"
            className="text-sr-dim hover:text-sr-info inline-flex items-center gap-1"
          >
            <ExternalLink size={10} /> blacklist policy
          </a>
        </dd>

        <dt className="text-sr-dim uppercase tracking-wider">Recovery</dt>
        <dd className="text-sr-dim">
          {r.asset === 'USDC' ? (
            <>Email <code className="text-sr-info">compliance@circle.com</code> with proof of ownership + use case. Outcome depends on Circle's policy review.</>
          ) : (
            <>Email <code className="text-sr-info">compliance@tether.to</code> with proof of ownership. Tether historically unblocks fewer addresses than Circle.</>
          )}
        </dd>
      </dl>
    </div>
  );
}

// Affiliate cross-sell: when a freeze is detected, surface a contextual
// CTA pointing the user at kyc.rip/swap with the right pair prefilled.
// Captures moment-of-need (frozen address → wants to exit to XMR / BTC).
// The /go redirect could be added later for click tracking; for now it
// goes direct to the swap with pair + amount pre-filled.
function ExitCta({ asset, chain, balance }: { asset: 'USDT' | 'USDC'; chain: string; balance: number }) {
  const network = chain === 'TRON' ? 'TRC20' : 'ERC20';
  const amount = balance > 0 ? Math.min(Math.floor(balance), 100000) : 1000;
  const swapUrl = `https://kyc.rip/swap?from=${asset.toLowerCase()}&from_network=${network}&to=xmr&to_network=Mainnet&amount=${amount}`;
  return (
    <div className="border border-sr-info/30 rounded-sm bg-sr-info/5 p-4 space-y-2">
      <div className="text-xs font-bold text-sr-info uppercase tracking-wider">
        Exit strategy
      </div>
      <p className="text-[11px] text-sr-dim">
        A frozen address means you can't move the {asset} from it directly. For{' '}
        <strong className="text-sr-info">future</strong> {asset} you receive, the privacy-respecting
        exit is to swap into native XMR (or BTC) immediately on arrival — that way nothing sits in
        a freezable wallet long enough to get caught.
      </p>
      <a
        href={swapUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sr-info/10 hover:bg-sr-info/20 border border-sr-info/30 text-sr-info text-[11px] uppercase tracking-wider font-bold transition-colors rounded-sm"
      >
        Swap {asset} → XMR on kyc.rip <ExternalLink size={11} />
      </a>
    </div>
  );
}

function NoFreezeResult({ query }: { query: string }) {
  return (
    <div className="border border-sr-green/30 rounded-sm bg-sr-green/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-sr-green" />
        <span className="text-sm font-bold text-sr-green uppercase tracking-wider">No freeze detected</span>
      </div>
      <p className="text-[11px] text-sr-dim">
        <code className="text-sr-info break-all">{query}</code> is not on either the USDC (Circle) or USDT (Tether) blacklist as of our most recent sync.
      </p>
      <p className="text-[10px] text-sr-dim">
        Coverage: Ethereum mainnet (USDT + USDC), TRON (USDT). Other chains are not yet indexed. Address lookup is case-insensitive.
      </p>
    </div>
  );
}

export default function CheckAddress() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  // Accept both ?q= and ?address= (?q= matches the rest-of-site convention,
  // ?address= matches the API field name — both feel natural to share).
  const initialQuery = params.get('q') ?? params.get('address') ?? '';
  const [input, setInput] = useState(initialQuery);
  const [results, setResults] = useState<BanRecord[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async (q: string) => {
    setSearching(true);
    setError(null);
    setResults(null);
    try {
      const j = await api<BanListResponse>(`/v1/tools/ban-list?address=${encodeURIComponent(q)}&limit=20`);
      setResults(j.data ?? []);
    } catch (e) {
      setError(String((e as Error).message));
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Auto-search on mount or query-param change
  useEffect(() => {
    if (initialQuery && initialQuery !== '') {
      setInput(initialQuery);
      runSearch(initialQuery);
    }
  }, [initialQuery, runSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setParams({ q }, { replace: false });
    runSearch(q);
  };

  const sharedQuery = params.get('q') ?? params.get('address') ?? '';
  const canShareUrl = sharedQuery && results !== null;

  return (
    <div className="flex flex-col items-center min-h-screen font-mono antialiased text-current">
      <SEO
        title={sharedQuery ? `${sharedQuery} · USDC/USDT blacklist check · stables.rip` : 'Check address · stables.rip'}
        description={sharedQuery ? `USDC/USDT blacklist status for ${sharedQuery}. Lookup powered by stables.rip's on-chain freeze tracker.` : 'Check any Ethereum or TRON address against the full USDC and USDT blacklist. Shareable result URLs, transaction-level detail.'}
        path={`/check${sharedQuery ? `?q=${encodeURIComponent(sharedQuery)}` : ''}`}
      />
      <div className="scanlines" />
      <div className="vignette" />
      <Header />

      <main className="w-full max-w-3xl px-4 md:px-6 pb-12 relative z-10 space-y-6">
        <div className="mt-4">
          <h1 className="font-display text-2xl md:text-3xl font-black mb-2">
            Check a wallet address
          </h1>
          <p className="text-xs text-sr-dim max-w-lg leading-relaxed">
            Look up any Ethereum or TRON address against the full USDC + USDT blacklist. Results
            include the freeze transaction, current frozen balance, issuer policy, and the recovery
            email if you need to dispute. Share via the page URL.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="0x… or T… address"
            className="w-full bg-sr-base border border-sr-border p-4 pl-11 pr-32 text-xs placeholder:text-sr-dim/30 focus:outline-none focus:border-sr-danger transition-colors rounded-sm"
          />
          <Search className="absolute left-4 top-4 text-sr-dim" size={16} />
          <button
            type="submit"
            disabled={searching || !input.trim()}
            className="absolute right-2 top-2 px-3 py-2 bg-sr-danger/20 text-sr-danger text-[11px] uppercase tracking-wider font-bold rounded-sm hover:bg-sr-danger/30 disabled:opacity-50"
          >
            {searching ? 'Checking…' : 'Check'}
          </button>
        </form>

        {canShareUrl && (
          <div className="flex items-center gap-2 text-[10px] text-sr-dim">
            <Share2 size={11} />
            Shareable URL:
            <code className="text-sr-info break-all">
              {typeof window !== 'undefined' ? window.location.href : ''}
            </code>
            <CopyButton text={typeof window !== 'undefined' ? window.location.href : ''} />
          </div>
        )}

        {error && (
          <div className="border border-sr-danger/30 bg-sr-danger/5 text-sr-danger p-3 rounded-sm text-xs">
            {error}
          </div>
        )}

        {searching && (
          <div className="text-center text-[10px] text-sr-dim animate-pulse uppercase tracking-widest font-bold py-8">
            Scanning USDC + USDT blacklists across Ethereum + TRON…
          </div>
        )}

        {!searching && results !== null && (
          <div className="space-y-4">
            {results.length === 0 ? (
              <NoFreezeResult query={sharedQuery || input} />
            ) : (
              <>
                <div className="text-[10px] text-sr-dim uppercase tracking-widest font-bold">
                  {results.length === 1
                    ? '1 freeze record found'
                    : `${results.length} freeze records found`}
                </div>
                {results.map((r) => (
                  <ResultRow key={`${r.id}-${r.chain}`} r={r} />
                ))}
                {/* Affiliate cross-sell — only on first matching result */}
                <ExitCta
                  asset={results[0].asset}
                  chain={results[0].chain}
                  balance={parseFloat(results[0].frozen_balance || '0')}
                />
              </>
            )}
          </div>
        )}

        {!searching && results === null && !error && (
          <div className="text-center text-[10px] text-sr-dim py-12">
            Enter an address above and hit Check.
          </div>
        )}

        {/* Reference / sharing footer */}
        <div className="border-t border-sr-border pt-6 text-[10px] text-sr-dim space-y-2">
          <p>
            <strong className="text-sr-info">Shareable URL formats:</strong>{' '}
            <code className="text-sr-info">/check?q=&lt;address&gt;</code> or{' '}
            <code className="text-sr-info">/check?address=&lt;address&gt;</code> — both work.
          </p>
          <p>
            Address matching is case-insensitive (EIP-55 checksummed input accepted). Lookup hits the public{' '}
            <code className="text-sr-info">/v1/tools/ban-list</code> endpoint; data refreshes every 30 minutes
            from on-chain BlacklistEvents on the USDC/USDT contracts.
          </p>
          <p className="opacity-60">
            {t('wallet_checker.subtitle', { defaultValue: 'Check any Ethereum or TRON address against the full USDC and USDT blacklist instantly.' })}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
