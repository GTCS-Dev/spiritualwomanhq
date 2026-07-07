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
    <div className="grid gap-7 text-white">
      {/* ── FILTER ARCHIVE BAR ── */}
      <div className="bg-[#001233]/70 backdrop-blur-sm border border-white/[0.08] rounded-2xl px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E19508]">Archive Overview</p>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">Competition Winners</h2>
            <p className="max-w-2xl text-xs leading-relaxed text-white/70 mt-1">
              Explore our winners archive by year in a structured presentation that highlights each achievement with clarity, dignity, and professionalism.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="rounded-full border border-white/[0.08] bg-[#001233]/60 px-4 py-2 text-xs font-semibold text-white/70">
              {totalCount} winner{totalCount === 1 ? "" : "s"} shown
            </div>

            <label className="flex items-center gap-3 text-xs font-bold text-white/80">
              <span className="uppercase tracking-[0.16em] text-[#E19508]">Year</span>
              <select
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                className="rounded-full border border-white/10 bg-[#001233] px-4 py-2 text-xs font-bold text-[#E19508] outline-none transition-colors focus:border-[#E19508] cursor-pointer"
              >
                <option value="all" className="bg-[#001233] text-white">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year} className="bg-[#001233] text-white">
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* ── WINNERS DISPLAY GRID ── */}
      {filteredWinners.length > 0 ? (
        <div className="grid grid-cols-2 justify-items-center gap-4 sm:gap-6 lg:grid-cols-4">
          {filteredWinners.map((winner) => (
            <article key={winner.id} className="w-full max-w-full overflow-hidden rounded-2xl bg-[#001233]/70 backdrop-blur-sm border border-white/[0.08] hover:border-[#E19508]/40 transition-all duration-300 flex flex-col justify-between">
              
              <div className="relative flex items-center justify-center border-b border-white/[0.06] bg-[#001233]/40 px-4 py-6">
                <div className="absolute right-2.5 top-2.5 z-20">
                  <p className="rounded-md bg-[#980140]/90 border border-[#E19508]/30 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-white shadow-sm backdrop-blur-sm">
                    {winner.year || "Year n/a"}
                  </p>
                </div>
                
                <div className="relative aspect-square h-24 w-24 overflow-hidden rounded-full border-2 border-[#E19508]/40 bg-[#001233] shadow-lg sm:h-28 sm:w-28">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={winner.picture}
                      alt={`${winner.name} - ${winner.competition}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 120px"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2 p-4">
                <h3 className="text-center text-sm font-serif font-bold tracking-tight text-white line-clamp-1">{winner.name}</h3>
                
                <dl className="grid gap-1.5 text-[11px] leading-5">
                  <div className="flex items-center justify-between gap-3 bg-[#001233]/50 rounded-lg px-2.5 py-1 border border-white/[0.02]">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-white/50">ID:</dt>
                    <dd className="text-right font-mono font-semibold text-white/90">{toUpperDisplay(winner.competitionId)}</dd>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-[#001233]/50 rounded-lg px-2.5 py-1 border border-white/[0.02]">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-white/50">Comp:</dt>
                    <dd className="text-right font-semibold text-white/90 truncate max-w-[100px]">{toUpperDisplay(winner.competition)}</dd>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-[#001233]/50 rounded-lg px-2.5 py-1 border border-white/[0.02]">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-white/50">Category:</dt>
                    <dd className="text-right font-semibold text-white/90">{toUpperDisplay(winner.ageCategory)}</dd>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-[#001233]/50 rounded-lg px-2.5 py-1 border border-[#E19508]/10">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#E19508]/80">Position:</dt>
                    <dd className="text-right font-bold text-[#E19508]">{toUpperDisplay(winner.position)}</dd>
                  </div>
                </dl>
              </div>

            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#001233]/40 px-6 py-12 text-center shadow-inner">
          <p className="text-sm font-medium text-white/70">No winners found for {yearFilter}.</p>
          <p className="mt-1 text-xs text-white/40">Try another year filter to view more records.</p>
        </div>
      )}
    </div>
  );
}