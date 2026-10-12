import Link from "next/link";

export const metadata = {
  title: "Why Welding Matters | Blake's Portable Welding",
  description:
    "Welding is part of everyday life in Metro Detroit — cars, buildings, trailers, railings, and the tools that keep a shop moving. Here's why that work matters.",
};

export default function WhyWeldingMattersPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-12 text-sm leading-7">
      <h1 className="text-3xl font-normal">Why Welding Matters</h1>
      <p className="mt-3 text-muted">Welding is a part of our everyday lives.</p>

      <div className="mt-8 space-y-5 text-muted">
        <p>
          Most people don&apos;t think about a weld until something breaks. Then it
          is the hitch that failed on the way to a job, the railing that pulled
          loose from a porch, or the equipment that has to be running again
          before Monday. The truth is that welding is already in the background
          of a normal day: the car you drive, the building you work in, the
          trailer you tow, the appliances in the kitchen, and a lot of the
          equipment that built all of that.
        </p>
        <p>
          In simple terms, welding joins metal so it stays joined. That one
          process shows up in infrastructure, manufacturing, repair work, and
          even art. Without it, getting across town, across a river, or across
          the country would look very different. Bridges, ships, aircraft,
          farm equipment, and a lot of medical and industrial hardware all
          depend on sound welds.
        </p>
        <p>
          That is also why the work is personal for a mobile welder. Blake&apos;s
          Portable Welding has been on-site in Metro Detroit since 2012,
          fixing what cannot easily come to a shop — construction and
          maintenance, aluminum and stainless, trailers, railings, automotive
          repairs, and the odd jobs that do not fit a neat category. A good
          weld is not just a bead. It is a porch that is safe again, a trailer
          that can haul, or a machine that can go back to earning.
        </p>
        <p>
          Welding also supports livelihoods. It is skilled work, it pays, and
          it is needed in good years and in lean ones because people still
          have to build new things and keep old things in service. When you
          start looking for it, you see it everywhere: cars, trailers,
          buildings, bridges, gates, exercise equipment, boats, and the
          frames that hold daily life together.
        </p>
        <p>
          We don&apos;t spend a lot of time making speeches about it. Most days it
          is just showing up, looking at what failed, and putting it back
          together so somebody can get on with their life. Once you start
          noticing the welds around you, you start noticing how much of an
          ordinary day already depends on them.
        </p>
      </div>

      <p className="mt-10">
        <Link href="/#estimate" className="underline">
          Request an estimate
        </Link>
      </p>
    </article>
  );
}
