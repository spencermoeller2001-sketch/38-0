"use client";

import { useState } from "react";
import { DraftedPlayer, Formation, MatchResult } from "@/types/game";
import { SeasonRecord, outcomeFor } from "@/lib/season";
import { PitchFormation } from "@/components/PitchFormation";

function verdict(record: SeasonRecord): { title: string; tone: string } {
  if (record.perfect) return { title: "38-0. Perfect season.", tone: "text-gold" };
  if (record.unbeaten) return { title: "Unbeaten season!", tone: "text-accent" };
  if (record.points >= 90) return { title: "Title-winning form.", tone: "text-accent" };
  if (record.points >= 70) return { title: "Champions League class.", tone: "text-sky-300" };
  if (record.points >= 45) return { title: "Solid mid-table season.", tone: "text-foreground" };
  if (record.points >= 34) return { title: "Survived the drop.", tone: "text-amber-300" };
  return { title: "Relegated.", tone: "text-red-300" };
}

export function SeasonSummary({
  formation,
  squad,
  record,
  log,
}: {
  formation: Formation;
  squad: DraftedPlayer[];
  record: SeasonRecord;
  log: MatchResult[];
}) {
  const [copied, setCopied] = useState(false);
  const v = verdict(record);
  const gd = record.goalsFor - record.goalsAgainst;

  const filled = Object.fromEntries(squad.map((p) => [p.slotId, p])) as Record<string, DraftedPlayer>;

  const grid = log
    .map((r) => (outcomeFor(r) === "W" ? "🟩" : outcomeFor(r) === "D" ? "⬜" : "🟥"))
    .join("");

  const shareText = `38-0 (my version)\n${record.wins}W ${record.draws}D ${record.losses}L · ${record.points} pts · GD ${gd >= 0 ? "+" : ""}${gd}\n${grid}`;

  function share() {
    navigator.clipboard?.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 pb-12">
      <div className="animate-fade-in-up rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="text-xs uppercase tracking-widest text-muted">Season complete</div>
        <div className={`mt-2 text-3xl font-extrabold ${v.tone}`}>{v.title}</div>
        <div className="mt-4 font-mono text-4xl font-black tracking-tight">
          {record.wins}-{record.draws}-{record.losses}
        </div>
        <div className="mt-1 text-sm text-muted">
          {record.points} points &middot; {record.goalsFor} scored &middot; {record.goalsAgainst} conceded &middot; GD{" "}
          {gd >= 0 ? "+" : ""}
          {gd}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-[240px_minmax(0,1fr)]">
        <PitchFormation formation={formation} filled={filled} compact />
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold text-muted">Full record</div>
          <div className="flex flex-wrap gap-1.5">
            {log.map((r, i) => {
              const o = outcomeFor(r);
              return (
                <span
                  key={i}
                  title={`Matchday ${r.fixture.index} ${r.fixture.isHome ? "vs" : "@"} ${r.fixture.opponent.clubName} (${r.fixture.opponent.seasonLabel}): ${r.userGoals}-${r.oppGoals}`}
                  className={`flex h-7 w-7 items-center justify-center rounded text-[11px] font-bold ${
                    o === "W" ? "bg-accent/20 text-accent" : o === "D" ? "bg-slate-500/20 text-slate-300" : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {o}
                </span>
              );
            })}
          </div>
          <button
            type="button"
            onClick={share}
            className="mt-2 w-fit rounded-full border border-accent/50 px-5 py-2 text-sm font-semibold text-accent transition hover:bg-accent/10"
          >
            {copied ? "Copied!" : "Copy result to share"}
          </button>
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold text-muted">Fixture list</div>
        <div className="scrollbar-thin max-h-64 overflow-y-auto rounded-2xl border border-border bg-surface">
          {log.map((r, i) => {
            const o = outcomeFor(r);
            return (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-sm last:border-b-0"
              >
                <span className="text-muted">
                  MD{r.fixture.index} {r.fixture.isHome ? "vs" : "@"} {r.fixture.opponent.clubName}{" "}
                  <span className="text-xs">({r.fixture.opponent.seasonLabel})</span>
                </span>
                <span className="flex items-center gap-2 font-mono">
                  {r.userGoals}-{r.oppGoals}
                  <span
                    className={`rounded px-1.5 text-[10px] font-bold ${
                      o === "W" ? "bg-accent/20 text-accent" : o === "D" ? "bg-slate-500/20 text-slate-300" : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {o}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mx-auto rounded-full bg-accent px-8 py-3 font-semibold text-[#05170c] shadow-[0_0_24px_rgba(59,214,113,0.35)] transition hover:brightness-110"
      >
        Build another XI
      </button>
    </div>
  );
}
