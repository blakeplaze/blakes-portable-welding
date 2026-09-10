import Link from "next/link";

export const metadata = {
  title: "Estimate request sent | Blake's Portable Welding",
  robots: { index: false, follow: false },
};

export default function EstimateReceivedPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-16 text-center text-sm leading-7">
      <h1 className="text-2xl font-normal">Estimate request sent</h1>
      <p className="mt-4 text-muted">
        Thanks — we&apos;ll follow up at the email you entered.
      </p>
      <p className="mt-8">
        <Link href="/" className="underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
