import { googleReviews } from "@/lib/google-reviews";

function Stars({ size = 22 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="#F4B400"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  );
}

export function GoogleReviews({ compact = false }: { compact?: boolean }) {
  const { rating, count, url } = googleReviews;
  const label = `${rating.toFixed(1)} out of 5 stars from ${count} Google reviews`;

  if (compact) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="inline-flex flex-col items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <span className="inline-flex items-center gap-2">
          <Stars size={16} />
          <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
        </span>
        <span>
          {count} Google reviews
        </span>
      </a>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-5 pb-16 text-center">
      <p className="text-sm tracking-[0.14em] uppercase text-muted">
        Google reviews
      </p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="mt-5 inline-flex flex-col items-center"
      >
        <Stars />
        <span className="mt-3 text-3xl font-normal">{rating.toFixed(1)}</span>
        <span className="mt-1 text-sm text-muted">
          {count} Google reviews
        </span>
      </a>
      <div className="mt-6">
        <a href={url} target="_blank" rel="noreferrer" className="btn-outline">
          Read our Google reviews
        </a>
      </div>
    </section>
  );
}
