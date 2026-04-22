import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  compact?: boolean;
};

export function SiteLogo({ compact = false }: SiteLogoProps) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-(--rose)/50 shadow-sm">
        <Image src="/images/logo.jpeg" alt="SpiritualWoman logo" fill className="object-cover" sizes="48px" priority />
      </div>
      {!compact ? (
        <div>
          <p className="text-xl font-extrabold tracking-wide text-(--rose)">SpiritualWoman</p>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--stone)">Fellowship</p>
        </div>
      ) : null}
    </Link>
  );
}
