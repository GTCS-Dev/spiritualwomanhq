"use client";

import { FormEvent, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  defaultCompetitionWinners,
  readCompetitionWinnersFromStorage,
  writeCompetitionWinnersToStorage,
} from "@/lib/competition-winners";
import { blogCoverImages } from "@/lib/site-images";
import { CompetitionWinner } from "@/types/competition-winner";
import { AdminTabProps } from "./shared";

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

export function CompetitionsTab({ onStatus }: AdminTabProps) {
  const [draft, setDraft] = useState<DraftWinner>(initialDraft);
  const [winners, setWinners] = useState<CompetitionWinner[]>(() => {
    if (typeof window === "undefined") return defaultCompetitionWinners;
    return readCompetitionWinnersFromStorage();
  });

  function setField<K extends keyof DraftWinner>(key: K, value: DraftWinner[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    if (draft.name.trim().length < 2) return "Winner name is required.";
    if (draft.competitionId.trim().length < 2) return "Competition ID is required.";
    if (draft.competition.trim().length < 2) return "Competition name is required.";
    if (draft.position.trim().length < 2) return "Position is required.";
    if (draft.year.trim().length < 4) return "Year is required.";
    return null;
  }

  function save(event: FormEvent) {
    event.preventDefault();

    const error = validate();
    if (error) {
      onStatus(error);
      return;
    }

    const next: CompetitionWinner = {
      id: crypto.randomUUID(),
      name: draft.name.trim(),
      competitionId: draft.competitionId.trim(),
      competition: draft.competition.trim(),
      ageCategory: draft.ageCategory.trim(),
      position: draft.position.trim(),
      picture: draft.picture.trim() || blogCoverImages[0],
      year: draft.year.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [next, ...winners];
    setWinners(updated);
    writeCompetitionWinnersToStorage(updated);
    setDraft(initialDraft);
    onStatus("Competition winner saved.");
  }

  function removeWinner(id: string) {
    if (!confirm("Delete this competition winner?")) return;

    const updated = winners.filter((item) => item.id !== id);
    setWinners(updated);
    writeCompetitionWinnersToStorage(updated);
    onStatus("Competition winner deleted.");
  }

  const inputCls = "w-full rounded-xl border border-(--ash) bg-white px-4 py-2.5 text-sm outline-none focus:border-(--rose)/60 focus:ring-2 focus:ring-(--rose)/15";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-(--stone) mb-1.5";
  const countLabel = useMemo(() => `${winners.length} saved`, [winners.length]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form onSubmit={save} className="lg:col-span-5">
        <div className="rounded-2xl border border-(--ash) bg-white p-6">
          <h2 className="mb-5 text-xl font-extrabold text-(--ink)">Add Competition Winner</h2>
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
                <input className={inputCls} value={draft.year} onChange={(event) => setField("year", event.target.value)} placeholder="e.g. 2024" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Competition</label>
              <input className={inputCls} value={draft.competition} onChange={(event) => setField("competition", event.target.value)} placeholder="e.g. Spelling Bee" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Age Category</label>
                <input className={inputCls} value={draft.ageCategory} onChange={(event) => setField("ageCategory", event.target.value)} placeholder="e.g. 8 to 10" />
              </div>
              <div>
                <label className={labelCls}>Position</label>
                <input className={inputCls} value={draft.position} onChange={(event) => setField("position", event.target.value)} placeholder="e.g. 3rd Position" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Picture URL</label>
              <input className={inputCls} value={draft.picture} onChange={(event) => setField("picture", event.target.value)} placeholder="https://..." />
              <p className="mt-1 text-xs text-(--stone)">You can paste a URL or keep the default image for now.</p>
            </div>
            <button type="submit" className="rounded-full bg-(--rose) px-6 py-2.5 font-bold text-white hover:bg-(--rose-dark)">
              Save Winner
            </button>
          </div>
        </div>
      </form>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-(--ash) bg-white p-5">
          <h2 className="mb-4 text-base font-extrabold text-(--ink)">Competition Winners ({countLabel})</h2>
          <div className="grid gap-4">
            {winners.map((winner) => (
              <article key={winner.id} className="overflow-hidden rounded-xl border border-(--ash)">
                <div className="relative h-40 w-full">
                  <img src={winner.picture} alt={winner.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-(--rose)">{winner.year}</p>
                      <p className="text-base font-bold text-(--ink)">{winner.name}</p>
                      <p className="text-sm text-(--stone)">{winner.competition} ({winner.competitionId})</p>
                      <p className="text-sm text-(--stone)">{winner.ageCategory} • {winner.position}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWinner(winner.id)}
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {winners.length === 0 && <p className="text-sm text-(--stone)">No winners yet. Add your first record above.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
