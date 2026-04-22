import { ContentPageShell } from "@/components/content-page-shell";

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
      image="/images/hero-slide-3.jpg"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {options.map((item) => (
          <article key={item.title} className="elevated rounded-2xl border border-(--ash) bg-white px-5 py-6">
            <h2 className="text-2xl font-bold text-(--ink)">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-(--stone)">{item.text}</p>
            <a href="mailto:hello@spiritualwoman.org" className="mt-5 inline-block text-sm font-bold text-(--rose)">
              Learn More →
            </a>
          </article>
        ))}
      </div>
    </ContentPageShell>
  );
}
