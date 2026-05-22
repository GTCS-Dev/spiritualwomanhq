import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type ContentPageShellProps = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  children: React.ReactNode;
};

export function ContentPageShell({ title, subtitle, description, image, children }: ContentPageShellProps) {
  return (
    <div className="min-h-screen text-(--ink)">
      <SiteHeader />
      <main className="w-full pb-20">
        <section className="relative left-1/2 mt-0 w-screen -translate-x-1/2 overflow-hidden border-b border-(--ash)">
          <Image src={image} alt={title} width={2200} height={980} className="h-[54vh] min-h-[420px] w-full object-cover object-center" priority />
          <div className="absolute inset-0 bg-linear-to-r from-[#211325]/72 via-[#3b2140]/32 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/38 via-black/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
            <div className="max-w-2xl text-white">
              <p className="text-xs font-bold uppercase tracking-[0.29em] text-[#ffbfd1] sm:text-sm">{subtitle}</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">{title}</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-base sm:leading-8">{description}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</section>
      </main>
      <SiteFooter />
    </div>
  );
}
