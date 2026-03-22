import { SEO } from '../components/SEO';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function Blacklist() {
  return (
    <div className="flex flex-col items-center min-h-screen font-mono antialiased text-current">
      <SEO
        title="Understanding Stablecoin Blacklists — stables.rip"
        description="How USDC and USDT freeze functions work technically. Learn about Circle and Tether's blacklist smart contract mechanisms."
        path="/blacklist"
      />
      <div className="scanlines" />
      <div className="vignette" />
      <Header />

      <main className="w-full max-w-3xl px-4 md:px-6 pb-12 relative z-10 space-y-12">
        <div className="mt-4">
          <h1 className="font-display text-2xl md:text-3xl font-black mb-2">
            Understanding Stablecoin Blacklists
          </h1>
          <p className="text-xs text-sr-dim max-w-lg leading-relaxed mb-8">
            How USDC and USDT freeze functions work, and what it means for your funds.
          </p>
        </div>

        {/* USDC Section */}
        <section className="border border-sr-border rounded-sm bg-sr-surface p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-sm">USDC</span>
            <span className="font-display text-lg font-bold">Circle's Blacklist</span>
          </div>
          <div className="space-y-4 text-[12px] text-sr-dim leading-relaxed">
            <p>
              Circle, the issuer of USDC, maintains a blacklist function in the USDC smart contract on Ethereum (and all other chains). The <code className="text-sr-info bg-sr-base px-1 py-0.5 rounded text-[11px]">blacklist(address)</code> function can be called by Circle's designated blacklister address.
            </p>
            <p>
              Once an address is blacklisted, all USDC transfers to and from that address will revert. The tokens remain at the address but are completely non-transferable. Circle has used this power to comply with OFAC sanctions, law enforcement requests, and their own risk policies.
            </p>
            <p>
              Circle publishes a compliance transparency page, but the actual freeze decisions are made internally. There is no public appeal process for blacklisted addresses.
            </p>
          </div>
        </section>

        {/* USDT Section */}
        <section className="border border-sr-border rounded-sm bg-sr-surface p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-sm">USDT</span>
            <span className="font-display text-lg font-bold">Tether's Blacklist</span>
          </div>
          <div className="space-y-4 text-[12px] text-sr-dim leading-relaxed">
            <p>
              Tether's USDT contract on Ethereum includes <code className="text-sr-info bg-sr-base px-1 py-0.5 rounded text-[11px]">addBlackList(address)</code> and <code className="text-sr-info bg-sr-base px-1 py-0.5 rounded text-[11px]">destroyBlackFunds(address)</code> functions. Unlike USDC, Tether can not only freeze but also <strong className="text-current">destroy</strong> the tokens at a blacklisted address.
            </p>
            <p>
              On TRON, USDT uses the same <code className="text-sr-info bg-sr-base px-1 py-0.5 rounded text-[11px]">AddedBlackList</code> mechanism. TRON accounts for a significant portion of USDT blacklistings due to its high usage in peer-to-peer transfers.
            </p>
            <p>
              Tether has historically been more aggressive with freezes than Circle. They have cooperated with law enforcement agencies globally and have frozen addresses based on DOJ requests, Interpol notices, and OFAC designations.
            </p>
          </div>
        </section>

        {/* Technical */}
        <section className="border border-sr-border rounded-sm bg-sr-surface p-6 md:p-8">
          <h2 className="font-display text-lg font-bold mb-4">How Freezing Works Technically</h2>
          <div className="space-y-4 text-[12px] text-sr-dim leading-relaxed">
            <p>
              Stablecoin contracts implement a modifier (often called <code className="text-sr-info bg-sr-base px-1 py-0.5 rounded text-[11px]">notBlacklisted</code>) on the <code className="text-sr-info bg-sr-base px-1 py-0.5 rounded text-[11px]">transfer()</code> and <code className="text-sr-info bg-sr-base px-1 py-0.5 rounded text-[11px]">transferFrom()</code> functions. This modifier checks a mapping of blacklisted addresses before allowing any transfer.
            </p>
            <p>
              When you call <code className="text-sr-info bg-sr-base px-1 py-0.5 rounded text-[11px]">transfer()</code> on USDC or USDT, the contract checks if either the sender or receiver is blacklisted. If either is, the transaction reverts. This means:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You cannot send frozen tokens to any address</li>
              <li>No one can send tokens to a frozen address</li>
              <li>DeFi protocols cannot interact with frozen tokens</li>
              <li>The tokens cannot be approved for third-party spending</li>
            </ul>
            <p>
              The freeze is enforced at the protocol level. No wallet, DEX, or bridge can circumvent it. The only way to unfreeze is for the issuer to call the unblacklist function.
            </p>
          </div>
        </section>

        {/* Why it matters */}
        <section className="border border-sr-danger/20 rounded-sm bg-sr-danger/5 p-6 md:p-8">
          <h2 className="font-display text-lg font-bold mb-4 text-sr-danger">Why This Matters</h2>
          <div className="space-y-4 text-[12px] text-sr-dim leading-relaxed">
            <p>
              Stablecoins represent over $150 billion in market cap. They are the backbone of DeFi, cross-border payments, and crypto trading. Yet they carry a fundamental centralization risk that is often overlooked.
            </p>
            <p>
              The freeze function means that <strong className="text-current">your stablecoins are only yours as long as the issuer permits it</strong>. This is not a theoretical risk — thousands of addresses have been frozen, with billions of dollars locked.
            </p>
            <p>
              stables.rip exists to make this reality visible. Every freeze is a data point in the ongoing story of financial censorship. Transparency is the first step toward accountability.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
