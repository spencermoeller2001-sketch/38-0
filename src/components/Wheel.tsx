"use client";

import { useEffect, useRef, useState } from "react";
import { CLUB_MAP } from "@/data/clubs";
import { SEASON_MAP } from "@/data/seasons";
import { playableClubSeasons } from "@/lib/data";
import { readableTextColor } from "@/lib/color";

const ITEM_WIDTH = 108;
const REEL_LENGTH = 36;
const LANDING_INDEX = 30;

interface ReelItem {
  clubId: string;
  seasonId: string;
  key: string;
}

let pool: { clubId: string; seasonId: string }[] | null = null;
function getPool() {
  if (!pool) pool = playableClubSeasons();
  return pool;
}

function randomItem(): { clubId: string; seasonId: string } {
  const p = getPool();
  return p[Math.floor(Math.random() * p.length)];
}

export function Wheel({
  onLanded,
  pickNext,
  disabled,
}: {
  onLanded: (choice: { clubId: string; seasonId: string }) => void;
  pickNext: () => { clubId: string; seasonId: string };
  disabled?: boolean;
}) {
  const [reel, setReel] = useState<ReelItem[]>(() =>
    Array.from({ length: REEL_LENGTH }, (_, i) => ({ ...randomItem(), key: `init-${i}` }))
  );
  const [offset, setOffset] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [transitionOn, setTransitionOn] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  function spin() {
    if (spinning || disabled) return;
    const target = pickNext();
    const newReel: ReelItem[] = Array.from({ length: REEL_LENGTH }, (_, i) => {
      if (i === LANDING_INDEX) return { ...target, key: `land-${Date.now()}` };
      return { ...randomItem(), key: `r-${Date.now()}-${i}` };
    });

    setTransitionOn(false);
    setOffset(0);
    setReel(newReel);
    setSpinning(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionOn(true);
        setOffset(-(LANDING_INDEX * ITEM_WIDTH));
      });
    });
  }

  function handleTransitionEnd() {
    if (!spinning) return;
    setSpinning(false);
    const target = reel[LANDING_INDEX];
    onLanded({ clubId: target.clubId, seasonId: target.seasonId });
  }

  useEffect(() => {
    // preload pool early
    getPool();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[108px] -translate-x-1/2 border-x-2 border-gold/80 bg-gold/5" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-surface to-transparent" />
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className="flex py-4"
          style={{
            transform: `translateX(calc(50% - ${ITEM_WIDTH / 2}px + ${offset}px))`,
            transition: transitionOn ? "transform 3.2s cubic-bezier(0.11, 0.83, 0.14, 1)" : "none",
          }}
        >
          {reel.map((item) => {
            const club = CLUB_MAP[item.clubId];
            const season = SEASON_MAP[item.seasonId];
            return (
              <div
                key={item.key}
                className="flex shrink-0 flex-col items-center justify-center gap-1"
                style={{ width: ITEM_WIDTH }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-[11px] font-bold shadow"
                  style={{
                    backgroundColor: club?.primary ?? "#334155",
                    color: readableTextColor(club?.primary ?? "#334155"),
                  }}
                >
                  {club?.shortName ?? "?"}
                </div>
                <div className="text-center text-[11px] font-medium leading-tight text-foreground">
                  {club?.name ?? item.clubId}
                </div>
                <div className="text-[10px] text-muted">{season?.label ?? item.seasonId}</div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={spin}
        disabled={spinning || disabled}
        className="w-full max-w-md rounded-full bg-accent px-6 py-3 text-center font-semibold text-[#05170c] shadow-[0_0_24px_rgba(59,214,113,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {spinning ? "Spinning..." : disabled ? "Squad complete" : "Spin the wheel"}
      </button>
    </div>
  );
}
