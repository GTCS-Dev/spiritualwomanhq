import { ContentPageShell } from "@/components/content-page-shell";
import { pageHeroImages } from "@/lib/site-images";

const options = [
  {
    title: "Join A Small Group",
    text: "Find a group focused on prayer, Bible study, marriage support, or leadership growth.",
  },
  {
    title: "Serve In Ministry",
    text: "Use your gifts in worship, hospitality, media, mentorship, and outreach teams.",
  },
  {
    title: "Care & Counseling",
    text: "Receive spiritual support and guided care when you need encouragement and direction.",
  },
  {
    title: "Newsletter Updates",
    text: "Stay informed about events, devotionals, and new blog messages each week.",
  },
];

export default function ConnectPage() {
  return (
    <ContentPageShell
      title="Get Connected"
      subtitle="Belong + Serve"
      description="Build meaningful relationships, discover your calling, and take practical steps in community."
      image={pageHeroImages.connect}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {options.map((item, index) => (
          <article
            key={item.title}
            className={`home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-5 py-6 ${
              index === 1 || index === 3 ? "ink-rose-card" : ""
            }`}
          >
            <h2 className={`text-2xl font-bold ${index === 1 || index === 3 ? "ink-rose-title" : "text-(--ink)"}`}>{item.title}</h2>
            <p className={`mt-3 text-sm leading-7 ${index === 1 || index === 3 ? "text-white/85" : "text-(--stone)"}`}>{item.text}</p>
            <a
              href="mailto:hello@spiritualwoman.org"
              className={`mt-5 inline-block text-sm font-bold ${index === 1 || index === 3 ? "ink-rose-link" : "text-(--rose)"}`}
            >
              Learn More →
            </a>
          </article>
        ))}
      </div>
    </ContentPageShell>
  );
}
