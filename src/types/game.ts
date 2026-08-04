export type Position =
  | "GK"
  | "CB"
  | "LB"
  | "RB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LM"
  | "RM"
  | "LW"
  | "RW"
  | "ST";

export interface Club {
  id: string;
  name: string;
  shortName: string;
  primary: string;
  secondary: string;
}

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  defending: number;
  physical: number;
}

export interface PlayerSeason {
  id: string;
  playerName: string;
  clubId: string;
  seasonId: string;
  position: Position;
  overall: number;
  attributes: PlayerAttributes;
  note?: string;
}

export interface SeasonInfo {
  id: string;
  label: string;
  clubIds: string[];
}

export interface FormationSlot {
  id: string;
  position: Position;
  x: number;
  y: number;
}

export interface Formation {
  id: string;
  label: string;
  slots: FormationSlot[];
}

export interface DraftedPlayer extends PlayerSeason {
  slotId: string;
}

export type MatchEventType =
  | "goal"
  | "chance"
  | "save"
  | "woodwork"
  | "yellow"
  | "kickoff"
  | "halftime"
  | "fulltime";

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  side: "user" | "opponent" | "neutral";
  text: string;
  playerName?: string;
}

export interface Opponent {
  clubId: string;
  seasonId: string;
  clubName: string;
  seasonLabel: string;
  primary: string;
  secondary: string;
  overall: number;
  attack: number;
  midfield: number;
  defense: number;
  players: PlayerSeason[];
}

export interface Fixture {
  index: number;
  opponent: Opponent;
  isHome: boolean;
}

export interface MatchResult {
  fixture: Fixture;
  userGoals: number;
  oppGoals: number;
  events: MatchEvent[];
}

export type MatchOutcome = "W" | "D" | "L";

