export const subjects = [
  "math",
  "literature",
  "foreignLanguage",
  "physics",
  "chemistry",
  "biology",
  "history",
  "geography",
  "civics",
] as const;

export type Subject = (typeof subjects)[number];
