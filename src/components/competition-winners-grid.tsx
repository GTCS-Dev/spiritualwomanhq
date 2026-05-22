"use client";

import { useEffect, useMemo, useState } from "react";
import {
  COMPETITION_WINNERS_STORAGE_KEY,
  defaultCompetitionWinners,
  readCompetitionWinnersFromStorage,
} from "@/lib/competition-winners";
import { CompetitionWinner } from "@/types/competition-winner";

function sortByNewest(entries: CompetitionWinner[]) {
  return [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function CompetitionWinnersGrid() {
  const [winners, setWinners] = useState<CompetitionWinner[]>(() => {
    if (typeof window === "undefined") return defaultCompetitionWinners;
    return sortByNewest(readCompetitionWinnersFromStorage());
  });
  const [yearFilter, setYearFilter] = useState<string>("all");

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== COMPETITION_WINNERS_STORAGE_KEY) return;
      setWinners(sortByNewest(readCompetitionWinnersFromStorage()));
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const availableYears = useMemo(
    () => Array.from(new Set(winners.map((winner) => winner.year).filter(Boolean))).sort((a, b) => b.localeCompare(a)),
    [winners],
  );

  const filteredWinners = useMemo(
    () => (yearFilter === "all" ? winners : winners.filter((winner) => winner.year === yearFilter)),
    [winners, yearFilter],
  );

  const totalCount = filteredWinners.length;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-(--ash) bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-(--stone)">
          Competition Hall of Fame: {totalCount} winner{totalCount === 1 ? "" : "s"}
        </p>

        <label className="flex items-center gap-2 text-sm font-semibold text-(--ink)">
          Filter by Year
          <select
            value={yearFilter}
            onChange={(event) => setYearFilter(event.target.value)}
            className="rounded-lg border border-(--ash) bg-(--container) px-3 py-2 text-sm font-medium text-(--ink) outline-none transition-colors focus:border-(--rose)"
          >
            <option value="all">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredWinners.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredWinners.map((winner) => (
            <article key={winner.id} className="elevated overflow-hidden rounded-2xl border border-(--ash) bg-white">
              <div className="flex items-center justify-between bg-(--surface) px-5 py-4">
                <p className="rounded-full bg-(--ink)/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white">
                  {winner.year || "Year not set"}
                </p>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-(--stone)">Winner Profile</span>
              </div>

              <div className="flex justify-center px-5 pt-5">
                <img
                  src={winner.picture}
                  alt={`${winner.name} - ${winner.competition}`}
                  className="h-32 w-32 rounded-full border-4 border-(--blush) object-cover shadow-[0_10px_26px_-16px_rgba(0,0,0,0.45)]"
                  loading="lazy"
                />
              </div>

              <div className="grid gap-3 p-5 pt-4">
                <h2 className="text-center text-2xl font-extrabold text-(--ink)">{winner.name}</h2>

                <dl className="grid gap-2 text-sm">
                  <div className="flex items-start justify-between gap-3 border-b border-(--ash) pb-2">
                    <dt className="font-semibold text-(--stone)">Competition ID</dt>
                    <dd className="text-right font-bold text-(--ink)">{winner.competitionId}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-(--ash) pb-2">
                    <dt className="font-semibold text-(--stone)">Competition</dt>
                    <dd className="text-right text-(--ink)">{winner.competition}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-(--ash) pb-2">
                    <dt className="font-semibold text-(--stone)">Age Category</dt>
                    <dd className="text-right text-(--ink)">{winner.ageCategory || "-"}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="font-semibold text-(--stone)">Position</dt>
                    <dd className="rounded-full bg-(--blush) px-2.5 py-1 text-right text-xs font-bold uppercase tracking-[0.1em] text-(--rose)">
                      {winner.position || "-"}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-(--stone)/35 bg-white/70 px-6 py-10 text-center">
          <p className="font-semibold text-(--ink)">No winners found for {yearFilter}.</p>
          <p className="mt-1 text-sm text-(--stone)">Try another year filter to view more records.</p>
        </div>
      )}
    </div>
  );
}
