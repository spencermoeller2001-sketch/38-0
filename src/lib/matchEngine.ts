import { DraftedPlayer, Fixture, MatchEvent, MatchResult, PlayerSeason } from "@/types/game";
import { TeamRatings } from "@/lib/team";
import { Rng, randInt, samplePoisson, weightedPick } from "@/lib/rng";
import { POSITION_GROUP } from "@/lib/formations";

const HOME_ADVANTAGE = 0.18;

function expectedGoals(attack: number, opponentDefense: number, isHome: boolean): number {
  const diff = attack - opponentDefense;
  let xg = 1.35 + diff / 28;
  if (isHome) xg += HOME_ADVANTAGE;
  return Math.min(5.5, Math.max(0.15, xg));
}

function scorerPool(players: (PlayerSeason | DraftedPlayer)[]): (PlayerSeason | DraftedPlayer)[] {
  const attackers = players.filter((p) => POSITION_GROUP[p.position] === "FWD");
  const mids = players.filter((p) => POSITION_GROUP[p.position] === "MID");
  const pool = attackers.length ? [...attackers, ...mids] : players;
  return pool;
}

function pickScorer(rng: Rng, players: (PlayerSeason | DraftedPlayer)[]): PlayerSeason | DraftedPlayer | null {
  const pool = scorerPool(players);
  if (pool.length === 0) return null;
  return weightedPick(rng, pool, (p) => Math.pow(p.attributes.shooting + 1, 2));
}

const CHANCE_LINES = [
  "curls a shot just wide",
  "forces a smart save",
  "sees a header cleared off the line",
  "fires straight at the keeper",
  "is denied by a last-ditch tackle",
  "rattles the crossbar",
  "shoots over the bar under pressure",
  "has a strong penalty shout waved away",
];

const GOAL_LINES = [
  "finishes clinically",
  "smashes it into the top corner",
  "taps in from close range",
  "curls a beauty into the far post",
  "heads home from a corner",
  "slots it past the keeper",
  "finds the net with a stunning strike",
];

export function simulateMatch(
  rng: Rng,
  fixture: Fixture,
  userRatings: TeamRatings,
  userSquad: DraftedPlayer[]
): MatchResult {
  const opp = fixture.opponent;
  const userXg = expectedGoals(userRatings.attack, opp.defense, fixture.isHome);
  const oppXg = expectedGoals(opp.attack, userRatings.defense, !fixture.isHome);

  const userGoals = Math.min(9, samplePoisson(rng, userXg));
  const oppGoals = Math.min(9, samplePoisson(rng, oppXg));

  const events: MatchEvent[] = [];
  events.push({ minute: 0, type: "kickoff", side: "neutral", text: `Kickoff! You ${fixture.isHome ? "host" : "travel to face"} ${opp.clubName} (${opp.seasonLabel}).` });

  const usedMinutes = new Set<number>();
  const uniqueMinute = (): number => {
    let m = randInt(rng, 2, 90);
    while (usedMinutes.has(m)) m = randInt(rng, 2, 90);
    usedMinutes.add(m);
    return m;
  };

  for (let i = 0; i < userGoals; i++) {
    const scorer = pickScorer(rng, userSquad);
    const minute = uniqueMinute();
    const line = GOAL_LINES[randInt(rng, 0, GOAL_LINES.length - 1)];
    events.push({
      minute,
      type: "goal",
      side: "user",
      playerName: scorer?.playerName,
      text: scorer ? `GOAL! ${scorer.playerName} ${line}. Your XI ahead!` : `GOAL for your XI!`,
    });
  }

  for (let i = 0; i < oppGoals; i++) {
    const scorer = pickScorer(rng, opp.players);
    const minute = uniqueMinute();
    const line = GOAL_LINES[randInt(rng, 0, GOAL_LINES.length - 1)];
    events.push({
      minute,
      type: "goal",
      side: "opponent",
      playerName: scorer?.playerName,
      text: scorer
        ? `GOAL for ${opp.clubName}! ${scorer.playerName} ${line}.`
        : `GOAL for ${opp.clubName}!`,
    });
  }

  const chanceCount = randInt(rng, 4, 8);
  for (let i = 0; i < chanceCount; i++) {
    const side: "user" | "opponent" = rng() < userRatings.attack / (userRatings.attack + opp.attack) ? "user" : "opponent";
    const minute = uniqueMinute();
    const squad = side === "user" ? userSquad : opp.players;
    const player = pickScorer(rng, squad);
    const line = CHANCE_LINES[randInt(rng, 0, CHANCE_LINES.length - 1)];
    const club = side === "user" ? "Your XI" : opp.clubName;
    events.push({
      minute,
      type: "chance",
      side,
      playerName: player?.playerName,
      text: player ? `${club}: ${player.playerName} ${line}.` : `${club} ${line}.`,
    });
  }

  events.sort((a, b) => a.minute - b.minute);
  events.splice(
    events.findIndex((e) => e.minute > 45) === -1 ? events.length : events.findIndex((e) => e.minute > 45),
    0,
    { minute: 45, type: "halftime", side: "neutral", text: "Halftime." }
  );
  events.push({ minute: 90, type: "fulltime", side: "neutral", text: "Full time." });

  return { fixture, userGoals, oppGoals, events };
}
