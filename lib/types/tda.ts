export interface PersistencePair {
  birth: number;
  death: number | null;
  dimension: number;
}

export interface PersistenceResponse {
  pairs: PersistencePair[];
  betti_summary: Record<string, number>;
  computation_time_ms: number;
}

export interface EmbeddingResponse {
  points: number[][];
  num_points: number;
}

export interface PipelineResponse {
  window_centers: number[];
  features: Record<string, number[]>;
  anomalies: boolean[];
  num_windows: number;
  computation_time_ms: number;
}

export interface ServiceHealth {
  status: "unknown" | "warming" | "healthy" | "error";
  lastChecked: number | null;
}

export const DIMENSION_COLORS: Record<number, string> = {
  0: "#1f77b4",
  1: "#ff7f0e",
  2: "#2ca02c",
};

export const DIMENSION_LABELS: Record<number, string> = {
  0: "H\u2080",
  1: "H\u2081",
  2: "H\u2082",
};
