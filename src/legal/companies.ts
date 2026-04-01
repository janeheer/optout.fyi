/**
 * AI companies known to collect, process, or sell data used in
 * immigration surveillance, enforcement, or profiling.
 *
 * Sources: public contracts (USAspending.gov), FOIA releases,
 * investigative journalism (The Intercept, EFF, ACLU reports).
 */

export interface Company {
  id: string;
  name: string;
  category: "surveillance" | "dataBrokers" | "telecom";
  description: string;
  privacyEmail: string | null;
  privacyUrl: string | null;
  privacyAddress: string | null;
  knownContracts: string[];
  dataTypes: string[];
  headquarteredInCA: boolean;
}

export const companies: Company[] = [
  {
    id: "palantir",
    name: "Palantir Technologies",
    category: "surveillance",
    description:
      "Builds ICE's primary investigative case management system (FALCON). Used for tracking, profiling, and targeting immigrants.",
    privacyEmail: "privacy@palantir.com",
    privacyUrl: "https://www.palantir.com/privacy-and-security/",
    privacyAddress:
      "Palantir Technologies Inc., Attn: Privacy Team, 1200 17th Street, Floor 15, Denver, CO 80202",
    knownContracts: ["ICE FALCON system", "ICE HSI investigative platform", "CBP analytics"],
    dataTypes: ["location data", "social media", "financial records", "travel records", "biometric data"],
    headquarteredInCA: false,
  },
  {
    id: "clearview-ai",
    name: "Clearview AI",
    category: "surveillance",
    description:
      "Facial recognition company that scraped billions of photos from the internet. Used by ICE and CBP for identification.",
    privacyEmail: "privacy@clearview.ai",
    privacyUrl: "https://www.clearview.ai/privacy-policy",
    privacyAddress:
      "Clearview AI, Inc., Attn: Privacy, 99 Wall Street, Suite 5810, New York, NY 10005",
    knownContracts: ["ICE HSI facial recognition", "CBP identification"],
    dataTypes: ["facial images", "biometric faceprints", "web-scraped photos", "social media images"],
    headquarteredInCA: false,
  },
  {
    id: "thomson-reuters",
    name: "Thomson Reuters (CLEAR)",
    category: "dataBrokers",
    description:
      "CLEAR database aggregates personal data from hundreds of sources. ICE's most-used commercial data tool for locating individuals.",
    privacyEmail: "privacy.enquiries@thomsonreuters.com",
    privacyUrl: "https://www.thomsonreuters.com/en/privacy-statement",
    privacyAddress:
      "Thomson Reuters, Attn: Privacy, 610 Opperman Drive, Eagan, MN 55123",
    knownContracts: ["ICE ERO location", "ICE HSI investigations", "CBP vetting"],
    dataTypes: [
      "address history",
      "phone records",
      "utility records",
      "vehicle registrations",
      "court records",
      "social media",
    ],
    headquarteredInCA: false,
  },
  {
    id: "lexisnexis",
    name: "LexisNexis Risk Solutions (RELX)",
    category: "dataBrokers",
    description:
      "Provides ICE with access to billions of data records for locating and identifying immigrants through its Accurint product.",
    privacyEmail: "privacy.information@lexisnexisrisk.com",
    privacyUrl: "https://risk.lexisnexis.com/corporate/privacy-policy",
    privacyAddress:
      "LexisNexis Risk Solutions, Attn: Privacy, 1000 Alderman Drive, Alpharetta, GA 30005",
    knownContracts: ["ICE Accurint database access", "CBP person-search"],
    dataTypes: [
      "credit data",
      "address history",
      "phone records",
      "utility connections",
      "property records",
      "employment data",
    ],
    headquarteredInCA: false,
  },
  {
    id: "amazon",
    name: "Amazon Web Services / Amazon (Rekognition)",
    category: "telecom",
    description:
      "AWS Rekognition facial recognition sold to law enforcement. Ring doorbell partnerships share footage with police and immigration authorities.",
    privacyEmail: null,
    privacyUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ",
    privacyAddress:
      "Amazon.com, Inc., Attn: Legal Department, P.O. Box 81226, Seattle, WA 98108",
    knownContracts: ["ICE cloud infrastructure", "Law enforcement Rekognition licenses"],
    dataTypes: ["facial images", "voice data", "purchase history", "location data", "Ring video footage"],
    headquarteredInCA: false,
  },
  {
    id: "babel-street",
    name: "Babel Street",
    category: "surveillance",
    description:
      "Provides Locate X tool to ICE, which uses commercial location data from mobile apps to track individuals without a warrant.",
    privacyEmail: "privacy@babelstreet.com",
    privacyUrl: "https://www.babelstreet.com/privacy",
    privacyAddress:
      "Babel Street, Attn: Privacy, 1720 Diagonal Road, Suite 725, Alexandria, VA 22314",
    knownContracts: ["ICE Locate X geolocation", "CBP location surveillance"],
    dataTypes: ["mobile location data", "app-derived geolocation", "movement patterns", "social media"],
    headquarteredInCA: false,
  },
  {
    id: "vigilant-solutions",
    name: "Motorola Solutions (Vigilant / Rekor)",
    category: "surveillance",
    description:
      "Operates the largest license plate reader (LPR) database in the US. ICE uses it to track vehicles and locate individuals.",
    privacyEmail: "privacy1@motorolasolutions.com",
    privacyUrl: "https://www.motorolasolutions.com/en_us/about/privacy-policy.html",
    privacyAddress:
      "Motorola Solutions, Attn: Privacy, 500 W. Monroe Street, Suite 4400, Chicago, IL 60661",
    knownContracts: ["ICE license plate reader database", "CBP border zone surveillance"],
    dataTypes: ["license plate scans", "vehicle location", "travel patterns", "timestamps"],
    headquarteredInCA: false,
  },
  {
    id: "shadowdragon",
    name: "ShadowDragon",
    category: "surveillance",
    description:
      "Social media surveillance tool used by ICE to monitor online activity and build profiles from 120+ platforms.",
    privacyEmail: "privacy@shadowdragon.io",
    privacyUrl: "https://shadowdragon.io/privacy-policy/",
    privacyAddress:
      "ShadowDragon LLC, Attn: Privacy, 1717 Pennsylvania Ave NW, Suite 1025, Washington, DC 20006",
    knownContracts: ["ICE social media monitoring", "CBP vetting"],
    dataTypes: ["social media posts", "online activity", "network connections", "digital footprint"],
    headquarteredInCA: false,
  },
  {
    id: "giant-oak",
    name: "Giant Oak",
    category: "surveillance",
    description:
      "GOST (Giant Oak Search Technology) used by ICE to screen social media of visa applicants and immigrants.",
    privacyEmail: "privacy@giantoak.com",
    privacyUrl: "https://www.giantoak.com/privacy-policy",
    privacyAddress:
      "Giant Oak, Inc., Attn: Privacy, 1300 Pennsylvania Ave NW, Suite 700, Washington, DC 20004",
    knownContracts: ["ICE social media vetting", "DHS visa screening"],
    dataTypes: ["social media content", "online profiles", "sentiment analysis", "network mapping"],
    headquarteredInCA: false,
  },
  {
    id: "google",
    name: "Google LLC",
    category: "telecom",
    description:
      "Collects vast personal data through search, Gmail, Maps, Android, and YouTube. Data has been subpoenaed in immigration cases via geofence warrants.",
    privacyEmail: null,
    privacyUrl: "https://support.google.com/accounts/answer/3024190",
    privacyAddress:
      "Google LLC, Attn: Privacy, 1600 Amphitheatre Parkway, Mountain View, CA 94043",
    knownContracts: ["Geofence warrant compliance", "CBP cloud services"],
    dataTypes: [
      "search history",
      "location history",
      "email content",
      "contacts",
      "voice recordings",
      "app usage",
    ],
    headquarteredInCA: true,
  },
  {
    id: "meta",
    name: "Meta Platforms (Facebook/Instagram/WhatsApp)",
    category: "telecom",
    description:
      "Social media data has been used in immigration enforcement. ICE has monitored Facebook accounts and used data in deportation proceedings.",
    privacyEmail: null,
    privacyUrl: "https://help.meta.com/support/privacy/",
    privacyAddress:
      "Meta Platforms, Inc., Attn: Privacy Operations, 1601 Willow Road, Menlo Park, CA 94025",
    knownContracts: ["ICE social media monitoring (indirect)", "Law enforcement data requests"],
    dataTypes: [
      "social connections",
      "posts and messages",
      "location check-ins",
      "photos",
      "facial recognition data",
      "WhatsApp metadata",
    ],
    headquarteredInCA: true,
  },
  {
    id: "microsoft",
    name: "Microsoft Corporation",
    category: "telecom",
    description:
      "Azure cloud services and LinkedIn data. Microsoft has faced scrutiny for ICE contracts through Azure Government cloud.",
    privacyEmail: null,
    privacyUrl: "https://www.microsoft.com/en-us/privacy/privacy-support-requests",
    privacyAddress:
      "Microsoft Corporation, Attn: Privacy, One Microsoft Way, Redmond, WA 98052",
    knownContracts: ["ICE Azure Government cloud", "LinkedIn data aggregation"],
    dataTypes: ["professional profiles", "email content", "cloud data", "browsing data", "Cortana voice data"],
    headquarteredInCA: false,
  },
  {
    id: "sandvine",
    name: "Sandvine (now part of Francisco Partners portfolio)",
    category: "surveillance",
    description:
      "Deep packet inspection technology that can monitor all internet traffic. Used by governments worldwide for surveillance.",
    privacyEmail: "privacy@sandvine.com",
    privacyUrl: "https://www.sandvine.com/privacy-policy",
    privacyAddress: "Sandvine, Attn: Privacy, 408 Albert Street, Waterloo, ON N2L 3V3, Canada",
    knownContracts: ["Government internet surveillance", "Network traffic analysis"],
    dataTypes: ["internet traffic", "browsing history", "app usage", "communication metadata"],
    headquarteredInCA: false,
  },
  {
    id: "venntel",
    name: "Venntel (now Babel Street subsidiary)",
    category: "surveillance",
    description:
      "Sold commercially-harvested cell phone location data to ICE and CBP, bypassing warrant requirements.",
    privacyEmail: "privacy@babelstreet.com",
    privacyUrl: "https://www.babelstreet.com/privacy",
    privacyAddress:
      "Babel Street (Venntel), Attn: Privacy, 1720 Diagonal Road, Suite 725, Alexandria, VA 22314",
    knownContracts: ["ICE warrantless location tracking", "CBP border tracking"],
    dataTypes: ["mobile device location", "app-derived movement data", "geofence data"],
    headquarteredInCA: false,
  },
  {
    id: "penlink",
    name: "Pen-Link",
    category: "surveillance",
    description:
      "Provides ICE with tools to intercept and analyze digital communications, social media, and financial transactions.",
    privacyEmail: "info@penlink.com",
    privacyUrl: "https://www.penlink.com/privacy-policy/",
    privacyAddress: "Pen-Link, Ltd., Attn: Privacy, 2607 Canterbury Drive, Lincoln, NE 68512",
    knownContracts: ["ICE communications interception", "Financial surveillance"],
    dataTypes: ["communications data", "financial transactions", "social media analysis", "call records"],
    headquarteredInCA: false,
  },
  {
    id: "att",
    name: "AT&T",
    category: "telecom",
    description:
      "Sold real-time cell phone location data to third-party brokers who resold it to bounty hunters and law enforcement, including immigration enforcement, without warrants.",
    privacyEmail: null,
    privacyUrl: "https://about.att.com/csr/home/privacy.html",
    privacyAddress:
      "AT&T Privacy Policy Contact, Attn: Your Privacy Rights, 208 S. Akard Street, Dallas, TX 75202",
    knownContracts: ["Location data sales to brokers", "Law enforcement data sharing"],
    dataTypes: ["cell phone location", "call records", "text metadata", "subscriber information", "real-time GPS"],
    headquarteredInCA: false,
  },
  {
    id: "verizon",
    name: "Verizon",
    category: "telecom",
    description:
      "Sold customer location data to aggregators like LocationSmart and Zumigo, which resold it to bail bond companies, bounty hunters, and law enforcement without customer consent.",
    privacyEmail: null,
    privacyUrl: "https://www.verizon.com/about/privacy/full-privacy-policy",
    privacyAddress:
      "Verizon Privacy Office, 1300 I Street NW, Suite 500E, Washington, DC 20005",
    knownContracts: ["Location data aggregator sales", "Law enforcement cooperation"],
    dataTypes: ["cell phone location", "call detail records", "subscriber data", "browsing history", "app usage"],
    headquarteredInCA: false,
  },
  {
    id: "tmobile",
    name: "T-Mobile",
    category: "telecom",
    description:
      "Sold real-time location data of customers to data aggregators. Despite pledging to stop in 2018, continued sharing data with third parties used by law enforcement.",
    privacyEmail: "privacy@t-mobile.com",
    privacyUrl: "https://www.t-mobile.com/privacy-center/personal-data-request",
    privacyAddress:
      "T-Mobile Privacy Resources, Attn: Privacy, 12920 SE 38th Street, Bellevue, WA 98006",
    knownContracts: ["Location data aggregator sales", "Continued data sharing post-pledge"],
    dataTypes: ["cell phone location", "call records", "subscriber information", "device identifiers", "browsing data"],
    headquarteredInCA: false,
  },
];

export function getCompanyById(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}
