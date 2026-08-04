"use client";

import { useEffect, useRef, useState } from "react";
import { MatchResult } from "@/types/game";
import { CLUB_MAP } from "@/data/clubs";

const EVENT_DELAY_MS: Record<string, number> = {
  goal: 1600,
  chance: 750,
  save: 700,
  woodwork: 700,
  yellow: 600,
  kickoff: 500,
  halftime: 900,
  fulltime: 400,
};

function ballTop(side: string): number {
  if (side === "user") return 18;
  if (side === "opponent") return 82;
  return 50;
}

export function MatchLive({
  result,
  userClubColor = "#3bd671",
  onContinue,
}: {
  result: MatchResult;
  userClubColor?: string;
  onContinue: () => void;
}) {
  const { fixture, events, userGoals, oppGoals } = result;
  const opp = fixture.opponent;
  const [revealed, setRevealed] = useState(1);
  const tickerRef = useRef<HTMLDivElement>(null);
  const finished = revealed >= events.length;

  useEffect(() => {
    if (finished) return;
    const current = events[revealed - 1];
    const delay = EVENT_DELAY_MS[current?.type ?? "chance"] ?? 700;
    const t = setTimeout(() => setRevealed((r) => Math.min(events.length, r + 1)), delay);
    return () => clearTimeout(t);
  }, [revealed, events, finished]);

  useEffect(() => {
    tickerRef.current?.scrollTo({ top: tickerRef.current.scrollHeight, behavior: "smooth" });
  }, [revealed]);

  function skip() {
    setRevealed(events.length);
  }

  const visibleEvents = events.slice(0, revealed);
  const shownUserGoals = visibleEvents.filter((e) => e.type === "goal" && e.side === "user").length;
  const shownOppGoals = visibleEvents.filter((e) => e.type === "goal" && e.side === "opponent").length;
  const lastEvent = visibleEvents[visibleEvents.length - 1];
  const minute = lastEvent ? Math.min(90, lastEvent.minute) : 0;
  const lastIsGoal = lastEvent?.type === "goal";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="h-8 w-8 rounded-full" style={{ backgroundColor: userClubColor }} />
          <span className="font-semibold">Your XI</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-2 font-mono text-2xl font-bold">
          <span>{shownUserGoals}</span>
          <span className="text-muted">-</span>
          <span>{shownOppGoals}</span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 text-right">
          <span className="font-semibold">{opp.clubName}</span>
          <div className="h-8 w-8 rounded-full" style={{ backgroundColor: opp.primary }} />
        </div>
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-muted">
        <span>
          {fixture.isHome ? "Home" : "Away"} &middot; {opp.seasonLabel} {opp.clubName}
        </span>
        <span className="font-mono">{finished ? "FT" : `${minute}'`}</span>
      </div>

      <div
        className={`relative h-40 overflow-hidden rounded-2xl border border-border ${
          lastEvent?.type === "goal" ? "animate-goal-flash" : ""
        }`}
        style={{ background: "linear-gradient(180deg, #0f6b3c 0%, var(--pitch) 100%)" }}
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/20" />
        <div
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow transition-all duration-700 ease-out"
          style={{ top: `${ballTop(lastEvent?.side ?? "neutral")}%` }}
        />
        {lastIsGoal && (
          <div className="animate-pop-in absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-black/60 px-4 py-1 text-lg font-extrabold tracking-wide text-gold">
              GOAL!
            </span>
          </div>
        )}
      </div>

      <div ref={tickerRef} className="scrollbar-thin h-48 overflow-y-auto rounded-2xl border border-border bg-surface p-3">
        <div className="flex flex-col gap-1.5">
          {visibleEvents.map((e, i) => (
            <div
              key={i}
              className={`animate-fade-in-up flex gap-2 rounded-lg px-2 py-1 text-sm ${
                e.type === "goal"
                  ? e.side === "user"
                    ? "bg-accent/15 text-accent"
                    : "bg-red-500/10 text-red-300"
                  : "text-foreground/80"
              }`}
            >
              <span className="w-8 shrink-0 font-mono text-xs text-muted">
                {e.type === "halftime" || e.type === "fulltime" ? "" : `${e.minute}'`}
              </span>
              <span>{e.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {!finished ? (
          <button
            type="button"
            onClick={skip}
            className="rounded-full border border-border px-6 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-accent"
          >
            Skip to full time
          </button>
        ) : (
          <button
            type="button"
            onClick={onContinue}
            className="animate-fade-in-up rounded-full bg-accent px-8 py-3 font-semibold text-[#05170c] shadow-[0_0_24px_rgba(59,214,113,0.35)] transition hover:brightness-110"
          >
            {userGoals > oppGoals ? "Nice win — continue" : userGoals === oppGoals ? "Continue" : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}
