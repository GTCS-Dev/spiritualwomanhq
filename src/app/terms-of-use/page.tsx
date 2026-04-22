import { ContentPageShell } from "@/components/content-page-shell";

export default function TermsOfUsePage() {
  return (
    <ContentPageShell
      title="Terms Of Use"
      subtitle="Legal"
      description="These Terms of Use govern your access to and use of the SpiritualWoman Fellowship website and related content."
      image="/images/blog-events-gathering.jpg"
    >
      <div className="grid gap-5">
        <article className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold text-(--ink)">Acceptance Of Terms</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            By using this website, you agree to these Terms of Use and all applicable laws. If you do not agree,
            please discontinue use of the site.
          </p>
        </article>

        <article className="home-accent-card ink-rose-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="ink-rose-title text-2xl font-bold">Use Of Content</h2>
          <p className="mt-3 text-sm leading-7 text-white/85">
            Sermons, articles, images, and other ministry resources on this site are provided for personal,
            non-commercial use unless otherwise stated. You may not republish or redistribute content in a misleading
            way.
          </p>
        </article>

        <article className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold text-(--ink)">User Conduct</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            Users agree not to misuse forms, submit unlawful material, attempt unauthorized access, or disrupt website
            functionality. We reserve the right to restrict access if terms are violated.
          </p>
        </article>

        <article className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold text-(--ink)">Disclaimer And Liability</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            Content is provided in good faith for spiritual encouragement and general information. The site is provided
            on an "as is" basis without warranties of uninterrupted availability.
          </p>
        </article>

        <article className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold text-(--ink)">Changes To Terms</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            We may update these terms when needed. Continued use of the website after updates means you accept the
            revised terms.
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--stone)">
            Last updated: April 22, 2026
          </p>
        </article>
      </div>
    </ContentPageShell>
  );
}
