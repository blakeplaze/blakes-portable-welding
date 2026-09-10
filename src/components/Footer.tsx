import Link from "next/link";

const links = [
  { href: "/#estimate", label: "Estimate Request Form" },
  {
    href: "https://network.procore.com/p/blakes-portable-welding-grosse-pointe-park",
    label: "Procore Network",
    external: true,
  },
  { href: "/#services", label: "List Of Services" },
  { href: "/portfolio", label: "Welding Portfolio" },
  {
    href: "https://medium.com/@theweldersedge",
    label: "The Welders Edge Blog",
    external: true,
  },
  {
    href: "https://www.weldwire.net/3783/welding-is-a-part-of-our-everyday-lives/",
    label: "Why Welding Matters",
    external: true,
  },
  { href: "/#about", label: "About Us" },
];

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-12 text-center text-sm text-muted">
      <nav className="mx-auto mb-10 flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-2">
        {links.map((link) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              {link.label}
            </a>
          ) : (
            <Link key={link.label} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ),
        )}
      </nav>
      <div className="mb-8 flex justify-center gap-6">
        <a href="mailto:Estimates@Bpweld.com" className="hover:text-foreground">
          Email
        </a>
        <a
          href="https://www.instagram.com/BlakesPortableWelding"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          Instagram
        </a>
      </div>
      <p className="uppercase tracking-wide leading-6">
        Blake Fife Welding, Limited Liability Company,
        <br />
        Detroit, Michigan 48230
        <br />
        United States of America
        <br />© {new Date().getFullYear()}
      </p>
    </footer>
  );
}
