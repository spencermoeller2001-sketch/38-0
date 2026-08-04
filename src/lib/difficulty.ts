export interface Difficulty {
  id: string;
  label: string;
  rerolls: number;
  description: string;
}

export const DIFFICULTIES: Difficulty[] = [
  {
    id: "sunday-league",
    label: "Sunday League",
    rerolls: 6,
    description: "6 rerolls. Spin away the duds and steer toward the squad you want.",
  },
  {
    id: "championship",
    label: "Championship",
    rerolls: 3,
    description: "3 rerolls. Use them wisely.",
  },
  {
    id: "premier-league",
    label: "Premier League",
    rerolls: 1,
    description: "Just 1 reroll. Almost every spin sticks.",
  },
  {
    id: "invincible",
    label: "Invincible",
    rerolls: 0,
    description: "No rerolls. Whoever the wheel gives you, you draft.",
  },
];

export function getDifficulty(id: string): Difficulty {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[0];
}
