import Link from "next/link";

export function Header() {
  return (
    <header className="px-5 pt-8 pb-4">
      <div className="mx-auto flex max-w-3xl justify-center">
        <Link href="/" aria-label="Blake's Portable Welding home" suppressHydrationWarning>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Blake's Portable Welding logo"
            width={280}
            height={102}
            className="h-auto w-[220px] sm:w-[260px]"
          />
        </Link>
      </div>
    </header>
  );
}
