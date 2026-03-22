import { SEO, buildFAQSchema } from '../components/SEO';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'What is stablecoin freezing?',
    a: 'Stablecoin issuers like Circle (USDC) and Tether (USDT) have built-in blacklist functions in their smart contracts. When an address is blacklisted, the tokens at that address become permanently non-transferable. The owner cannot send, swap, or interact with those tokens in any way.',
  },
  {
    q: 'Who can freeze stablecoin wallets?',
    a: 'Only the issuing company can execute a freeze. Circle manages USDC blacklisting, and Tether manages USDT blacklisting. These freezes are typically initiated in response to law enforcement requests, OFAC sanctions compliance, or internal risk assessments. There is no public appeals process.',
  },
  {
    q: 'Can USDC freeze my funds?',
    a: 'Yes. If you hold USDC in any self-custody wallet, Circle can blacklist your address at any time. This applies to Ethereum, TRON, and all other chains where USDC is deployed. The freeze is enforced at the smart contract level — no exchange or wallet app can override it.',
  },
  {
    q: 'Can USDT freeze my funds?',
    a: 'Yes. Tether has blacklisted hundreds of addresses across Ethereum and TRON. Once blacklisted, the USDT at that address is permanently frozen. Tether has frozen over $1 billion in total across all chains.',
  },
  {
    q: 'Is freezing the same as confiscation?',
    a: 'Freezing prevents the address owner from moving the tokens, but the tokens are not destroyed or transferred to anyone else. They remain at the frozen address indefinitely. In some cases, law enforcement may later work with the issuer to move the frozen funds, but this is rare.',
  },
  {
    q: 'How does stables.rip track freeze events?',
    a: 'We monitor on-chain events from the USDC and USDT smart contracts on Ethereum and TRON. When a blacklist event (AddedBlackList, Blacklisted) is emitted, we record the address, transaction hash, timestamp, and current balance. Data is synced every 30 minutes.',
  },
  {
    q: 'Where does the data come from?',
    a: 'Ethereum freeze events are fetched from Etherscan\'s log API, monitoring the official USDT and USDC contract addresses. TRON freeze events come from the TronGrid API, monitoring the AddedBlackList events on the TRON USDT contract. Balances are verified via on-chain multicall queries.',
  },
  {
    q: 'What does "blacklisted" vs "frozen" mean?',
    a: 'They refer to the same thing. "Blacklisted" is the technical term used in the smart contract code. "Frozen" describes the practical effect — the tokens cannot be moved. Some blacklisted addresses show $0 balance because the tokens were moved before the freeze took effect, or were drained through other mechanisms.',
  },
  {
    q: 'Can frozen stablecoins be unfrozen?',
    a: 'Technically yes — the contracts have a removeBlackList / unBlacklist function. In practice, unfreezes are extremely rare. We track both freeze and unfreeze events when they occur.',
  },
  {
    q: 'How can I protect myself from stablecoin freezing?',
    a: 'The only way to fully avoid freeze risk is to not hold freezable stablecoins. Privacy-preserving cryptocurrencies like Monero (XMR) have no blacklist function, no central issuer, and no freeze capability. You can swap stablecoins for XMR without KYC at kyc.rip.',
  },
  {
    q: 'Does this affect stablecoins on exchanges?',
    a: 'When you hold stablecoins on a centralized exchange, the exchange holds the actual tokens in their wallet. If the exchange\'s wallet is frozen (rare but possible), your funds are affected. More commonly, exchanges comply with legal orders independently by freezing your account.',
  },
  {
    q: 'Which chains are monitored?',
    a: 'Currently we monitor Ethereum (ETH) and TRON for both USDT and USDC freeze events. Ethereum is where the majority of USDC freezes occur, while TRON has the most USDT blacklistings. We plan to add Arbitrum, Optimism, and Polygon monitoring in the future.',
  },
  {
    q: 'Is stables.rip affiliated with Circle or Tether?',
    a: 'No. stables.rip is an independent transparency project by the rip.family ecosystem (kyc.rip). We have no affiliation with any stablecoin issuer. All data is sourced from public blockchain records.',
  },
  {
    q: 'How often is the data updated?',
    a: 'Freeze events are synced every 30 minutes via automated cron jobs. Balance checks are performed at sync time. The "Last scan" indicator on the homepage shows when the most recent sync completed.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-sr-border/50 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="font-display text-sm font-semibold pr-4 group-hover:text-sr-danger transition-colors">{q}</span>
        <ChevronDown size={16} className={`text-sr-dim shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 text-[12px] text-sr-dim leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="flex flex-col items-center min-h-screen font-mono antialiased text-current">
      <SEO
        title="FAQ — stables.rip"
        description="Frequently asked questions about stablecoin freezing, USDC and USDT blacklists, and how stables.rip tracks on-chain censorship events."
        path="/faq"
        schema={buildFAQSchema(faqs.map(f => ({ question: f.q, answer: f.a })))}
      />
      <div className="scanlines" />
      <div className="vignette" />
      <Header />

      <main className="w-full max-w-3xl px-4 md:px-6 pb-12 relative z-10">
        <h1 className="font-display text-2xl md:text-3xl font-black mb-2 mt-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-sr-dim mb-8 max-w-lg leading-relaxed">
          Everything you need to know about stablecoin freezing, blacklists, and how we track on-chain censorship.
        </p>

        <div className="border border-sr-border rounded-sm bg-sr-surface px-5">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
