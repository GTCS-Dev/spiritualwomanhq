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
          <Image src={image} alt={title} width={2200} height={980} className="h-[56vh] min-h-[440px] w-full object-cover object-center" priority />
          <div className="absolute inset-0 bg-linear-to-r from-[#1d1020]/78 via-[#38203d]/36 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/12 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/16 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
            <div className="max-w-2xl text-white">
              <div className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.26em] text-[#ffd5e1] backdrop-blur-md sm:text-xs">
                {subtitle}
              </div>
              <h1 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-[0.94] drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-[1.04rem] sm:leading-8">
                {description}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-18 w-full max-w-6xl px-4 sm:mt-20 sm:px-6 lg:px-8">{children}</section>
      </main>
      <SiteFooter />
    </div>
  );
}
