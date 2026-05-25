"use client";

import { FormEvent, useMemo, useState } from "react";
import { ContentPageShell } from "@/components/content-page-shell";
import { pageHeroImages } from "@/lib/site-images";

const contactChannels = [
  {
    title: "General Inquiries",
    detail: "hello@spiritualwoman.org",
    cta: "mailto:hello@spiritualwoman.org",
    label: "Send Email",
  },
  {
    title: "Prayer Requests",
    detail: "prayer@spiritualwoman.org",
    cta: "mailto:prayer@spiritualwoman.org",
    label: "Request Prayer",
  },
  {
    title: "Events And Outreach",
    detail: "events@spiritualwoman.org",
    cta: "mailto:events@spiritualwoman.org",
    label: "Contact Team",
  },
  {
    title: "Call Or WhatsApp",
    detail: "+1 (240) 555-0187",
    cta: "tel:+12405550187",
    label: "Call Now",
  },
];

const baseApiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/+$/, "");

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const canSubmit = useMemo(
    () =>
      form.name.trim().length >= 2 &&
      form.email.trim().length > 4 &&
      form.subject.trim().length >= 3 &&
      form.message.trim().length >= 10,
    [form],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitted(false);

    if (!canSubmit) {
      setSubmitError("Please complete all required fields before sending.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseApiUrl}/contact-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      if (!response.ok) {
        const raw = await response.text();
        throw new Error(raw || "Unable to send your message right now.");
      }

      setForm(initialForm);
      setIsSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send your message right now.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ContentPageShell
      title="Contact Us"
      subtitle="We Are Here For You"
      description="Reach out for prayer, support, events, and fellowship information. We would love to hear your story and walk with you in faith."
      image={pageHeroImages.contact}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {contactChannels.map((channel, index) => (
          <article
            key={channel.title}
            className={`home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-6 transition duration-300 hover:-translate-y-1 hover:border-(--rose)/40 ${
              index === 1 ? "ink-rose-card" : ""
            }`}
          >
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${index === 1 ? "ink-rose-title" : "text-(--rose)"}`}>{channel.title}</p>
            <p className={`mt-3 text-lg font-bold ${index === 1 ? "text-white" : "text-(--ink)"}`}>{channel.detail}</p>
            <a
              href={channel.cta}
              className={`mt-5 inline-block rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                index === 1
                  ? "border-white/35 text-white hover:border-(--rose)/65 hover:text-(--rose)"
                  : "border-(--ash) text-(--ink) hover:border-(--rose)/40 hover:text-(--rose)"
              }`}
            >
              {channel.label}
            </a>
          </article>
        ))}
      </div>

      <section className="home-accent-card mt-8 rounded-2xl border border-(--ash) bg-white px-6 py-7">
        <h2 className="text-2xl font-bold text-(--ink)">Office And Gathering Details</h2>
        <div className="mt-4 grid gap-3 text-sm leading-7 text-(--stone) sm:grid-cols-2">
          <p>
            <span className="font-bold text-(--ink)">Address:</span> 1204 Hope Lane, Silver Spring, MD 20901
          </p>
          <p>
            <span className="font-bold text-(--ink)">Response Time:</span> Within 24 hours for all inquiries
          </p>
          <p>
            <span className="font-bold text-(--ink)">Prayer Line:</span> Saturday at 7:00 AM EST
          </p>
          <p>
            <span className="font-bold text-(--ink)">Service Day:</span> Sunday at 9:30 AM EST
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-(--ash) bg-white px-6 py-7">
        <h2 className="text-2xl font-bold text-(--ink)">Send Us A Message</h2>
        <p className="mt-2 text-sm leading-7 text-(--stone)">
          Fill this form and our team will follow up with you as soon as possible.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-(--ink)">
              Full Name
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-(--ash) bg-white px-4 py-3 text-sm outline-none transition focus:border-(--rose)/55"
                placeholder="Your full name"
              />
            </label>
            <label className="text-sm font-semibold text-(--ink)">
              Email Address
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-(--ash) bg-white px-4 py-3 text-sm outline-none transition focus:border-(--rose)/55"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-(--ink)">
              Phone (Optional)
              <input
                type="text"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-(--ash) bg-white px-4 py-3 text-sm outline-none transition focus:border-(--rose)/55"
                placeholder="+1 240 000 0000"
              />
            </label>
            <label className="text-sm font-semibold text-(--ink)">
              Subject
              <input
                type="text"
                required
                value={form.subject}
                onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-(--ash) bg-white px-4 py-3 text-sm outline-none transition focus:border-(--rose)/55"
                placeholder="How can we support you?"
              />
            </label>
          </div>

          <label className="text-sm font-semibold text-(--ink)">
            Message
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-(--ash) bg-white px-4 py-3 text-sm outline-none transition focus:border-(--rose)/55"
              placeholder="Share your message here..."
            />
          </label>

          {submitError ? <p className="text-sm font-semibold text-red-600">{submitError}</p> : null}
          {isSubmitted ? (
            <p className="text-sm font-semibold text-emerald-600">Message sent successfully. We will be in touch soon.</p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="inline-flex w-fit items-center rounded-full bg-(--rose) px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-(--rose-dark) disabled:cursor-not-allowed disabled:bg-(--stone)"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </ContentPageShell>
  );
}
