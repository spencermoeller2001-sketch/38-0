import Link from "next/link";
import { CLUBS } from "@/data/clubs";
import { SEASONS } from "@/data/seasons";
import { totalPlayerCount } from "@/lib/data";

export default function Home() {
  const playerCount = totalPlayerCount();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <div className="mb-4 rounded-full border border-border bg-surface px-4 py-1 text-xs font-medium text-muted">
        Unofficial fan-made draft game
      </div>
      <h1 className="font-mono text-6xl font-black tracking-tight sm:text-8xl">
        38<span className="text-accent">-</span>0
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Spin the wheel, draft real players from every English top-flight season since{" "}
        {SEASONS[0].label.slice(0, 4)}, build your all-time XI, and simulate a full 38-game season.
        Can you go unbeaten?
      </p>

      <Link
        href="/play"
        className="mt-8 rounded-full bg-accent px-10 py-4 text-lg font-bold text-[#05170c] shadow-[0_0_30px_rgba(59,214,113,0.4)] transition hover:brightness-110"
      >
        Play 38-0 →
      </Link>

      <div className="mt-14 grid w-full grid-cols-3 gap-4">
        <StatBlock value={CLUBS.length} label="Top-flight clubs" />
        <StatBlock value={`${playerCount.toLocaleString()}+`} label="Player seasons" />
        <StatBlock
          value={`${SEASONS[0].label.split("-")[0]}–${SEASONS[SEASONS.length - 1].label.split("-").pop()}`}
          label="Seasons covered"
        />
      </div>

      <section className="mt-20 grid w-full gap-6 text-left sm:grid-cols-2">
        <HowItWorks step={1} title="Spin the wheel" text="Each spin lands on a real club from a specific top-flight season." />
        <HowItWorks step={2} title="Draft a player" text="Pick a player from that squad and slot them into your formation." />
        <HowItWorks step={3} title="Build your XI" text="Repeat until all 11 positions are filled across every era." />
        <HowItWorks step={4} title="Simulate the season" text="Play out 38 games live and chase a perfect, unbeaten 38-0." />
      </section>

      <footer className="mt-24 max-w-lg text-xs text-muted">
        38-0 is an independent fan project. It is not affiliated with, endorsed by, or sponsored by any
        football league, competition, club, or governing body. Player ratings are an original,
        independent interpretation for gameplay purposes.
      </footer>
    </main>
  );
}

function StatBlock({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-3 py-5">
      <div className="font-mono text-2xl font-bold text-accent sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}

function HowItWorks({ step, title, text }: { step: number; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 font-mono font-bold text-accent">
        {step}
      </div>
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted">{text}</div>
    </div>
  );
}
