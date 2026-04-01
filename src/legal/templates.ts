import { type Company } from "./companies";
import { citations, type RequestType } from "./citations";
import { getDeadlineDate } from "@/lib/tracking";

export interface LetterData {
  senderName: string;
  senderEmail: string;
  company: Company;
  requestTypes: RequestType[];
  additionalContext?: string;
}

export interface BatchLetterData {
  senderName: string;
  senderEmail: string;
  companies: Company[];
  requestTypes: RequestType[];
}

export const BATCH_EMAIL_SUBJECT = "CCPA/CPRA Privacy Rights Request";

export function getBatchRecipientEmails(companies: Company[]): string[] {
  return companies
    .map((company) => company.privacyEmail)
    .filter((email): email is string => email !== null);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getRequestParagraphs(requestTypes: RequestType[]): string {
  const paragraphs: string[] = [];

  if (requestTypes.includes("RIGHT_TO_KNOW")) {
    paragraphs.push(
      `RIGHT TO KNOW (${citations.RIGHT_TO_KNOW.statute}): I request that you disclose to me: (1) the categories of personal information you have collected about me; (2) the specific pieces of personal information you have collected about me; (3) the categories of sources from which the personal information was collected; (4) the business or commercial purpose for collecting, selling, or sharing my personal information; (5) the categories of third parties to whom you have disclosed my personal information; and (6) if you have sold or shared my personal information, the categories of personal information sold or shared and the categories of third parties to whom it was sold or shared.`
    );
  }

  if (requestTypes.includes("RIGHT_TO_DELETE")) {
    paragraphs.push(
      `RIGHT TO DELETE (${citations.RIGHT_TO_DELETE.statute}): I request that you delete any and all personal information you have collected from me or about me. I further request that you direct any service providers or contractors with whom you have shared my personal information to delete my personal information from their records as well.`
    );
  }

  if (requestTypes.includes("RIGHT_TO_CORRECT")) {
    paragraphs.push(
      `RIGHT TO CORRECT (${citations.RIGHT_TO_CORRECT.statute}): I request that you correct any inaccurate personal information you maintain about me. If your records contain information about me that was obtained through surveillance, data aggregation, or scraping without my knowledge or consent, I dispute the accuracy and completeness of such information in its entirety.`
    );
  }

  if (requestTypes.includes("OPT_OUT_SALE")) {
    paragraphs.push(
      `OPT-OUT OF SALE AND SHARING (${citations.OPT_OUT_SALE.statute}): I direct you to stop selling and/or sharing my personal information with third parties, effective immediately. This includes any sharing of personal information for cross-context behavioral advertising, targeted advertising, or any form of profiling. This opt-out must be applied to all personal information you hold about me, including data obtained from any source.`
    );
  }

  if (requestTypes.includes("LIMIT_SENSITIVE")) {
    paragraphs.push(
      `LIMIT USE OF SENSITIVE PERSONAL INFORMATION (${citations.LIMIT_SENSITIVE.statute}): I direct you to limit your use and disclosure of my sensitive personal information to only that which is necessary to perform the services or provide the goods reasonably expected. Sensitive personal information includes, but is not limited to: precise geolocation data; racial or ethnic origin; immigration or citizenship status; biometric information; and contents of communications. You are to cease any processing of my sensitive personal information beyond what is strictly necessary.`
    );
  }

  if (requestTypes.includes("OPT_OUT_PROFILING")) {
    paragraphs.push(
      `OPT-OUT OF AUTOMATED DECISION-MAKING AND PROFILING (${citations.OPT_OUT_PROFILING.statute}): I opt out of any automated decision-making technology, including profiling, that you use to process my personal information. This includes any AI-powered risk scoring, predictive analytics, behavioral analysis, or pattern recognition that produces legal or similarly significant effects. I request that you stop subjecting my personal information to automated processing for these purposes immediately.`
    );
  }

  return paragraphs.join("\n\n");
}

export function generateLetter(data: LetterData): string {
  const today = formatDate(new Date());
  const responseDeadline = getDeadlineDate(new Date(), data.requestTypes);

  const recipientAddress = data.company.privacyAddress ?? `${data.company.name}\nAttn: Privacy Department`;
  const contactMethod = data.company.privacyEmail
    ? `via email to ${data.company.privacyEmail}`
    : data.company.privacyUrl
      ? `via your privacy request portal`
      : `via certified mail`;

  const letter = `${today}

${data.senderName}
${data.senderEmail}

TO:
${recipientAddress}
${data.company.privacyEmail ? `Email: ${data.company.privacyEmail}` : ""}

RE: CALIFORNIA CONSUMER PRIVACY ACT / CALIFORNIA PRIVACY RIGHTS ACT — EXERCISE OF PRIVACY RIGHTS

Dear Privacy Department of ${data.company.name}:

I am writing to exercise my rights under the California Consumer Privacy Act of 2018 ("CCPA"), as amended by the California Privacy Rights Act of 2020 ("CPRA"), codified at California Civil Code sections 1798.100 through 1798.199.100.

Your company is subject to the CCPA/CPRA because it does business in the State of California and meets one or more of the applicability thresholds set forth in Cal. Civ. Code § 1798.140(d). Your company's collection, processing, sale, and/or sharing of personal information — including through surveillance technologies, data aggregation, and automated decision-making systems — triggers obligations under this law.

I hereby make the following requests:

${getRequestParagraphs(data.requestTypes)}
${data.additionalContext ? `\nADDITIONAL CONTEXT: ${data.additionalContext}\n` : ""}
VERIFICATION: For purposes of verifying my identity in connection with this request, my name is ${data.senderName} and my email address is ${data.senderEmail}. I declare under penalty of perjury that I am the consumer whose personal information is the subject of this request.

LEGAL OBLIGATIONS AND DEADLINES: Under the CCPA/CPRA, you are required to respond to this request within forty-five (45) calendar days of receipt. If you require an extension, you must notify me within the initial 45-day period and may extend by no more than an additional 45 calendar days. For opt-out requests under § 1798.120 and § 1798.121, you must comply within fifteen (15) business days.

You may not discriminate against me for exercising these rights, as prohibited by Cal. Civ. Code § 1798.125.

NOTICE OF INTENT: If you fail to respond to this request within the statutory deadline, I intend to file a complaint with the California Privacy Protection Agency (CPPA) and/or the California Attorney General's Office. Under CPRA, the 30-day right-to-cure period has been eliminated for most violations, and the CPPA has independent enforcement authority with penalties of up to $2,500 per violation, or $7,500 per intentional violation or violation involving minors.

I look forward to your timely response.

Sincerely,

${data.senderName}
${data.senderEmail}

---
This letter was sent ${contactMethod}.
Date sent: ${today}
Response deadline: ${formatDate(responseDeadline)}

NOTE: This letter constitutes a verifiable consumer request under Cal. Civ. Code § 1798.140(ak). Retain a copy of this letter and proof of delivery for your records.`;

  return letter;
}

export function generateComplaintLetter(data: LetterData, sentDate: Date): string {
  const today = formatDate(new Date());
  const originalDate = formatDate(sentDate);

  return `${today}

${data.senderName}
${data.senderEmail}

TO:
California Privacy Protection Agency
2101 Arena Boulevard
Sacramento, CA 95834
complaints@cppa.ca.gov

AND:

Office of the Attorney General
California Department of Justice
Attn: Public Inquiry Unit
P.O. Box 944255
Sacramento, CA 94244-2550

RE: COMPLAINT — FAILURE TO RESPOND TO CCPA/CPRA PRIVACY RIGHTS REQUEST

Dear California Privacy Protection Agency and Office of the Attorney General:

I am filing this complaint regarding ${data.company.name}'s failure to comply with the California Consumer Privacy Act / California Privacy Rights Act.

FACTS:

1. On ${originalDate}, I submitted a verifiable consumer request to ${data.company.name} exercising the following rights under the CCPA/CPRA:
${data.requestTypes.map((t) => `   - ${citations[t].label} (${citations[t].statute})`).join("\n")}

2. The request was sent to:
   ${data.company.privacyEmail ? `Email: ${data.company.privacyEmail}` : ""}
   ${data.company.privacyAddress ?? data.company.name}

3. As of ${today}, the applicable statutory response deadline has elapsed, and ${data.company.name} has:
   [ ] Failed to respond entirely
   [ ] Failed to provide a complete response
   [ ] Failed to acknowledge receipt within the statutory period
   (Please check all that apply)

4. ${data.company.name} is known to collect and process personal information for the following purposes: ${data.company.knownContracts.join("; ")}.

LEGAL BASIS:

Under Cal. Civ. Code § 1798.105, § 1798.110, § 1798.120, § 1798.121, and related provisions, businesses are required to respond within the applicable statutory deadlines, including 45 calendar days for access, deletion, correction, and similar requests, and 15 business days for opt-out and sensitive-information limitation requests. The CPRA eliminated the 30-day cure period for most violations (effective January 1, 2023). The CPPA has independent enforcement authority under Cal. Civ. Code § 1798.199.40 et seq.

Each failure to respond to a consumer request constitutes a separate violation, subject to penalties of up to $2,500 per violation, or $7,500 per intentional violation.

REQUESTED ACTION:

I respectfully request that your office:
1. Investigate ${data.company.name}'s failure to comply with the CCPA/CPRA;
2. Take appropriate enforcement action; and
3. Ensure that ${data.company.name} fulfills its statutory obligations.

I have attached a copy of my original request for your reference.

Sincerely,

${data.senderName}
${data.senderEmail}

Enclosure: Original CCPA/CPRA request dated ${originalDate}`;
}

/**
 * Generate a single letter addressed to multiple companies.
 * The letter references all companies and instructs each to respond.
 */
export function generateBatchLetter(data: BatchLetterData): string {
  const today = formatDate(new Date());
  const companyList = data.companies.map((company) => `- ${company.name}`).join("\n");

  return `${today}

COMPANIES ADDRESSED:
${companyList}

To Whom It May Concern:

I am writing to exercise my rights under the California Consumer Privacy Act of 2018 ("CCPA"), as amended by the California Privacy Rights Act of 2020 ("CPRA"), codified at California Civil Code sections 1798.100 through 1798.199.100.

Your company is subject to the CCPA/CPRA because it does business in the State of California and meets one or more of the applicability thresholds set forth in Cal. Civ. Code § 1798.140(d). Your collection, processing, sale, and/or sharing of personal information — including through surveillance technologies, data aggregation, and automated decision-making systems — triggers obligations under this law.

I hereby make the following requests:

${getRequestParagraphs(data.requestTypes)}

VERIFICATION: For purposes of verifying my identity in connection with this request, my name is ${data.senderName} and my email address is ${data.senderEmail}. I declare under penalty of perjury that I am the consumer whose personal information is the subject of this request.

LEGAL OBLIGATIONS AND DEADLINES: Under the CCPA/CPRA, you are required to respond to this request within forty-five (45) calendar days of receipt. If you require an extension, you must notify me within the initial 45-day period and may extend by no more than an additional 45 calendar days. For opt-out requests under § 1798.120 and § 1798.121, you must comply within fifteen (15) business days.

You may not discriminate against me for exercising these rights, as prohibited by Cal. Civ. Code § 1798.125.

NOTICE OF INTENT: If you fail to respond to this request within the statutory deadline, I intend to file a complaint with the California Privacy Protection Agency (CPPA) and/or the California Attorney General's Office. Under CPRA, the 30-day right-to-cure period has been eliminated for most violations, and the CPPA has independent enforcement authority with penalties of up to $2,500 per violation, or $7,500 per intentional violation or violation involving minors.

I look forward to your timely response.

Sincerely,

${data.senderName}
${data.senderEmail}`;
}

/**
 * Build a mailto: URL that BCCs all selected companies' privacy emails.
 * BCC so companies can't see each other's addresses or coordinate responses.
 */
export function buildMailtoUrl(data: BatchLetterData): string {
  const emails = getBatchRecipientEmails(data.companies);

  if (emails.length === 0) return "";

  const to = data.senderEmail; // send to yourself
  const bcc = emails.join(",");
  const subject = encodeURIComponent(BATCH_EMAIL_SUBJECT);
  const body = encodeURIComponent(generateBatchLetter(data));

  return `mailto:${to}?subject=${subject}&bcc=${bcc}&body=${body}`;
}
