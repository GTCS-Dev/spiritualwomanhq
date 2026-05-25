import { CompetitionWinnersGrid } from "@/components/competition-winners-grid";
import { ContentPageShell } from "@/components/content-page-shell";
import { pageHeroImages } from "@/lib/site-images";

export default function CompetitionsPage() {
  return (
    <ContentPageShell
      title="Competition Winners"
      subtitle="Celebrating Excellence"
      description="Meet the amazing children and young people who represented us with excellence. Browse by year and celebrate every achievement."
      image={pageHeroImages.competitions}
    >
      <div className="grid gap-8">
        <section className="competition-panel rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div className="grid gap-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-(--rose)">Hall of Distinction</p>
              <h2 className="max-w-[14ch] text-3xl font-semibold text-(--ink) sm:text-4xl">
                Every card carries a story of discipline, courage, and growth.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-(--stone) sm:text-base">
                Explore our winners archive with a cleaner, more premium presentation designed to highlight each child&apos;s achievement with clarity and pride.
              </p>
            </div>

            <div className="competition-highlight rounded-[1.6rem] border border-(--ash) px-5 py-5 text-(--ink)">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-(--stone)">Why it matters</p>
              <p className="mt-3 text-lg font-semibold leading-8">
                We celebrate results, but we also honour the preparation, character, and confidence behind them.
              </p>
            </div>
          </div>
        </section>

        <CompetitionWinnersGrid />
      </div>
    </ContentPageShell>
  );
}
