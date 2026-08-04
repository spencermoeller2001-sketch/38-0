import { Fixture, MatchOutcome, MatchResult } from "@/types/game";
import { Rng, pick } from "@/lib/rng";
import { playableClubSeasons } from "@/lib/data";
import { buildOpponent } from "@/lib/opponent";

const SEASON_LENGTH = 38;

export function generateFixtures(rng: Rng, userClubSeasons: Set<string>): Fixture[] {
  const pool = playableClubSeasons();
  const fixtures: Fixture[] = [];
  const recent: string[] = [];

  for (let i = 0; i < SEASON_LENGTH; i++) {
    let choice = pick(rng, pool);
    let key = `${choice.clubId}__${choice.seasonId}`;
    let attempts = 0;
    while (recent.includes(key) && attempts < 20) {
      choice = pick(rng, pool);
      key = `${choice.clubId}__${choice.seasonId}`;
      attempts++;
    }
    recent.push(key);
    if (recent.length > 6) recent.shift();

    fixtures.push({
      index: i + 1,
      opponent: buildOpponent(choice.clubId, choice.seasonId),
      isHome: i % 2 === 0,
    });
  }

  return fixtures;
}

export function outcomeFor(result: MatchResult): MatchOutcome {
  if (result.userGoals > result.oppGoals) return "W";
  if (result.userGoals < result.oppGoals) return "L";
  return "D";
}

export interface SeasonRecord {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  unbeaten: boolean;
  perfect: boolean;
}

export function emptyRecord(): SeasonRecord {
  return { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, unbeaten: true, perfect: true };
}

export function applyResult(record: SeasonRecord, result: MatchResult): SeasonRecord {
  const outcome = outcomeFor(result);
  const next: SeasonRecord = { ...record };
  next.played += 1;
  next.goalsFor += result.userGoals;
  next.goalsAgainst += result.oppGoals;
  if (outcome === "W") {
    next.wins += 1;
    next.points += 3;
  } else if (outcome === "D") {
    next.draws += 1;
    next.points += 1;
    next.perfect = false;
  } else {
    next.losses += 1;
    next.unbeaten = false;
    next.perfect = false;
  }
  return next;
}
