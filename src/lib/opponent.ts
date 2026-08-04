import { Opponent } from "@/types/game";
import { CLUB_MAP } from "@/data/clubs";
import { SEASON_MAP } from "@/data/seasons";
import { playersFor } from "@/lib/data";
import { ratePlayers } from "@/lib/team";

export function buildOpponent(clubId: string, seasonId: string): Opponent {
  const club = CLUB_MAP[clubId];
  const season = SEASON_MAP[seasonId];
  const players = playersFor(clubId, seasonId);
  const ratings = ratePlayers(players);
  return {
    clubId,
    seasonId,
    clubName: club?.name ?? clubId,
    seasonLabel: season?.label ?? seasonId,
    primary: club?.primary ?? "#334155",
    secondary: club?.secondary ?? "#94a3b8",
    overall: ratings.overall,
    attack: ratings.attack,
    midfield: ratings.midfield,
    defense: ratings.defense,
    players,
  };
}
