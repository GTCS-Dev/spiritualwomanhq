import Image from "next/image";
import { ContentPageShell } from "@/components/content-page-shell";
import { pageHeroImages } from "@/lib/site-images";

export default function AboutPage() {
  return (
    <ContentPageShell
      title="About Spiritual Woman Fellowship"
      subtitle="Our Mission"
      description="We exist to help women know God deeply, build strong spiritual habits, and live out their God-given purpose with courage."
      image={pageHeroImages.about}
    >
      <div className="grid gap-8">
        {/* ── Welcome / Overview ── split layout with image */}
        <section className="overflow-hidden rounded-2xl border border-(--ash) bg-white">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="px-6 py-8 sm:px-10">
              <h2 className="text-2xl font-bold text-(--ink)">Empowering Women to Grow in Faith and Purpose</h2>
              <p className="mt-4 text-sm leading-7 text-(--stone)">
                Welcome to The Spiritual Woman, a faith-based platform dedicated to helping Christian women deepen their relationship with God, discover their purpose, and live a life rooted in biblical truth.
              </p>
              <p className="mt-3 text-sm leading-7 text-(--stone)">
                Through inspiring devotionals, practical biblical teachings, prayer resources, and uplifting articles, we empower women to navigate life&rsquo;s challenges with faith, wisdom, and confidence. Whether you are seeking spiritual growth, Christian encouragement, guidance for godly living, or a supportive community of women of faith, you have found a place where your spiritual journey matters.
              </p>
              <p className="mt-3 text-sm leading-7 text-(--stone)">
                Join us as we explore God&rsquo;s Word, strengthen our faith, and embrace the calling He has placed on our lives. Become the spiritual woman God created you to be.
              </p>
            </div>
            <div className="relative min-h-[280px] md:min-h-full">
              <Image
                src="/new/group-four-gorgeous-african-american-womans-wear-summer-hat-holding-hands-praying-green-grass-park.jpg"
                alt="Women praying together in fellowship"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-l from-black/10 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* ── Vision / Beliefs / Culture ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
            <h2 className="text-2xl font-bold text-(--ink)">Vision</h2>
            <p className="mt-3 text-sm leading-7 text-(--stone)">
              To raise women of faith who influence homes, communities, and nations with grace, wisdom, and love.
            </p>
          </article>

          <article className="home-accent-card ink-rose-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
            <h2 className="ink-rose-title text-2xl font-bold">Beliefs</h2>
            <p className="mt-3 text-sm leading-7 text-white/85">
              We are centered on Christ, committed to Scripture, and passionate about prayer, discipleship, and service.
            </p>
          </article>

          <article className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
            <h2 className="text-2xl font-bold text-(--ink)">Culture</h2>
            <p className="mt-3 text-sm leading-7 text-(--stone)">
              We are welcoming, joyful, and growth-focused, creating safe spaces for testimony, healing, and purpose.
            </p>
          </article>
        </div>

        {/* ── What We Offer ── */}
        <section className="rounded-2xl border border-(--ash) bg-white px-6 py-8 sm:px-10">
          <h2 className="text-2xl font-bold text-(--ink)">What We Offer</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl bg-(--blush) px-5 py-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-(--rose)">Women&rsquo;s Fellowship</h3>
              <p className="mt-2 text-sm leading-7 text-(--stone)">
                Join our weekly community of Christian women for prayer, mentorship, spiritual growth, and real-life support. Build meaningful relationships while growing deeper in faith and purpose.
              </p>
            </div>
            <div className="rounded-xl bg-(--blush) px-5 py-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-(--rose)">Sunday Messages</h3>
              <p className="mt-2 text-sm leading-7 text-(--stone)">
                Access powerful Bible-centered teachings designed to strengthen your faith, provide spiritual clarity, and equip you for victorious Christian living.
              </p>
            </div>
            <div className="rounded-xl bg-(--blush) px-5 py-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-(--rose)">Events & Retreats</h3>
              <p className="mt-2 text-sm leading-7 text-(--stone)">
                Experience transformative gatherings through our weekly and monthly events, prayer meetings, fasting retreats, and community programs that inspire faith and foster connection.
              </p>
            </div>
          </div>
        </section>
      </div>
    </ContentPageShell>
  );
}