"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { ContentPageShell } from "@/components/content-page-shell";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { pageHeroImages } from "@/lib/site-images";

const baseApiUrl = getApiBaseUrl();

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof ContactFormState, string>>;

const initialForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateForm(form: ContactFormState): FormErrors {
  const errors: FormErrors = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 80) {
    errors.name = "Name must be under 80 characters.";
  }

  const email = form.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  } else if (email.length > 120) {
    errors.email = "Email must be under 120 characters.";
  }

  const phone = form.phone.trim();
  if (phone && phone.length > 30) {
    errors.phone = "Phone number must be under 30 characters.";
  }

  const subject = form.subject.trim();
  if (!subject) {
    errors.subject = "Subject is required.";
  } else if (subject.length < 3) {
    errors.subject = "Subject must be at least 3 characters.";
  } else if (subject.length > 120) {
    errors.subject = "Subject must be under 120 characters.";
  }

  const message = form.message.trim();
  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (message.length > 2500) {
    errors.message = "Message must be under 2500 characters.";
  }

  return errors;
}

function getFieldErrorClassName(error?: string): string {
  return error 
    ? "border-red-500/70 focus:border-red-500" 
    : "border-white/[0.08] focus:border-[#E19508]/60";
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const honeypotRef = useRef<HTMLInputElement>(null);

  const canSubmit = useMemo(
    () =>
      form.name.trim().length >= 2 &&
      EMAIL_REGEX.test(form.email.trim()) &&
      form.subject.trim().length >= 3 &&
      form.message.trim().length >= 10,
    [form],
  );

  function handleFieldChange(field: keyof ContactFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  }

  function handleResetForm() {
    setForm(initialForm);
    setFieldErrors({});
    setSubmitError("");
    setIsSubmitted(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    if (honeypotRef.current?.value) {
      handleResetForm();
      setIsSubmitted(true);
      return;
    }

    const errors = validateForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
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
        let errorMessage = "Unable to send your message right now.";
        try {
          const errorBody = await response.json();
          errorMessage =
            errorBody.message?.[0]?.constraints?.isEmail ??
            errorBody.message?.[0]?.constraints?.isString ??
            errorBody.message?.[0]?.constraints?.minLength ??
            errorBody.message?.[0]?.constraints?.maxLength ??
            errorBody.message ??
            errorBody.error ??
            errorMessage;
        } catch {
          const raw = await response.text();
          if (raw) errorMessage = raw;
        }
        throw new Error(errorMessage);
      }

      setFieldErrors({});
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
      <section className="relative mt-8 overflow-hidden rounded-2xl border-2 border-[#E19508]/20 bg-[#001233]/70 backdrop-blur-sm px-6 py-8 text-white shadow-[0_24px_50px_-20px_rgba(0,0,0,0.5)] selection:bg-[#980140]/40 selection:text-white">
        {/* ── BRAND DECORATIVE ELEMENTS ── */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border-2 border-[#E19508]/10 opacity-40" />
        <div className="pointer-events-none absolute -bottom-5 -right-5 h-24 w-24 rounded-full border-2 border-[#980140]/10 opacity-30" />
        
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E19508]">Connect Directly</p>
        <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">Send Us A Message</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70 max-w-xl">
          Fill out the fields below and our team will follow up with you systematically.
        </p>

        <form className="mt-6 grid gap-5" onSubmit={handleSubmit} noValidate>
          {/* Honeypot Spam Barrier */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="website">Website (do not fill)</label>
            <input
              ref={honeypotRef}
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/80">
              Full Name
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                className={`mt-2 w-full rounded-xl border bg-[#001946]/50 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all ${getFieldErrorClassName(fieldErrors.name)}`}
                placeholder="Your full name"
                maxLength={80}
              />
              {fieldErrors.name && <p className="mt-1.5 text-xs text-red-400 font-medium">{fieldErrors.name}</p>}
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-white/80">
              Email Address
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                className={`mt-2 w-full rounded-xl border bg-[#001946]/50 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all ${getFieldErrorClassName(fieldErrors.email)}`}
                placeholder="you@example.com"
                maxLength={120}
              />
              {fieldErrors.email && <p className="mt-1.5 text-xs text-red-400 font-medium">{fieldErrors.email}</p>}
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/80">
              Phone (Optional)
              <input
                type="text"
                value={form.phone}
                onChange={(event) => handleFieldChange("phone", event.target.value)}
                className={`mt-2 w-full rounded-xl border bg-[#001946]/50 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all ${getFieldErrorClassName(fieldErrors.phone)}`}
                placeholder="+1 240 000 0000"
                maxLength={30}
              />
              {fieldErrors.phone && <p className="mt-1.5 text-xs text-red-400 font-medium">{fieldErrors.phone}</p>}
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-white/80">
              Subject
              <input
                type="text"
                required
                value={form.subject}
                onChange={(event) => handleFieldChange("subject", event.target.value)}
                className={`mt-2 w-full rounded-xl border bg-[#001946]/50 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all ${getFieldErrorClassName(fieldErrors.subject)}`}
                placeholder="How can we support you?"
                maxLength={120}
              />
              {fieldErrors.subject && <p className="mt-1.5 text-xs text-red-400 font-medium">{fieldErrors.subject}</p>}
            </label>
          </div>

          <label className="text-xs font-bold uppercase tracking-wider text-white/80">
            Message
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(event) => handleFieldChange("message", event.target.value)}
              className={`mt-2 w-full rounded-xl border bg-[#001946]/50 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all ${getFieldErrorClassName(fieldErrors.message)}`}
              placeholder="Share your message here..."
              maxLength={2500}
            />
            <div className="mt-1.5 flex justify-between items-center text-[11px] font-mono tracking-tight">
              {fieldErrors.message ? (
                <p className="text-red-400 font-medium font-sans">{fieldErrors.message}</p>
              ) : (
                <span />
              )}
              <span className="text-white/40">{form.message.length}/2500</span>
            </div>
          </label>

          {/* ── DYNAMIC SYSTEM FEEDBACK STAGES ── */}
          {submitError && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/40 backdrop-blur-sm px-4 py-3 text-xs font-semibold text-red-400">
              {submitError}
            </div>
          )}

          {isSubmitted && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 backdrop-blur-sm px-4 py-3 text-xs font-semibold text-emerald-400">
              Message systematically dispatched. Our framework team will respond promptly.
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="inline-flex w-fit items-center justify-center rounded-full bg-[#980140] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#980140]/25 hover:bg-[#7c0134] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-[#001946] disabled:text-white/40 disabled:border-white/5 disabled:scale-100 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </section>
    </ContentPageShell>
  );
}