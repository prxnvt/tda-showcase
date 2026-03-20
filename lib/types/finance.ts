export interface CrisisEvent {
  name: string;
  date: string;
  detected: boolean;
  lead_lag_days: number | null;
}

export interface FinanceAnalysisResponse {
  dates: string[];
  features: Record<string, number[]>;
  anomalies: boolean[];
  sp500_dates: string[];
  sp500_values: number[];
  crisis_events: CrisisEvent[];
  detection_rate: string;
  computation_time_ms: number;
  num_windows: number;
}

export interface FinanceWindowResponse {
  pairs: import("./tda").PersistencePair[];
  correlation_matrix: number[][];
  tickers: string[];
  date_range: [string, string];
}

export interface FinanceMetadata {
  tickers: string[];
  date_range: [string, string];
  num_trading_days: number;
}

export interface FinanceParams {
  tickers: string[] | null;
  date_range: [string, string] | null;
  window_size: number;
  step_size: number;
  max_dimension: number;
  max_edge_length_percentile: number;
  anomaly_threshold_sigma: number;
  rolling_lookback: number;
}

export const DEFAULT_FINANCE_PARAMS: FinanceParams = {
  tickers: null,
  date_range: null,
  window_size: 30,
  step_size: 5,
  max_dimension: 1,
  max_edge_length_percentile: 90,
  anomaly_threshold_sigma: 2.0,
  rolling_lookback: 50,
};
