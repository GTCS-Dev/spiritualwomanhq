import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  compact?: boolean;
};

export function SiteLogo({ compact = false }: SiteLogoProps) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <div className="relative h-12 w-12 overflow-hidden rounded-[1.1rem] border-2 border-(--rose)/45 shadow-md">
        <Image src="/images/logo.jpeg" alt="SpiritualWoman logo" fill className="object-cover" sizes="48px" priority />
      </div>
      {!compact ? (
        <div>
          <p className="font-serif text-[1.55rem] font-semibold leading-none tracking-[0.015em] text-(--ink)">SpiritualWoman</p>
          <p className="mt-0.5 text-[0.64rem] font-bold uppercase tracking-[0.28em] text-(--rose)">Fellowship</p>
        </div>
      ) : null}
    </Link>
  );
}
