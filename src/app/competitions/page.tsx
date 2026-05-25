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
          <div className="grid gap-7 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
            <div className="grid gap-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-(--rose)">Hall of Distinction</p>
              <h2 className="max-w-[14ch] text-3xl font-semibold text-(--ink) sm:text-4xl">
                Every card carries a story of discipline, courage, and growth.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-(--stone) sm:text-base">
                Explore our winners archive in a cleaner, more premium presentation that gives each child&apos;s achievement a stronger visual presence.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Archive", "Curated records"],
                  ["Style", "Bolder visual hierarchy"],
                  ["Focus", "Winner-first storytelling"],
                ].map(([label, value]) => (
                  <div key={label} className="competition-card__meta rounded-2xl px-4 py-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-(--stone)">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-(--ink)">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="competition-highlight rounded-[1.6rem] border border-(--ash) px-5 py-5 text-(--ink)">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-(--stone)">Why it matters</p>
              <p className="mt-3 text-lg font-semibold leading-8">
                We celebrate results, but we also honour the preparation, character, and confidence behind them.
              </p>
              <p className="mt-4 text-sm leading-7 text-(--stone)">
                The page now uses stronger cards, better spacing, and richer image treatment so the archive feels polished on every device.
              </p>
            </div>
          </div>
        </section>

        <CompetitionWinnersGrid />
      </div>
    </ContentPageShell>
  );
}
