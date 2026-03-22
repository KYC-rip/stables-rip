import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/client';
import type { BanRecord, BanStats } from '../types';

interface TopResponse { ok: boolean; data: BanRecord[] }
interface LatestResponse { ok: boolean; data: BanRecord[] }
interface ChartResponse { ok: boolean; data: { time: string; value: number; daily: number; count: number }[] }
interface MonthlyResponse { ok: boolean; data: { month: string; count: number; volume: number }[] }
interface BanListResponse { ok: boolean; data: BanRecord[]; stats: BanStats; meta: { limit: number; offset: number } }

export function useBanData() {
  const [stats, setStats] = useState<BanStats | null>(null);
  const [latestFreezes, setLatestFreezes] = useState<BanRecord[]>([]);
  const [topWallets, setTopWallets] = useState<BanRecord[]>([]);
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; count: number; volume: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<BanRecord[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        // Parallel fetch all aggregated endpoints
        const [statsRes, latestRes, topRes, chartRes, monthlyRes] = await Promise.all([
          api<BanListResponse>('/v1/tools/ban-list?limit=1&offset=0'),
          api<LatestResponse>('/v1/tools/ban-list/latest?limit=15'),
          api<TopResponse>('/v1/tools/ban-list/top?limit=30'),
          api<ChartResponse>('/v1/tools/ban-list/chart'),
          api<MonthlyResponse>('/v1/tools/ban-list/monthly'),
        ]);

        if (cancelled) return;

        if (statsRes.ok) setStats(statsRes.stats);
        if (latestRes.ok) setLatestFreezes(latestRes.data);
        if (topRes.ok) setTopWallets(topRes.data);
        if (chartRes.ok) setChartData(chartRes.data);
        if (monthlyRes.ok) setMonthlyData(monthlyRes.data);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const searchAddress = useCallback(async (addr: string) => {
    if (!addr.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const res = await api<BanListResponse>(`/v1/tools/ban-list?address=${encodeURIComponent(addr)}&limit=20`);
      setSearchResults(res.ok ? res.data : []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => setSearchResults(null), []);

  // Per-asset totals from breakdown
  const assetTotals = useMemo(() => {
    const result = { usdt: { frozen: 0, count: 0 }, usdc: { frozen: 0, count: 0 } };
    if (!stats?.breakdown) return result;
    for (const row of stats.breakdown) {
      const key = row.asset === 'USDT' ? 'usdt' : 'usdc';
      result[key].frozen += row.total_frozen || 0;
      result[key].count += row.total_count || 0;
    }
    return result;
  }, [stats]);

  return {
    stats, loading, error,
    searchResults, searching, searchAddress, clearSearch,
    latestFreezes, topWallets, chartData, monthlyData, assetTotals,
  };
}
