import { blogCoverImages } from "@/lib/site-images";
import { CompetitionWinner } from "@/types/competition-winner";

export const COMPETITION_WINNERS_STORAGE_KEY = "sw_competition_winners_v1";

export const defaultCompetitionWinners: CompetitionWinner[] = [
  {
    id: "demo-titus-salem-oyinade",
    name: "Titus Salem Oyinade",
    competitionId: "BO39",
    competition: "Spelling Bee",
    ageCategory: "8 to 10",
    position: "3rd Position",
    picture: blogCoverImages[1],
    year: "2024",
    createdAt: new Date("2024-06-15").toISOString(),
  },
  {
    id: "demo-grace-adeola",
    name: "Grace Adeola",
    competitionId: "CH14",
    competition: "Bible Memory Challenge",
    ageCategory: "11 to 13",
    position: "1st Position",
    picture: blogCoverImages[0],
    year: "2025",
    createdAt: new Date("2025-02-08").toISOString(),
  },
];

function normalizeWinner(input: Partial<CompetitionWinner>): CompetitionWinner | null {
  if (!input.id || !input.name || !input.competitionId || !input.competition) return null;

  return {
    id: String(input.id),
    name: String(input.name),
    competitionId: String(input.competitionId),
    competition: String(input.competition),
    ageCategory: String(input.ageCategory ?? ""),
    position: String(input.position ?? ""),
    picture: String(input.picture ?? blogCoverImages[0]),
    year: String(input.year ?? ""),
    createdAt: String(input.createdAt ?? new Date().toISOString()),
  };
}

export function readCompetitionWinnersFromStorage(): CompetitionWinner[] {
  if (typeof window === "undefined") return defaultCompetitionWinners;

  try {
    const raw = window.localStorage.getItem(COMPETITION_WINNERS_STORAGE_KEY);
    if (!raw) return defaultCompetitionWinners;

    const parsed = JSON.parse(raw) as Partial<CompetitionWinner>[];
    if (!Array.isArray(parsed)) return defaultCompetitionWinners;

    const normalized = parsed
      .map((entry) => normalizeWinner(entry))
      .filter((entry): entry is CompetitionWinner => Boolean(entry));

    if (parsed.length > 0 && normalized.length === 0) return defaultCompetitionWinners;
    return normalized;
  } catch {
    return defaultCompetitionWinners;
  }
}

export function writeCompetitionWinnersToStorage(entries: CompetitionWinner[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COMPETITION_WINNERS_STORAGE_KEY, JSON.stringify(entries));
}
