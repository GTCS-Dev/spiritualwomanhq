"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { AdminTabProps, Verse, fetchWithApiFallback, parseApiError } from "./shared";

export function VerseTab({ token, onUnauthorized, onStatus }: AdminTabProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [text, setText] = useState("");
  const [reference, setReference] = useState("");
  const [period, setPeriod] = useState("week");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchVerses = useCallback(async () => {
    try {
      const response = await fetchWithApiFallback(`/verses/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) {
        if (response.status === 401) onUnauthorized();
        return;
      }
      setVerses((await response.json()) as Verse[]);
    } catch {
      // Keep current state on transient failures.
    }
  }, [token, onUnauthorized]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (token) fetchVerses();
  }, [token, fetchVerses]);

  function startEdit(verse: Verse) {
    setEditingId(verse._id);
    setText(verse.text);
    setReference(verse.reference);
    setPeriod(verse.period);
  }

  function cancelEdit() {
    setEditingId(null);
    setText("");
    setReference("");
    setPeriod("week");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!text.trim() || !reference.trim()) {
      onStatus("Verse text and reference are required.");
      return;
    }
    try {
      const isEdit = Boolean(editingId);
      const endpoint = isEdit ? `/verses/${editingId}` : `/verses`;
      const response = await fetchWithApiFallback(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text, reference, period, isActive: true }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized();
          return;
        }
        onStatus(await parseApiError(response, "Save failed."));
        return;
      }
      onStatus(isEdit ? "Verse updated." : "Verse saved.");
      cancelEdit();
      await fetchVerses();
    } catch {
      onStatus("Network error.");
    }
  }

  async function setActive(id: string) {
    const response = await fetchWithApiFallback(`/verses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: true }),
    });
    if (!response.ok) {
      if (response.status === 401) onUnauthorized();
      return;
    }
    await fetchVerses();
    onStatus("Verse set as active.");
  }

  async function deleteVerse(id: string) {
    if (!confirm("Delete this verse?")) return;
    const response = await fetchWithApiFallback(`/verses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      if (response.status === 401) onUnauthorized();
      return;
    }
    onStatus("Verse deleted.");
    await fetchVerses();
  }

  const inputCls = "w-full rounded-xl border border-(--ash) bg-white px-4 py-2.5 text-sm outline-none focus:border-(--rose)/60 focus:ring-2 focus:ring-(--rose)/15";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-(--stone) mb-1.5";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form onSubmit={save} className="lg:col-span-5">
        <div className="rounded-2xl border border-(--ash) bg-white p-6">
          <h2 className="mb-5 text-xl font-extrabold text-(--ink)">{editingId ? "Edit Verse" : "Add Verse"}</h2>
          <div className="grid gap-4">
            <div>
              <label className={labelCls}>Verse Text</label>
              <textarea className={`${inputCls} resize-none`} rows={4} placeholder="Full verse text…" value={text} onChange={(event) => setText(event.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Reference (e.g. Proverbs 31:25)</label>
              <input className={inputCls} placeholder="Book Chapter:Verse" value={reference} onChange={(event) => setReference(event.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Period</label>
              <select className={inputCls} value={period} onChange={(event) => setPeriod(event.target.value)}>
                <option value="week">Verse of the Week</option>
                <option value="day">Verse of the Day</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="rounded-full bg-(--rose) px-6 py-2.5 font-bold text-white hover:bg-(--rose-dark)">
                {editingId ? "Update Verse" : "Save Verse"}
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
          <h2 className="mb-4 text-base font-extrabold text-(--ink)">Saved Verses ({verses.length})</h2>
          <div className="grid gap-4">
            {verses.map((verse) => (
              <div key={verse._id} className={`rounded-xl border p-4 ${verse.isActive ? "border-(--rose)/40 bg-(--blush)" : "border-(--ash)"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {verse.isActive && <span className="mb-2 inline-block rounded-full bg-(--rose) px-2.5 py-0.5 text-xs font-bold text-white">Active</span>}
                    <p className="text-sm font-semibold italic text-(--ink)">&ldquo;{verse.text}&rdquo;</p>
                    <p className="mt-1 text-xs font-bold text-(--rose)">{verse.reference} — {verse.period === "day" ? "Day" : "Week"}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {!verse.isActive && (
                    <button type="button" onClick={() => setActive(verse._id)} className="rounded-full bg-(--rose) px-3 py-1 text-xs font-bold text-white">
                      Set Active
                    </button>
                  )}
                  <button type="button" onClick={() => startEdit(verse)} className="flex items-center gap-1 rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold hover:text-(--rose)">
                    <Pencil size={11} /> Edit
                  </button>
                  <button type="button" onClick={() => deleteVerse(verse._id)} className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
            {verses.length === 0 && <p className="text-sm text-(--stone)">No verses yet. Add one to display on the home page.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
