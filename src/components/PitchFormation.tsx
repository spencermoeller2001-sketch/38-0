"use client";

import { DraftedPlayer, Formation } from "@/types/game";
import { CLUB_MAP } from "@/data/clubs";
import { readableTextColor } from "@/lib/color";

export function PitchFormation({
  formation,
  filled,
  highlightSlotIds,
  onSlotClick,
  compact,
}: {
  formation: Formation;
  filled: Record<string, DraftedPlayer | null>;
  highlightSlotIds?: Set<string>;
  onSlotClick?: (slotId: string) => void;
  compact?: boolean;
}) {
  return (
    <div
      className="pitch-stripes relative w-full overflow-hidden rounded-2xl border border-border"
      style={{
        aspectRatio: "2 / 3",
        background: "linear-gradient(180deg, #0f6b3c 0%, var(--pitch) 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-2 rounded-xl border border-white/25" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />
      <div className="pointer-events-none absolute inset-x-[15%] top-2 h-[12%] rounded-b-md border border-t-0 border-white/25" />
      <div className="pointer-events-none absolute inset-x-[15%] bottom-2 h-[12%] rounded-t-md border border-b-0 border-white/25" />

      {formation.slots.map((slot) => {
        const player = filled[slot.id];
        const highlighted = highlightSlotIds?.has(slot.id);
        const club = player ? CLUB_MAP[player.clubId] : null;
        const Tag = onSlotClick ? "button" : "div";
        return (
          <Tag
            key={slot.id}
            type={onSlotClick ? "button" : undefined}
            onClick={onSlotClick ? () => onSlotClick(slot.id) : undefined}
            className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${
              onSlotClick ? "cursor-pointer" : ""
            }`}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            <div
              className={`flex items-center justify-center rounded-full border-2 font-mono font-bold shadow-lg transition-transform ${
                compact ? "h-8 w-8 text-[10px]" : "h-11 w-11 text-xs sm:h-12 sm:w-12"
              } ${
                player
                  ? "border-white/80"
                  : highlighted
                  ? "animate-pulse-ring border-accent bg-accent/20 text-accent"
                  : "border-dashed border-white/50 bg-white/10 text-white/70"
              }`}
              style={
                player
                  ? {
                      backgroundColor: club?.primary ?? "#334155",
                      color: readableTextColor(club?.primary ?? "#334155"),
                    }
                  : undefined
              }
            >
              {player ? player.overall : slot.position}
            </div>
            {!compact && (
              <span className="mt-1 max-w-[70px] truncate rounded bg-black/50 px-1 text-[9px] font-medium text-white">
                {player ? player.playerName.split(" ").slice(-1)[0] : slot.position}
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
}
