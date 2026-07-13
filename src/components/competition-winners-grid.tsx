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
    <div className="grid gap-10 text-white">
      {/* ── FILTER ARCHIVE BAR ── */}
      <div className="group relative overflow-hidden rounded-2xl border border-[#E19508]/15 bg-[#001233]/80 backdrop-blur-sm px-6 py-7 sm:px-8 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.3)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border-2 border-[#E19508]/8" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between relative z-10">
          <div className="grid gap-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E19508]">Archive Overview</p>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">Competition Winners</h2>
            <p className="max-w-2xl text-xs leading-relaxed text-white/60 mt-1">
              Explore our winners archive by year in a structured presentation that highlights each achievement with clarity, dignity, and professionalism.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="rounded-full border border-[#E19508]/15 bg-[#E19508]/8 px-4 py-2 text-xs font-semibold text-white/70">
              {totalCount} winner{totalCount === 1 ? "" : "s"} shown
            </div>

            <label className="flex items-center gap-3 text-xs font-bold text-white">
              <span className="uppercase tracking-[0.16em] text-[#E19508]">Year</span>
              <select
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                className="rounded-full border border-[#E19508]/20 bg-[#001946]/60 px-4 py-2 text-xs font-bold text-[#E19508] outline-none transition-all duration-300 focus:border-[#E19508] focus:shadow-[0_0_0_3px_rgba(225,149,8,0.12)] cursor-pointer backdrop-blur-sm"
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredWinners.map((winner) => (
            <article key={winner.id} className="group relative overflow-hidden rounded-2xl border border-[#E19508]/12 bg-[#001233]/80 backdrop-blur-sm shadow-[0_8px_30px_-16px_rgba(0,0,0,0.3)] transition-all duration-400 hover:-translate-y-1.5 hover:border-[#E19508]/30 hover:shadow-[0_20px_50px_-18px_rgba(225,149,8,0.15)]">
              {/* Gold ring accent */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border-2 border-[#E19508]/6 transition-all duration-500 group-hover:scale-125" />
              
              {/* ── Image Header ── */}
              <div className="relative flex items-end justify-center overflow-hidden h-44 bg-gradient-to-b from-[#001946] to-[#001233]">
                {/* Decorative ring around avatar */}
                <div className="absolute -left-6 -bottom-12 h-28 w-28 rounded-full border-2 border-[#E19508]/8" />
                <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full border-2 border-[#E19508]/6" />
                
                <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-[#E19508]/30 bg-[#001946] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-all duration-400 group-hover:border-[#E19508]/50 group-hover:shadow-[0_12px_32px_-8px_rgba(225,149,8,0.2)]">
                  <Image
                    src={winner.picture}
                    alt={`${winner.name} - ${winner.competition}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 120px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Year badge */}
                <div className="absolute right-3 top-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#980140] to-[#A2014A] px-3 py-1 text-[10px] font-bold tracking-wider text-white shadow-md border border-[#E19508]/20">
                    {winner.year || "Year n/a"}
                  </span>
                </div>
              </div>

              {/* ── Body ── */}
              <div className="grid gap-3 p-5 pt-4">
                <h3 className="text-center text-base font-bold text-white line-clamp-1">{winner.name}</h3>

                <div className="grid gap-2 text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 border border-white/[0.03]">
                    <span className="font-semibold uppercase tracking-[0.08em] text-[#E19508]/60">ID</span>
                    <span className="font-mono font-medium text-white/70">{toUpperDisplay(winner.competitionId)}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 border border-white/[0.03]">
                    <span className="font-semibold uppercase tracking-[0.08em] text-[#E19508]/60">Competition</span>
                    <span className="font-medium text-white/70 truncate max-w-[140px] text-right">{toUpperDisplay(winner.competition)}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 border border-white/[0.03]">
                    <span className="font-semibold uppercase tracking-[0.08em] text-[#E19508]/60">Category</span>
                    <span className="font-medium text-white/70">{toUpperDisplay(winner.ageCategory)}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#980140]/10 to-[#980140]/5 px-3 py-2.5 border border-[#E19508]/15">
                    <span className="font-semibold uppercase tracking-[0.08em] text-[#E19508]/80">Position</span>
                    <span className="font-bold text-[#E19508]">{toUpperDisplay(winner.position)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-[#E19508]/15 bg-[#001233]/60 px-6 py-16 text-center shadow-inner transition-all duration-300 hover:border-[#E19508]/25 hover:bg-[#001233]/80">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border-2 border-[#E19508]/6" />
          <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full border-2 border-[#E19508]/5" />
          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E19508]/8">
              <span className="text-2xl text-[#E19508]/60">✦</span>
            </div>
            <p className="text-sm font-medium text-white/70">No winners found for <span className="text-[#E19508]">{yearFilter}</span>.</p>
            <p className="mt-1 text-xs text-white/50">Try another year filter to view more records.</p>
          </div>
        </div>
      )}
    </div>
  );
}