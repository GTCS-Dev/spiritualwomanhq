"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { defaultCompetitionWinners } from "@/lib/competition-winners";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { CompetitionWinner } from "@/types/competition-winner";

function sortByNewest(entries: CompetitionWinner[]) {
  return [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function CompetitionWinnersGrid() {
  const [winners, setWinners] = useState<CompetitionWinner[]>(defaultCompetitionWinners);
  const [yearFilter, setYearFilter] = useState<string>("all");

  useEffect(() => {
    const controller = new AbortController();
    const apiUrl = getApiBaseUrl();

    fetch(`${apiUrl}/competitions`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Failed loading competitions"))))
      .then((data: CompetitionWinner[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setWinners(sortByNewest(data));
          return;
        }
        setWinners(defaultCompetitionWinners);
      })
      .catch(() => {
        setWinners(defaultCompetitionWinners);
      });

    return () => controller.abort();
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
    <div className="grid gap-7">
      <div className="competition-filter rounded-[1.8rem] px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-(--rose)">Archive Overview</p>
            <h2 className="text-2xl font-semibold text-(--ink) sm:text-3xl">Competition Winners</h2>
            <p className="max-w-2xl text-sm leading-7 text-(--stone) sm:text-base">
              Browse every winner profile by year in a clean layout designed for clarity, consistency, and visual polish.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="rounded-full border border-(--ash) bg-white/80 px-4 py-3 text-sm font-semibold text-(--stone)">
              {totalCount} winner{totalCount === 1 ? "" : "s"} shown
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-(--ink)">
              <span className="uppercase tracking-[0.16em] text-(--stone)">Year</span>
              <select
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                className="rounded-full border border-(--ash) bg-(--container) px-4 py-2.5 text-sm font-semibold text-(--ink) outline-none transition-colors focus:border-(--rose)"
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
        </div>
      </div>

      {filteredWinners.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWinners.map((winner) => (
            <article key={winner.id} className="competition-card overflow-hidden rounded-[1.75rem] p-4 sm:p-5">
              <div className="relative overflow-hidden rounded-[1.35rem] border border-(--ash) bg-white/80">
                <div className="absolute right-3 top-3 z-10">
                  <p className="competition-badge rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white sm:text-[11px]">
                    {winner.year || "Year n/a"}
                  </p>
                </div>
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={winner.picture}
                    alt={`${winner.name} - ${winner.competition}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="grid gap-4 px-1 pb-1 pt-5">
                <div>
                  <h3 className="competition-card__title text-2xl font-semibold leading-tight text-(--ink) sm:text-[1.75rem]">
                    {winner.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-(--rose)">
                    {winner.position || "Outstanding Performance"}
                  </p>
                </div>

                <div className="competition-card__meta rounded-2xl px-4 py-3.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-(--stone)">Competition</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-(--ink)">{winner.competition || "Competition"}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {winner.ageCategory ? (
                    <span className="competition-card__chip rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-(--stone)">
                      {winner.ageCategory}
                    </span>
                  ) : null}
                  {winner.competitionId ? (
                    <span className="competition-card__chip rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-(--stone)">
                      Candidate ID {winner.competitionId}
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="competition-panel rounded-[1.8rem] border border-dashed border-(--stone)/35 px-6 py-12 text-center">
          <p className="text-2xl font-semibold text-(--ink)">No winners found for {yearFilter}.</p>
          <p className="mt-2 text-sm leading-7 text-(--stone)">Try another year filter to view more records.</p>
        </div>
      )}
    </div>
  );
}
