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

  const inputCls = "w-full rounded-xl border border-[#E19508]/15 bg-[#001233]/80 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E19508]/60 focus:ring-2 focus:ring-[#E19508]/15 placeholder:text-white/40";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-[#E19508]/80 mb-1.5";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form onSubmit={save} className="lg:col-span-5">
        <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-6 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
          <h2 className="mb-5 text-xl font-extrabold text-white">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>
          <div className="grid gap-4">
            <div>
              <label className={labelCls}>Quote</label>
              <textarea className={`${inputCls} resize-none`} rows={4} placeholder="Their story in their words..." value={quote} onChange={(event) => setQuote(clampToMaxWords(event.target.value, MAX_TESTIMONIAL_WORDS))} />
              <p className="mt-1 text-xs font-semibold text-white/50">{quoteWordCount}/{MAX_TESTIMONIAL_WORDS} words</p>
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
              <button type="submit" className="rounded-full bg-[#980140] px-6 py-2.5 font-bold text-white transition-all duration-300 hover:bg-[#7c0134] hover:shadow-[0_6px_20px_-8px_rgba(152,1,64,0.5)]">
                {editingId ? "Update" : "Save Testimonial"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-5 py-2.5 text-sm font-semibold text-white/70 transition-all duration-300 hover:border-[#E19508]/30 hover:text-white">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-5 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
          <h2 className="mb-4 text-base font-extrabold text-white">All Testimonials ({testimonials.length})</h2>
          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className={`rounded-xl border p-4 transition-all duration-300 ${testimonial.isPublished ? "border-[#E19508]/10 bg-[#001233]/50 hover:border-[#E19508]/20" : "border-dashed border-white/20 bg-[#001233]/30 opacity-70"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#980140]/20 text-sm font-bold text-[#E19508]">{testimonial.name[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-white">{testimonial.name}</p>
                      <p className="text-xs text-white/50">{testimonial.role}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${testimonial.isPublished ? "bg-green-900/40 text-green-400" : "bg-white/10 text-white/50"}`}>
                    {testimonial.isPublished ? "Visible" : "Hidden"}
                  </span>
                </div>
                <p className="mt-3 text-sm italic text-white/70">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => startEdit(testimonial)} className="flex items-center gap-1 rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-3 py-1 text-xs font-semibold text-white/80 transition-all duration-300 hover:border-[#E19508]/30 hover:text-[#E19508]">
                    <Pencil size={11} /> Edit
                  </button>
                  <button type="button" onClick={() => togglePublish(testimonial)} className="rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-3 py-1 text-xs font-semibold text-white/80 transition-all duration-300 hover:border-[#E19508]/30">
                    {testimonial.isPublished ? "Hide" : "Show"}
                  </button>
                  <button type="button" onClick={() => deleteTestimonial(testimonial._id)} className="rounded-full border border-red-500/30 bg-[#001233]/50 px-3 py-1 text-xs font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/10">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <p className="text-sm text-white/50">No testimonials yet. Add one to feature stories on the home page.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}