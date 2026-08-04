"use client";

import { FORMATIONS } from "@/lib/formations";
import { Formation } from "@/types/game";
import { PitchFormation } from "@/components/PitchFormation";

export function FormationPicker({ onSelect }: { onSelect: (formation: Formation) => void }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-1 text-center text-2xl font-bold">Choose your formation</h2>
      <p className="mb-6 text-center text-sm text-muted">
        You&apos;ll draft real players from English top-flight history to fill every slot.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {FORMATIONS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f)}
            className="group rounded-2xl border border-border bg-surface p-3 text-center transition hover:-translate-y-1 hover:border-accent"
          >
            <div className="pointer-events-none">
              <PitchFormation formation={f} filled={{}} compact />
            </div>
            <div className="mt-2 font-mono font-bold group-hover:text-accent">{f.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
