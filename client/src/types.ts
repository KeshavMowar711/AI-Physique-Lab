export type Goal = "cut" | "bulk" | "recomp";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
}

export interface AuthUserResponse {
  user: User;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AiReport {
  summary: string;
  changesObserved: string[];
  laggingMuscles: string[];
  workoutSuggestions: string[];
  dietSuggestions: string[];
  confidenceNote: string;
}

export interface CheckIn {
  _id?: string;
  date: string;
  goal: Goal;
  weightKg: number;
  calories?: number;
  workoutNotes: string;
  photos: {
    front: string;
    side: string;
    back: string;
  };
  aiReport?: AiReport;
}

export interface UploadSignature {
  timestamp: number;
  folder: string;
  signature: string;
  cloudName: string;
  apiKey: string;
}

export interface DashboardResponse {
  overview: {
    totalCheckIns: number;
    latestWeightKg: number | null;
    currentGoal: Goal | null;
    lastUpdated: string | null;
  };
  latestReport: AiReport | null;
  history: CheckIn[];
  comparison: {
    weightDeltaKg: number;
    daysBetween: number;
  } | null;
}