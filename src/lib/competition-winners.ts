import { blogCoverImages } from "@/lib/site-images";
import { CompetitionWinner } from "@/types/competition-winner";

export const COMPETITION_WINNERS_STORAGE_KEY = "sw_competition_winners_v1";

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
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(COMPETITION_WINNERS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Partial<CompetitionWinner>[];
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .map((entry) => normalizeWinner(entry))
      .filter((entry): entry is CompetitionWinner => Boolean(entry));

    return normalized;
  } catch {
    return [];
  }
}

export function writeCompetitionWinnersToStorage(entries: CompetitionWinner[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COMPETITION_WINNERS_STORAGE_KEY, JSON.stringify(entries));
}
