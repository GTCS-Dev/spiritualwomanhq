"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { blogCoverImages } from "@/lib/site-images";
import { CompetitionWinner } from "@/types/competition-winner";
import { AdminTabProps, apiUrl, parseApiError } from "./shared";

type DraftWinner = {
  name: string;
  competitionId: string;
  competition: string;
  ageCategory: string;
  position: string;
  picture: string;
  year: string;
};

const initialDraft: DraftWinner = {
  name: "",
  competitionId: "",
  competition: "",
  ageCategory: "",
  position: "",
  picture: blogCoverImages[0],
  year: "",
};

const positionOptions = ["1ST", "2ND", "3RD"];
const ageCategoryOptions = [
  "8-10 YEARS",
  "14-18 YEARS",
  "5-7 YEARS",
  "11-13 YEARS",
  "11 -12 YEARS",
];
const competitionOptions = ["SPELLING BEE", "BIBLE QUIZ"];
const yearOptions = ["2025", "2026"];

export function CompetitionsTab({ token, onUnauthorized, onStatus }: AdminTabProps) {
  const [draft, setDraft] = useState<DraftWinner>(initialDraft);
  const [winners, setWinners] = useState<CompetitionWinner[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchWinners = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/competitions/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) onUnauthorized();
        return;
      }

      const data = (await response.json()) as CompetitionWinner[];
      setWinners(data);
    } catch {
      // Keep current list on transient network failure.
    }
  }, [token, onUnauthorized]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (token) fetchWinners();
  }, [token, fetchWinners]);

  function setField<K extends keyof DraftWinner>(key: K, value: DraftWinner[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    if (draft.name.trim().length < 2) return "Winner name is required.";
    return null;
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${apiUrl}/uploads/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) onUnauthorized();
      throw new Error(await parseApiError(response, "Image upload failed."));
    }

    return ((await response.json()) as { url: string }).url;
  }

  async function save(event: FormEvent) {
    event.preventDefault();

    const error = validate();
    if (error) {
      onStatus(error);
      return;
    }

    setSaving(true);

    try {
      const pictureUrl = imageFile ? await uploadFile(imageFile) : draft.picture.trim() || blogCoverImages[0];

      const method = editingId ? "PATCH" : "POST";
      const endpoint = editingId ? `${apiUrl}/competitions/${editingId}` : `${apiUrl}/competitions`;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: draft.name.trim(),
          competitionId: draft.competitionId.trim(),
          competition: draft.competition.trim(),
          ageCategory: draft.ageCategory.trim(),
          position: draft.position.trim(),
          picture: pictureUrl,
          year: draft.year.trim(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized();
          return;
        }

        onStatus(await parseApiError(response, editingId ? "Updating competition winner failed." : "Saving competition winner failed."));
        return;
      }

      setDraft(initialDraft);
      setImageFile(null);
      setEditingId(null);
      onStatus(editingId ? "Competition winner updated." : "Competition winner saved.");
      await fetchWinners();
    } catch (error) {
      onStatus(error instanceof Error ? error.message : "Network error.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(winner: CompetitionWinner) {
    setDraft({
      name: winner.name,
      competitionId: winner.competitionId,
      competition: winner.competition,
      ageCategory: winner.ageCategory,
      position: winner.position,
      picture: winner.picture,
      year: winner.year,
    });
    setEditingId(winner.id);
    setImageFile(null);
  }

  function cancelEdit() {
    setDraft(initialDraft);
    setImageFile(null);
    setEditingId(null);
  }

  async function removeWinner(id: string) {
    if (!confirm("Delete this competition winner?")) return;

    const response = await fetch(`${apiUrl}/competitions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401) onUnauthorized();
      onStatus(await parseApiError(response, "Deleting competition winner failed."));
      return;
    }

    onStatus("Competition winner deleted.");
    await fetchWinners();
  }

  const inputCls = "w-full rounded-xl border border-[#E19508]/15 bg-[#001233]/80 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E19508]/60 focus:ring-2 focus:ring-[#E19508]/15 placeholder:text-white/40";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-[#E19508]/80 mb-1.5";
  const countLabel = useMemo(() => `${winners.length} saved`, [winners.length]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form onSubmit={save} className="lg:col-span-5">
        <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-6 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
           <h2 className="mb-5 text-xl font-extrabold text-white">{editingId ? "Edit Competition Winner" : "Add Competition Winner"}</h2>
          <div className="grid gap-4">
            <div>
              <label className={labelCls}>Name</label>
              <input className={inputCls} value={draft.name} onChange={(event) => setField("name", event.target.value)} placeholder="e.g. Titus Salem Oyinade" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Competition ID</label>
                <input className={inputCls} value={draft.competitionId} onChange={(event) => setField("competitionId", event.target.value)} placeholder="e.g. BO39" />
              </div>
              <div>
                <label className={labelCls}>Year</label>
                <select className={inputCls} value={draft.year} onChange={(event) => setField("year", event.target.value)}>
                  <option value="" className="bg-[#001233] text-white">Select year</option>
                  {yearOptions.map((option) => (
                    <option key={option} value={option} className="bg-[#001233] text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Competition</label>
              <select className={inputCls} value={draft.competition} onChange={(event) => setField("competition", event.target.value)}>
                <option value="" className="bg-[#001233] text-white">Select competition</option>
                {competitionOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#001233] text-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Age Category</label>
                <select className={inputCls} value={draft.ageCategory} onChange={(event) => setField("ageCategory", event.target.value)}>
                  <option value="" className="bg-[#001233] text-white">Select age category</option>
                  {ageCategoryOptions.map((option) => (
                    <option key={option} value={option} className="bg-[#001233] text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Position</label>
                <select className={inputCls} value={draft.position} onChange={(event) => setField("position", event.target.value)}>
                  <option value="" className="bg-[#001233] text-white">Select position</option>
                  {positionOptions.map((option) => (
                    <option key={option} value={option} className="bg-[#001233] text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Picture URL (Optional)</label>
              <input className={inputCls} value={draft.picture} onChange={(event) => setField("picture", event.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className={labelCls}>Or Upload Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-[#E19508]/15 bg-[#001233]/80 px-3 py-2 text-sm text-white file:mr-3 file:rounded-full file:border-0 file:bg-[#980140] file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
              />
              <p className="mt-1 text-xs text-white/50">Upload sends image to Cloudinary and stores returned URL in database.</p>
            </div>
            <button type="submit" disabled={saving} className="rounded-full bg-[#980140] px-6 py-2.5 font-bold text-white transition-all duration-300 hover:bg-[#7c0134] hover:shadow-[0_6px_20px_-8px_rgba(152,1,64,0.5)] disabled:opacity-65">
              {saving ? "Saving..." : editingId ? "Update Winner" : "Save Winner"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-6 py-2.5 font-bold text-white/80 transition-all duration-300 hover:border-[#E19508]/30 hover:text-white">
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-5 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
          <h2 className="mb-4 text-base font-extrabold text-white">Competition Winners ({countLabel})</h2>
          <div className="grid gap-4">
            {winners.map((winner) => (
              <article key={winner.id} className="overflow-hidden rounded-xl border border-[#E19508]/10 bg-[#001233]/50 transition-all duration-300 hover:border-[#E19508]/20">
                <div className="relative h-40 w-full">
                  <img src={winner.picture} alt={winner.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E19508]">{winner.year}</p>
                      <p className="text-base font-bold text-white">{winner.name}</p>
                      <p className="text-sm text-white/60">{winner.competition} ({winner.competitionId})</p>
                      <p className="text-sm text-white/60">{winner.ageCategory} • {winner.position}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(winner)}
                        className="rounded-full border border-blue-500/30 bg-[#001233]/50 px-3 py-1 text-xs font-semibold text-blue-400 transition-all duration-300 hover:bg-blue-500/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeWinner(winner.id)}
                        className="rounded-full border border-red-500/30 bg-[#001233]/50 px-3 py-1 text-xs font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/10"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            {winners.length === 0 && <p className="text-sm text-white/50">No winners yet. Add your first record above.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}