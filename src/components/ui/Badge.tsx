interface BadgeProps {
  type: 'chain' | 'asset';
  value: string;
}

const COLORS: Record<string, string> = {
  ETH: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  TRON: 'bg-red-500/10 text-red-400 border-red-500/20',
  USDT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  USDC: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export function Badge({ value }: BadgeProps) {
  const color = COLORS[value] || 'bg-sr-dim/10 text-sr-dim border-sr-border';
  return (
    <span className={`px-1.5 py-0.5 text-[9px] font-bold tracking-tight border rounded-sm ${color}`}>
      {value}
    </span>
  );
}
