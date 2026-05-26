"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { CompetitionWinner } from "@/types/competition-winner";

function sortByNewest(entries: CompetitionWinner[]) {
  return [...entries].sort((a, b) => {
    const yearA = Number.parseInt(a.year ?? "0", 10);
    const yearB = Number.parseInt(b.year ?? "0", 10);

    if (yearA !== yearB) {
      return yearB - yearA;
    }

    return b.createdAt.localeCompare(a.createdAt);
  });
}

function toUpperDisplay(value?: string) {
  const safeValue = value?.trim();
  return safeValue ? safeValue.toUpperCase() : "-";
}

export function CompetitionWinnersGrid() {
  const [winners, setWinners] = useState<CompetitionWinner[]>([]);
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
        setWinners([]);
      })
      .catch(() => {
        setWinners([]);
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
              Explore our winners archive by year in a structured presentation that highlights each achievement with clarity, dignity, and professionalism.
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredWinners.map((winner) => (
            <article key={winner.id} className="competition-card relative overflow-hidden rounded-3xl">
              <div className="absolute right-3 top-3 z-20">
                <p className="competition-badge rounded-full border border-white/25 bg-(--ink)/85 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-sm sm:text-[10px]">
                  {winner.year || "Year n/a"}
                </p>
              </div>
              <div className="flex items-center justify-center border-b border-(--ash) bg-white px-4 py-4 sm:px-6 sm:py-6">
                <div className="relative aspect-square h-55 w-55 overflow-hidden rounded-full border-4 border-(--ash) bg-white sm:h-72 sm:w-72">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={winner.picture}
                      alt={`${winner.name} - ${winner.competition}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 320px"
                      className="object-contain object-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-1.5 p-2.5 sm:p-3">
                <h3 className="competition-card__title text-center text-[1rem] font-semibold uppercase leading-tight text-(--ink)">{winner.name}</h3>
                <dl className="grid gap-1.5 text-[11px] leading-5 sm:text-[11.5px]">
                  <div className="competition-card__meta flex items-start justify-between gap-3 rounded-lg px-2.5 py-1">
                    <dt className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-(--stone)">Competition ID:</dt>
                    <dd className="text-right text-[11px] font-semibold uppercase text-(--ink)">{toUpperDisplay(winner.competitionId)}</dd>
                  </div>

                  <div className="competition-card__meta flex items-start justify-between gap-3 rounded-lg px-2.5 py-1">
                    <dt className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-(--stone)">Competition:</dt>
                    <dd className="text-right text-[11px] font-semibold uppercase text-(--ink)">{toUpperDisplay(winner.competition)}</dd>
                  </div>

                  <div className="competition-card__meta flex items-start justify-between gap-3 rounded-lg px-2.5 py-1">
                    <dt className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-(--stone)">Age Category:</dt>
                    <dd className="text-right text-[11px] font-semibold uppercase text-(--ink)">{toUpperDisplay(winner.ageCategory)}</dd>
                  </div>

                  <div className="competition-card__meta flex items-start justify-between gap-3 rounded-lg px-2.5 py-1">
                    <dt className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-(--stone)">Position:</dt>
                    <dd className="text-right text-[11px] font-semibold uppercase text-(--rose)">{toUpperDisplay(winner.position)}</dd>
                  </div>
                </dl>
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
