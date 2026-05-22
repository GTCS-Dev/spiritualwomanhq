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
      <CompetitionWinnersGrid />
    </ContentPageShell>
  );
}
