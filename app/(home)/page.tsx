import Link from 'next/link';
import { Boxes, Rocket, BookOpen, LifeBuoy, ArrowRight } from 'lucide-react';

const cards = [
  {
    title: 'Get started',
    icon: Rocket,
    description:
      'Generate an API key, exchange it for a bearer token, and make your first authenticated request against API v3.',
    bullets: ['Create an API key in your dashboard', 'Exchange it for a bearer token'],
    href: '/docs/guides/overview',
    linkLabel: 'Check the guides',
  },
  {
    title: 'API reference',
    icon: BookOpen,
    description:
      'Explore the resources the API exposes, with parameters, request bodies, and example responses for every endpoint.',
    bullets: ['Products, assets, and categories', 'Authentication and status codes'],
    href: '/docs/reference/api-reference-overview',
    linkLabel: 'Browse the reference',
  },
  {
    title: 'Plytix Help Center',
    icon: LifeBuoy,
    description:
      "Managing products by hand, configuring channels, or handling account administration? That's covered in the Help Center, not here.",
    bullets: ['Using the Plytix dashboard', 'Account and channel setup'],
    href: 'https://help.plytix.com/en',
    linkLabel: 'Visit the Help Center',
  },
];

export default function HomePage() {
  return (
    <main className="max-w-(--fd-layout-width) mx-auto px-4 py-12">
      <div className="relative overflow-hidden w-full text-center rounded-2xl bg-[#7A52FF] px-6 py-16 mb-12">
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-8 -right-8 opacity-10 rotate-12">
          <Boxes size={140} color="white" />
        </div>

        <div className="relative z-10">
          <h1 className="text-white text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            Build on the Plytix API
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Connect your ERP, storefront, or internal tools to Plytix, so you can manage
            products, assets, and other PIM data programmatically.
          </p>
          <Link
            href="/docs/guides/quickstart"
            className="inline-flex items-center gap-2 bg-white text-[#7A52FF] px-8 py-3 rounded-lg font-semibold no-underline hover:no-underline"
          >
            Get started
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ title, icon: Icon, description, bullets, href, linkLabel }) => (
          <div
            key={title}
            className="rounded-xl border border-fd-border bg-fd-card p-6 flex flex-col"
          >
            <Icon className="mb-3 size-6 text-[#7A52FF]" />
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-sm text-fd-muted-foreground mb-4">{description}</p>
            <div className="space-y-1 mb-4 text-sm text-fd-muted-foreground">
              {bullets.map((bullet) => (
                <div key={bullet}>&bull; {bullet}</div>
              ))}
            </div>
            <Link
              href={href}
              className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[#7A52FF] no-underline hover:underline"
            >
              {linkLabel} <ArrowRight className="size-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
