export type Alert = {
  id: string;
  recipient: string;
  type: string;
  subject: string;
  details: string;
  screeningStatus: "Pending" | "Flagged" | "Clear";
  isCritical?: boolean;
};

export const ALERTS: Alert[] = [
  {
    id: "TX-8829",
    recipient: "blockchain.user@provider.hk",
    type: "Travel Rule Trigger",
    subject: "Action Required: Transfer > HK$8,000",
    details: "Transaction of 12,500 HKDR detected. Originator info missing.",
    screeningStatus: "Pending",
  },
  {
    id: "TX-5521",
    recipient: "li.wei@hk-mail.com",
    type: "Name Screening Hit",
    subject: "CRITICAL: PEP Match Detected",
    details: 'Name "Li Wei" matches HKMA Watchlist (Fuzzy: 92%). Verify Source of Wealth.',
    screeningStatus: "Flagged",
    isCritical: true,
  },
  {
    id: "TX-7742",
    recipient: "treasury@zetrov.hk",
    type: "Stablecoin De-peg",
    subject: "Liquidity Alert: HKDR Deviation",
    details: "HKDR trading at 0.985. Check reserve attestations via HKMA portal.",
    screeningStatus: "Clear",
  },
];

export type MsoPlatform = {
  id: string;
  name: string;
  category: "Travel Rule" | "Screening" | "Blockchain Analytics" | "KYC/KYB" | "Reporting";
  description: string;
  status: "Connected" | "Available";
};

export const MSO_PLATFORMS: MsoPlatform[] = [
  { id: "notabene", name: "Notabene", category: "Travel Rule", description: "FATF Travel Rule messaging across VASPs.", status: "Connected" },
  { id: "sumsub", name: "Sumsub", category: "KYC/KYB", description: "Identity verification & onboarding.", status: "Connected" },
  { id: "chainalysis", name: "Chainalysis KYT", category: "Blockchain Analytics", description: "Real-time wallet risk scoring.", status: "Available" },
  { id: "elliptic", name: "Elliptic Navigator", category: "Blockchain Analytics", description: "On-chain transaction monitoring.", status: "Available" },
  { id: "trm", name: "TRM Labs", category: "Blockchain Analytics", description: "Sanctions & illicit finance detection.", status: "Available" },
  { id: "complyadvantage", name: "ComplyAdvantage", category: "Screening", description: "PEP, sanctions & adverse media.", status: "Available" },
  { id: "hkma", name: "HKMA STR Portal", category: "Reporting", description: "Suspicious Transaction Reporting to JFIU.", status: "Connected" },
  { id: "refinitiv", name: "LSEG World-Check", category: "Screening", description: "Global watchlist & PEP database.", status: "Available" },
];
