"use client";

// Shared layout for the "what is X" explainer tabs (Trustless Work, LumenWipe,
// Neko). The copy comes from the i18n dictionary; the resource links (hrefs)
// are passed in by each page since URLs aren't translated.

type AboutSection = {
  eyebrow: string;
  title: string;
  tagline: string;
  body: string[];
  // Optional "why pick Pollar on top of this tech" sales callout.
  whyPollar?: {
    title: string;
    tagline: string;
    points: { title: string; desc: string }[];
    punch: string;
  };
  featuresTitle: string;
  features: { title: string; desc: string }[];
  resourcesTitle: string;
  disclaimer: string;
};

export function AboutPage({
  section,
  links,
}: {
  section: AboutSection;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="w-full max-w-3xl space-y-8">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-primary">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">{section.eyebrow}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {section.title}
        </h1>
        <p className="text-sm sm:text-base text-muted">{section.tagline}</p>
      </header>

      <div className="space-y-4">
        {section.body.map((paragraph, i) => (
          <p key={i} className="text-sm sm:text-base text-foreground/90">
            {paragraph}
          </p>
        ))}
      </div>

      {section.whyPollar && (
        <section className="rounded-2xl border border-primary/30 bg-primary-light p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {section.whyPollar.title}
            </h2>
            <p className="text-sm text-muted">{section.whyPollar.tagline}</p>
          </div>
          <ul className="space-y-3">
            {section.whyPollar.points.map((point) => (
              <li key={point.title} className="flex gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {point.title}
                  </p>
                  <p className="text-xs sm:text-sm text-muted">{point.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm font-semibold text-primary">
            {section.whyPollar.punch}
          </p>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">
          {section.featuresTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {section.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-background p-4 sm:p-5"
            >
              <p className="text-sm font-bold text-foreground">
                {feature.title}
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-muted">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          {section.resourcesTitle}
        </h2>
        <div className="flex flex-wrap gap-3">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                i === 0
                  ? "inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover transition-colors"
                  : "inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-surface transition-colors"
              }
            >
              {link.label}
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted-light">{section.disclaimer}</p>
    </div>
  );
}
