"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  AdminTabProps,
  MAX_TESTIMONIAL_WORDS,
  Testimonial,
  apiUrl,
  clampToMaxWords,
  countWords,
  parseApiError,
} from "./shared";

export function TestimonialsTab({ token, onUnauthorized, onStatus }: AdminTabProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const quoteWordCount = useMemo(() => countWords(quote), [quote]);

  const fetchAll = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/testimonials/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) {
        if (response.status === 401) onUnauthorized();
        return;
      }
      setTestimonials((await response.json()) as Testimonial[]);
    } catch {
      // Ignore transient failures.
    }
  }, [token, onUnauthorized]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (token) fetchAll();
  }, [token, fetchAll]);

  function startEdit(testimonial: Testimonial) {
    setEditingId(testimonial._id);
    setQuote(testimonial.quote);
    setName(testimonial.name);
    setRole(testimonial.role);
  }

  function cancelEdit() {
    setEditingId(null);
    setQuote("");
    setName("");
    setRole("");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!quote.trim()) {
      onStatus("Quote is required.");
      return;
    }
    if (quoteWordCount > MAX_TESTIMONIAL_WORDS) {
      onStatus(`Quote must be ${MAX_TESTIMONIAL_WORDS} words or less.`);
      return;
    }
    if (name.trim().length < 2) {
      onStatus("Name is required.");
      return;
    }
    if (role.trim().length < 2) {
      onStatus("Role is required.");
      return;
    }

    try {
      const isEdit = Boolean(editingId);
      const url = isEdit ? `${apiUrl}/testimonials/${editingId}` : `${apiUrl}/testimonials`;
      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quote, name, role, isPublished: true }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized();
          return;
        }
        onStatus(await parseApiError(response, "Save failed."));
        return;
      }
      onStatus(isEdit ? "Testimonial updated." : "Testimonial saved.");
      cancelEdit();
      await fetchAll();
    } catch {
      onStatus("Network error.");
    }
  }

  async function togglePublish(testimonial: Testimonial) {
    const response = await fetch(`${apiUrl}/testimonials/${testimonial._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isPublished: !testimonial.isPublished }),
    });
    if (!response.ok) {
      if (response.status === 401) onUnauthorized();
      return;
    }
    onStatus(testimonial.isPublished ? "Hidden from site." : "Visible on site.");
    await fetchAll();
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const response = await fetch(`${apiUrl}/testimonials/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      if (response.status === 401) onUnauthorized();
      return;
    }
    onStatus("Testimonial deleted.");
    await fetchAll();
  }

  const inputCls = "w-full rounded-xl border border-(--ash) bg-white px-4 py-2.5 text-sm outline-none focus:border-(--rose)/60 focus:ring-2 focus:ring-(--rose)/15";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-(--stone) mb-1.5";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form onSubmit={save} className="lg:col-span-5">
        <div className="rounded-2xl border border-(--ash) bg-white p-6">
          <h2 className="mb-5 text-xl font-extrabold text-(--ink)">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>
          <div className="grid gap-4">
            <div>
              <label className={labelCls}>Quote</label>
              <textarea className={`${inputCls} resize-none`} rows={4} placeholder="Their story in their words..." value={quote} onChange={(event) => setQuote(clampToMaxWords(event.target.value, MAX_TESTIMONIAL_WORDS))} />
              <p className="mt-1 text-xs font-semibold text-(--stone)">{quoteWordCount}/{MAX_TESTIMONIAL_WORDS} words</p>
            </div>
            <div>
              <label className={labelCls}>Name</label>
              <input className={inputCls} placeholder="e.g. Amara O." value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Role or Title</label>
              <input className={inputCls} placeholder="e.g. Member since 2022" value={role} onChange={(event) => setRole(event.target.value)} />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="rounded-full bg-(--rose) px-6 py-2.5 font-bold text-white hover:bg-(--rose-dark)">
                {editingId ? "Update" : "Save Testimonial"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="rounded-full border border-(--ash) px-5 py-2.5 text-sm font-semibold text-(--stone) hover:text-(--ink)">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-(--ash) bg-white p-5">
          <h2 className="mb-4 text-base font-extrabold text-(--ink)">All Testimonials ({testimonials.length})</h2>
          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className={`rounded-xl border p-4 ${testimonial.isPublished ? "border-(--ash)" : "border-dashed border-(--stone)/40 opacity-70"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--blush) text-sm font-bold text-(--rose)">{testimonial.name[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-(--ink)">{testimonial.name}</p>
                      <p className="text-xs text-(--stone)">{testimonial.role}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${testimonial.isPublished ? "bg-green-100 text-green-700" : "bg-(--ash) text-(--stone)"}`}>
                    {testimonial.isPublished ? "Visible" : "Hidden"}
                  </span>
                </div>
                <p className="mt-3 text-sm italic text-(--stone)">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => startEdit(testimonial)} className="flex items-center gap-1 rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold hover:text-(--rose)">
                    <Pencil size={11} /> Edit
                  </button>
                  <button type="button" onClick={() => togglePublish(testimonial)} className="rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold hover:border-(--rose)/40">
                    {testimonial.isPublished ? "Hide" : "Show"}
                  </button>
                  <button type="button" onClick={() => deleteTestimonial(testimonial._id)} className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <p className="text-sm text-(--stone)">No testimonials yet. Add one to feature stories on the home page.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
