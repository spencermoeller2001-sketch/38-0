import { DraftedPlayer, FormationSlot, PlayerSeason } from "@/types/game";
import { POSITION_GROUP } from "@/lib/formations";
import { Rng, pick } from "@/lib/rng";
import { playableClubSeasons } from "@/lib/data";

export function spinWheel(rng: Rng, excludeKeys: Set<string>): { clubId: string; seasonId: string } {
  const pool = playableClubSeasons();
  let choice = pick(rng, pool);
  let key = `${choice.clubId}__${choice.seasonId}`;
  let attempts = 0;
  while (excludeKeys.has(key) && attempts < 30) {
    choice = pick(rng, pool);
    key = `${choice.clubId}__${choice.seasonId}`;
    attempts++;
  }
  return choice;
}

// Slots this player is eligible to fill, best match first: exact position, then position group, then any open slot.
export function eligibleSlots(
  player: PlayerSeason,
  slots: FormationSlot[],
  filled: Record<string, DraftedPlayer | null>
): FormationSlot[] {
  const open = slots.filter((s) => !filled[s.id]);
  const exact = open.filter((s) => s.position === player.position);
  if (exact.length) return exact;
  const group = open.filter((s) => POSITION_GROUP[s.position] === POSITION_GROUP[player.position]);
  if (group.length) return group;
  return open;
}

export function isDraftComplete(filled: Record<string, DraftedPlayer | null>): boolean {
  return Object.values(filled).length > 0 && Object.values(filled).every((p) => p !== null);
}
