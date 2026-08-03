import type { CaseWithRelations } from '@/db/repositories/casesRepo';

export interface DraftInputFacts {
  causeOfAction?: string;
  description?: string;
  claimAmount?: number;
}

function fmtDate(d: number | undefined): string {
  if (!d) return '[TO BE FILLED: date]';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function partyBlock(parties: Array<{ name: string; address?: string }>): string {
  if (!parties.length) return '[TO BE FILLED: party name(s) and address]';
  return parties.map((p) => `${p.name}, ${p.address || '[TO BE FILLED: address]'}`).join('\n');
}

function causeTitle(caseData: CaseWithRelations): string {
  const petitioners = partyBlock([caseData.client]);
  const respondents = partyBlock(caseData.opponents);
  return `IN THE ${caseData.forumName || '[TO BE FILLED: forum/court name]'}
${caseData.cnrNumber ? `Case No.: ${caseData.cnrNumber}` : 'Case No.: [TO BE FILLED, once allotted]'}

${petitioners}
... PETITIONER(S)/APPLICANT(S)

VERSUS

${respondents}
... RESPONDENT(S)`;
}

function prayerBlock(reliefHint?: string): string {
  return `PRAYER

In view of the facts and grounds stated above, it is most respectfully prayed that this Hon'ble forum may be pleased to:

  a) ${reliefHint || '[TO BE FILLED: the specific relief sought]'};
  b) [TO BE FILLED: any further relief sought];
  c) Pass any other order(s) as this Hon'ble forum may deem fit and proper in the interest of justice.`;
}

function verificationBlock(): string {
  return `VERIFICATION

I, the deponent above named, do hereby verify that the contents of the above are true and correct to my knowledge and belief, no part of it is false and nothing material has been concealed therefrom.

Verified at [TO BE FILLED: place] on this [TO BE FILLED: date].

(Signature)`;
}

type TemplateBuilder = (caseData: CaseWithRelations, facts: DraftInputFacts) => string;

const TEMPLATES: Record<string, TemplateBuilder> = {
  legal_notice: (c, f) => `LEGAL NOTICE

To,
${partyBlock(c.opponents)}

From,
${partyBlock([c.client])}

Date: ${fmtDate(Date.now())}

Sir/Madam,

Under instructions from and on behalf of my client, I hereby serve upon you the following notice:

1. That ${f.causeOfAction || '[TO BE FILLED: the facts giving rise to this notice]'}.

2. ${f.description || '[TO BE FILLED: further facts/background]'}.

3. My client hereby calls upon you to [TO BE FILLED: the specific action/remedy demanded] within 15 (fifteen) days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, entirely at your risk, cost, and consequences, for which you alone shall be liable.

This notice is issued without prejudice to any other right or remedy available to my client under law, all of which are expressly reserved.

Yours faithfully,
(Signature)`,

  petition: (c, f) => `${causeTitle(c)}

PETITION UNDER [TO BE FILLED: applicable provision/act]

MOST RESPECTFULLY SHOWETH:

1. That ${f.causeOfAction || '[TO BE FILLED: brief facts giving rise to this petition]'}.

2. ${f.description || '[TO BE FILLED: further material facts, in numbered paragraphs]'}.

3. That the Petitioner(s) have no other efficacious remedy except to approach this Hon'ble forum.

4. That this petition is filed bona fide and in the interest of justice.

${prayerBlock()}

${verificationBlock()}`,

  plaint: (c, f) => `${causeTitle(c)}

PLAINT

1. PARTIES: As set out in the cause title above.

2. JURISDICTION: This Hon'ble Court has jurisdiction to try this suit as [TO BE FILLED: the cause of action arose / the defendant resides / the property is situated] within its territorial limits.

3. VALUATION: The suit is valued at ₹${f.claimAmount ?? '[TO BE FILLED]'} for the purposes of court fee and jurisdiction.

4. CAUSE OF ACTION: ${f.causeOfAction || '[TO BE FILLED: cause of action, with date(s)]'}.

5. FACTS: ${f.description || '[TO BE FILLED: numbered statement of facts]'}.

${prayerBlock()}

${verificationBlock()}`,

  written_statement: (c, f) => `${causeTitle(c)}

WRITTEN STATEMENT ON BEHALF OF THE DEFENDANT(S)/RESPONDENT(S)

PRELIMINARY OBJECTIONS
1. [TO BE FILLED: any preliminary objection, e.g. maintainability, limitation, jurisdiction]

REPLY ON MERITS
(Paragraph-wise reply to the plaint/petition's numbered facts)
1. That the contents of paragraph 1 of the plaint/petition are [admitted/denied/not within personal knowledge, hence not admitted].
2. [TO BE FILLED: continue paragraph-wise]

ADDITIONAL FACTS
${f.description || '[TO BE FILLED: any additional facts/defense the Defendant(s)/Respondent(s) rely on]'}

PRAYER
It is respectfully prayed that the plaint/petition be dismissed with costs, and any other order deemed fit be passed.

${verificationBlock()}`,

  affidavit: (c, f) => `AFFIDAVIT

I, ${partyBlock([c.client])}, do hereby solemnly affirm and declare as under:

1. That I am the deponent in the above matter and am well conversant with the facts of the case, competent to swear this affidavit.

2. That ${f.causeOfAction || '[TO BE FILLED: statement of fact, on personal knowledge]'}.

3. ${f.description || '[TO BE FILLED: further statements, each paragraph noting whether made on personal knowledge or information/belief]'}.

4. That the contents of this affidavit are true and correct to my knowledge and belief, and nothing material has been concealed.

DEPONENT

${verificationBlock()}`,

  application: (c, f) => `${causeTitle(c)}

APPLICATION UNDER [TO BE FILLED: applicable provision/rule]

MOST RESPECTFULLY SHOWETH:

1. That the above-captioned matter is pending before this Hon'ble forum.

2. That ${f.causeOfAction || '[TO BE FILLED: grounds for this application]'}.

3. ${f.description || '[TO BE FILLED: further grounds]'}.

${prayerBlock("this Hon'ble forum may be pleased to allow the present application")}

${verificationBlock()}`,

  reply: (c, f) => `${causeTitle(c)}

REPLY

1. That the contents of the notice/application/petition are denied except to the extent specifically admitted herein below.

2. ${f.description || '[TO BE FILLED: point-by-point response to the points raised]'}.

3. ${f.causeOfAction || "[TO BE FILLED: the replying party's own version of events/position]"}.

4. It is submitted that the claims/allegations made are misconceived and untenable, and are denied in their entirety.

${verificationBlock()}`,

  appeal: (c, f) => `${causeTitle(c)}

MEMORANDUM OF APPEAL

Against the order dated [TO BE FILLED] passed by [TO BE FILLED: forum below] in [TO BE FILLED: case number below], the Appellant(s) above named most respectfully prefer this appeal on the following, among other, GROUNDS:

A. [TO BE FILLED: ground of appeal 1 -- what the forum below got wrong, and why]
B. [TO BE FILLED: ground of appeal 2]

FACTS: ${f.description || '[TO BE FILLED: brief facts and procedural history]'}.

${prayerBlock('the impugned order be set aside / modified as prayed')}

${verificationBlock()}`,

  rejoinder: (c, f) => `${causeTitle(c)}

REJOINDER

1. That this rejoinder is filed in response to the reply filed by the opposite side, and reaffirms the position taken in the original petition/plaint/application.

2. ${f.description || '[TO BE FILLED: point-by-point response to the new points raised in the reply]'}.

3. That the averments made in the reply, to the extent inconsistent with this rejoinder, are denied.

${verificationBlock()}`,

  other: (c, f) => `${causeTitle(c)}

${f.description || '[TO BE FILLED: purpose and content of this document]'}

${verificationBlock()}`,
};

/**
 * Offline, template-based first drafts -- works with ZERO network and ZERO AI call, filling in
 * whatever the case record already has and leaving a clear "[TO BE FILLED: ...]" placeholder for
 * anything it doesn't. src/services/ai/draftService.ts layers an optional online AI rewrite on top
 * of this when the user has configured their own Gemini key and is online -- but this function
 * alone is enough to produce a usable structural starting point with no signal at all.
 */
export function renderTemplateDraft(draftType: string, caseData: CaseWithRelations, facts: DraftInputFacts = {}): string {
  const build = TEMPLATES[draftType] || TEMPLATES.other;
  return build(caseData, facts);
}
