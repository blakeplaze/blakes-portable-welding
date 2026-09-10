import Link from "next/link";
import { EstimateForm } from "@/components/EstimateForm";
import { testimonials } from "@/lib/testimonials";

const firstQuotes = testimonials.slice(0, 6);
const laterQuotes = testimonials.slice(6);

export default function HomePage() {
  return (
    <div>
      <section className="px-5 pb-4 pt-6 text-center">
        <h1 className="mx-auto max-w-xl text-[2.15rem] leading-tight font-normal sm:text-[2.6rem]">
          Proudly Serving
          <br />
          Metro Detroit, Michigan
          <br />
          Since 2012.
        </h1>
      </section>

      <EstimateForm />

      <section className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="text-sm tracking-[0.14em] uppercase text-muted">Our mission</p>
        <h2 className="mt-4 text-2xl leading-snug font-normal sm:text-3xl">
          We deliver fast, safe, expert mobile welding right where you need
          it—helping our community get the job done and building lasting trust,
          one weld at a time.
        </h2>
      </section>

      <Quotes quotes={firstQuotes} />

      <section className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="text-sm tracking-[0.14em] uppercase text-muted">Our promise</p>
        <h2 className="mt-4 text-2xl font-normal">Superior service, personalized attention</h2>
        <p className="mt-6 text-[0.95rem] leading-7 text-muted">
          We&apos;re proud to serve the Metro Detroit area since 2012. From our
          family to yours, we put lots of love and careful attention in each weld
          and every project. We hope you enjoy our work as much as we enjoy
          bringing it to you.
        </p>
        <Link href="/#estimate" className="btn mt-8">
          Request an estimate
        </Link>
      </section>

      <EstimateForm id="estimate-mid" />
      <Quotes quotes={laterQuotes} />

      <section className="mx-auto max-w-xl px-5 py-16 text-center">
        <h2 className="text-2xl font-normal">Office Hours & Contact</h2>
        <p className="mt-6 text-sm font-medium">Licensed and Insured</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Proudly serving Metro Detroit since 2012 with mobile welding and cutting
          solutions.
        </p>
        <p className="mt-6 text-sm leading-7">
          Phone:{" "}
          <a href="tel:3135129353" className="underline">
            313-512-WELD (9353)
          </a>
          <br />
          Email:{" "}
          <a href="mailto:blakesportablewelding@gmail.com" className="underline">
            blakesportablewelding@gmail.com
          </a>
        </p>
        <p className="mt-6 text-sm leading-7">
          Blake Fife Welding, LLC.
          <br />
          926 Trombley Road
          <br />
          Grosse Pointe, Michigan 48230
          <br />
          USA
        </p>
        <div className="mt-8 text-sm leading-7">
          <p className="font-medium">Office Hours:</p>
          <p>Monday 5:30am - 5:00pm</p>
          <p>Tuesday 5:30am - 5:00pm</p>
          <p>Wednesday 5:30am - 5:00pm</p>
          <p>Thursday 5:30am - 5:00pm</p>
          <p>Friday 5:30am - 5:00pm</p>
          <p>Saturday 8:00am - 3:00pm</p>
          <p>Sunday Closed</p>
        </div>
        <Link href="/#estimate" className="btn mt-8">
          Request Estimate
        </Link>
      </section>

      <section className="mx-auto max-w-xl px-5 pb-8 text-center">
        <p className="text-sm tracking-[0.14em] uppercase text-muted">
          Cash or Credit/Debit Card
        </p>
        <h2 className="mt-3 text-2xl font-normal">Accepted Payment Methods</h2>
      </section>

      <section id="about" className="mx-auto max-w-2xl px-5 pb-20 text-center">
        <h2 className="text-2xl font-normal">About Us</h2>
        <p className="mt-6 text-sm leading-7 text-muted">
          Since 2012, Blake’s Portable Welding has provided mobile service
          throughout the Greater Detroit area. We handle the standard
          repairs—construction and maintenance—but we also take on the specialized,
          non-standard jobs that others might avoid. Our rig is set up for on-site
          work with aluminum, stainless, and experimental projects, bringing a
          practical, mobile solution to simple or complex repair needs.
        </p>
      </section>

      <EstimateForm id="estimate-bottom" />
    </div>
  );
}

function Quotes({
  quotes,
}: {
  quotes: { quote: string; name: string }[];
}) {
  return (
    <section className="mx-auto max-w-2xl space-y-12 px-5 py-8 text-center">
      {quotes.map((item) => (
        <blockquote key={item.name}>
          <p className="text-[1.05rem] leading-7">&ldquo;{item.quote}&rdquo;</p>
          <footer className="mt-4 text-sm tracking-wide text-muted uppercase">
            {item.name}
          </footer>
        </blockquote>
      ))}
    </section>
  );
}
