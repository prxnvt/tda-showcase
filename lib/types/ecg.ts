export interface ECGRecord {
  id: string;
  description: string;
  num_samples: number;
  sample_rate: number;
}

export interface ECGAnnotation {
  sample_index: number;
  label: string;
}

export interface ECGSignalResponse {
  signal: number[];
  sample_rate: number;
  annotations: ECGAnnotation[];
}

export interface ArrhythmiaRegion {
  start: number;
  end: number;
  labels: string[];
}

export interface ECGEvaluation {
  sensitivity: number;
  precision: number;
  f1: number;
  true_positives: number;
  false_positives: number;
  false_negatives: number;
}

export interface ECGAnalysisResponse {
  filtered_signal: number[];
  window_centers: number[];
  features: Record<string, number[]>;
  anomalies: boolean[];
  evaluation: ECGEvaluation;
  arrhythmia_regions: ArrhythmiaRegion[];
  computation_time_ms: number;
}

export interface ECGWindowResponse {
  embedding_points: number[][];
  pairs: import("./tda").PersistencePair[];
  signal_segment: number[];
  segment_start: number;
}

export interface ECGParams {
  record_id: string;
  start_sample: number;
  end_sample: number;
  window_size: number;
  step_size: number;
  embedding_delay: number;
  embedding_dimension: number;
  subsample_size: number;
  max_edge_length: number | "auto";
  anomaly_threshold_sigma: number;
}

export const DEFAULT_ECG_PARAMS: ECGParams = {
  record_id: "207",
  start_sample: 0,
  end_sample: 108000,
  window_size: 1200,
  step_size: 100,
  embedding_delay: 3,
  embedding_dimension: 3,
  subsample_size: 100,
  max_edge_length: "auto",
  anomaly_threshold_sigma: 2.0,
};

export const ECG_RECORDS: ECGRecord[] = [
  { id: "100", description: "Normal sinus rhythm", num_samples: 650000, sample_rate: 360 },
  { id: "207", description: "Frequent PVCs, ventricular tachycardia", num_samples: 650000, sample_rate: 360 },
  { id: "228", description: "Mixed normal and arrhythmia", num_samples: 650000, sample_rate: 360 },
  { id: "217", description: "Ventricular flutter/fibrillation", num_samples: 650000, sample_rate: 360 },
];
