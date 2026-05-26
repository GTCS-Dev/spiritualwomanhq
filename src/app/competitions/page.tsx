import { CompetitionWinnersGrid } from "@/components/competition-winners-grid";
import { ContentPageShell } from "@/components/content-page-shell";
import { pageHeroImages } from "@/lib/site-images";

export default function CompetitionsPage() {
  return (
    <ContentPageShell
      title="Competition Winners"
      subtitle="Winners Archive"
      description="A refined showcase of our young champions, organized by year and designed to spotlight each achievement with clarity and pride."
      image={pageHeroImages.competitions}
    >
      <CompetitionWinnersGrid />
    </ContentPageShell>
  );
}
