"use client";

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
      <div className="competition-filter rounded-[1.8rem] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-(--rose)">Archive Overview</p>
            <h2 className="text-2xl font-semibold text-(--ink) sm:text-3xl">Competition Hall of Fame</h2>
            <p className="max-w-2xl text-sm leading-7 text-(--stone) sm:text-base">
              Browse our winner profiles by year and revisit the performances that brought honour to the fellowship.
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
            <article key={winner.id} className="competition-card rounded-[1.9rem] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-(--stone)">Winner Profile</p>
                  <p className="mt-2 text-sm font-semibold text-(--stone)">{winner.competition || "Competition"}</p>
                </div>

                <p className="competition-badge rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
                  {winner.year || "Year not set"}
                </p>
              </div>

              <div className="flex justify-center px-2 pt-6">
                <img
                  src={winner.picture}
                  alt={`${winner.name} - ${winner.competition}`}
                  className="competition-avatar h-36 w-36 rounded-full border-[6px] border-white object-cover"
                  loading="lazy"
                />
              </div>

              <div className="grid gap-4 px-1 pb-1 pt-6">
                <div className="text-center">
                  <h3 className="text-3xl font-semibold text-(--ink)">{winner.name}</h3>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-(--rose)">
                    {winner.position || "Outstanding Performance"}
                  </p>
                </div>

                <dl className="grid gap-3 text-sm">
                  <div className="flex items-start justify-between gap-3 rounded-2xl border border-(--ash) bg-white/70 px-4 py-3">
                    <dt className="font-semibold text-(--stone)">Competition ID</dt>
                    <dd className="text-right font-bold text-(--ink)">{winner.competitionId}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 rounded-2xl border border-(--ash) bg-white/70 px-4 py-3">
                    <dt className="font-semibold text-(--stone)">Competition</dt>
                    <dd className="text-right text-(--ink)">{winner.competition}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 rounded-2xl border border-(--ash) bg-white/70 px-4 py-3">
                    <dt className="font-semibold text-(--stone)">Age Category</dt>
                    <dd className="text-right text-(--ink)">{winner.ageCategory || "-"}</dd>
                  </div>
                  <div className="competition-highlight flex items-start justify-between gap-3 rounded-2xl border border-(--ash) px-4 py-3">
                    <dt className="font-semibold text-(--stone)">Position</dt>
                    <dd className="rounded-full bg-white/85 px-3 py-1 text-right text-xs font-extrabold uppercase tracking-[0.12em] text-(--rose)">
                      {winner.position || "-"}
                    </dd>
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
