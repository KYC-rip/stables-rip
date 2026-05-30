import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS } from '../i18n/config';

function useLangPrefix() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  if (lang === 'en' || !(SUPPORTED_LANGS as readonly string[]).includes(lang)) return '';
  return `/${lang}`;
}

export function Footer() {
  const { t } = useTranslation();
  const prefix = useLangPrefix();

  return (
    <footer className="w-full border-t border-sr-border mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* CTA */}
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <p className="text-[11px] text-sr-dim uppercase tracking-[0.2em] font-bold">
            {t('footer.cta')}
          </p>
          <a
            href="https://kyc.rip/swap?from=usdt&from_network=TRC20&to=xmr&to_network=Mainnet&amount=1000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sr-danger/10 border border-sr-danger/30 text-sr-danger text-xs font-bold uppercase tracking-wider hover:bg-sr-danger hover:text-white dark:hover:text-black transition-all rounded-sm"
          >
            {t('footer.swap_cta')} <ExternalLink size={12} />
          </a>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Tools */}
          <div>
            <h4 className="text-[10px] text-sr-dim uppercase tracking-wider font-bold mb-3">{t('footer.tools')}</h4>
            <ul className="space-y-2 text-[12px]">
              <li><Link to={`${prefix}/`} className="hover:text-sr-danger transition-colors">{t('footer.freeze_tracker')}</Link></li>
              <li><Link to={`${prefix}/check`} className="hover:text-sr-danger transition-colors">{t('footer.check_address', { defaultValue: 'Check an address' })}</Link></li>
              <li><Link to={`${prefix}/stats`} className="hover:text-sr-danger transition-colors">{t('footer.statistics')}</Link></li>
              <li><Link to={`${prefix}/blacklist`} className="hover:text-sr-danger transition-colors">{t('footer.blacklist_explainer')}</Link></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-[10px] text-sr-dim uppercase tracking-wider font-bold mb-3">{t('footer.learn')}</h4>
            <ul className="space-y-2 text-[12px]">
              <li><Link to={`${prefix}/faq`} className="hover:text-sr-danger transition-colors">FAQ</Link></li>
              <li><Link to={`${prefix}/blacklist`} className="hover:text-sr-danger transition-colors">{t('footer.how_freezing_works')}</Link></li>
              <li><a href="https://kyc.rip/graveyard" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">Graveyard (KYC.RIP)</a></li>
              <li>
                <a
                  href="https://kyc.rip/donate"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-sr-danger transition-colors inline-flex items-center gap-1"
                  title="Support stables.rip + the kyc.rip ecosystem"
                >
                  {t('footer.donate', { defaultValue: 'Donate (XMR / BTC)' })}
                  <ExternalLink size={10} />
                </a>
              </li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-[10px] text-sr-dim uppercase tracking-wider font-bold mb-3">{t('footer.ecosystem')}</h4>
            <ul className="space-y-2 text-[12px]">
              <li>
                <a href="https://kyc.rip" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">
                  kyc.rip <span className="text-sr-dim text-[10px]">— {t('footer.kycrip_desc')}</span>
                </a>
              </li>
              <li>
                <a href="https://xmrprice.live" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">
                  xmrprice.live <span className="text-sr-dim text-[10px]">— {t('footer.xmrprice_desc')}</span>
                </a>
              </li>
              <li>
                <a href="https://ripley.run" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">
                  ripley.run <span className="text-sr-dim text-[10px]">— {t('footer.ripley_desc')}</span>
                </a>
              </li>
              <li>
                <a href="https://xmr402.org" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">
                  xmr402.org <span className="text-sr-dim text-[10px]">— {t('footer.xmr402_desc')}</span>
                </a>
              </li>
              <li>
                <a href="https://walls.rip" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">
                  walls.rip <span className="text-sr-dim text-[10px]">— {t('footer.walls_desc')}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] text-sr-dim uppercase tracking-wider font-bold mb-3">{t('footer.connect')}</h4>
            <ul className="space-y-2 text-[12px]">
              <li><a href="https://x.com/intent/follow?screen_name=XBToshi" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">@XBToshi</a></li>
              <li><a href="https://x.com/intent/follow?screen_name=kyc_rip" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors">@kyc_rip</a></li>
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
            <span className="opacity-50">—</span>
            <a href="https://kyc.rip" target="_blank" rel="noreferrer" className="hover:text-sr-danger transition-colors font-bold">
              rip.family
            </a>
            <span className="opacity-50">{t('footer.project_suffix')}</span>
          </div>
          <span className="opacity-50">
            {t('footer.disclaimer')}
          </span>
        </div>
      </div>
    </footer>
  );
}
