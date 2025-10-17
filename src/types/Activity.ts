// src/types/Activity.ts
export interface Activity {
  id: number;
  title: string;
  duration: number; // minutes
  type: "fun" | "chores";
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  materials?: readonly string[];
}

export type ActivityType = Activity["type"];
export type DurationRange = "any" | "short" | "standard" | "long" | "extended";