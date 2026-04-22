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
      <main className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <section className="section-gradient elevated mt-8 grid items-center gap-7 overflow-hidden rounded-3xl border border-white/70 p-5 sm:p-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-(--rose)">{subtitle}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-(--stone)">{description}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/70">
            <Image src={image} alt={title} width={900} height={620} className="h-[260px] w-full object-cover sm:h-[320px]" />
          </div>
        </section>

        <section className="mt-12">{children}</section>
      </main>
      <SiteFooter />
    </div>
  );
}
