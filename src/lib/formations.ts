import { Formation } from "@/types/game";

export const FORMATIONS: Formation[] = [
  {
    id: "4-3-3",
    label: "4-3-3",
    slots: [
      { id: "gk", position: "GK", x: 50, y: 93 },
      { id: "lb", position: "LB", x: 15, y: 76 },
      { id: "cb1", position: "CB", x: 37, y: 80 },
      { id: "cb2", position: "CB", x: 63, y: 80 },
      { id: "rb", position: "RB", x: 85, y: 76 },
      { id: "cm1", position: "CM", x: 28, y: 54 },
      { id: "cdm", position: "CDM", x: 50, y: 60 },
      { id: "cm2", position: "CM", x: 72, y: 54 },
      { id: "lw", position: "LW", x: 18, y: 24 },
      { id: "st", position: "ST", x: 50, y: 14 },
      { id: "rw", position: "RW", x: 82, y: 24 },
    ],
  },
  {
    id: "4-4-2",
    label: "4-4-2",
    slots: [
      { id: "gk", position: "GK", x: 50, y: 93 },
      { id: "lb", position: "LB", x: 15, y: 76 },
      { id: "cb1", position: "CB", x: 37, y: 80 },
      { id: "cb2", position: "CB", x: 63, y: 80 },
      { id: "rb", position: "RB", x: 85, y: 76 },
      { id: "lm", position: "LM", x: 13, y: 50 },
      { id: "cm1", position: "CM", x: 38, y: 53 },
      { id: "cm2", position: "CM", x: 62, y: 53 },
      { id: "rm", position: "RM", x: 87, y: 50 },
      { id: "st1", position: "ST", x: 38, y: 17 },
      { id: "st2", position: "ST", x: 62, y: 17 },
    ],
  },
  {
    id: "4-2-3-1",
    label: "4-2-3-1",
    slots: [
      { id: "gk", position: "GK", x: 50, y: 93 },
      { id: "lb", position: "LB", x: 15, y: 76 },
      { id: "cb1", position: "CB", x: 37, y: 80 },
      { id: "cb2", position: "CB", x: 63, y: 80 },
      { id: "rb", position: "RB", x: 85, y: 76 },
      { id: "cdm1", position: "CDM", x: 38, y: 62 },
      { id: "cdm2", position: "CDM", x: 62, y: 62 },
      { id: "lm", position: "LM", x: 18, y: 38 },
      { id: "cam", position: "CAM", x: 50, y: 35 },
      { id: "rm", position: "RM", x: 82, y: 38 },
      { id: "st", position: "ST", x: 50, y: 14 },
    ],
  },
];

export const POSITION_GROUP: Record<string, "GK" | "DEF" | "MID" | "FWD"> = {
  GK: "GK",
  CB: "DEF",
  LB: "DEF",
  RB: "DEF",
  CDM: "MID",
  CM: "MID",
  CAM: "MID",
  LM: "MID",
  RM: "MID",
  LW: "FWD",
  RW: "FWD",
  ST: "FWD",
};

export function getFormation(id: string): Formation {
  return FORMATIONS.find((f) => f.id === id) ?? FORMATIONS[0];
}
