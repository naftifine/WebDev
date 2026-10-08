export const combinations = ["a00", "a01"] as const;

export type Combination = (typeof combinations)[number];

export function isCombination(value: string): value is Combination {
  return combinations.includes(value as Combination);
}
