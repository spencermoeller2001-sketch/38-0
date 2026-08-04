import { DraftedPlayer, PlayerSeason } from "@/types/game";
import { POSITION_GROUP } from "@/lib/formations";

export interface TeamRatings {
  overall: number;
  attack: number;
  midfield: number;
  defense: number;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 55;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function ratePlayers(players: PlayerSeason[]): TeamRatings {
  const gk = players.filter((p) => POSITION_GROUP[p.position] === "GK");
  const def = players.filter((p) => POSITION_GROUP[p.position] === "DEF");
  const mid = players.filter((p) => POSITION_GROUP[p.position] === "MID");
  const fwd = players.filter((p) => POSITION_GROUP[p.position] === "FWD");

  const defenseScore = avg([
    ...gk.map((p) => (p.attributes.defending + p.attributes.physical) / 2 + (p.overall - 70) * 0.3),
    ...def.map((p) => p.overall),
  ]);
  const midfieldScore = avg(mid.map((p) => p.overall));
  const attackScore = avg(fwd.map((p) => p.overall));

  const overall = avg(players.map((p) => p.overall));

  return {
    overall: Math.round(overall),
    attack: Math.round(attackScore || overall),
    midfield: Math.round(midfieldScore || overall),
    defense: Math.round(defenseScore || overall),
  };
}

export function squadIsComplete(filled: Record<string, DraftedPlayer | null>): boolean {
  return Object.values(filled).every((p) => p !== null);
}
