export function PaymentMethods() {
  return (
    <ul
      className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
      aria-label="Accepted payment methods: Visa, Mastercard, American Express, Discover, and cash"
    >
      <li>
        <Badge label="Visa" className="bg-[#1A1F71] text-white">
          <span className="text-[15px] font-bold italic tracking-wide">VISA</span>
        </Badge>
      </li>
      <li>
        <Badge label="Mastercard" className="bg-white">
          <svg viewBox="0 0 40 24" className="h-6 w-10" aria-hidden="true">
            <circle cx="15.2" cy="12" r="8" fill="#EB001B" />
            <circle cx="24.8" cy="12" r="8" fill="#F79E1B" />
            <path
              fill="#FF5F00"
              d="M20 5.9a8 8 0 0 1 2.7 6.1A8 8 0 0 1 20 18.1a8 8 0 0 1-2.7-6.1A8 8 0 0 1 20 5.9z"
            />
          </svg>
        </Badge>
      </li>
      <li>
        <Badge label="American Express" className="bg-[#2E77BC] text-white">
          <span className="text-[11px] font-bold tracking-wide">AMEX</span>
        </Badge>
      </li>
      <li>
        <Badge label="Discover" className="bg-white">
          <span className="flex items-center gap-1 text-[9px] font-bold tracking-wide text-[#111]">
            DISCOVER
            <span className="inline-block h-3 w-3 rounded-full bg-[#F76B1C]" />
          </span>
        </Badge>
      </li>
      <li>
        <Badge label="Cash" className="bg-white">
          <span className="text-[11px] font-semibold tracking-wide text-[#17803d]">
            CASH
          </span>
        </Badge>
      </li>
    </ul>
  );
}

function Badge({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex h-11 w-[74px] items-center justify-center rounded-md border border-line shadow-sm ${className || ""}`}
    >
      {children}
    </span>
  );
}
