# TDA Showcase — TODO

## Deployment (your action items)

- [ ] **Render: TDA Core Service** — Create Render web service, connect `prxnvt/tda-pipeline`, Docker deploy, port 8000
- [ ] **Render: Finance Service** — Create Render web service, connect `prxnvt/finance-regime`, Docker deploy, port 8000
- [ ] **Render: ECG Service** — Create Render web service, connect `prxnvt/arrhythmia`, Docker deploy, port 8000
- [ ] **Vercel: tda-showcase** — Connect `prxnvt/tda-showcase`, set env vars:
  - `TDA_SERVICE_URL` = Render URL for TDA Core
  - `FINANCE_SERVICE_URL` = Render URL for Finance
  - `ECG_SERVICE_URL` = Render URL for ECG
  - `SYNTHETIC_SERVICE_URL` = existing synthetic-signals URL
- [ ] **Optional: UptimeRobot** — Free tier, ping each Render service every 14 min to prevent cold starts

## Seismic Tab (build next)

Backend service: `~/Workspace/seismic-events/service/` — same pattern as arrhythmia.

- [ ] **Data loader** (`core/data_loader.py`) — Use `obspy` to pull seismograph data from IRIS FDSN
  - Suggested events:
    - 2011-03-11 Tohoku, Japan (M9.1) — station IU.MAJO
    - 2010-01-12 Haiti (M7.0) — station CU.ANWB
    - 2015-04-25 Nepal Gorkha (M7.8) — station II.NIL
    - 2023-02-06 Turkey-Syria (M7.8) — station II.ANTO
    - 2019-07-06 Ridgecrest, CA (M7.1) — station CI.CLC
  - Pull 1hr waveforms centered on event time (30min quiet + event + aftershocks)
  - BHZ channel (broadband vertical), 1 sample/sec after decimation
  - Cache as JSON in `data/`
- [ ] **Preprocessing** (`core/preprocessing.py`) — Bandpass filter (0.01-1.0 Hz), detrend, z-score normalize
- [ ] **Detector** (`core/detector.py`) — Same as ECG: Takens embedding -> persistence -> features -> anomaly detection
  - Parameters: window_size=600 samples (~10min), step_size=60, embedding_delay=5, embedding_dimension=3, subsample_size=100
- [ ] **Evaluation** (`core/evaluation.py`) — Compare TDA flags vs known event onset times
- [ ] **API endpoints** — records, analyze, analyze-stream (SSE), window-detail, health
- [ ] **Frontend** — SeismicSidebar, SeismicSignalPlot, SeismicFeatures, EvaluationMetrics (reuse ECG patterns)
- [ ] **GitHub repo** — `prxnvt/seismic-events`, push, deploy to Render
- [ ] **BFF route** — `app/api/seismic/route.ts` (already created, just needs env var)

## Synthetic Tab (wire up existing backend)

- [ ] Confirm deployed URL for `synthetic-signals` backend (or deploy to Render)
- [ ] Port `frontend-vite` components into `app/synthetic/page.tsx`:
  - Sidebar (signal type selector + params)
  - SignalPlot, WindowInspector, FeatureTimeSeries, AnomalyBar
  - Reuse `usePipeline` pattern adapted for the existing API
- [ ] Set `SYNTHETIC_SERVICE_URL` env var on Vercel

## Landing Page Enhancements

- [ ] Add animated GIFs or pre-rendered screenshots of each tab's output
- [ ] Add interactive point cloud editor (drag points, see persistence update live)
- [ ] Add a "How each tab works" section with brief explanations + links

## Polish

- [ ] Responsive: sidebar collapses to top panel on mobile (<1024px)
- [ ] OG image + social metadata for link previews
- [ ] Favicon
- [ ] 404 page
- [ ] Error boundaries per tab (crash one tab, others still work)
- [ ] Preload service health checks on tab hover (prefetch)
