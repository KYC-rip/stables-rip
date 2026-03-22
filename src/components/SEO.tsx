import { Helmet } from '@dr.pogodin/react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  schema?: Record<string, unknown>;
  schemas?: Record<string, unknown>[];
}

const SITE_URL = 'https://stables.rip';

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'stables.rip',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: 'On-chain stablecoin censorship tracker. Real-time monitoring of USDC and USDT freeze events across Ethereum and TRON.',
  parentOrganization: {
    '@type': 'Organization',
    name: 'KYC.RIP',
    url: 'https://kyc.rip',
  },
  sameAs: [
    'https://x.com/XBToshi',
    'https://x.com/kyc_rip',
  ],
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'stables.rip',
  url: SITE_URL,
  description: 'Real-time tracking of frozen stablecoin addresses across Ethereum and TRON.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const DATASET_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Stablecoin Blacklist Database',
  description: 'Comprehensive database of USDC and USDT blacklisted addresses on Ethereum and TRON, including freeze dates, transaction hashes, and frozen balances.',
  url: SITE_URL,
  creator: {
    '@type': 'Organization',
    name: 'stables.rip',
    url: SITE_URL,
  },
  temporalCoverage: '2020/..',
  spatialCoverage: 'Global',
  distribution: {
    '@type': 'DataDownload',
    contentUrl: 'https://api.kyc.rip/v1/tools/ban-list',
    encodingFormat: 'application/json',
  },
  keywords: [
    'stablecoin', 'USDC', 'USDT', 'freeze', 'blacklist', 'censorship',
    'Ethereum', 'TRON', 'Circle', 'Tether', 'blockchain', 'cryptocurrency',
  ],
  license: 'https://creativecommons.org/publicdomain/zero/1.0/',
};

export function SEO({
  title = 'stables.rip — On-chain stablecoin censorship tracker',
  description = 'Real-time tracking of frozen stablecoin addresses across Ethereum and TRON. USDT and USDC freeze intel, wallet checker, and censorship analytics.',
  path = '',
  image,
  schema,
  schemas,
}: SEOProps) {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ? `${SITE_URL}${image}` : `${SITE_URL}/og-image.jpg`;

  const allSchemas: Record<string, unknown>[] = [ORG_SCHEMA, WEBSITE_SCHEMA, DATASET_SCHEMA];
  if (schema) allSchemas.push(schema);
  if (schemas) allSchemas.push(...schemas);

  return (
    <Helmet>
      <html lang="en" />

      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Geo / Topic */}
      <meta name="geo.placename" content="Global" />
      <meta name="coverage" content="Worldwide" />
      <meta name="topic" content="Stablecoin Censorship Tracking" />
      <meta name="subject" content="Cryptocurrency, Blockchain, Financial Censorship, USDC, USDT" />
      <meta name="classification" content="Finance, Cryptocurrency, Privacy" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="stables.rip" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@kyc_rip" />
      <meta name="twitter:creator" content="@XBToshi" />

      {/* Structured Data */}
      {allSchemas.map((s, i) => (
        <script key={i} type="application/ld+json" data-rh="true">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
