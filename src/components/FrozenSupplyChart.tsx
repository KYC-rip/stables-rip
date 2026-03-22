import { useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, AreaSeriesPartialOptions } from 'lightweight-charts';
import { useTheme } from '../hooks/useTheme';

interface FrozenSupplyChartProps {
  data: { time: string; value: number }[];
  loading: boolean;
}

export function FrozenSupplyChart({ data, loading }: FrozenSupplyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const colors = {
      text: theme === 'light' ? '#64748b' : '#475569',
      grid: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(239,68,68,0.04)',
      border: theme === 'light' ? '#e2e8f0' : '#1e293b',
      line: theme === 'light' ? '#dc2626' : '#ef4444',
      areaTop: theme === 'light' ? 'rgba(220,38,38,0.15)' : 'rgba(239,68,68,0.2)',
    };

    const chart = createChart(containerRef.current, {
      layout: {
        textColor: colors.text,
        background: { type: ColorType.Solid, color: 'transparent' },
        fontFamily: "'JetBrains Mono', monospace",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      width: containerRef.current.clientWidth,
      height: 300,
      timeScale: { borderColor: colors.border },
      rightPriceScale: {
        borderColor: colors.border,
        scaleMargins: { top: 0.1, bottom: 0.05 },
      },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: colors.line,
      topColor: colors.areaTop,
      bottomColor: 'rgba(0,0,0,0)',
      lineWidth: 2,
      priceFormat: {
        type: 'custom',
        formatter: (val: number) => {
          if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
          if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
          return `$${val.toLocaleString()}`;
        },
      },
    } as AreaSeriesPartialOptions);

    series.setData(data);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver(entries => {
      if (!containerRef.current || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) chart.applyOptions({ width });
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, theme]);

  if (loading || data.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-bold text-sr-dim uppercase tracking-wider mb-4">Frozen Supply Over Time</h2>
        <div className="border border-sr-border rounded-sm bg-sr-surface h-[300px] flex items-center justify-center text-[10px] text-sr-dim animate-pulse uppercase tracking-widest font-bold">
          {loading ? 'Loading chart...' : 'No data available'}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-sr-dim uppercase tracking-wider">Frozen Supply Over Time</h2>
        <span className="text-[9px] text-sr-dim">
          Cumulative USD value frozen across all stablecoins. Data from Etherscan/TronGrid.
        </span>
      </div>
      <div className="border border-sr-border rounded-sm bg-sr-surface overflow-hidden">
        <div ref={containerRef} />
      </div>
    </section>
  );
}
