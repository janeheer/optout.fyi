/**
 * localStorage-based tracking for sent privacy requests.
 * Stores only: sentDate, companyIds, requestTypes. No PII.
 * Uses localStorage (not cookies) so data is never transmitted
 * with HTTP requests — it stays entirely in the browser.
 */

import {
  addBusinessDays,
  addDays,
  differenceInCalendarDays,
  isValid,
  startOfDay,
} from "date-fns";
import { citations, type RequestType } from "@/legal/citations";

export interface SentRecord {
  sentDate: string; // ISO date string
  companyIds: string[];
  requestTypes: RequestType[];
}

const STORAGE_KEY = "optout_sent";

function isRequestType(value: unknown): value is RequestType {
  return typeof value === "string" && value in citations;
}

function parseSentDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  return isValid(parsed) ? parsed : null;
}

export function getSentRecord(): SentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SentRecord>;
    const sentDate = parseSentDate(parsed.sentDate);
    const companyIds = Array.isArray(parsed.companyIds)
      ? parsed.companyIds.filter((value): value is string => typeof value === "string")
      : [];
    const requestTypes = Array.isArray(parsed.requestTypes)
      ? parsed.requestTypes.filter(isRequestType)
      : [];

    if (!sentDate || companyIds.length === 0) return null;

    return {
      sentDate: sentDate.toISOString(),
      companyIds,
      requestTypes,
    };
  } catch {
    return null;
  }
}

export function markAsSent(companyIds: string[], requestTypes: RequestType[]) {
  const record: SentRecord = {
    sentDate: startOfDay(new Date()).toISOString(),
    companyIds,
    requestTypes,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage full or restricted — countdown won't persist but letter generation still works
  }
}

export function clearSentRecord() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Restricted environment — ignore
  }
}

/**
 * Calculate the deadline based on the longest applicable request window.
 * - Right to Know/Delete/Correct/Profiling: 45 calendar days
 * - Opt Out of Sale, Limit Sensitive: 15 business days
 */
export function getDeadlineDate(
  sentDate: string | Date,
  requestTypes: RequestType[] = []
): Date {
  const sent = typeof sentDate === "string" ? new Date(sentDate) : sentDate;
  const normalizedSent = startOfDay(sent);

  if (!isValid(normalizedSent)) {
    return normalizedSent;
  }

  if (!requestTypes.length) {
    return addDays(normalizedSent, 45);
  }

  return requestTypes.reduce((latest, requestType) => {
    const citation = citations[requestType];
    const candidate =
      citation.deadlineType === "business"
        ? addBusinessDays(normalizedSent, citation.deadlineDays)
        : addDays(normalizedSent, citation.deadlineDays);

    return candidate.getTime() > latest.getTime() ? candidate : latest;
  }, normalizedSent);
}

export function getDeadlineWindowDays(
  sentDate: string | Date,
  requestTypes: RequestType[] = []
): number {
  const sent = typeof sentDate === "string" ? new Date(sentDate) : sentDate;
  const normalizedSent = startOfDay(sent);
  const deadlineDate = getDeadlineDate(normalizedSent, requestTypes);

  if (!isValid(normalizedSent) || !isValid(deadlineDate)) {
    return 45;
  }

  return differenceInCalendarDays(deadlineDate, normalizedSent);
}

export function getDaysRemaining(sentDate: string, requestTypes: RequestType[] = []): number {
  const deadlineDate = getDeadlineDate(sentDate, requestTypes);
  return differenceInCalendarDays(deadlineDate, startOfDay(new Date()));
}
