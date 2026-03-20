"use client";

import { useState, useCallback } from "react";
import {
  ECGAnalysisResponse,
  ECGWindowResponse,
  ECGParams,
  DEFAULT_ECG_PARAMS,
} from "@/lib/types/ecg";
import { apiStream, apiFetch } from "@/lib/api/client";

export interface ECGPipelineState {
  params: ECGParams;
  result: ECGAnalysisResponse | null;
  windowDetail: ECGWindowResponse | null;
  selectedWindow: number;
  isRunning: boolean;
  isLoadingWindow: boolean;
  progressPct: number;
  progressMessage: string;
  error: string | null;
  setParams: (p: Partial<ECGParams>) => void;
  runAnalysis: () => void;
  selectWindow: (idx: number) => void;
}

export function useECGPipeline(): ECGPipelineState {
  const [params, setParamsState] = useState<ECGParams>(DEFAULT_ECG_PARAMS);
  const [result, setResult] = useState<ECGAnalysisResponse | null>(null);
  const [windowDetail, setWindowDetail] = useState<ECGWindowResponse | null>(null);
  const [selectedWindow, setSelectedWindow] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingWindow, setIsLoadingWindow] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setParams = useCallback((partial: Partial<ECGParams>) => {
    setParamsState((prev) => ({ ...prev, ...partial }));
  }, []);

  const runAnalysis = useCallback(() => {
    setIsRunning(true);
    setError(null);
    setProgressPct(0);
    setProgressMessage("Starting ECG analysis...");

    apiStream(
      "/api/ecg?path=analyze-stream",
      {
        ...params,
        max_edge_length: params.max_edge_length === "auto" ? null : params.max_edge_length,
      },
      (progress) => {
        setProgressPct((progress.progress as number) ?? 0);
        setProgressMessage(`Window ${progress.step}/${progress.total}`);
      },
      (data) => {
        setResult(data as unknown as ECGAnalysisResponse);
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
        const detail = await apiFetch<ECGWindowResponse>(
          "/api/ecg?path=window-detail",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              record_id: params.record_id,
              window_index: idx,
              start_sample: params.start_sample,
              end_sample: params.end_sample,
              window_size: params.window_size,
              step_size: params.step_size,
              embedding_delay: params.embedding_delay,
              embedding_dimension: params.embedding_dimension,
              subsample_size: params.subsample_size,
              max_edge_length: params.max_edge_length === "auto" ? null : params.max_edge_length,
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
