import { ContentPageShell } from "@/components/content-page-shell";
import { pageHeroImages } from "@/lib/site-images";

export default function TermsOfUsePage() {
  return (
    <ContentPageShell
      title="Terms Of Use"
      subtitle="Legal"
      description="These Terms of Use govern your access to and use of the SpiritualWoman Fellowship website and related content."
      image={pageHeroImages.terms}
    >
      <div className="grid gap-5">
        {[
          { title: "Acceptance Of Terms", text: "By using this website, you agree to these Terms of Use and all applicable laws. If you do not agree, please discontinue use of the site.", featured: false },
          { title: "Use Of Content", text: "Sermons, articles, images, and other ministry resources on this site are provided for personal, non-commercial use unless otherwise stated. You may not republish or redistribute content in a misleading way.", featured: true },
          { title: "User Conduct", text: "Users agree not to misuse forms, submit unlawful material, attempt unauthorized access, or disrupt website functionality. We reserve the right to restrict access if terms are violated.", featured: false },
          { title: "Disclaimer And Liability", text: "Content is provided in good faith for spiritual encouragement and general information. The site is provided on an \"as is\" basis without warranties of uninterrupted availability.", featured: false },
          { title: "Changes To Terms", text: "We may update these terms when needed. Continued use of the website after updates means you accept the revised terms.", extra: "Last updated: April 22, 2026", featured: false },
        ].map((item) => (
          <article
            key={item.title}
            className={`relative overflow-hidden rounded-2xl px-6 py-6 ${
              item.featured
                ? "bg-gradient-to-br from-[#980140] via-[#A2014A] to-[#001946] text-white"
                : "border-2 border-[#E19508]/15 bg-white shadow-[0_28px_60px_-30px_rgba(0,25,70,0.15)]"
            }`}
          >
            <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border-2 ${item.featured ? "border-[#E19508]/20" : "border-[#E19508]/10"}`} />
            <div className="relative z-10">
              <h2 className={`text-2xl font-bold ${item.featured ? "text-white" : "text-[#001946]"}`}>{item.title}</h2>
              <p className={`mt-3 text-sm leading-7 ${item.featured ? "text-white/85" : "text-[#5d6068]"}`}>{item.text}</p>
              {item.extra ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#E19508]">{item.extra}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </ContentPageShell>
  );
}