export interface BanRecord {
  id: number;
  address: string;
  asset: 'USDT' | 'USDC';
  chain: string;
  tx_hash: string;
  banned_at: string;
  frozen_balance?: string;
  is_active?: number;
}

export interface BreakdownRow {
  total_count: number;
  total_frozen: number;
  earliest_date: string;
  chain: string;
  asset: string;
}

export interface BanStats {
  ok: boolean;
  total_frozen: number;
  total_records: number;
  earliest_date: string | null;
  last_sync: number | null;
  last_blocks: Record<string, string>;
  distribution: Record<string, number>;
  breakdown: BreakdownRow[];
}

export interface BanApiResponse {
  ok: boolean;
  data: BanRecord[];
  stats: BanStats;
  meta: { limit: number; offset: number };
}
