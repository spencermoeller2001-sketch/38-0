"use client";

import { PlayerSeason } from "@/types/game";
import { CLUB_MAP } from "@/data/clubs";
import { SEASON_MAP } from "@/data/seasons";

function ratingColor(overall: number): string {
  if (overall >= 90) return "text-gold";
  if (overall >= 80) return "text-accent";
  if (overall >= 70) return "text-sky-300";
  return "text-slate-300";
}

const ATTR_LABELS: { key: keyof PlayerSeason["attributes"]; label: string }[] = [
  { key: "pace", label: "PAC" },
  { key: "shooting", label: "SHO" },
  { key: "passing", label: "PAS" },
  { key: "defending", label: "DEF" },
  { key: "physical", label: "PHY" },
];

export function PlayerCard({
  player,
  onClick,
  selected,
  compact,
}: {
  player: PlayerSeason;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}) {
  const club = CLUB_MAP[player.clubId];
  const season = SEASON_MAP[player.seasonId];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`group relative w-full overflow-hidden rounded-xl border text-left transition-all ${
        selected
          ? "border-accent shadow-[0_0_0_2px_rgba(59,214,113,0.4)]"
          : "border-border hover:border-accent/60 hover:-translate-y-0.5"
      } ${onClick ? "cursor-pointer" : "cursor-default"} bg-surface`}
      style={{
        background: `linear-gradient(135deg, ${club?.primary ?? "#1a2338"}22 0%, var(--surface) 55%)`,
      }}
    >
      <div className="h-1 w-full" style={{ backgroundColor: club?.primary ?? "#334155" }} />
      <div className={`flex items-center gap-3 p-3 ${compact ? "py-2" : ""}`}>
        <div className={`flex flex-col items-center leading-none ${ratingColor(player.overall)}`}>
          <span className="font-mono text-2xl font-bold">{player.overall}</span>
          <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-muted">{player.position}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-foreground">{player.playerName}</div>
          <div className="truncate text-xs text-muted">
            {club?.name ?? player.clubId} &middot; {season?.label ?? player.seasonId}
          </div>
          {player.note && !compact && (
            <div className="mt-0.5 truncate text-[11px] italic text-accent/80">{player.note}</div>
          )}
          {!compact && (
            <div className="mt-1.5 grid grid-cols-5 gap-1">
              {ATTR_LABELS.map(({ key, label }) => (
                <div key={key} className="flex flex-col items-center">
                  <span className="text-[9px] text-muted">{label}</span>
                  <span className="text-[11px] font-mono font-semibold text-foreground/90">
                    {player.attributes[key]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
