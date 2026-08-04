# 38-0

An unofficial, fan-made football draft game. Spin a wheel to land on a real
English top-flight club and season, draft a player from that squad, and
repeat until your XI is complete. Then simulate a 38-game season, live, and
see if your squad can go unbeaten.

Built with Next.js, TypeScript, and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

- **Formation** — choose 4-3-3, 4-4-2, or 4-2-3-1.
- **Draft** — spin the wheel, pick a player from the landed club/season, repeat
  for all 11 slots. Players are drawn from a hand-curated dataset covering
  every English top-flight season from 1992-93 to 2025-26 across 51 clubs
  (`src/data/players/`), with independent 1-99 ratings for gameplay.
- **Season** — simulate 38 fixtures against opponents drawn from the same
  pool of historical club-seasons, with a live match viewer (event ticker +
  animated mini-pitch) and a running record/table.
- **Summary** — final record, shareable result grid, and full fixture list.

## Project structure

- `src/types/game.ts` — core data model (players, clubs, seasons, formations, matches).
- `src/data/` — canonical clubs list, season-by-club participation table, and player-season dataset.
- `src/lib/` — draft logic, match simulation engine, season/fixture generation, team rating math.
- `src/components/` — UI: wheel, draft screen, pitch/formation view, live match viewer, season dashboard.

## Disclaimer

38-0 is an independent fan project. It is not affiliated with, endorsed by,
or sponsored by any football league, competition, club, or governing body.
Player ratings are an original, independent interpretation for gameplay
purposes.
