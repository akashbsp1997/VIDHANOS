export interface EcourtsRawData {
  petitionerName: string | null;
  respondentName: string | null;
  cnrNumber: string | null;
  filingNumber: string | null;
  filingDate: string | null;
  registrationNumber: string | null;
  caseType: string | null;
  forumName: string | null;
  judgeName: string | null;
  caseStatus: string | null;
  stage: string | null;
  nextHearingDate: string | null;
  hearingHistory: string[][];
  pageTitle: string | null;
}

export interface EcourtsScraperMessage {
  ok: boolean;
  data?: EcourtsRawData;
  error?: string;
}

export interface ParsedHearing {
  date: number;
  purpose: string;
}

export interface ParsedEcourtsCase {
  petitionerName: string;
  respondentName: string;
  cnrNumber: string;
  filingNumber: string;
  filingDate: number | null;
  registrationNumber: string;
  caseType: string;
  forumName: string;
  judgeName: string;
  caseStatus: string;
  stage: string;
  nextHearingDate: number | null;
  hearings: ParsedHearing[];
}

/** eCourts commonly renders dates as DD-MM-YYYY; falls back to Date.parse for anything else. */
function parseIndianDate(text: string | null | undefined): number | null {
  if (!text) return null;
  const ddmmyyyy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(text.trim());
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date.getTime();
  }
  const parsed = Date.parse(text);
  return Number.isNaN(parsed) ? null : parsed;
}

function findDateColumn(row: string[]): number | null {
  return parseIndianDate(row[0]) !== null ? 0 : row.findIndex((cell) => parseIndianDate(cell) !== null);
}

export function parseEcourtsPayload(raw: EcourtsRawData): ParsedEcourtsCase {
  const hearings: ParsedHearing[] = raw.hearingHistory
    .map((row) => {
      const dateIndex = findDateColumn(row);
      if (dateIndex === null) return null;
      const date = parseIndianDate(row[dateIndex]);
      if (!date) return null;
      const purpose = row.filter((_, index) => index !== dateIndex).join(' — ');
      return { date, purpose };
    })
    .filter((entry): entry is ParsedHearing => entry !== null);

  return {
    petitionerName: raw.petitionerName ?? '',
    respondentName: raw.respondentName ?? '',
    cnrNumber: raw.cnrNumber ?? '',
    filingNumber: raw.filingNumber ?? '',
    filingDate: parseIndianDate(raw.filingDate),
    registrationNumber: raw.registrationNumber ?? '',
    caseType: raw.caseType ?? '',
    forumName: raw.forumName ?? '',
    judgeName: raw.judgeName ?? '',
    caseStatus: raw.caseStatus ?? '',
    stage: raw.stage ?? '',
    nextHearingDate: parseIndianDate(raw.nextHearingDate),
    hearings,
  };
}
