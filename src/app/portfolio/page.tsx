import Link from "next/link";

export const metadata = {
  title: "Blakes Portable Welding Portfolio | Blake's Portable Welding",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 text-center">
      <h1 className="text-3xl font-normal">Welding Portfolio</h1>
      <p className="mt-6 text-sm leading-7 text-muted">
        Job photos live on Instagram. The Square site embeds that feed here; this
        copy links straight to the same account.
      </p>
      <a
        href="https://www.instagram.com/BlakesPortableWelding"
        target="_blank"
        rel="noreferrer"
        className="btn mt-8"
      >
        View Instagram
      </a>
      <p className="mt-10">
        <Link href="/#estimate" className="underline">
          Request an estimate
        </Link>
      </p>
    </div>
  );
}
