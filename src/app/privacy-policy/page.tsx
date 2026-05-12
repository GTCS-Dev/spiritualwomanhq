import { ContentPageShell } from "@/components/content-page-shell";
import { pageHeroImages } from "@/lib/site-images";

export default function PrivacyPolicyPage() {
  return (
    <ContentPageShell
      title="Privacy Policy"
      subtitle="Legal"
      description="This Privacy Policy explains how SpiritualWoman Fellowship collects, uses, and protects your personal information when you use this website."
      image={pageHeroImages.privacy}
    >
      <div className="grid gap-5">
        <article className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold text-(--ink)">Information We Collect</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            We may collect information that you provide directly, such as your name, email address, prayer requests,
            and any message submitted through forms. We may also collect basic technical data like browser type, page
            visits, and device information to improve website performance.
          </p>
        </article>

        <article className="home-accent-card ink-rose-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="ink-rose-title text-2xl font-bold">How We Use Information</h2>
          <p className="mt-3 text-sm leading-7 text-white/85">
            Your information is used to respond to inquiries, share fellowship updates, improve content experience, and
            support ministry communication. We do not sell personal information to third parties.
          </p>
        </article>

        <article className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold text-(--ink)">Cookies And Analytics</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            This site may use cookies or similar technologies for essential functionality and anonymous analytics. You
            can manage cookie settings in your browser at any time.
          </p>
        </article>

        <article className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold text-(--ink)">Data Security</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            We use reasonable administrative and technical safeguards to protect your information. No internet
            transmission is fully secure, so we encourage users to avoid sharing highly sensitive personal data through
            public forms.
          </p>
        </article>

        <article className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold text-(--ink)">Contact</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            If you have privacy-related questions, contact us at hello@spiritualwoman.org.
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--stone)">
            Last updated: April 22, 2026
          </p>
        </article>
      </div>
    </ContentPageShell>
  );
}
