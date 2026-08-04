"use client";

import { useState } from "react";
import Link from "next/link";
import { DraftedPlayer, Formation } from "@/types/game";
import { Difficulty } from "@/lib/difficulty";
import { DifficultyPicker } from "@/components/DifficultyPicker";
import { FormationPicker } from "@/components/FormationPicker";
import { DraftScreen } from "@/components/DraftScreen";
import { SeasonRunner } from "@/components/SeasonRunner";
import { PitchFormation } from "@/components/PitchFormation";
import { ratePlayers } from "@/lib/team";

type Phase = "difficulty" | "formation" | "draft" | "review" | "season";

export default function PlayPage() {
  const [phase, setPhase] = useState<Phase>("difficulty");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [filled, setFilled] = useState<Record<string, DraftedPlayer> | null>(null);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="font-mono text-lg font-black tracking-tight">
          38<span className="text-accent">-</span>0
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted">
          {difficulty && <span>{difficulty.label}</span>}
          {difficulty && formation && <span>&middot;</span>}
          {formation && <span>{formation.label}</span>}
        </div>
      </header>

      {phase === "difficulty" && (
        <DifficultyPicker
          onSelect={(d) => {
            setDifficulty(d);
            setPhase("formation");
          }}
        />
      )}

      {phase === "formation" && (
        <FormationPicker
          onSelect={(f) => {
            setFormation(f);
            setPhase("draft");
          }}
        />
      )}

      {phase === "draft" && formation && difficulty && (
        <DraftScreen
          formation={formation}
          rerolls={difficulty.rerolls}
          onComplete={(f) => {
            setFilled(f);
            setPhase("review");
          }}
        />
      )}

      {phase === "review" && formation && filled && (
        <SquadReview formation={formation} filled={filled} onStart={() => setPhase("season")} />
      )}

      {phase === "season" && formation && filled && (
        <SeasonRunner formation={formation} filled={filled} />
      )}
    </main>
  );
}

function SquadReview({
  formation,
  filled,
  onStart,
}: {
  formation: Formation;
  filled: Record<string, DraftedPlayer>;
  onStart: () => void;
}) {
  const squad = Object.values(filled);
  const ratings = ratePlayers(squad);

  return (
    <div className="animate-fade-in-up mx-auto grid max-w-3xl gap-6 sm:grid-cols-[minmax(0,280px)_1fr]">
      <PitchFormation formation={formation} filled={filled} />
      <div className="flex flex-col justify-center gap-4">
        <h2 className="text-2xl font-bold">Your XI is ready</h2>
        <div className="grid grid-cols-4 gap-2">
          <RatingChip label="OVR" value={ratings.overall} accent="text-gold" />
          <RatingChip label="ATT" value={ratings.attack} />
          <RatingChip label="MID" value={ratings.midfield} />
          <RatingChip label="DEF" value={ratings.defense} />
        </div>
        <p className="text-sm text-muted">
          Eleven players from eleven different eras. Kick off the 38-game season and find out if this
          squad can go 38-0.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="w-fit rounded-full bg-accent px-8 py-3 font-semibold text-[#05170c] shadow-[0_0_24px_rgba(59,214,113,0.35)] transition hover:brightness-110"
        >
          Start the season
        </button>
      </div>
    </div>
  );
}

function RatingChip({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-2 py-3 text-center">
      <div className={`font-mono text-xl font-bold ${accent ?? ""}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}
