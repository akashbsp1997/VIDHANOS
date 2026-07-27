import { generateId } from '@/lib/ids';
import { db, type LegalReference } from './schema';

const LEGAL_REFERENCES_SEED: Array<Omit<LegalReference, 'id' | 'createdAt'>> = [
  {
    category: 'forum',
    name: 'District Consumer Disputes Redressal Commission',
    description:
      'Handles consumer complaints against goods/services up to the pecuniary jurisdiction set for the district; extrajudicial, simplified procedure.',
    appliesToKeywords: 'consumer,defective product,refund,deficiency of service,warranty,ecommerce,builder,insurance claim',
    jurisdictionLevel: 'district',
  },
  {
    category: 'mechanism',
    name: 'Consumer Complaint under Consumer Protection Act, 2019',
    description:
      'Formal complaint filed before a Consumer Commission seeking compensation, refund, or replacement for a deficient good/service.',
    appliesToKeywords: 'consumer,defective product,refund,deficiency of service,warranty,ecommerce,builder,insurance claim',
    jurisdictionLevel: 'district',
  },
  {
    category: 'mechanism',
    name: 'Right to Information (RTI) Application',
    description:
      'Application under the RTI Act, 2005 to a Public Information Officer to obtain information held by a government department/public authority.',
    appliesToKeywords: 'government department,public authority,information,delay,record,government office,application status',
    jurisdictionLevel: 'state_or_central',
  },
  {
    category: 'forum',
    name: 'Police Station / FIR',
    description:
      'First point of contact for cognizable criminal offences; a First Information Report can be lodged to initiate criminal investigation.',
    appliesToKeywords: 'theft,assault,fraud,cheating,criminal,fir,threat,harassment,cybercrime',
    jurisdictionLevel: 'local',
  },
  {
    category: 'mechanism',
    name: 'First Information Report (FIR) / Criminal Complaint',
    description:
      'Reporting a cognizable offence to police (FIR) or filing a criminal complaint before a Magistrate for non-cognizable offences.',
    appliesToKeywords: 'theft,assault,fraud,cheating,criminal,fir,threat,harassment,cybercrime',
    jurisdictionLevel: 'local',
  },
  {
    category: 'forum',
    name: 'Civil Court (District Judiciary)',
    description: 'Court of first instance for civil disputes such as property, contract, recovery of money, and injunctions.',
    appliesToKeywords: 'property,contract,recovery of money,injunction,civil dispute,land,tenancy,partition',
    jurisdictionLevel: 'district',
  },
  {
    category: 'mechanism',
    name: 'Civil Suit under Code of Civil Procedure, 1908',
    description: 'Formal civil litigation seeking a decree, injunction, or damages from a civil court.',
    appliesToKeywords: 'property,contract,recovery of money,injunction,civil dispute,land,tenancy,partition',
    jurisdictionLevel: 'district',
  },
  {
    category: 'forum',
    name: 'Family Court',
    description: 'Handles matrimonial disputes, divorce, maintenance, custody, and related family matters.',
    appliesToKeywords: 'divorce,maintenance,custody,matrimonial,alimony,domestic,marriage',
    jurisdictionLevel: 'district',
  },
  {
    category: 'forum',
    name: 'Labour Court / Industrial Tribunal',
    description: 'Adjudicates disputes between employers and employees/workmen including wrongful termination, wages, and industrial disputes.',
    appliesToKeywords: 'employment,termination,wages,labour,industrial dispute,workman,salary,pf,provident fund',
    jurisdictionLevel: 'state',
  },
  {
    category: 'department',
    name: 'Municipal Corporation / Local Body',
    description: 'Handles civic issues: property tax, building permissions, sanitation, water supply, encroachment complaints.',
    appliesToKeywords: 'property tax,building permission,municipal,sanitation,water supply,encroachment,civic',
    jurisdictionLevel: 'local',
  },
  {
    category: 'department',
    name: 'Income Tax Department',
    description: 'Handles matters relating to income tax assessment, refunds, notices, and appeals.',
    appliesToKeywords: 'income tax,tax notice,tds,refund,assessment,tax appeal',
    jurisdictionLevel: 'central',
  },
  {
    category: 'forum',
    name: 'Motor Accident Claims Tribunal (MACT)',
    description: 'Adjudicates compensation claims arising from motor vehicle accidents.',
    appliesToKeywords: 'accident,motor vehicle,compensation,injury,death claim,insurance,road accident',
    jurisdictionLevel: 'district',
  },
  {
    category: 'mechanism',
    name: 'Lok Adalat / Mediation',
    description: 'Extrajudicial alternative dispute resolution forum for amicable settlement of pending or pre-litigation disputes.',
    appliesToKeywords: 'settlement,mediation,compromise,amicable,dispute resolution,lok adalat',
    jurisdictionLevel: 'district',
  },
  {
    category: 'forum',
    name: 'High Court (Writ Jurisdiction)',
    description: 'Constitutional remedy against government/authority action or inaction, via writ petition under Article 226.',
    appliesToKeywords: 'writ,government inaction,fundamental rights,authority,administrative action,mandamus',
    jurisdictionLevel: 'state',
  },
];

export async function seedLegalReferencesIfEmpty(): Promise<void> {
  const count = await db.legalReferences.count();
  if (count > 0) return;

  await db.legalReferences.bulkAdd(
    LEGAL_REFERENCES_SEED.map((entry) => ({ ...entry, id: generateId(), createdAt: Date.now() }))
  );
}
