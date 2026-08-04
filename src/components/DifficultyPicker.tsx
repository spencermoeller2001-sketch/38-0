"use client";

import { DIFFICULTIES, Difficulty } from "@/lib/difficulty";

export function DifficultyPicker({ onSelect }: { onSelect: (difficulty: Difficulty) => void }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-1 text-center text-2xl font-bold">Choose your difficulty</h2>
      <p className="mb-6 text-center text-sm text-muted">
        Harder difficulties give you fewer rerolls when the wheel lands somewhere unhelpful.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onSelect(d)}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-border bg-surface p-5 text-left transition hover:-translate-y-1 hover:border-accent"
          >
            <div className="flex w-full items-center justify-between">
              <span className="font-mono text-lg font-bold group-hover:text-accent">{d.label}</span>
              <span
                className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                  d.rerolls === 0
                    ? "bg-red-500/15 text-red-300"
                    : d.rerolls <= 1
                    ? "bg-amber-400/15 text-amber-300"
                    : "bg-accent/15 text-accent"
                }`}
              >
                {d.rerolls === 0 ? "0 rerolls" : `${d.rerolls} reroll${d.rerolls === 1 ? "" : "s"}`}
              </span>
            </div>
            <p className="text-sm text-muted">{d.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
