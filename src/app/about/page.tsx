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
        {/* ── Welcome / Overview ── */}
        <section className="relative overflow-hidden rounded-2xl border border-[#E19508]/15 bg-(--container)">
          {/* Gold decorative circles */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border-2 border-[#E19508]/10" />
          <div className="pointer-events-none absolute -bottom-5 -right-5 h-24 w-24 rounded-full border-2 border-[#E19508]/8" />

          <div className="relative z-10 grid gap-0 md:grid-cols-2">
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
              <div className="absolute inset-0 bg-gradient-to-l from-[#001946]/20 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* ── Vision / Beliefs / Culture ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="relative overflow-hidden rounded-2xl border-2 border-[#E19508]/15 bg-(--container) px-6 py-6 shadow-[0_28px_60px_-30px_rgba(0,25,70,0.2)]">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-2 border-[#E19508]/10" />
            <div className="relative z-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E19508]/12 text-lg">✦</span>
              <h2 className="mt-4 text-2xl font-bold text-(--ink)">Vision</h2>
              <p className="mt-3 text-sm leading-7 text-(--stone)">
                To raise women of faith who influence homes, communities, and nations with grace, wisdom, and love.
              </p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#980140] via-[#A2014A] to-[#001946] px-6 py-6 shadow-[0_28px_60px_-30px_rgba(152,1,64,0.4)]">
            <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full border-2 border-[#E19508]/20" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-20 w-20 rounded-full border-2 border-[#E19508]/15" />
            <div className="relative z-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg">✦</span>
              <h2 className="mt-4 text-2xl font-bold text-white">Beliefs</h2>
              <p className="mt-3 text-sm leading-7 text-white/85">
                We are centered on Christ, committed to Scripture, and passionate about prayer, discipleship, and service.
              </p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-2xl border-2 border-[#E19508]/15 bg-(--container) px-6 py-6 shadow-[0_28px_60px_-30px_rgba(0,25,70,0.2)]">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-2 border-[#E19508]/10" />
            <div className="relative z-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E19508]/12 text-lg">✦</span>
              <h2 className="mt-4 text-2xl font-bold text-(--ink)">Culture</h2>
              <p className="mt-3 text-sm leading-7 text-(--stone)">
                We are welcoming, joyful, and growth-focused, creating safe spaces for testimony, healing, and purpose.
              </p>
            </div>
          </article>
        </div>

        {/* ── What We Offer ── */}
        <section className="relative overflow-hidden rounded-2xl border-2 border-[#E19508]/15 bg-(--container) px-6 py-8 sm:px-10 shadow-[0_28px_60px_-30px_rgba(0,25,70,0.2)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border-2 border-[#E19508]/8" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-(--ink)">What We Offer</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div className="rounded-xl bg-(--blush) px-5 py-5 border border-[#E19508]/10">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-(--rose)">Women&rsquo;s Fellowship</h3>
                <p className="mt-2 text-sm leading-7 text-(--stone)">
                  Join our weekly community of Christian women for prayer, mentorship, spiritual growth, and real-life support. Build meaningful relationships while growing deeper in faith and purpose.
                </p>
              </div>
              <div className="rounded-xl bg-(--blush) px-5 py-5 border border-[#E19508]/10">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-(--rose)">Sunday Messages</h3>
                <p className="mt-2 text-sm leading-7 text-(--stone)">
                  Access powerful Bible-centered teachings designed to strengthen your faith, provide spiritual clarity, and equip you for victorious Christian living.
                </p>
              </div>
              <div className="rounded-xl bg-(--blush) px-5 py-5 border border-[#E19508]/10">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-(--rose)">Events & Retreats</h3>
                <p className="mt-2 text-sm leading-7 text-(--stone)">
                  Experience transformative gatherings through our weekly and monthly events, prayer meetings, fasting retreats, and community programs that inspire faith and foster connection.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ContentPageShell>
  );
}