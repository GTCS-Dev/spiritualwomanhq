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
    <div className="grid gap-8 text-white">
      {/* ── FILTER ARCHIVE BAR ── */}
      <div className="group bg-(--container) backdrop-blur-sm border-2 border-[#E19508]/15 rounded-2xl px-6 py-7 sm:px-8 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.2)] transition-all duration-400 hover:shadow-[0_20px_50px_-22px_rgba(0,25,70,0.3)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid gap-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E19508]">Archive Overview</p>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-(--ink) sm:text-3xl">Competition Winners</h2>
            <p className="max-w-2xl text-xs leading-relaxed text-(--stone) mt-1">
              Explore our winners archive by year in a structured presentation that highlights each achievement with clarity, dignity, and professionalism.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="rounded-full border border-[#E19508]/15 bg-[#E19508]/5 px-4 py-2 text-xs font-semibold text-(--stone)">
              {totalCount} winner{totalCount === 1 ? "" : "s"} shown
            </div>

            <label className="flex items-center gap-3 text-xs font-bold text-(--ink)">
              <span className="uppercase tracking-[0.16em] text-[#E19508]">Year</span>
              <select
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                className="rounded-full border border-[#E19508]/20 bg-(--container) px-4 py-2 text-xs font-bold text-[#E19508] outline-none transition-all duration-300 focus:border-[#E19508] focus:shadow-[0_0_0_3px_rgba(225,149,8,0.12)] cursor-pointer"
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
        <div className="grid grid-cols-2 justify-items-center gap-5 sm:gap-6 lg:grid-cols-4">
          {filteredWinners.map((winner) => (
            <article key={winner.id} className="group w-full max-w-full overflow-hidden rounded-2xl bg-(--container) border-2 border-[#E19508]/10 transition-all duration-400 hover:-translate-y-1.5 hover:border-[#E19508]/30 hover:shadow-[0_20px_50px_-18px_rgba(225,149,8,0.2)] flex flex-col justify-between">
              
              <div className="relative flex items-center justify-center border-b border-[#E19508]/8 bg-[#001233]/40 px-4 py-8">
                <div className="absolute right-3 top-3 z-20">
                  <p className="rounded-md bg-gradient-to-r from-[#980140] to-[#A2014A] border border-[#E19508]/25 px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider text-white shadow-md backdrop-blur-sm">
                    {winner.year || "Year n/a"}
                  </p>
                </div>
                
                <div className="relative aspect-square h-24 w-24 overflow-hidden rounded-full border-2 border-[#E19508]/30 bg-[#001233] shadow-lg transition-all duration-400 group-hover:border-[#E19508]/50 group-hover:shadow-xl sm:h-28 sm:w-28">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={winner.picture}
                      alt={`${winner.name} - ${winner.competition}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 120px"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2 p-5">
                <h3 className="text-center text-sm font-serif font-bold tracking-tight text-(--ink) line-clamp-1">{winner.name}</h3>
                
                <dl className="grid gap-1.5 text-[11px] leading-5">
                  <div className="flex items-center justify-between gap-3 bg-[#001233]/40 rounded-lg px-3 py-1.5 border border-white/[0.03] transition-colors duration-200 group-hover:bg-[#001233]/60">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#E19508]/60">ID:</dt>
                    <dd className="text-right font-mono font-semibold text-(--stone)">{toUpperDisplay(winner.competitionId)}</dd>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-[#001233]/40 rounded-lg px-3 py-1.5 border border-white/[0.03] transition-colors duration-200 group-hover:bg-[#001233]/60">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#E19508]/60">Comp:</dt>
                    <dd className="text-right font-semibold text-(--stone) truncate max-w-[100px]">{toUpperDisplay(winner.competition)}</dd>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-[#001233]/40 rounded-lg px-3 py-1.5 border border-white/[0.03] transition-colors duration-200 group-hover:bg-[#001233]/60">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#E19508]/60">Category:</dt>
                    <dd className="text-right font-semibold text-(--stone)">{toUpperDisplay(winner.ageCategory)}</dd>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#980140]/10 to-[#980140]/5 rounded-lg px-3 py-1.5 border border-[#E19508]/10 transition-all duration-200 group-hover:from-[#980140]/15 group-hover:to-[#980140]/10">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#E19508]/80">Position:</dt>
                    <dd className="text-right font-bold text-[#E19508]">{toUpperDisplay(winner.position)}</dd>
                  </div>
                </dl>
              </div>

            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-[#E19508]/15 bg-(--container)/60 px-6 py-16 text-center shadow-inner transition-all duration-300 hover:border-[#E19508]/25 hover:bg-(--container)/80">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E19508]/8">
            <span className="text-2xl text-[#E19508]/60">✦</span>
          </div>
          <p className="text-sm font-medium text-(--stone)">No winners found for <span className="text-[#E19508]">{yearFilter}</span>.</p>
          <p className="mt-1 text-xs text-(--stone)">Try another year filter to view more records.</p>
        </div>
      )}
    </div>
  );
}