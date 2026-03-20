"use client";

import { useState, useCallback } from "react";
import { FinanceAnalysisResponse, FinanceParams, DEFAULT_FINANCE_PARAMS, FinanceWindowResponse } from "@/lib/types/finance";
import { apiStream, apiFetch } from "@/lib/api/client";

export interface FinancePipelineState {
  params: FinanceParams;
  result: FinanceAnalysisResponse | null;
  windowDetail: FinanceWindowResponse | null;
  selectedWindow: number;
  isRunning: boolean;
  isLoadingWindow: boolean;
  progressPct: number;
  progressMessage: string;
  error: string | null;
  setParams: (p: Partial<FinanceParams>) => void;
  runAnalysis: () => void;
  selectWindow: (idx: number) => void;
}

export function useFinancePipeline(): FinancePipelineState {
  const [params, setParamsState] = useState<FinanceParams>(DEFAULT_FINANCE_PARAMS);
  const [result, setResult] = useState<FinanceAnalysisResponse | null>(null);
  const [windowDetail, setWindowDetail] = useState<FinanceWindowResponse | null>(null);
  const [selectedWindow, setSelectedWindow] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingWindow, setIsLoadingWindow] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setParams = useCallback((partial: Partial<FinanceParams>) => {
    setParamsState((prev) => ({ ...prev, ...partial }));
  }, []);

  const runAnalysis = useCallback(() => {
    setIsRunning(true);
    setError(null);
    setProgressPct(0);
    setProgressMessage("Starting analysis...");

    apiStream(
      "/api/finance?path=analyze-stream",
      params,
      (progress) => {
        setProgressPct(progress.progress as number ?? 0);
        setProgressMessage(`Window ${progress.step}/${progress.total}`);
      },
      (data) => {
        setResult(data as unknown as FinanceAnalysisResponse);
        setIsRunning(false);
        setProgressPct(100);
      },
      (err) => {
        setError(err.message);
        setIsRunning(false);
      },
    );
  }, [params]);

  const selectWindow = useCallback(
    async (idx: number) => {
      setSelectedWindow(idx);
      setIsLoadingWindow(true);

      try {
        const detail = await apiFetch<FinanceWindowResponse>(
          "/api/finance?path=window-detail",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              window_index: idx,
              tickers: params.tickers,
              date_range: params.date_range,
              window_size: params.window_size,
              step_size: params.step_size,
              max_dimension: params.max_dimension,
              max_edge_length_percentile: params.max_edge_length_percentile,
            }),
          },
        );
        setWindowDetail(detail);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoadingWindow(false);
      }
    },
    [params],
  );

  return {
    params,
    result,
    windowDetail,
    selectedWindow,
    isRunning,
    isLoadingWindow,
    progressPct,
    progressMessage,
    error,
    setParams,
    runAnalysis,
    selectWindow,
  };
}
