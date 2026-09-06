import type { Lesson } from '../types';

export const polityLessons: Lesson[] = [
  {
    id: 'polity-d1-historical-background',
    title: 'Historical Background of the Indian Constitution',
    summary:
      'The Government of India Act 1935 is the direct structural template for our Constitution, but the story starts in 1773. This lesson traces the key Acts from Company rule to the transfer of power, focused on how executive power shifted over time.',
    estimatedMinutes: 40,
    learningObjectives: [
      'Explain the significance of the Regulating Act 1773 and the Pitt\'s India Act 1784',
      'Trace how executive control shifted from the Company to the Crown to Indians',
      'List the Government of India Acts and their headline contribution',
      'Identify which single Act is the direct "blueprint" of the 1950 Constitution',
    ],
    sections: [
      {
        heading: 'Regulating Act, 1773',
        body: [
          'This was the first step by the British Parliament to control and regulate the affairs of the East India Company in India — and the first written document functioning as a "constitutional" charter for Company rule. It designated the Governor of Bengal as "Governor-General of Bengal" and created an Executive Council of four members to assist him (Warren Hastings was the first Governor-General under this Act). It also subordinated the Governors of Bombay and Madras presidencies to the Governor-General of Bengal for the first time, and provided for a Supreme Court at Calcutta (1774). It prohibited servants of the Company from private trade and from accepting bribes from Indians — an early anti-corruption clause.',
          'Side-note focus for today: this Act is important because it marks the first shift of executive power from a purely commercial Company structure towards a system with Crown oversight (through Parliament) — a theme ("who controls the executive") that runs through every Act until 1947.',
        ],
      },
      {
        heading: "Pitt's India Act, 1784",
        body: [
          'Passed because the Regulating Act 1773 had proved inadequate, this Act is significant for creating a system of double government: it distinguished the Company\'s commercial and political functions. A Board of Control was created in London to manage political affairs, while a Court of Directors continued to manage commercial affairs — the first time British India\'s political affairs were placed under a body directly responsible to the British Parliament/Crown, rather than the Company\'s shareholders alone. This is the second major step in the shift of ultimate control away from the Company toward the British state.',
        ],
      },
      {
        heading: 'Charter Acts and the Move Toward Crown Rule',
        body: [
          "Charter Act 1833 made the Governor-General of Bengal the 'Governor-General of India' (first one: Lord William Bentinck) — centralising all civil and military power in one authority for the first time and ending the legislative powers of Bombay and Madras. Charter Act 1853 separated legislative and executive functions of the Governor-General's council for the first time and introduced open competition (via examination) for the civil service, reducing patronage.",
          "Government of India Act 1858, passed after the 1857 revolt, was the real turning point: it ended Company rule entirely and transferred power directly to the British Crown. The Governor-General of India additionally became the 'Viceroy' as the direct representative of the Crown. A new office, the Secretary of State for India (a British Cabinet minister), was created to be responsible to the British Parliament.",
        ],
      },
      {
        heading: 'Steps Toward Indian Representation (1861–1935)',
        body: [
          'Indian Councils Act 1861 began the process of devolving legislative power to India and started an era of representative institutions by associating Indians (in a nominal advisory capacity) with law-making. Indian Councils Act 1892 introduced indirect elections for the first time. The Morley-Minto Reforms (Indian Councils Act 1909) introduced separate electorates for Muslims for the first time — a critical, controversial step communalising Indian politics.',
          "Government of India Act 1919 (Montagu-Chelmsford Reforms) introduced 'dyarchy' (a dual system of governance) in the provinces — subjects were divided into 'transferred' (administered by ministers responsible to the legislature) and 'reserved' (administered by the Governor without legislative accountability). This was the first real, if limited, transfer of executive power to elected Indians.",
          "Government of India Act 1935 is the most important of all for GS Polity, since it forms the direct structural template of our present Constitution — many provisions (federal scheme, office of Governor, Public Service Commissions, judiciary structure, emergency provisions) were borrowed almost verbatim by the Constituent Assembly. It proposed an All-India Federation (never actually implemented) and extended dyarchy to the centre while abolishing it in the provinces, replacing it with provincial autonomy.",
        ],
      },
      {
        heading: 'Indian Independence Act, 1947',
        body: [
          'This Act ended British paramountcy, partitioned British India into India and Pakistan as two independent dominions from 15 August 1947, abolished the office of Secretary of State for India, and made the Constituent Assembly of each dominion a fully sovereign body empowered to frame and adopt any constitution and to repeal any British Act, including this one. It is the final Act — the one that formally transfers ultimate executive and legislative authority to Indians.',
        ],
      },
    ],
    keyTerms: [
      { term: 'Dyarchy', definition: 'A dual system of government (introduced 1919, provinces) dividing subjects into "transferred" (elected minister-controlled) and "reserved" (Governor-controlled) categories.' },
      { term: 'Board of Control', definition: 'Body created in London by Pitt\'s India Act 1784 to oversee the East India Company\'s political/civil/military affairs on behalf of the British government.' },
      { term: 'Separate electorate', definition: 'A system where voters of a particular religion/community vote only for candidates of their own community — introduced for Muslims by the 1909 Act.' },
    ],
    mnemonics: [
      'Executive power timeline: Company (1773–1784, regulated) → Crown via Board of Control (1784–1858) → Crown direct rule (1858–1919) → shared with Indians via dyarchy (1919) → provincial autonomy (1935) → full transfer (1947).',
    ],
    practiceQuestions: [
      {
        question: 'What were the two main contributions of the Regulating Act, 1773?',
        answer:
          'It designated the Governor of Bengal as Governor-General and created an Executive Council to assist him, and it subordinated the Bombay and Madras presidencies to Bengal — the first steps of Parliamentary control over Company rule.',
      },
      {
        question: "Why is the Government of India Act 1935 called the 'blueprint' of the Indian Constitution?",
        answer:
          'Because a large share of its provisions — federal structure, office of Governor, Public Service Commissions, the judiciary\'s structure, and emergency provisions — were directly borrowed by the Constituent Assembly while drafting the 1950 Constitution.',
      },
      {
        question: "What change did Pitt's India Act 1784 make to the control of Company affairs?",
        answer:
          'It created a Board of Control in London for political affairs, separate from the Company\'s own Court of Directors (commercial affairs) — a system of "double government" that placed political control under a body answerable to the British Parliament.',
      },
    ],
    revisionChecklist: [
      'Can state what changed in executive power at each of: 1773, 1784, 1858, 1919, 1935, 1947',
      'Know why 1935 is called the "blueprint" Act',
      'Can name the first Governor-General (Warren Hastings) and first Governor-General of India (Bentinck)',
      'Can explain dyarchy in one line',
    ],
  },
  {
    id: 'polity-d2-making-of-constitution',
    title: 'Making of the Constitution',
    summary:
      'The Constituent Assembly, formed under the 1946 Cabinet Mission Plan, took 2 years 11 months 18 days to draft the Constitution. This lesson covers the Assembly\'s composition, its key committees, and the broad drafting process — with focus on who headed what, not minor names.',
    estimatedMinutes: 40,
    learningObjectives: [
      'Explain how the Constituent Assembly was formed and its broad composition',
      'List the major committees of the Assembly and their chairpersons',
      'State the key dates: first meeting, adoption, and commencement',
      'Describe the Drafting Committee\'s role and Dr B.R. Ambedkar\'s position',
    ],
    sections: [
      {
        heading: 'Formation of the Constituent Assembly',
        body: [
          'The idea of a Constituent Assembly elected by Indians (rather than a constitution imposed by the British) was first formally put forward by M.N. Roy in 1934 and adopted as official Congress demand in 1935; the British accepted it in the 1940 "August Offer". The Assembly was actually constituted under the Cabinet Mission Plan of 1946. Members were elected indirectly, by the members of the newly elected provincial legislative assemblies, using a single transferable vote system of proportional representation. Seats were allocated to each province roughly in proportion to population (1 seat per 10 lakh population) and split communally (Muslims, Sikhs, general).',
          'The total membership was fixed at 389 (296 from British India, 93 from princely states) before Partition; after Partition, membership reduced to 299 (as many Muslim-League members went to Pakistan\'s separate Constituent Assembly).',
        ],
      },
      {
        heading: 'First Meeting and Key Dates',
        body: [
          'The Assembly first met on 9 December 1946; the Muslim League boycotted this first meeting and demanded a separate state. Dr Sachchidananda Sinha was elected the temporary/provisional Chairman (the oldest member present, per convention). On 11 December 1946, Dr Rajendra Prasad was elected as the permanent President of the Assembly, and H.C. Mukherjee as Vice-President. On 13 December 1946, Jawaharlal Nehru moved the historic "Objectives Resolution", which laid down the fundamental philosophy of the constitutional structure and later formed the basis of the Preamble.',
          'The Constitution was finally adopted on 26 November 1949 (celebrated today as "Constitution Day"/Samvidhan Divas) and came into force on 26 January 1950 (chosen to commemorate the 1930 "Purna Swaraj" declaration). The Assembly took 2 years, 11 months, and 18 days to complete its work, holding 11 sessions.',
        ],
      },
      {
        heading: 'Major Committees — Focus on Who Headed What',
        body: [
          'For revision, remember only the chairperson of each major committee, not every member:',
          '• Drafting Committee — Dr B.R. Ambedkar (Chairman) — the most important committee, responsible for preparing the actual draft text',
          '• Union Powers Committee — Jawaharlal Nehru',
          '• Union Constitution Committee — Jawaharlal Nehru',
          '• Provincial Constitution Committee — Sardar Vallabhbhai Patel',
          '• Drafting/Advisory Committee on Fundamental Rights, Minorities, Tribal Areas — Sardar Vallabhbhai Patel (overall Advisory Committee); the Fundamental Rights Sub-Committee itself was headed by J.B. Kripalani',
          '• Rules of Procedure Committee — Dr Rajendra Prasad',
          '• States Committee (Committee for Negotiating with States) — Jawaharlal Nehru',
          'The overwhelming exam focus is: Ambedkar = Drafting Committee, Nehru = Union-related committees + Objectives Resolution, Patel = Provincial + Advisory Committee (Minorities/Fundamental Rights), Rajendra Prasad = President of the Assembly overall.',
        ],
      },
      {
        heading: 'The Drafting Committee and Ambedkar\'s Role',
        body: [
          'The Drafting Committee, set up on 29 August 1947 with seven members, was the most important committee because it was tasked with scrutinising the draft Constitution prepared by the Constitutional Adviser B.N. Rau and presenting it, article by article, before the Assembly. Dr B.R. Ambedkar, as Chairman, is therefore popularly called the "Father/Chief Architect of the Indian Constitution" — not because he alone wrote it, but because he steered the drafting, defended provisions in debate, and piloted the final text through the Assembly. B.N. Rau, though not a member of the Assembly, is important as the Constitutional Adviser who prepared the original draft based on the decisions of various committees.',
        ],
      },
    ],
    keyTerms: [
      { term: 'Objectives Resolution', definition: 'Resolution moved by Nehru (13 Dec 1946) outlining the Constitution\'s foundational philosophy; basis for the eventual Preamble.' },
      { term: 'Drafting Committee', definition: 'Seven-member committee chaired by Dr B.R. Ambedkar responsible for preparing and piloting the Constitution\'s draft text through the Assembly.' },
      { term: 'Constitutional Adviser', definition: 'B.N. Rau, who prepared the original draft Constitution based on committee decisions, before it went to the Drafting Committee.' },
    ],
    mnemonics: ['Committee heads — "ANPR": Ambedkar (Drafting), Nehru (Union), Patel (Provincial/Advisory), (Rajendra) Prasad (President/Rules of Procedure).'],
    practiceQuestions: [
      {
        question: 'How was the Constituent Assembly constituted, and what was its total strength before and after Partition?',
        answer:
          'It was constituted under the 1946 Cabinet Mission Plan, with members indirectly elected by provincial legislative assemblies. Total strength was 389 before Partition (296 British India + 93 princely states), reduced to 299 after Partition.',
      },
      {
        question: 'What is the significance of the Objectives Resolution and who moved it?',
        answer:
          'Moved by Jawaharlal Nehru on 13 December 1946, it laid down the fundamental philosophy and guiding values of the future Constitution and later formed the basis of the Preamble.',
      },
      {
        question: 'Why is Dr B.R. Ambedkar called the chief architect of the Constitution?',
        answer:
          'As Chairman of the Drafting Committee, he was responsible for scrutinising and presenting the draft Constitution article-by-article before the Assembly, steering debates and defending provisions, even though the original draft was prepared by Constitutional Adviser B.N. Rau based on various committee reports.',
      },
    ],
    revisionChecklist: [
      'Know the three key dates: 9 Dec 1946 (first meeting), 26 Nov 1949 (adopted), 26 Jan 1950 (commenced)',
      'Can match each major committee to its chairperson without hesitation',
      'Can explain the Objectives Resolution\'s significance in one line',
      'Know the difference between B.N. Rau\'s role and Ambedkar\'s role',
    ],
  },
  {
    id: 'polity-d3-salient-features-preamble',
    title: 'Salient Features of the Indian Constitution & Preamble',
    summary:
      "The Indian Constitution blends borrowed features into a unique document — the longest written constitution in the world. This lesson covers its salient features and a close reading of the Preamble, word by word.",
    estimatedMinutes: 40,
    learningObjectives: [
      'List at least 8 salient features of the Indian Constitution',
      'Recite and explain each key word of the Preamble',
      'State which words were added by the 42nd Amendment (1976)',
      'Explain why the Preamble is / is not part of the Constitution, per the Supreme Court',
    ],
    sections: [
      {
        heading: 'Salient Features — a Working List',
        body: [
          "1. Lengthiest written constitution in the world (originally 395 Articles in 22 Parts and 8 Schedules; now more, due to amendments), reflecting India's size, diversity, and detailed borrowing from many sources. 2. Drawn from many sources — e.g., parliamentary system from Britain, Fundamental Rights from the USA, Directive Principles from Ireland, federal scheme from Canada, concurrent list from Australia — earning it the description of a 'bag of borrowings', though skilfully adapted to India's needs.",
          "3. Blend of rigidity and flexibility — some provisions can be amended by simple parliamentary majority, others need special majority, and a few need special majority plus ratification by half the states (Article 368). 4. Federal system with unitary bias — often described as 'quasi-federal' or 'federal in form, unitary in spirit', since it provides a strong centre (residuary powers, single citizenship, all-India services, emergency provisions that can convert it into a unitary system).",
          "5. Parliamentary form of government (as opposed to presidential) — executive is drawn from and accountable to the legislature. 6. Synthesis of parliamentary sovereignty and judicial supremacy — Parliament makes laws, but the judiciary can strike down unconstitutional laws (judicial review), yet Parliament can still amend the Constitution, giving neither absolute supremacy. 7. Integrated and independent judiciary with a single, unified system of courts for both central and state laws, headed by the Supreme Court.",
          "8. Fundamental Rights and Duties along with Directive Principles of State Policy — rights are justiciable (enforceable in court), DPSPs are non-justiciable but fundamental in governance. 9. Secularism — the state has no religion of its own but treats all religions equally (added explicitly to the Preamble in 1976, though considered implicit from the start via Articles 25–28). 10. Universal adult franchise — every citizen 18 years or above can vote, without property, education, or gender qualification. 11. Single citizenship (unlike the USA's dual citizenship, despite India's federal structure). 12. Independent bodies such as the Election Commission, CAG, and UPSC.",
        ],
      },
      {
        heading: 'The Preamble — Word by Word',
        body: [
          'The Preamble reads: "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN, SOCIALIST, SECULAR, DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation; IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION."',
          'Sovereign: India is internally and externally free to make its own decisions, subject to no outside authority — though it may voluntarily join international bodies like the UN. Socialist: added by the 42nd Amendment (1976); India follows "democratic socialism" — a mixed economy blending private enterprise with a welfare state, not state ownership of all means of production. Secular: also added in 1976; the state has no state religion and treats all religions with equal respect (distinct from strict Western separation — India\'s model allows the state to reform/regulate religious institutions).',
          'Democratic: government derives authority from the will of the people, expressed through free and periodic elections (this covers not just political but, per the objects clause, social and economic democracy too). Republic: the head of state (President) is elected, directly or indirectly, for a fixed term — not a hereditary monarch. Justice (social, economic, political): drawn from the Russian Revolution\'s ideals, aims at removing social/economic/political inequalities. Liberty: of thought, expression, belief, faith, worship — drawn from the French Revolution. Equality: of status and opportunity. Fraternity: a sense of common brotherhood, assuring individual dignity and national unity and integrity — the word "integrity" was also added by the 42nd Amendment.',
        ],
      },
      {
        heading: 'Preamble in Judicial Interpretation',
        body: [
          'In the Berubari Union case (1960), the Supreme Court held that the Preamble is not part of the Constitution and is not enforceable in court, though it is useful in interpreting ambiguous provisions. In the landmark Kesavananda Bharati case (1973), the Court reversed itself and held that the Preamble IS part of the Constitution, subject to the same limitation as any other part — it can be amended under Article 368, but Parliament cannot amend the "basic structure" reflected in the Preamble (justice, liberty, equality, fraternity, the republic\'s democratic and secular character). The Preamble itself has been amended only once, by the 42nd Amendment Act, 1976, which added "Socialist", "Secular", and "Integrity".',
        ],
      },
    ],
    keyTerms: [
      { term: 'Basic structure doctrine', definition: 'The Supreme Court doctrine (Kesavananda Bharati, 1973) holding that Parliament\'s amending power under Article 368 cannot alter the Constitution\'s basic/essential features.' },
      { term: '42nd Amendment, 1976', definition: 'Added "Socialist", "Secular", and "Integrity" to the Preamble; also made several other significant constitutional changes.' },
      { term: 'Quasi-federal', definition: 'Describes India\'s constitutional design as federal in structure but with a strong unitary bias/tilt toward the centre.' },
    ],
    mnemonics: ['Preamble ideals — "JLEF": Justice, Liberty, Equality, Fraternity (in that fixed order, each with its own sub-scope).'],
    practiceQuestions: [
      {
        question: 'Which three words were added to the Preamble by the 42nd Amendment Act, 1976, and what does each mean in the Indian context?',
        answer:
          '"Socialist" (a mixed economy / democratic socialism, not state ownership of all production), "Secular" (state treats all religions equally and has no religion of its own, while retaining power to reform religious institutions), and "Integrity" (added to "unity and integrity of the Nation").',
      },
      {
        question: 'How did the Supreme Court\'s view on whether the Preamble is "part of" the Constitution change between 1960 and 1973?',
        answer:
          'In the Berubari Union case (1960) the Court held the Preamble is not part of the Constitution and not enforceable. In Kesavananda Bharati (1973) it reversed this, holding the Preamble is part of the Constitution, though it remains subject to Parliament\'s amending power under Article 368, constrained by the basic structure doctrine.',
      },
      {
        question: 'List any five salient features of the Indian Constitution.',
        answer:
          'Any five of: lengthiest written constitution; blend of rigidity and flexibility; federal system with unitary bias; parliamentary form of government; independent and integrated judiciary; Fundamental Rights with Directive Principles; secularism; universal adult franchise; single citizenship; independent bodies like the Election Commission.',
      },
    ],
    revisionChecklist: [
      'Can recite the Preamble\'s structure from memory (sovereign-socialist-secular-democratic-republic + JLEF)',
      'Know exactly which words the 42nd Amendment added',
      'Can state the Berubari vs Kesavananda Bharati positions on the Preamble',
      'Can list 8+ salient features without notes',
    ],
  },
  {
    id: 'polity-d4-fundamental-rights-1',
    title: 'Fundamental Rights I — Right to Equality & Right to Freedom (Articles 12–22)',
    summary:
      'Part III of the Constitution is its most litigated and most-tested part. This first half covers Article 12\'s definition of "State", Article 13, the Right to Equality (14–18), and the Right to Freedom (19–22), read as plain constitutional text.',
    estimatedMinutes: 45,
    learningObjectives: [
      'Explain what Article 12 means by "State" and why Article 13 matters',
      'List the four Articles under Right to Equality and what each guarantees',
      'List the six freedoms under Article 19 and the grounds on which they can be restricted',
      'Distinguish Articles 20, 21, and 22 in one line each',
    ],
    sections: [
      {
        heading: 'Article 12 & 13 — Setting the Frame',
        body: [
          'Article 12 defines "the State" for the purposes of Part III to include the Union government and Parliament, state governments and legislatures, local authorities, and other authorities within India or under the control of the Government of India — this wide definition means Fundamental Rights can be claimed not just against the central/state governments but also against bodies like municipalities, statutory corporations, and (per later case law) certain instrumentalities of the state.',
          'Article 13 declares that any law inconsistent with or in derogation of Part III shall be void to the extent of the inconsistency — this is the provision that empowers courts to strike down unconstitutional laws (the foundation of judicial review) and applies to laws in force before the Constitution as well as any future law.',
        ],
      },
      {
        heading: 'Right to Equality (Articles 14–18)',
        body: [
          'Article 14: Equality before law (a negative concept, borrowed from Britain, meaning no special privileges for anyone, including the State) and equal protection of the laws (a positive concept, borrowed from the USA, meaning equal treatment in equal circumstances — allowing "reasonable classification" as long as it has a rational basis and nexus to the law\'s objective).',
          'Article 15: Prohibits discrimination by the State against citizens on grounds only of religion, race, caste, sex, or place of birth, in access to shops, public restaurants, wells, roads, etc. It permits special provisions for women, children, and socially/educationally backward classes (including reservations) — the constitutional basis for affirmative action.',
          'Article 16: Guarantees equality of opportunity in public employment, prohibiting discrimination on the same grounds as Article 15 (plus descent and residence), while permitting reservation of posts for backward classes not adequately represented in state services.',
          'Article 17: Abolishes "untouchability" in any form and forbids its practice, making its enforcement an offence punishable by law (implemented via the Protection of Civil Rights Act, 1955).',
          'Article 18: Abolishes titles (other than military/academic distinctions) — the State cannot confer titles on citizens or foreigners, and citizens cannot accept titles from a foreign state — the constitutional basis on which "Bharat Ratna" and similar awards are legally framed as not being "titles" in the prohibited sense.',
        ],
      },
      {
        heading: 'Right to Freedom — Article 19\'s Six Freedoms',
        body: [
          'Article 19(1) guarantees six freedoms to citizens (not to foreigners): (a) speech and expression, (b) assembly (peaceable, without arms), (c) association/union/co-operative societies, (d) movement freely throughout India, (e) residence and settlement in any part of India, and (g) practise any profession or carry on any occupation, trade or business. (Freedom (f), to acquire/hold/dispose of property, was removed from Part III by the 44th Amendment, 1978, and downgraded to a mere legal right under Article 300A.)',
          'None of these freedoms is absolute — each can be restricted by the State on specified reasonable grounds listed under Article 19(2)–(6): for example, speech can be restricted in the interest of sovereignty/integrity of India, security of the state, public order, decency/morality, contempt of court, defamation, or incitement to an offence. The word "reasonable" is key — courts can strike down a restriction that is excessive, arbitrary, or not proportionate to its stated purpose.',
        ],
      },
      {
        heading: 'Articles 20–22 — Protections in Criminal Process and Detention',
        body: [
          'Article 20 protects against arbitrary and excessive punishment: no conviction except for violation of a law in force at the time of the act (no ex-post-facto criminal laws), no double jeopardy (not to be prosecuted/punished more than once for the same offence), and no compulsion to be a witness against oneself (protection against self-incrimination). These apply to "any person", not just citizens.',
          'Article 21 protects life and personal liberty: "No person shall be deprived of his life or personal liberty except according to procedure established by law." Also available to "any person" (citizens and foreigners). Since Maneka Gandhi v. Union of India (1978), the Supreme Court has read this "procedure" to mean a fair, just, and reasonable procedure (not merely any procedure enacted by the legislature), massively expanding Article 21 through judicial interpretation to include rights like privacy, a clean environment, speedy trial, legal aid, and livelihood.',
          'Article 22 provides protection against arbitrary arrest and detention — the right to be informed of the grounds of arrest, to consult and be defended by a lawyer of choice, and to be produced before a magistrate within 24 hours of arrest. However, it also carves out an exception for preventive detention laws, under which some of these safeguards do not apply — a frequently tested tension between individual liberty and state security.',
        ],
      },
    ],
    keyTerms: [
      { term: 'Judicial review', definition: 'The power of courts to examine the constitutionality of a law and declare it void if inconsistent with Fundamental Rights (rooted in Article 13).' },
      { term: 'Reasonable classification', definition: 'The principle allowing the State to treat different groups differently under Article 14, provided the classification has an intelligible differentia and a rational nexus to the law\'s objective.' },
      { term: 'Preventive detention', definition: 'Detention of a person without trial to prevent them from committing a future offence, permitted under Article 22 subject to safeguards.' },
    ],
    mnemonics: ['Article 19 freedoms — "SAAM-R-P": Speech, Assembly, Association, Movement, Residence, Profession (property removed by 44th Amendment).'],
    practiceQuestions: [
      {
        question: 'What does Article 12 mean by "the State" for the purposes of Part III?',
        answer:
          'It includes the Union and state governments and legislatures, local authorities, and other authorities within India or under the control of the Government of India — a wide definition that allows Fundamental Rights to be enforced against bodies beyond just central/state governments.',
      },
      {
        question: 'How did Maneka Gandhi v. Union of India (1978) change the interpretation of Article 21?',
        answer:
          'It held that the "procedure established by law" depriving a person of life or personal liberty must itself be fair, just, and reasonable, not arbitrary — linking Article 21 to Articles 14 and 19 and enabling courts to read many unenumerated rights (privacy, livelihood, clean environment, etc.) into it.',
      },
      {
        question: 'Which of the original six freedoms under Article 19 was removed, and by which amendment?',
        answer:
          'The freedom to acquire, hold, and dispose of property (Article 19(1)(f)) was removed by the 44th Amendment Act, 1978, and reduced to a legal (constitutional, non-fundamental) right under Article 300A.',
      },
    ],
    revisionChecklist: [
      'Can state what Articles 14–18 each cover in one line',
      'Can list all six (originally seven) freedoms under Article 19 in order',
      'Can distinguish Articles 20, 21, and 22 without confusing them',
      'Know that Article 21\'s scope expanded hugely after Maneka Gandhi (1978)',
    ],
  },
  {
    id: 'polity-d5-fundamental-rights-2',
    title: 'Fundamental Rights II — Remaining Articles & Exceptions (Articles 23–35)',
    summary:
      'The second half of Part III covers the Right against Exploitation, Right to Freedom of Religion, Cultural and Educational Rights, the Right to Constitutional Remedies, and the important exceptions/limitations on Fundamental Rights.',
    estimatedMinutes: 40,
    learningObjectives: [
      'Explain Articles 23 and 24 (Right against Exploitation)',
      'List Articles 25–28 and what each protects regarding religion',
      'Distinguish Articles 29 and 30 (Cultural and Educational Rights)',
      'Explain why Dr Ambedkar called Article 32 "the heart and soul" of the Constitution',
      'List the key exceptions to Fundamental Rights (Articles 33, 34, 31A–31C)',
    ],
    sections: [
      {
        heading: 'Right against Exploitation (Articles 23–24)',
        body: [
          'Article 23 prohibits traffic in human beings, "begar" (forced/unpaid labour), and other similar forms of forced labour — and makes any contravention a punishable offence. It applies against both the State and private individuals, and expressly permits the State to impose compulsory service for public purposes (like conscription or community service) without this counting as discrimination on religion/race/caste alone.',
          'Article 24 prohibits employment of children below 14 years of age in any factory, mine, or other hazardous employment — the constitutional basis for later child-labour legislation. Note it is a fairly narrow prohibition (hazardous work specifically), further strengthened over the decades by statutes and by the addition of Article 21A (Right to Education, added by the 86th Amendment, 2002) which makes free and compulsory education a fundamental right for children aged 6–14.',
        ],
      },
      {
        heading: 'Right to Freedom of Religion (Articles 25–28)',
        body: [
          'Article 25 guarantees to all persons (not just citizens) freedom of conscience and the right to freely profess, practise, and propagate religion, subject to public order, morality, health, and other Fundamental Rights. It also allows the State to regulate secular activities associated with religious practice and to throw open Hindu religious institutions of a public character to all classes/sections of Hindus (addressing untouchability in temple entry).',
          'Article 26 gives every religious denomination the right to establish and maintain institutions for religious/charitable purposes, manage its own affairs in religious matters, and own/administer property — again subject to public order, morality, and health.',
          'Article 27 says no person can be compelled to pay taxes for the promotion of any particular religion — the state cannot use general tax revenue to fund one religion\'s propagation (though it can spend on regulating/maintaining all religious institutions).',
          'Article 28 prohibits religious instruction in wholly State-funded educational institutions, while permitting it in institutions administered by the State but established under an endowment/trust requiring such instruction, and in institutions merely recognised/aided (but not wholly maintained) by the State, subject to the student\'s or guardian\'s consent.',
        ],
      },
      {
        heading: 'Cultural and Educational Rights (Articles 29–30)',
        body: [
          'Article 29 protects any section of citizens having a distinct language, script, or culture from being denied admission into State-maintained or State-aided educational institutions on grounds only of religion, race, caste, or language — protecting minority (and majority) cultural groups from discrimination in admissions.',
          'Article 30 gives all minorities (religious or linguistic) the right to establish and administer educational institutions of their choice, and bars the State from discriminating against minority institutions in granting aid. This is a distinct, additional right specifically for minorities, going beyond the non-discrimination guarantee of Article 29.',
        ],
      },
      {
        heading: 'Right to Constitutional Remedies (Article 32)',
        body: [
          'Article 32 itself guarantees the right to move the Supreme Court directly for the enforcement of Fundamental Rights, and empowers the Supreme Court to issue writs — habeas corpus, mandamus, prohibition, certiorari, and quo warranto — for that purpose. Because a right without a remedy is meaningless, Dr B.R. Ambedkar called Article 32 "the heart and soul of the Constitution" and "the very soul of the Constitution and the very heart of it", without which the Constitution would be a "nullity". Note Article 226 gives High Courts an even wider writ jurisdiction (for enforcement of Fundamental Rights and "any other purpose"), but Article 32 is itself a Fundamental Right, while Article 226 is not.',
        ],
      },
      {
        heading: 'Exceptions and Limits on Fundamental Rights',
        body: [
          'Article 33 empowers Parliament to restrict or abrogate Fundamental Rights in their application to members of the armed forces, para-military forces, police, and similar forces, to ensure proper discharge of duties and maintenance of discipline. Article 34 permits restriction of Fundamental Rights while martial law is in force in any area, to enable restoration of order.',
          'Article 35 assigns the power to make laws giving effect to certain Fundamental Rights (e.g., Articles 16, 32, 33, 34) exclusively to Parliament, not state legislatures, to ensure uniformity throughout India. Also remember Articles 31A, 31B, and 31C (inserted by later amendments), which shield land reform laws, laws placed in the Ninth Schedule, and laws implementing certain Directive Principles from being challenged as violating Articles 14 and 19 (31C\'s protection regarding Article 19 challenges is more contested post-Kesavananda Bharati / Minerva Mills).',
          'Finally, remember the 44th Amendment Act, 1978, removed the Right to Property from Part III altogether (it survives only as a legal right under Article 300A, outside Part III, meaning it can no longer be enforced via Article 32).',
        ],
      },
    ],
    keyTerms: [
      { term: 'Begar', definition: 'Forced labour without payment, expressly prohibited by Article 23.' },
      { term: 'Writs', definition: 'Five judicial orders (habeas corpus, mandamus, prohibition, certiorari, quo warranto) the Supreme Court (Art. 32) and High Courts (Art. 226) can issue to enforce rights.' },
      { term: 'Ninth Schedule', definition: 'A list of laws (added via Article 31B) historically shielded from judicial review on Fundamental Rights grounds, though the Supreme Court has since allowed limited review of post-1973 additions.' },
    ],
    mnemonics: ['Religion articles 25-28 — "Practise-Manage-noTax-noInstruction": 25=Practise, 26=Manage institutions, 27=no Tax for religion, 28=no religious Instruction in state-funded schools.'],
    practiceQuestions: [
      {
        question: 'Distinguish Article 29 from Article 30.',
        answer:
          'Article 29 protects any section of citizens with a distinct language/script/culture from being denied admission to state institutions on grounds of religion, race, caste, or language. Article 30 additionally gives specifically religious or linguistic minorities the right to establish and administer their own educational institutions, and protects them from discriminatory denial of state aid.',
      },
      {
        question: 'Why did Dr Ambedkar call Article 32 "the heart and soul of the Constitution"?',
        answer:
          'Because it guarantees the right to directly approach the Supreme Court for enforcement of Fundamental Rights and empowers the Court to issue writs, giving substance to all other Fundamental Rights — without an enforceable remedy, rights would be meaningless.',
      },
      {
        question: 'What restriction does Article 24 place, and what related right was added later to strengthen it?',
        answer:
          'Article 24 prohibits employing children below 14 in factories, mines, or hazardous work. Article 21A, added by the 86th Amendment (2002), later made free and compulsory education a Fundamental Right for children aged 6–14, reinforcing protection of children.',
      },
    ],
    revisionChecklist: [
      'Can state what Articles 23 and 24 each prohibit',
      'Can list Articles 25–28 in order with one line each',
      'Can distinguish Article 29 from Article 30 without hesitation',
      'Know all five writs under Article 32/226',
      'Can state what Articles 33 and 34 permit, and what happened to the Right to Property',
    ],
  },
];
