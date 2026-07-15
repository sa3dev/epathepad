export const DISCIPLINES = [
  "MUSIC",
  "DANCE",
  "THEATER",
  "MAGIC",
  "CIRCUS",
  "STORYTELLING",
  "OTHER",
] as const;

export type Discipline = (typeof DISCIPLINES)[number];

export const DISCIPLINE_LABELS: Record<Discipline, string> = {
  MUSIC: "Musique",
  DANCE: "Danse",
  THEATER: "Théâtre",
  MAGIC: "Magie",
  CIRCUS: "Cirque",
  STORYTELLING: "Conte",
  OTHER: "Autre",
};
