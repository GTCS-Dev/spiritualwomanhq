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
        {([
          {
            title: "Information We Collect" as const,
            text: "We may collect information that you provide directly, such as your name, email address, prayer requests, and any message submitted through forms. We may also collect basic technical data like browser type, page visits, and device information to improve website performance.",
            featured: false as const,
          },
          {
            title: "How We Use Information" as const,
            text: "Your information is used to respond to inquiries, share fellowship updates, improve content experience, and support ministry communication. We do not sell personal information to third parties.",
            featured: true as const,
          },
          {
            title: "Cookies And Analytics" as const,
            text: "This site may use cookies or similar technologies for essential functionality and anonymous analytics. You can manage cookie settings in your browser at any time.",
            featured: false as const,
          },
          {
            title: "Data Security" as const,
            text: "We use reasonable administrative and technical safeguards to protect your information. No internet transmission is fully secure, so we encourage users to avoid sharing highly sensitive personal data through public forms.",
            featured: false as const,
          },
          {
            title: "Contact" as const,
            text: "If you have privacy-related questions, contact us at hello@spiritualwoman.org.",
            extra: "Last updated: April 22, 2026" as const,
            featured: false as const,
          },
        ]).map((item: { title: string; text: string; featured: boolean; extra?: string }) => (
          <article
            key={item.title}
            className={`relative overflow-hidden rounded-2xl px-6 py-6 ${
              item.featured
                ? "bg-gradient-to-br from-[#980140] via-[#A2014A] to-[#001946] text-white"
                : "border-2 border-[#E19508]/15 bg-(--container) shadow-[0_28px_60px_-30px_rgba(0,25,70,0.15)]"
            }`}
          >
            <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border-2 ${item.featured ? "border-[#E19508]/20" : "border-[#E19508]/10"}`} />
            <div className="relative z-10">
              <h2 className={`text-2xl font-bold ${item.featured ? "text-white" : "text-(--ink)"}`}>{item.title}</h2>
              <p className={`mt-3 text-sm leading-7 ${item.featured ? "text-white/85" : "text-(--stone)"}`}>{item.text}</p>
              {(item as any).extra ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#E19508]">{(item as any).extra}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </ContentPageShell>
  );
}