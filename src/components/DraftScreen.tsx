"use client";

import { useMemo, useState } from "react";
import { DraftedPlayer, Formation } from "@/types/game";
import { Wheel } from "@/components/Wheel";
import { PlayerCard } from "@/components/PlayerCard";
import { PitchFormation } from "@/components/PitchFormation";
import { spinWheel, eligibleSlots } from "@/lib/draft";
import { playersFor, clubName, seasonLabel } from "@/lib/data";
import { mulberry32, newSeed } from "@/lib/rng";

export function DraftScreen({
  formation,
  rerolls,
  onComplete,
}: {
  formation: Formation;
  rerolls: number;
  onComplete: (filled: Record<string, DraftedPlayer>) => void;
}) {
  const rng = useMemo(() => mulberry32(newSeed()), []);
  const [filled, setFilled] = useState<Record<string, DraftedPlayer | null>>(() =>
    Object.fromEntries(formation.slots.map((s) => [s.id, null]))
  );
  const [usedPlayerIds, setUsedPlayerIds] = useState<Set<string>>(new Set());
  const [spunKeys, setSpunKeys] = useState<Set<string>>(new Set());
  const [landed, setLanded] = useState<{ clubId: string; seasonId: string } | null>(null);
  const [rerollsLeft, setRerollsLeft] = useState(rerolls);

  const filledCount = Object.values(filled).filter(Boolean).length;
  const total = formation.slots.length;
  const done = filledCount === total;

  const candidates = landed
    ? playersFor(landed.clubId, landed.seasonId).filter((p) => !usedPlayerIds.has(p.id))
    : [];

  function pickNext() {
    return spinWheel(rng, spunKeys);
  }

  function handleLanded(choice: { clubId: string; seasonId: string }) {
    setSpunKeys((prev) => new Set(prev).add(`${choice.clubId}__${choice.seasonId}`));
    setLanded(choice);
  }

  function handleReroll() {
    if (rerollsLeft <= 0) return;
    const choice = spinWheel(rng, spunKeys);
    setSpunKeys((prev) => new Set(prev).add(`${choice.clubId}__${choice.seasonId}`));
    setRerollsLeft((r) => r - 1);
    setLanded(choice);
  }

  function handlePick(player: (typeof candidates)[number]) {
    const slots = eligibleSlots(player, formation.slots, filled);
    const slot = slots[0];
    if (!slot) return;
    const drafted: DraftedPlayer = { ...player, slotId: slot.id };
    const nextFilled = { ...filled, [slot.id]: drafted };
    setFilled(nextFilled);
    setUsedPlayerIds((prev) => new Set(prev).add(player.id));
    setLanded(null);

    if (Object.values(nextFilled).every(Boolean)) {
      setTimeout(() => onComplete(nextFilled as Record<string, DraftedPlayer>), 500);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-5">
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Draft your XI</h2>
            <span className="font-mono text-sm text-muted">
              {filledCount}/{total} filled
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${(filledCount / total) * 100}%` }}
            />
          </div>
        </div>

        {!landed && !done && (
          <div className="rounded-2xl border border-border bg-surface p-5">
            <Wheel onLanded={handleLanded} pickNext={pickNext} disabled={done} />
          </div>
        )}

        {landed && (
          <div
            key={`${landed.clubId}__${landed.seasonId}__${rerollsLeft}`}
            className="animate-pop-in rounded-2xl border border-accent/40 bg-surface p-5"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-muted">
                Landed on <span className="font-semibold text-foreground">{clubName(landed.clubId)}</span>{" "}
                &middot; {seasonLabel(landed.seasonId)} &mdash; draft one player:
              </div>
              <button
                type="button"
                onClick={handleReroll}
                disabled={rerollsLeft <= 0}
                title={rerollsLeft <= 0 ? "No rerolls left" : "Discard this club and spin again"}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted"
              >
                ↻ Reroll ({rerollsLeft})
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {candidates.map((p) => (
                <PlayerCard key={p.id} player={p} onClick={() => handlePick(p)} />
              ))}
            </div>
            {candidates.length === 0 && (
              <div className="text-sm text-muted">No players left from this squad &mdash; spin again.</div>
            )}
          </div>
        )}

        {done && (
          <div className="animate-fade-in-up rounded-2xl border border-accent/50 bg-surface p-6 text-center">
            <div className="text-xl font-bold text-accent">Squad complete!</div>
            <div className="mt-1 text-sm text-muted">Preparing your season...</div>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <PitchFormation formation={formation} filled={filled} />
      </div>
    </div>
  );
}
