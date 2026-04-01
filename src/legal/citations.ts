/**
 * Canonical legal citations for privacy rights requests.
 *
 * CCPA/CPRA applies to businesses that "do business in California" —
 * the requester does NOT need to be a CA resident if the business
 * collects personal information and meets CCPA thresholds.
 *
 * Many of these AI surveillance companies are headquartered in CA
 * or have substantial CA operations, triggering CCPA obligations.
 *
 * For non-CA companies, we also cite the California Delete Act (SB 362)
 * for registered data brokers, and applicable state laws.
 */

export type RequestType =
  | "RIGHT_TO_KNOW"
  | "RIGHT_TO_DELETE"
  | "RIGHT_TO_CORRECT"
  | "OPT_OUT_SALE"
  | "LIMIT_SENSITIVE"
  | "OPT_OUT_PROFILING";

export interface LegalCitation {
  type: RequestType;
  label: string;
  shortDescription: string;
  statute: string;
  fullCitation: string;
  responseDeadline: string;
  deadlineDays: number;
  deadlineType: "calendar" | "business";
}

export const citations: Record<RequestType, LegalCitation> = {
  RIGHT_TO_KNOW: {
    type: "RIGHT_TO_KNOW",
    label: "Right to Know",
    shortDescription: "Demand a company disclose what personal information it has collected about you, the sources, and who it was shared with.",
    statute: "Cal. Civ. Code \u00A7 1798.110",
    fullCitation:
      "California Consumer Privacy Act, Cal. Civ. Code \u00A7\u00A7 1798.100\u20131798.199.100, as amended by the California Privacy Rights Act of 2020 (Proposition 24)",
    responseDeadline: "45 calendar days (extendable by 45 days with notice)",
    deadlineDays: 45,
    deadlineType: "calendar",
  },
  RIGHT_TO_DELETE: {
    type: "RIGHT_TO_DELETE",
    label: "Right to Delete",
    shortDescription: "Require a company to delete all personal information it has collected about you.",
    statute: "Cal. Civ. Code \u00A7 1798.105",
    fullCitation:
      "California Consumer Privacy Act, Cal. Civ. Code \u00A7 1798.105, as amended by CPRA",
    responseDeadline: "45 calendar days (extendable by 45 days with notice)",
    deadlineDays: 45,
    deadlineType: "calendar",
  },
  RIGHT_TO_CORRECT: {
    type: "RIGHT_TO_CORRECT",
    label: "Right to Correct",
    shortDescription: "Require a company to correct inaccurate personal information it holds about you.",
    statute: "Cal. Civ. Code \u00A7 1798.106",
    fullCitation:
      "California Consumer Privacy Act, Cal. Civ. Code \u00A7 1798.106, as amended by CPRA",
    responseDeadline: "45 calendar days (extendable by 45 days with notice)",
    deadlineDays: 45,
    deadlineType: "calendar",
  },
  OPT_OUT_SALE: {
    type: "OPT_OUT_SALE",
    label: "Opt Out of Sale/Sharing",
    shortDescription: "Prohibit a company from selling or sharing your personal information with third parties.",
    statute: "Cal. Civ. Code \u00A7 1798.120",
    fullCitation:
      "California Consumer Privacy Act, Cal. Civ. Code \u00A7 1798.120, as amended by CPRA",
    responseDeadline: "15 business days",
    deadlineDays: 15,
    deadlineType: "business",
  },
  LIMIT_SENSITIVE: {
    type: "LIMIT_SENSITIVE",
    label: "Limit Use of Sensitive Personal Information",
    shortDescription:
      "Restrict a company's use of sensitive data including precise geolocation, racial/ethnic origin, immigration status, and biometric information.",
    statute: "Cal. Civ. Code \u00A7 1798.121",
    fullCitation:
      "California Consumer Privacy Act, Cal. Civ. Code \u00A7 1798.121, as amended by CPRA",
    responseDeadline: "15 business days",
    deadlineDays: 15,
    deadlineType: "business",
  },
  OPT_OUT_PROFILING: {
    type: "OPT_OUT_PROFILING",
    label: "Opt Out of Automated Decision-Making / Profiling",
    shortDescription:
      "Opt out of automated decision-making technology and profiling, including AI-powered risk scoring and predictive analytics. Note: CPPA compliance obligations for ADMT begin January 1, 2027.",
    statute: "Cal. Civ. Code \u00A7 1798.185(a)(15); CPPA Regulations \u00A7\u00A7 7150\u20137153",
    fullCitation:
      "California Privacy Rights Act, CPPA Final Regulations on Automated Decision-Making Technology (\u00A7\u00A7 7150\u20137153), compliance effective January 1, 2027",
    responseDeadline: "45 calendar days",
    deadlineDays: 45,
    deadlineType: "calendar",
  },
};

export const allRequestTypes = Object.values(citations);
