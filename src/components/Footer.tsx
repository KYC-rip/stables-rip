import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-sr-border mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* CTA */}
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <p className="text-[11px] text-sr-dim uppercase tracking-[0.2em] font-bold">
            Stablecoins are permissioned. Your money shouldn't be.
          </p>
          <a
            href="https://kyc.rip/swap?from=usdt&from_network=TRC20&to=xmr&to_network=Mainnet&amount=1000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sr-danger/10 border border-sr-danger/30 text-sr-danger text-xs font-bold uppercase tracking-wider hover:bg-sr-danger hover:text-white dark:hover:text-black transition-all rounded-sm"
          >
            Swap without KYC <ExternalLink size={12} />
          </a>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Tools */}
          <div>
            <h4 className="text-[10px] text-sr-dim uppercase tracking-wider font-bold mb-3">Tools</h4>
            <ul className="space-y-2 text-[12px]">
              <li><Link to="/" className="hover:text-sr-danger transition-colors">Freeze Tracker</Link></li>
              <li><Link to="/stats" className="hover:text-sr-danger transition-colors">Statistics</Link></li>
              <li><Link to="/blacklist" className="hover:text-sr-danger transition-colors">Blacklist Explainer</Link></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-[10px] text-sr-dim uppercase tracking-wider font-bold mb-3">Learn</h4>
            <ul className="space-y-2 text-[12px]">
              <li><Link to="/faq" className="hover:text-sr-danger transition-colors">FAQ</Link></li>
              <li><Link to="/blacklist" className="hover:text-sr-danger transition-colors">How Freezing Works</Link></li>
              <li><a href="https://kyc.rip/graveyard" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">Graveyard (KYC.RIP)</a></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-[10px] text-sr-dim uppercase tracking-wider font-bold mb-3">Ecosystem</h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <a href="https://kyc.rip" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">
                  kyc.rip <span className="text-sr-dim text-[10px]">— No-KYC swap aggregator</span>
                </a>
              </li>
              <li>
                <a href="https://xmrprice.live" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">
                  xmrprice.live <span className="text-sr-dim text-[10px]">— XMR price tracker</span>
                </a>
              </li>
              <li>
                <a href="https://ripley.run" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">
                  ripley.run <span className="text-sr-dim text-[10px]">— Monero toolkit</span>
                </a>
              </li>
              <li>
                <a href="https://xmr402.org" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">
                  xmr402.org <span className="text-sr-dim text-[10px]">— XMR paywall middleware</span>
                </a>
              </li>
              <li>
                <a href="https://walls.rip" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">
                  walls.rip <span className="text-sr-dim text-[10px]">— Anonymous comms toolkit</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] text-sr-dim uppercase tracking-wider font-bold mb-3">Connect</h4>
            <ul className="space-y-2 text-[12px]">
              <li><a href="https://x.com/XBToshi" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">@XBToshi</a></li>
              <li><a href="https://x.com/kyc_rip" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">@kyc_rip</a></li>
              <li><a href="https://kyc.rip/ghost-mail" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">Ghost Mail</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-sr-border/30 text-[10px] text-sr-dim">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sr-danger opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sr-danger" />
            </span>
            <span className="font-bold">stables.rip</span>
            <span className="opacity-50">— A</span>
            <a href="https://kyc.rip" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors font-bold">
              rip.family
            </a>
            <span className="opacity-50">project</span>
          </div>
          <span className="opacity-50">
            All data sourced from public blockchain records. No affiliation with Circle or Tether.
          </span>
        </div>
      </div>
    </footer>
  );
}
