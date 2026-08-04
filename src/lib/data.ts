import { PlayerSeason } from "@/types/game";
import { ALL_PLAYERS } from "@/data/players";
import { CLUB_MAP } from "@/data/clubs";
import { SEASON_MAP, SEASONS } from "@/data/seasons";

let byClubSeason: Map<string, PlayerSeason[]> | null = null;

function index(): Map<string, PlayerSeason[]> {
  if (byClubSeason) return byClubSeason;
  const map = new Map<string, PlayerSeason[]>();
  for (const p of ALL_PLAYERS) {
    const key = `${p.clubId}__${p.seasonId}`;
    const list = map.get(key);
    if (list) list.push(p);
    else map.set(key, [p]);
  }
  byClubSeason = map;
  return map;
}

export function playersFor(clubId: string, seasonId: string): PlayerSeason[] {
  return index().get(`${clubId}__${seasonId}`) ?? [];
}

// A club-season is "playable" on the wheel if it has enough players to be worth drafting from.
export function playableClubSeasons(): { clubId: string; seasonId: string }[] {
  const out: { clubId: string; seasonId: string }[] = [];
  for (const season of SEASONS) {
    for (const clubId of season.clubIds) {
      const players = playersFor(clubId, season.id);
      if (players.length >= 3) out.push({ clubId, seasonId: season.id });
    }
  }
  return out;
}

export function clubName(clubId: string): string {
  return CLUB_MAP[clubId]?.name ?? clubId;
}

export function seasonLabel(seasonId: string): string {
  return SEASON_MAP[seasonId]?.label ?? seasonId;
}

export function totalPlayerCount(): number {
  return ALL_PLAYERS.length;
}
