const DEFAULT_API_URL = "http://localhost:4000";
const FALLBACK_PROD_API_URL = "https://backoffice.spiritualwomanhq.com";

export function getApiBaseUrl() {
  const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).trim();
  const withProtocol = /^https?:\/\//i.test(rawApiUrl) ? rawApiUrl : `https://${rawApiUrl}`;
  const normalized = withProtocol.replace(/\/+$/, "");

  try {
    const parsed = new URL(normalized);
    if (/^(www\.)?spiritualwomanhq\.com$/i.test(parsed.hostname)) {
      return FALLBACK_PROD_API_URL;
    }
  } catch {
    // Keep normalized fallback even when URL parsing fails.
  }

  return normalized;
}
