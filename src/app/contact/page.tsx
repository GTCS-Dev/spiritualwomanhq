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
  return error ? "border-red-400 focus:border-red-500" : "border-(--ash) focus:border-(--rose)/55";
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Honeypot ref for spam prevention (hidden field that bots fill in)
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
    // Clear field-level error on change
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    // Dismiss success banner when user starts editing (ready to send another)
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

    // Check honeypot – if filled, silently discard (bot)
    if (honeypotRef.current?.value) {
      // Pretend success to avoid alerting bots
      handleResetForm();
      setIsSubmitted(true);
      return;
    }

    // Client-side validation
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
      <section className="mt-8 rounded-2xl border border-(--ash) bg-white px-6 py-7">
        <h2 className="text-2xl font-bold text-(--ink)">Send Us A Message</h2>
        <p className="mt-2 text-sm leading-7 text-(--stone)">
          Fill this form and our team will follow up with you as soon as possible.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
          {/* Honeypot field – hidden from real users, catches bots */}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-(--ink)">
              Full Name
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${getFieldErrorClassName(fieldErrors.name)}`}
                placeholder="Your full name"
                maxLength={80}
              />
              {fieldErrors.name ? <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p> : null}
            </label>
            <label className="text-sm font-semibold text-(--ink)">
              Email Address
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${getFieldErrorClassName(fieldErrors.email)}`}
                placeholder="you@example.com"
                maxLength={120}
              />
              {fieldErrors.email ? <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p> : null}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-(--ink)">
              Phone (Optional)
              <input
                type="text"
                value={form.phone}
                onChange={(event) => handleFieldChange("phone", event.target.value)}
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${getFieldErrorClassName(fieldErrors.phone)}`}
                placeholder="+1 240 000 0000"
                maxLength={30}
              />
              {fieldErrors.phone ? <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p> : null}
            </label>
            <label className="text-sm font-semibold text-(--ink)">
              Subject
              <input
                type="text"
                required
                value={form.subject}
                onChange={(event) => handleFieldChange("subject", event.target.value)}
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${getFieldErrorClassName(fieldErrors.subject)}`}
                placeholder="How can we support you?"
                maxLength={120}
              />
              {fieldErrors.subject ? <p className="mt-1 text-xs text-red-500">{fieldErrors.subject}</p> : null}
            </label>
          </div>

          <label className="text-sm font-semibold text-(--ink)">
            Message
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(event) => handleFieldChange("message", event.target.value)}
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${getFieldErrorClassName(fieldErrors.message)}`}
              placeholder="Share your message here..."
              maxLength={2500}
            />
            <div className="mt-1 flex justify-between">
              {fieldErrors.message ? (
                <p className="text-xs text-red-500">{fieldErrors.message}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-(--stone)">{form.message.length}/2500</span>
            </div>
          </label>

          {submitError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {submitError}
            </div>
          ) : null}

          {isSubmitted ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              Message sent successfully. We will be in touch soon.
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="inline-flex w-fit items-center rounded-full bg-(--rose) px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-(--rose-dark) disabled:cursor-not-allowed disabled:bg-(--stone) disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
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