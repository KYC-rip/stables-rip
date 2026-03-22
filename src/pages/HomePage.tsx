import { useBanData } from '../hooks/useBanData';
import { SEO } from '../components/SEO';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { WalletChecker } from '../components/WalletChecker';
import { Explainer } from '../components/Explainer';
import { LatestFreezes } from '../components/LatestFreezes';
import { FrozenSupplyChart } from '../components/FrozenSupplyChart';
import { TopFrozenWallets } from '../components/TopFrozenWallets';
import { QuickFacts } from '../components/QuickFacts';

export default function HomePage() {
  const {
    stats, loading, error,
    searchResults, searching, searchAddress, clearSearch,
    latestFreezes, topWallets, chartData, assetTotals,
  } = useBanData();

  if (error) {
    return (
      <div className="flex flex-col items-center min-h-screen font-mono antialiased text-current">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sr-danger text-sm mb-2">Failed to load data</p>
            <p className="text-sr-dim text-xs">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen font-mono antialiased text-current">
      <SEO path="/" />

      {/* VFX */}
      <div className="scanlines" />
      <div className="vignette" />

      <Header />

      <main className="w-full max-w-6xl px-4 md:px-6 pb-12 space-y-16 relative z-10">
        <Hero stats={stats} loading={loading} assetTotals={assetTotals} />
        <WalletChecker
          onSearch={searchAddress}
          onClear={clearSearch}
          results={searchResults}
          searching={searching}
        />
        <Explainer totalFrozen={stats?.total_frozen || 0} />
        <LatestFreezes records={latestFreezes} loading={loading} />
        <FrozenSupplyChart data={chartData} loading={loading} />
        <TopFrozenWallets records={topWallets} loading={loading} />
        <QuickFacts stats={stats} topWallets={topWallets} />
      </main>

      <Footer />
    </div>
  );
}
