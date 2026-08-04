"use client";

import { useMemo, useState } from "react";
import { DraftedPlayer, Formation, MatchResult } from "@/types/game";
import { mulberry32, newSeed } from "@/lib/rng";
import { generateFixtures, applyResult, emptyRecord, outcomeFor, SeasonRecord } from "@/lib/season";
import { ratePlayers } from "@/lib/team";
import { simulateMatch } from "@/lib/matchEngine";
import { MatchLive } from "@/components/MatchLive";
import { SeasonSummary } from "@/components/SeasonSummary";
import { PitchFormation } from "@/components/PitchFormation";

export function SeasonRunner({
  formation,
  filled,
}: {
  formation: Formation;
  filled: Record<string, DraftedPlayer>;
}) {
  const squad = useMemo(() => Object.values(filled), [filled]);
  const ratings = useMemo(() => ratePlayers(squad), [squad]);
  const rng = useMemo(() => mulberry32(newSeed()), []);
  const fixtures = useMemo(() => generateFixtures(rng, new Set()), [rng]);

  const [index, setIndex] = useState(0);
  const [record, setRecord] = useState<SeasonRecord>(emptyRecord());
  const [log, setLog] = useState<MatchResult[]>([]);
  const [live, setLive] = useState<MatchResult | null>(null);

  const done = index >= fixtures.length;
  const upcoming = !done ? fixtures[index] : null;

  function kickoff() {
    if (!upcoming) return;
    const result = simulateMatch(rng, upcoming, ratings, squad);
    setLive(result);
  }

  function finishMatch() {
    if (!live) return;
    setRecord((r) => applyResult(r, live));
    setLog((l) => [...l, live]);
    setLive(null);
    setIndex((i) => i + 1);
  }

  if (live) {
    return <MatchLive result={live} userClubColor="#3bd671" onContinue={finishMatch} />;
  }

  if (done) {
    return <SeasonSummary formation={formation} squad={squad} record={record} log={log} />;
  }

  const gd = record.goalsFor - record.goalsAgainst;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          <Stat label="Played" value={record.played} />
          <Stat label="W" value={record.wins} accent="text-accent" />
          <Stat label="D" value={record.draws} />
          <Stat label="L" value={record.losses} accent={record.losses > 0 ? "text-red-300" : undefined} />
          <Stat label="GD" value={gd > 0 ? `+${gd}` : gd} />
          <Stat label="Pts" value={record.points} accent="text-gold" />
        </div>

        {record.played > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {log.map((r, i) => {
              const o = outcomeFor(r);
              return (
                <span
                  key={i}
                  title={`vs ${r.fixture.opponent.clubName} (${r.fixture.opponent.seasonLabel}): ${r.userGoals}-${r.oppGoals}`}
                  className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold ${
                    o === "W" ? "bg-accent/20 text-accent" : o === "D" ? "bg-slate-500/20 text-slate-300" : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {o}
                </span>
              );
            })}
          </div>
        )}

        {record.played > 0 && record.unbeaten && (
          <div className="animate-fade-in-up rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 text-center text-sm font-medium text-gold">
            Unbeaten through {record.played} game{record.played === 1 ? "" : "s"} &mdash; chasing 38-0.
          </div>
        )}

        {upcoming && (
          <div className="animate-fade-in-up rounded-2xl border border-border bg-surface p-6 text-center">
            <div className="text-xs uppercase tracking-wide text-muted">
              Matchday {upcoming.index} of {fixtures.length}
            </div>
            <div className="my-4 flex items-center justify-center gap-4">
              <div className="text-right">
                <div className="font-semibold">Your XI</div>
                <div className="text-xs text-muted">{ratings.overall} OVR</div>
              </div>
              <div className="text-sm font-mono text-muted">{upcoming.isHome ? "vs" : "@"}</div>
              <div className="text-left">
                <div className="font-semibold">{upcoming.opponent.clubName}</div>
                <div className="text-xs text-muted">
                  {upcoming.opponent.seasonLabel} &middot; {upcoming.opponent.overall} OVR
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={kickoff}
              className="rounded-full bg-accent px-8 py-3 font-semibold text-[#05170c] shadow-[0_0_24px_rgba(59,214,113,0.35)] transition hover:brightness-110"
            >
              Kick off
            </button>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <PitchFormation formation={formation} filled={filled} compact />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-2 py-2 text-center">
      <div className={`font-mono text-lg font-bold ${accent ?? ""}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}
