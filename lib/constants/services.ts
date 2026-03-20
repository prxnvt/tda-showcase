/** Service URLs — resolved at build time from env vars, fallback to localhost for dev */

export const TDA_SERVICE_URL =
  process.env.NEXT_PUBLIC_TDA_SERVICE_URL ?? "http://localhost:8001";

export const FINANCE_SERVICE_URL =
  process.env.NEXT_PUBLIC_FINANCE_SERVICE_URL ?? "http://localhost:8002";

export const ECG_SERVICE_URL =
  process.env.NEXT_PUBLIC_ECG_SERVICE_URL ?? "http://localhost:8003";

export const SYNTHETIC_SERVICE_URL =
  process.env.NEXT_PUBLIC_SYNTHETIC_SERVICE_URL ?? "http://localhost:8000";
