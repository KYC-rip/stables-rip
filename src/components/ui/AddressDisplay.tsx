import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface AddressDisplayProps {
  address: string;
  chain: string;
  truncate?: boolean;
}

function explorerUrl(chain: string, address: string) {
  if (chain === 'TRON') return `https://tronscan.org/#/address/${address}`;
  return `https://etherscan.io/address/${address}`;
}

export function AddressDisplay({ address, chain, truncate = true }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);
  const display = truncate ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;

  const copy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span className="inline-flex items-center gap-1.5 group">
      <code className="text-[11px] text-sr-info font-medium">{display}</code>
      <button
        onClick={copy}
        className="text-sr-dim hover:text-sr-info transition-colors opacity-0 group-hover:opacity-100"
        title="Copy address"
      >
        {copied ? <Check size={10} /> : <Copy size={10} />}
      </button>
      <a
        href={explorerUrl(chain, address)}
        target="_blank"
        rel="noreferrer"
        className="text-sr-dim hover:text-sr-info transition-colors opacity-0 group-hover:opacity-100"
        title="View on explorer"
      >
        <ExternalLink size={10} />
      </a>
    </span>
  );
}
