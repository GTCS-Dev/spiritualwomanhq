import { ContentPageShell } from "@/components/content-page-shell";
import { pageHeroImages } from "@/lib/site-images";

const programs = [
  {
    title: "Sunday Live Worship",
    body: "Join our weekly live stream with worship, prayer, and a practical teaching message that helps you win in everyday life.",
  },
  {
    title: "Midweek Bible Study",
    body: "A deeper verse-by-verse teaching experience where women can ask questions, reflect, and grow together.",
  },
  {
    title: "Prayer Room Live",
    body: "A short focused prayer broadcast for healing, family, purpose, and personal spiritual breakthrough.",
  },
];

export default function WatchPage() {
  return (
    <ContentPageShell
      title="Watch Online"
      subtitle="Live + On Demand"
      description="Watch worship services, encouragement messages, and prayer sessions wherever you are."
      image={pageHeroImages.watch}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {programs.map((program, index) => (
          <article
            key={program.title}
            className={`home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-5 py-6 ${
              index === 1 ? "ink-rose-card" : ""
            }`}
          >
            <h2 className={`text-2xl font-bold ${index === 1 ? "ink-rose-title" : "text-(--ink)"}`}>{program.title}</h2>
            <p className={`mt-3 text-sm leading-7 ${index === 1 ? "text-white/85" : "text-(--stone)"}`}>{program.body}</p>
            <button className="mt-6 rounded-full bg-(--rose) px-5 py-2 text-sm font-bold text-white hover:bg-(--rose-dark)">
              Watch Now
            </button>
          </article>
        ))}
      </div>
    </ContentPageShell>
  );
}
