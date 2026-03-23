import { useState, FormEvent } from 'react';
import { Search, ShieldCheck, ShieldAlert, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from './ui/Badge';
import { AddressDisplay } from './ui/AddressDisplay';
import type { BanRecord } from '../types';

interface WalletCheckerProps {
  onSearch: (addr: string) => void;
  onClear: () => void;
  results: BanRecord[] | null;
  searching: boolean;
}

export function WalletChecker({ onSearch, onClear, results, searching }: WalletCheckerProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  };

  const clear = () => {
    setInput('');
    onClear();
  };

  const hasResults = results !== null;
  const isFrozen = hasResults && results.length > 0;

  return (
    <section className="w-full">
      <div className="border border-sr-border rounded-sm p-6 md:p-8 bg-sr-surface">
        <h2 className="font-display text-lg font-bold mb-1">{t('wallet_checker.title')}</h2>
        <p className="text-[11px] text-sr-dim mb-6">
          {t('wallet_checker.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('wallet_checker.placeholder')}
            className="w-full bg-sr-base border border-sr-border p-4 pl-11 pr-10 text-xs placeholder:text-sr-dim/30 focus:outline-none focus:border-sr-danger transition-colors rounded-sm"
          />
          <Search className="absolute left-4 top-4 text-sr-dim" size={16} />
          {input && (
            <button type="button" onClick={clear} className="absolute right-4 top-4 text-sr-dim hover:text-current transition-colors">
              <X size={16} />
            </button>
          )}
        </form>

        {/* Results */}
        {searching && (
          <div className="mt-4 text-center text-[10px] text-sr-dim animate-pulse uppercase tracking-widest font-bold py-4">
            {t('wallet_checker.scanning')}
          </div>
        )}

        {hasResults && !searching && (
          <div className="mt-4">
            {isFrozen ? (
              <div className="border border-sr-danger/30 rounded-sm bg-sr-danger/5 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-sr-danger" />
                  <span className="text-xs font-bold text-sr-danger uppercase tracking-wider">
                    {results.length > 1
                      ? t('wallet_checker.frozen_records_found_plural', { count: results.length })
                      : t('wallet_checker.frozen_records_found', { count: results.length })}
                  </span>
                </div>
                {results.map((r) => (
                  <div key={`${r.id}-${r.chain}`} className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-2 border-t border-sr-danger/10">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge type="chain" value={r.chain} />
                      <Badge type="asset" value={r.asset} />
                      <AddressDisplay address={r.address} chain={r.chain} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${parseFloat(r.frozen_balance || '0') > 0 ? 'text-sr-danger' : 'text-sr-dim'}`}>
                        {parseFloat(r.frozen_balance || '0') > 0
                          ? `$${parseFloat(r.frozen_balance!).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                          : t('wallet_checker.drained')}
                      </span>
                      <span className="text-[9px] text-sr-dim">{new Date(r.banned_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-sr-green/30 rounded-sm bg-sr-green/5 p-4 flex items-center gap-3">
                <ShieldCheck size={18} className="text-sr-green" />
                <div>
                  <span className="text-xs font-bold text-sr-green uppercase tracking-wider">{t('wallet_checker.no_freeze_detected')}</span>
                  <p className="text-[10px] text-sr-dim mt-0.5">{t('wallet_checker.no_freeze_description')}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
