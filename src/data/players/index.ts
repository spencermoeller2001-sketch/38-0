import { PlayerSeason } from "@/types/game";
import { PLAYERS_1990S } from "@/data/players/players-1990s";
import { PLAYERS_2000S } from "@/data/players/players-2000s";
import { PLAYERS_2010S_EARLY } from "@/data/players/players-2010s-early";
import { PLAYERS_2010S_LATE } from "@/data/players/players-2010s-late";

export const ALL_PLAYERS: PlayerSeason[] = [
  ...PLAYERS_1990S,
  ...PLAYERS_2000S,
  ...PLAYERS_2010S_EARLY,
  ...PLAYERS_2010S_LATE,
];
