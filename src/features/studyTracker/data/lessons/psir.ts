import type { Lesson } from '../types';

export const psirLessons: Lesson[] = [
  {
    id: 'psir-d1-scope-approaches',
    title: 'Meaning, Scope, and Approaches to Political Theory',
    summary:
      'Political theory is the systematic reflection on the state, power, and the good life. This lesson maps what the discipline studies, why it matters for a democracy like India, and the major lenses (traditional, empirical, contemporary) through which scholars approach it.',
    estimatedMinutes: 45,
    learningObjectives: [
      'Define political theory and distinguish it from political science as a whole',
      'List the traditional, empirical, and contemporary approaches to political theory',
      'Explain why the discipline declined mid-20th century and how it revived after 1970',
      'Connect political theory to real institutions you will study later (Constitution, rights, state)',
    ],
    sections: [
      {
        heading: 'What is Political Theory?',
        body: [
          'Political theory is the branch of political science concerned with ideas, values, and concepts such as the state, sovereignty, liberty, equality, justice, and rights. Where political science more broadly studies institutions and behaviour empirically, political theory asks normative questions: not just "what is" but "what ought to be". It asks what makes a state legitimate, what a just distribution of resources looks like, and what obligations citizens owe each other.',
          'Andrew Hacker defined political theory as a body of thought that combines a description of political facts with an evaluation of their worth — every political theory therefore has two components: an explanatory element (how power actually works) and a normative element (how power should work). Keep this dual structure in mind; almost every thinker you study this week (Plato, Aristotle, Weber) mixes description with prescription.',
        ],
      },
      {
        heading: 'Scope of the Discipline',
        body: [
          'The scope of political theory covers the state and its origins, the concept of sovereignty, the relationship between state and individual, forms of government, the nature of law, rights and obligations, justice, liberty, equality, democracy, and — in the modern era — concepts like power, legitimacy, and ideology. It also studies political institutions (legislature, executive, judiciary) at a conceptual rather than country-specific level.',
          'A useful way to organise the scope for revision is in three baskets: (1) classical concepts — state, sovereignty, law; (2) values — liberty, equality, justice, rights; (3) processes and modern additions — power, authority, legitimacy, ideology, political obligation. You will meet one concept from each basket this week alone.',
        ],
      },
      {
        heading: 'Approaches to Political Theory',
        body: [
          'Traditional (normative/philosophical) approach: This is the oldest approach, running from Plato and Aristotle through to Rousseau and Hegel. It is deductive, value-laden, and historical — it asks what the state ought to be and derives answers from reason, ethics, and history rather than observed data. Sub-types include the philosophical approach (values as the starting point), the historical approach (ideas explained through their historical context), and the institutional approach (formal structures of government).',
          'Empirical (behavioural) approach: Emerging strongly in the USA from the 1930s–50s, this approach insists political study should be like a science — value-free, based on observable behaviour, using data, statistics, and models. David Easton and the behaviouralists argued theory must be empirically verifiable. Its critics said this made theory sterile: it could describe how voters behave but could not tell you whether a policy was just.',
          'Contemporary/post-behavioural approaches: After the 1970s, political theory revived through Rawls\'s A Theory of Justice (1971), which reintroduced normative theorising with analytical rigour. Alongside this, Marxist, feminist, communitarian, and post-modern approaches broadened the discipline — asking whose voice is missing from "universal" theories of justice and rights.',
        ],
      },
      {
        heading: 'The "Decline and Revival" Debate',
        body: [
          'A favourite PSIR essay/answer theme: political theory was said to be in "decline" in the mid-20th century because behaviouralists dismissed normative questions as unscientific, and because totalitarian experience made grand theorising seem dangerous. The "revival" is credited chiefly to John Rawls (1971), whose Theory of Justice showed that rigorous, quasi-scientific method could still be used to answer normative questions like "what is a fair distribution of goods in society?" Remember this as a two-line answer you can deploy in the optional paper: decline = behaviouralist dominance + post-war scepticism of ideology; revival = Rawls + rights movements + environmental and feminist concerns needing normative language.',
        ],
      },
    ],
    keyTerms: [
      { term: 'Normative', definition: 'Concerned with what ought to be the case, i.e., values and standards, rather than only what is observed.' },
      { term: 'Behaviouralism', definition: 'An approach that studies politics through observable, measurable behaviour, aiming for scientific objectivity.' },
      { term: 'Political obligation', definition: 'The moral duty of a citizen to obey the laws and authority of the state.' },
    ],
    mnemonics: [
      'Three baskets of scope — "SVP": State-concepts, Values, Processes.',
      'Approaches — "TEC": Traditional, Empirical, Contemporary.',
    ],
    practiceQuestions: [
      {
        question: 'Distinguish between the traditional and empirical approaches to the study of political theory.',
        answer:
          'Traditional approach is normative, deductive, and historical — it evaluates what the state ought to do (e.g., Plato, Aristotle). The empirical/behavioural approach is descriptive, inductive, and data-driven — it studies observable political behaviour without passing value judgments (e.g., voting behaviour studies). The former asks "what is just?"; the latter asks "how do people actually vote and why?"',
      },
      {
        question: 'Who is credited with the "revival" of political theory, and why?',
        answer:
          'John Rawls, through A Theory of Justice (1971). He showed that normative concepts like justice could be examined with the same rigour as empirical social science, reintroducing legitimacy to value-based theorising after decades of behaviouralist dominance.',
      },
      {
        question: 'Name the two components every political theory combines, per Andrew Hacker.',
        answer: 'A descriptive/explanatory element (how power works) and a normative/evaluative element (how power ought to work).',
      },
    ],
    revisionChecklist: [
      'Can define political theory in one sentence, distinguishing "is" from "ought"',
      'Can list the three approaches (traditional, empirical, contemporary) with one thinker/example each',
      'Can explain the decline–revival debate in 3–4 lines',
      'Have noted the three-basket scope framework for quick recall',
    ],
  },
  {
    id: 'psir-d2-plato-justice',
    title: "Plato's Theory of Justice and the Ideal State",
    summary:
      "Plato's Republic builds an ideal state around one central value — justice — understood as each class performing its proper function. This lesson covers the tripartite soul-state analogy, the theory of Forms behind it, the philosopher-king, and the standard criticisms raised against Plato.",
    estimatedMinutes: 50,
    learningObjectives: [
      "State Plato's definition of justice and how it differs from conventional definitions he rejects",
      'Explain the tripartite theory of the soul and its parallel tripartite class structure of the state',
      "Describe the philosopher-king and the theory of Forms that justifies it",
      'List at least four major criticisms of Plato\'s ideal state',
    ],
    sections: [
      {
        heading: "The Problem: What is Justice?",
        body: [
          "The Republic opens as a dialogue in which Plato (through Socrates) rejects three conventional definitions of justice offered by Cephalus, Polemarchus, and Thrasymachus. Cephalus says justice is speaking the truth and paying debts — Plato shows this fails in edge cases (returning a weapon to a madman). Polemarchus says justice is helping friends and harming enemies — Plato argues a just man should harm no one. Thrasymachus, a sophist, claims 'justice is the interest of the stronger' — that laws are simply whatever benefits the ruling class. Plato spends the rest of the Republic refuting Thrasymachus's cynical, might-is-right view.",
        ],
      },
      {
        heading: 'Justice as Functional Specialisation',
        body: [
          "Plato's own answer: justice is each part of the state (and each part of the soul) performing the function for which it is naturally best suited, without interfering in the function of others. He builds a state of three classes matching three parts of the soul: the Guardians/Philosopher-Rulers (reason) govern via wisdom; the Auxiliaries/Warriors (spirit) defend the state via courage; and the Producers/Artisans (appetite) supply material needs via temperance/self-control. Justice at the state level is 'harmony' — each class doing its own job. Justice at the individual level is the same harmony within the soul: reason ruling over spirit and appetite.",
          "This is why Plato's justice is often called 'functional' rather than 'legal' or 'distributive' — it is not about equal shares, but about the right person doing the right job, and not meddling ('polypragmosyne', doing many things, is injustice).",
        ],
      },
      {
        heading: 'The Philosopher-King and the Theory of Forms',
        body: [
          "Plato's most famous — and most attacked — proposal is that 'philosophers must become kings, or kings must become philosophers' before states can be free of evil. This rests on his metaphysical theory of Forms: the visible world is only a shadow of a higher world of perfect, unchanging Forms (Ideas), and the Form of the Good is the highest of all. Only philosophers, trained through decades of education (mathematics, dialectic) up to age 50, can grasp the Form of the Good directly, and are therefore uniquely qualified to rule justly rather than for self-interest.",
          "To keep Guardians and Auxiliaries free from corruption, Plato controversially proposes abolishing private property and even the nuclear family for the ruling classes ('communism of property and wives'), so that rulers have no private interest that could conflict with the common good.",
        ],
      },
      {
        heading: 'Criticisms of Plato',
        body: [
          'Major criticisms to remember for the optional paper: (1) Totalitarianism — critics like Karl Popper (The Open Society and Its Enemies) call Plato the father of totalitarian thought because he subordinates the individual entirely to the state and closes off social mobility between classes. (2) Absence of rule of law — Plato trusts the wisdom of philosopher-kings over impersonal laws, which is dangerous if a "philosopher" turns corrupt (Plato himself later moderated this in his last work, The Laws). (3) Anti-democratic — Plato distrusted the masses and rejected democracy as rule of the ignorant. (4) Impracticality — the philosopher-king and abolition of family/property for Guardians are seen as utopian and unworkable. (5) Neglect of economic justice — his justice is about function, not about fair distribution of wealth, which modern theorists (Rawls, Marx) find inadequate.',
        ],
      },
    ],
    keyTerms: [
      { term: 'Theory of Forms', definition: 'Plato\'s idea that abstract, perfect Forms (e.g., the Form of the Good) are more real than the physical objects that merely imitate them.' },
      { term: 'Philosopher-king', definition: "Plato's ideal ruler — a philosopher who has grasped the Form of the Good through rigorous education and therefore rules wisely and selflessly." },
      { term: 'Functional justice', definition: 'Justice as each class/part performing its proper role without interference — Plato\'s core definition.' },
    ],
    mnemonics: ['Three classes ↔ three soul-parts ↔ three virtues: Rulers–Reason–Wisdom, Auxiliaries–Spirit–Courage, Producers–Appetite–Temperance.'],
    practiceQuestions: [
      {
        question: "Explain Plato's definition of justice and how it differs from Thrasymachus's view.",
        answer:
          "Plato defines justice as each class/individual performing its own proper function without interfering in others' — a state of internal harmony. Thrasymachus claimed justice is merely 'the interest of the stronger', i.e., whatever rules the powerful impose. Plato rejects this as cynical and shows that true justice benefits the whole community, not just rulers.",
      },
      {
        question: "Why does Karl Popper call Plato's Republic a blueprint for totalitarianism?",
        answer:
          "Because Plato subordinates individual freedom entirely to the state's organic unity, forbids social mobility between rigid classes, controls reproduction and education, and vests unchecked power in an unelected philosopher elite — features Popper links to modern closed/totalitarian societies.",
      },
      {
        question: 'What is the role of the theory of Forms in justifying the philosopher-king?',
        answer:
          'Only someone who has philosophically grasped the eternal Form of the Good can know true justice and the common good beyond appearances, so only the philosopher — not the majority, who see only shadows — is fit to rule.',
      },
    ],
    revisionChecklist: [
      'Can state the three rejected definitions of justice and who proposed each',
      'Can draw the three-class/three-soul-part table from memory',
      'Can explain why philosopher-kings are chosen (link to Forms)',
      'Can list at least 3 criticisms with the name of a critic (Popper for totalitarianism)',
    ],
  },
  {
    id: 'psir-d3-aristotle',
    title: "Aristotle's Critique of Plato, Citizenship, and Classification of Governments",
    summary:
      "Aristotle, Plato's student, rejects his teacher's utopianism for empirical, comparative political science. This lesson covers his critique of the ideal state, his definitions of citizenship and the polis, and his six-fold classification of governments based on who rules and for whose benefit.",
    estimatedMinutes: 50,
    learningObjectives: [
      "Summarise Aristotle's key objections to Plato's communism of property and family",
      "Define Aristotle's concept of the polis and 'man as a political animal'",
      'State the criteria Aristotle uses for citizenship",',
      'Reproduce the six-fold classification of governments and identify the "best practicable" form',
    ],
    sections: [
      {
        heading: 'Aristotle as an Empirical Political Scientist',
        body: [
          "Where Plato was a philosopher building an ideal state from first principles, Aristotle was closer to an empirical scientist: he and his students collected and compared 158 city-state constitutions before writing Politics. This is why Aristotle is often called the 'father of political science' — he combined normative concerns (what is the best state) with comparative, inductive method (what actually works across many states). Keep this Plato-vs-Aristotle contrast (deductive idealist vs inductive empiricist) as a ready-made compare-and-contrast answer.",
        ],
      },
      {
        heading: "Critique of Plato's Communism",
        body: [
          "Aristotle attacks Plato's proposal to abolish private property and family among Guardians on practical grounds: (1) Common ownership breeds neglect — 'what is common to many is taken least care of' — people care most for what is exclusively their own. (2) It removes the pleasures of ownership and parenthood that make life worthwhile and generous giving possible. (3) Abolishing the family would dilute natural affection — a father would not know his own son, weakening not strengthening social bonds. (4) Excessive unity is not even desirable — a state is a plurality of different persons and functions; forcing artificial uniformity destroys the state's very nature as a partnership of diverse households.",
        ],
      },
      {
        heading: 'The Polis and Man as a Political Animal',
        body: [
          "Aristotle's famous line — 'man is by nature a political animal' (zoon politikon) — means humans can only achieve their true nature and the good life (eudaimonia) within the polis (city-state). The polis is not just for survival (which family and village already provide) but for the 'good life' — a life of virtue and reasoned self-sufficiency achievable only in political community. Someone who could live outside the polis, Aristotle says, is either a beast or a god.",
          "Aristotle defines a citizen (polites) narrowly: one who has the right to participate in deliberative or judicial office — i.e., to vote, hold office, and sit on juries — not merely someone who resides in or is protected by the state. This excluded women, slaves, and resident foreigners (metics) from citizenship in his scheme, a point often used to critique Aristotle's exclusionary conception from a modern rights perspective.",
        ],
      },
      {
        heading: 'Classification of Governments',
        body: [
          'Aristotle classifies constitutions along two axes: (a) number of rulers — one, few, or many; and (b) whether rule is for the common good (true/normal form) or for the selfish interest of rulers (perverted/deviant form). This gives six forms: Monarchy (true, rule of one for common good) vs its perversion Tyranny (one, self-interest); Aristocracy (true, rule of few for common good) vs Oligarchy (few, self-interest of the rich); and Polity (true, rule of many for common good) vs Democracy, which Aristotle treats as the perverted rule of the many/poor for their own interest.',
          "Aristotle regarded Polity — a mixed constitution blending oligarchic and democratic elements, dominated by a large, stable middle class — as the 'best practicable' state for most societies, because extremes of wealth and poverty breed instability, while a strong middle class produces moderation and civic stability. This middle-class argument is frequently quoted in essays on democratic stability even today.",
        ],
      },
    ],
    keyTerms: [
      { term: 'Polis', definition: "The self-sufficient Greek city-state; for Aristotle, the natural and necessary community for humans to achieve the 'good life'." },
      { term: 'Zoon politikon', definition: "Aristotle's phrase 'man is a political animal', meaning humans are naturally suited to, and complete themselves within, political community." },
      { term: 'Polity', definition: 'A mixed constitution combining oligarchic and democratic features, ruled by the many for the common good; Aristotle\'s preferred practicable government.' },
    ],
    mnemonics: [
      'Rulers × Interest grid — One/Few/Many crossed with Common-good/Self-interest gives Monarchy-Tyranny, Aristocracy-Oligarchy, Polity-Democracy.',
    ],
    practiceQuestions: [
      {
        question: "On what grounds does Aristotle criticise Plato's proposal for communism of property and family?",
        answer:
          "Aristotle argues shared property is neglected (tragedy of the commons), abolishing family dilutes natural affection and parental care, ownership provides legitimate pleasure and the scope for generosity, and excessive unity destroys the state's natural character as a plurality of diverse households, not a single organism.",
      },
      {
        question: "Explain Aristotle's six-fold classification of governments.",
        answer:
          'Based on number of rulers (one/few/many) and whether rule serves the common good or rulers\' self-interest: true forms are Monarchy, Aristocracy, and Polity; their perversions are Tyranny, Oligarchy, and Democracy respectively. Aristotle regarded Polity, dominated by a stable middle class, as the best practicable form.',
      },
      {
        question: 'Who does Aristotle count as a citizen, and who is excluded?',
        answer:
          'A citizen is one entitled to share in deliberative and judicial office (voting, holding office, jury duty). Women, slaves, and resident foreigners (metics) were excluded — they lacked this active share in ruling and being ruled.',
      },
    ],
    revisionChecklist: [
      'Can state 3+ criticisms Aristotle makes of Plato\'s communism',
      'Can explain "man is a political animal" in one line',
      'Can draw the 3x2 grid of six government forms from memory',
      'Can explain why Aristotle preferred Polity over pure democracy',
    ],
  },
  {
    id: 'psir-d4-liberty-equality',
    title: 'Concepts of Liberty (Negative vs. Positive) and Equality',
    summary:
      "Liberty and equality are the two values most contested in political theory — expand one carelessly and you can crush the other. This lesson covers Isaiah Berlin's negative/positive liberty distinction, key theorists on each side, and the main dimensions and critiques of equality.",
    estimatedMinutes: 45,
    learningObjectives: [
      "Explain Isaiah Berlin's distinction between negative and positive liberty with examples",
      'Identify which thinkers are associated with each concept of liberty',
      'List the different dimensions of equality (natural, legal, political, social, economic)',
      'Explain the tension between liberty and equality, and how theorists attempt to reconcile it',
    ],
    sections: [
      {
        heading: 'Negative Liberty: Freedom From Interference',
        body: [
          "Isaiah Berlin's 1958 essay 'Two Concepts of Liberty' is the anchor text here. Negative liberty is the absence of external constraint or coercion — the area within which a person can act unobstructed by others. 'I am free to the degree no one interferes with me.' It answers the question: 'What is the area within which I am left to do or be what I choose?' Classical liberals — Hobbes, Locke, Bentham, J.S. Mill, Berlin himself — favour this view because it protects a private sphere from both state and social tyranny. Mill's harm principle (the state may restrict liberty only to prevent harm to others, not for the individual's own good) is the practical rule that flows from negative liberty.",
        ],
      },
      {
        heading: 'Positive Liberty: Freedom To Be Self-Directed',
        body: [
          'Positive liberty is the freedom to be one\'s own master — self-realisation, self-mastery, and rational self-direction, often achieved through participation in collective/social life. It answers: "By whom am I governed?" rather than "how far am I governed?" Rousseau (the "general will"), Hegel, T.H. Green, and Marx lean towards positive liberty — they argue that mere absence of interference is empty if a person lacks the real capacity (education, health, resources) to act on their choices. Green\'s idea of liberty as a "positive power to do or enjoy something worth doing" bridges into welfare-state arguments: the state must actively provide conditions (education, minimum wages) for real freedom.',
          "Berlin himself warned that positive liberty is more dangerous historically: it can be twisted into 'forcing someone to be free' — a ruler or party claiming to know your 'true', 'rational' self better than you do, and coercing you in its name (used to justify authoritarian projects in the 20th century). This is the classic PSIR exam point: negative liberty protects against tyranny in a small way; misused positive liberty can justify tyranny at a grand scale.",
        ],
      },
      {
        heading: 'Dimensions of Equality',
        body: [
          "Equality is usually broken into: Natural equality (all humans share equal moral worth, regardless of ability — a foundational, not empirical, claim); Legal equality (equality before law, equal protection of laws — Article 14 of the Indian Constitution, which you will meet later this week); Political equality (equal voting rights, equal access to public office — one person one vote); Social equality (absence of birth/caste/race-based hierarchy — special resonance in India via the anti-untouchability provisions); and Economic equality (fair distribution of wealth and resources, ranging from equality of opportunity to equality of outcome).",
          'A key distinction within economic equality: equality of opportunity (everyone gets a fair starting chance — meritocracy) versus equality of outcome (results are actually equalised, e.g., through redistribution). Rawls\'s "difference principle" — inequalities are justified only if they benefit the worst-off — is the most quoted contemporary attempt to reconcile liberty (allowing inequality-generating enterprise) with equality (constraining it to help the least advantaged).',
        ],
      },
      {
        heading: 'The Liberty–Equality Tension',
        body: [
          "Unrestrained negative liberty (e.g., free market with no redistribution) tends to produce economic inequality, since talent, luck, and inherited wealth compound freely. Aggressive equality (heavy redistribution, strong state control) tends to constrain negative liberty, since it requires coercive taxation and regulation. Socialists prioritise equality even at some cost to liberty; classical liberals/libertarians (Nozick) prioritise liberty even at the cost of inequality, viewing redistribution as a rights violation. Social democrats and Rawlsian liberals attempt a middle path — liberty constrained just enough to guarantee a fair, equal basic structure of society.",
        ],
      },
    ],
    keyTerms: [
      { term: 'Negative liberty', definition: 'Freedom understood as absence of external interference or coercion (Berlin).' },
      { term: 'Positive liberty', definition: 'Freedom understood as self-mastery/self-realisation, often requiring enabling social conditions (Berlin, Green).' },
      { term: "Rawls's difference principle", definition: 'Social and economic inequalities are just only if they work to the greatest benefit of the least advantaged members of society.' },
    ],
    mnemonics: ['Negative = "Freedom FROM" (interference); Positive = "Freedom TO" (be self-directed).'],
    practiceQuestions: [
      {
        question: "Distinguish between negative and positive liberty with the help of thinkers associated with each.",
        answer:
          'Negative liberty (Hobbes, Locke, Mill, Berlin) is freedom from external interference — a protected private sphere. Positive liberty (Rousseau, Green, Hegel, Marx) is freedom to achieve self-mastery and self-realisation, often requiring the state to actively provide enabling conditions like education and welfare.',
      },
      {
        question: 'Why did Isaiah Berlin consider positive liberty potentially more dangerous than negative liberty?',
        answer:
          'Because it can be misused to justify coercion in the name of a person\'s "true" or "higher" self — a ruler claiming to liberate people by forcing them to act according to what the ruler deems rational, a logic Berlin linked to 20th-century authoritarianism.',
      },
      {
        question: 'How does Rawls attempt to reconcile liberty and equality?',
        answer:
          'Through the difference principle: inequalities arising from free enterprise (liberty) are permitted only if they improve the position of society\'s worst-off members, thereby constraining liberty just enough to protect a baseline of equality.',
      },
    ],
    revisionChecklist: [
      'Can state Berlin\'s two questions ("how far governed" vs "by whom governed")',
      'Can name 2 thinkers each for negative and positive liberty',
      'Can list the 5 dimensions of equality (natural, legal, political, social, economic)',
      'Can explain Rawls\'s difference principle in one line',
    ],
  },
  {
    id: 'psir-d5-weber-authority',
    title: "Max Weber's Theory of Authority and Legitimate Power",
    summary:
      "Weber distinguishes 'power' (the ability to compel) from 'authority' (power accepted as legitimate) and identifies three pure types of legitimate authority. This lesson explains all three types with real-world and historical examples, and why the distinction matters for the study of the state.",
    estimatedMinutes: 40,
    learningObjectives: [
      "Distinguish Weber's concepts of power, authority, and legitimacy",
      'Describe the three ideal types of legitimate authority with examples',
      'Explain why legal-rational authority underpins the modern bureaucratic state',
      'Identify limitations of Weber\'s typology',
    ],
    sections: [
      {
        heading: 'Power vs Authority vs Legitimacy',
        body: [
          "Max Weber defined power (Macht) as the probability that one actor can carry out their will despite resistance — it can rest on coercion alone (a robber has power over a victim at gunpoint). Authority (Herrschaft, often translated 'domination' or 'authority') is a special form of power: the probability that a command will be obeyed by a given group of people, because they regard it as legitimate. Legitimacy is thus the key that converts naked power into stable authority — people obey not from fear alone but because they believe the ruler/system has the right to rule.",
        ],
      },
      {
        heading: 'Traditional Authority',
        body: [
          "Rests on established, long-standing customs and traditions — obedience is owed to the person occupying a traditionally sanctioned position (a hereditary king, tribal chief, or patriarch), because 'it has always been this way'. The ruler's own power is often bound only loosely by tradition and can otherwise be personal and arbitrary within its bounds. Examples: hereditary monarchies, feudal lords, tribal/village elders. In India, examples often cited include princely-state rulers before 1947 or traditional caste/community heads.",
        ],
      },
      {
        heading: 'Charismatic Authority',
        body: [
          "Rests on the exceptional, almost supernatural or heroic qualities attributed to an individual leader by their followers — devotion to the person, not to an office or tradition. It is inherently unstable and personal: it depends on the leader continuing to demonstrate extraordinary qualities and typically cannot be inherited (creating a 'routinisation of charisma' problem after the leader dies or falls, when the movement must convert into traditional or legal-rational authority to survive — e.g., a revolutionary movement institutionalising into a party or state). Examples: religious prophets, revolutionary leaders like Gandhi or Napoleon, some modern populist leaders.",
        ],
      },
      {
        heading: 'Legal-Rational Authority',
        body: [
          'Rests on a belief in the legality of enacted rules and the right of those elevated to authority under such rules to issue commands — obedience is owed to the impersonal office/position and the rules that created it, not to the individual personally. This is the type Weber associated with the modern state and its instrument, bureaucracy: officials exercise authority within fixed jurisdictions, following written rules, hierarchically organised, appointed by merit/qualification, separating the office from the office-holder\'s private life and property. A civil servant, an elected prime minister acting within constitutional limits, or a judge applying codified law all exercise legal-rational authority.',
          "Weber saw legal-rational authority and its bureaucratic apparatus as the most efficient and calculable form of domination and the defining feature of the modern state, but he also warned of the 'iron cage' — the risk that bureaucratic rationality could become dehumanising, rule-bound, and stifling of individual freedom and meaning even while being efficient.",
        ],
      },
      {
        heading: 'Applying the Typology',
        body: [
          'These are Weber\'s "ideal types" — analytical tools, not exact descriptions of any real government, which usually mixes all three (a hereditary monarch who is also a constitutional head of a legal-rational bureaucratic state; a charismatic prime minister operating within a legal-rational constitutional system). For the optional paper, be ready to classify a given real-world example (e.g., the Mughal Emperor = traditional; Gandhi during the freedom struggle = charismatic; the Indian Prime Minister\'s office = legal-rational) and to discuss the "routinisation of charisma" as a recurring essay theme.',
        ],
      },
    ],
    keyTerms: [
      { term: 'Legitimacy', definition: "The belief among the governed that a ruler's or system's exercise of power is rightful, converting power into stable authority." },
      { term: 'Routinisation of charisma', definition: 'The process by which charismatic authority, being unstable, gets converted into traditional or legal-rational forms to outlast its original leader.' },
      { term: 'Iron cage', definition: 'Weber\'s metaphor for the way rational, rule-bound bureaucracy, while efficient, can trap and dehumanise individuals.' },
    ],
    mnemonics: ['Three types = "T-C-L": Traditional (custom), Charismatic (person), Legal-rational (rules/office).'],
    practiceQuestions: [
      {
        question: "How does Weber distinguish power from authority?",
        answer:
          'Power is simply the probability of imposing one\'s will despite resistance, which can rest purely on coercion. Authority is power that is obeyed because it is regarded as legitimate by those subject to it — legitimacy is what transforms mere power into stable authority.',
      },
      {
        question: "Explain Weber's three types of legitimate authority with one example each.",
        answer:
          'Traditional authority rests on long-established custom (a hereditary king). Charismatic authority rests on the exceptional personal qualities of a leader (a revolutionary or religious leader like Gandhi). Legal-rational authority rests on impersonal rules and offices created by law (a modern civil servant or elected official acting within constitutional powers).',
      },
      {
        question: 'What is meant by the "routinisation of charisma"?',
        answer:
          'Because charismatic authority is unstable and tied to one individual, movements built on it must, to survive the leader\'s death or decline, convert their authority structure into traditional or (more commonly in the modern era) legal-rational institutional forms.',
      },
    ],
    revisionChecklist: [
      'Can define power, authority, and legitimacy as three separate terms',
      'Can list the three types of authority with one example each',
      'Can explain "routinisation of charisma" in one line',
      'Can classify a given real-world example into one of the three types',
    ],
  },
];
