import { ContentPageShell } from "@/components/content-page-shell";

export default function AboutPage() {
  return (
    <ContentPageShell
      title="About SpiritualWoman Fellowship"
      subtitle="Our Mission"
      description="We exist to help women know God deeply, build strong spiritual habits, and live out their God-given purpose with courage."
      image="/images/hero-slide-1.jpg"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold">Vision</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            To raise women of faith who influence homes, communities, and nations with grace, wisdom, and love.
          </p>
        </article>

        <article className="rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold">Beliefs</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            We are centered on Christ, committed to Scripture, and passionate about prayer, discipleship, and service.
          </p>
        </article>

        <article className="rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold">Culture</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            We are welcoming, joyful, and growth-focused, creating safe spaces for testimony, healing, and purpose.
          </p>
        </article>
      </div>
    </ContentPageShell>
  );
}
