export type ContentCategory = "Mental Clarity" | "Burnout Recovery" | "Leadership" | "Focus";
export type ContentType = "article" | "guide";

export interface ContentPiece {
  id: string;
  hourSlot: number;
  type: ContentType;
  title: string;
  excerpt: string;
  content: string;
  category: ContentCategory;
  readTime: string;
  image: string;
  author: string;
  trendingScore: number;
  premium: boolean;
}

type Seed = {
  hourSlot: number;
  title: string;
  excerpt: string;
  category: ContentCategory;
  type: ContentType;
  focus: string;
  action: string;
  insight: string;
  trendingScore: number;
};

type SeedTuple = [string, string, ContentCategory, string, string, string, number];

const author = "Clarity Sessions Research Team";
const imageFor = (hourSlot: number) => `https://images.unsplash.com/photo-${[
  "1499750310107-5fef28a66643", "1497366811353-6870744d04b2", "1517245386807-bb43f82c33c4", "1499209974431-9dddcece7f88",
  "1516321318423-f06f85e504b3", "1497366754035-f200968a6e72", "1521737711867-e3b97375f902", "1455390582262-044cdead277a",
  "1517245386807-bb43f82c33c4", "1517842645767-c639042777db", "1506126613408-eca07ce68773", "1499750310107-5fef28a66643",
  "1556761175-b413da4baf72", "1542744173-8e7e53415bb0", "1516321318423-f06f85e504b3", "1484480974693-6ca0a78fb36b",
  "1517245386807-bb43f82c33c4", "1500530855697-b586d89ba3ee", "1497366216548-37526070297c", "1499750310107-5fef28a66643",
  "1517245386807-bb43f82c33c4", "1516321318423-f06f85e504b3", "1497366754035-f200968a6e72", "1542744173-8e7e53415bb0",
][hourSlot]}?auto=format&fit=crop&w=1200&q=85`;

const buildContent = (seed: Seed) => `
${seed.focus}

The most useful way to work with this hour is to treat attention as a biological and organisational resource, not a moral test. Research on cognitive load, stress recovery, and implementation intentions consistently points to the same principle: people make better decisions when the environment reduces unnecessary friction and the next action is visible. ${seed.insight}

Start with a two-minute baseline. Write down what is occupying your mind, what matters most before the next transition, and the smallest observable action that would move it forward. This turns an abstract feeling into a workable map. Do not attempt to solve the entire day in one sitting. A clear boundary around the next block is more useful than a perfect plan for everything.

Then apply the ${seed.action} protocol. Remove one avoidable interruption, define a stopping point, and decide what “enough for now” means before you begin. This is not about squeezing more output from yourself. It is about protecting the quality of attention you bring to work, relationships, recovery, and leadership. If an action cannot be repeated on an ordinary day, it is probably too elaborate to be a dependable practice.

A practical experiment for today: set a timer for 18 minutes, complete the first visible step, and record what changed in your body, attention, and confidence. At the end, ask three questions. What became easier? What remained ambiguous? What support would make the next attempt more humane? These questions create feedback without turning reflection into self-criticism.

For leaders and builders, the wider lesson is important. Culture is shaped by repeated defaults: whether meetings have a purpose, whether recovery is respected, whether people can ask for clarity, and whether progress is measured only by visible urgency. A calm system can be ambitious. In fact, calm systems often notice risk earlier, communicate more accurately, and sustain high standards for longer.

Use this piece as a prompt, not a prescription. Your circumstances, health, and responsibilities matter. If persistent exhaustion, anxiety, low mood, or loss of functioning is affecting daily life, professional support is appropriate. The goal is not to perform wellness. The goal is to create enough clarity to choose the next honest, useful step.
`;

const articleSeeds: SeedTuple[] = [
  ["The 5AM Clarity Protocol", "A quiet morning can become a strategic advantage when it protects thinking before demand arrives.", "Mental Clarity", "the first-light reset", "name the one decision that deserves your freshest attention", "the opening hour is shaped more by defaults than motivation", 98],
  ["Attention Is the New Executive Capital", "Your calendar reveals what your mind is being asked to finance.", "Leadership", "attention behaves like scarce capital", "audit your transitions before adding another productivity tool", "strategic focus is a design problem before it is a discipline problem", 96],
  ["The Invisible Tax of Context Switching", "Every interruption leaves a residue, even when the task looks small.", "Focus", "fragmented attention compounds quietly", "group similar decisions into one protected block", "switching costs are often felt as fatigue rather than recognised as lost time", 94],
  ["A Better Definition of High Performance", "Sustainable excellence is the ability to return to what matters without self-violence.", "Burnout Recovery", "performance and recovery are a single system", "build a deliberate shutdown ritual", "output without restoration eventually borrows from judgment", 93],
  ["The Psychology of a Clean Decision", "Clarity rarely arrives before the first honest constraint is named.", "Mental Clarity", "decisions improve when ambiguity has a container", "write the decision, deadline, and reversible next step", "decisional confidence grows through structured movement", 91],
  ["Why Calm Leaders Move Faster", "Composure is not softness; it is bandwidth available for signal detection.", "Leadership", "calm improves the quality of information", "slow the reaction and accelerate the review", "teams borrow the nervous-system pace of their leaders", 95],
  ["Designing a Day That Can Survive Reality", "A plan is intelligent only when it has room for the human being executing it.", "Focus", "rigid schedules collapse under normal uncertainty", "reserve a recovery margin between demanding blocks", "adaptability is a feature, not a scheduling failure", 89],
  ["The 18-Minute Deep Work Window", "Short protected blocks can rebuild trust with a distracted mind.", "Focus", "focus returns through repeated evidence", "make one outcome visible before starting the timer", "small completions are stronger than motivational speeches", 92],
  ["Burnout Is a Systems Signal", "Exhaustion often points to a mismatch between demand, control, and recovery.", "Burnout Recovery", "burnout is not a character flaw", "map demands you can reduce, renegotiate, or share", "recovery becomes practical when the system is allowed to change", 97],
  ["The Founder’s Emotional Operating System", "Vision needs an inner architecture capable of carrying uncertainty.", "Leadership", "founders lead through both decisions and emotional weather", "separate identity from the current result", "psychological flexibility protects long-range thinking", 90],
  ["A Two-Minute Reset Before the Meeting", "The quality of a conversation often begins before anyone speaks.", "Mental Clarity", "micro-pauses improve intentional communication", "choose the outcome and the tone before joining", "preparation can be relational rather than merely informational", 88],
  ["The Difference Between Urgency and Importance", "A loud task is not automatically a meaningful task.", "Focus", "urgency is a sensation as well as a signal", "label each task by consequence, not volume", "importance becomes visible when noise is removed", 93],
  ["Recovery Is a Leadership Practice", "What leaders normalise in themselves becomes permission for everyone else.", "Burnout Recovery", "recovery is part of operational excellence", "model a visible boundary without apology", "rest changes culture when it is treated as responsible stewardship", 90],
  ["The Clarity Ledger", "A simple record of promises, decisions, and open loops can quiet a crowded mind.", "Mental Clarity", "externalising memory releases cognitive capacity", "keep one trusted list for unfinished commitments", "clarity increases when the brain no longer has to rehearse reminders", 87],
  ["Build Before You Broadcast", "The strongest ideas gain power through a private proof of usefulness.", "Leadership", "creation needs a protected incubation stage", "test the smallest meaningful version before announcing it", "quiet iteration protects both quality and courage", 86],
  ["The Meeting After the Meeting", "Unspoken uncertainty is where many teams lose their real working hours.", "Leadership", "clarity after a meeting is a measurable team asset", "write the decision, owner, and next checkpoint", "alignment is complete only when action is legible", 91],
  ["Focus Without Force", "Attention responds better to invitation, environment, and meaning than punishment.", "Focus", "force creates resistance in already-tired systems", "make the desired action easier to begin", "friction design is a humane route to consistency", 89],
  ["When Your Brain Says Everything Is Too Much", "Overwhelm becomes workable when the field of attention gets smaller.", "Burnout Recovery", "overwhelm narrows working memory", "choose one body need and one practical need", "sequencing restores agency faster than solving everything", 96],
  ["The Architecture of Trust", "Trust is built from repeated accurate signals, not impressive declarations.", "Leadership", "reliability is psychological infrastructure", "make one promise smaller and keep it completely", "predictability creates room for healthy risk", 88],
  ["The Focus Cost of Open Loops", "Unfinished conversations can occupy more attention than unfinished tasks.", "Mental Clarity", "the mind seeks closure even when no action is possible", "name the next contact or consciously release the loop", "closure can be a decision rather than an outcome", 90],
  ["A Humane Approach to Personal Ambition", "Ambition becomes durable when it is connected to values rather than worth.", "Burnout Recovery", "achievement cannot safely carry identity alone", "define success in behaviours you can repeat", "values turn ambition into direction", 92],
  ["The 3PM Decision Window", "Afternoon fatigue changes the kind of problem your brain can solve well.", "Focus", "energy-aware scheduling protects judgment", "reserve complex decisions for your strongest window", "smart timing is an underused form of intelligence", 94],
  ["The Executive Pause", "A pause between stimulus and response is where strategic leadership becomes visible.", "Leadership", "response flexibility is trainable", "take one breath before answering a charged request", "space creates options that speed cannot see", 87],
  ["Close the Day Before It Closes You", "A deliberate ending keeps tomorrow from becoming tonight’s unfinished business.", "Mental Clarity", "shutdown rituals reduce mental carryover", "record the next starting point and release the rest", "completion includes knowing when to stop", 91],
];

const guideSeeds: SeedTuple[] = [
  ["The 7-Minute Grounding Guide", "A practical reset for returning to the room, the body, and the next useful choice.", "Mental Clarity", "grounding works through sensory orientation", "name five visible details and one immediate need", "the present becomes safer when it becomes specific", 95],
  ["Burnout Recovery: First 24 Hours", "A gentle sequence for stopping the spiral and protecting basic capacity.", "Burnout Recovery", "early recovery is about stabilisation, not reinvention", "reduce one demand, hydrate, eat, and tell someone the truth", "small care is operational triage", 97],
  ["The Focus Sprint Field Guide", "A repeatable structure for doing meaningful work when attention feels expensive.", "Focus", "focus improves when scope and finish lines are visible", "define one deliverable and remove one distraction", "a small completed loop teaches the brain to trust focus", 93],
  ["Leadership Under Pressure", "A calm framework for decisions when everyone is looking to you for certainty.", "Leadership", "pressure amplifies the leader’s signals", "state what is known, unknown, and next", "honest structure is more stabilising than false confidence", 96],
  ["The Evening Nervous-System Reset", "A low-friction guide for moving from output into genuine recovery.", "Burnout Recovery", "transitions help the body stop carrying work", "change one sensory cue and close one open loop", "recovery starts before sleep", 90],
  ["Clarity for Difficult Conversations", "Prepare for honesty without turning a needed conversation into a courtroom.", "Mental Clarity", "specific observations reduce defensive fog", "use situation, impact, need, and request", "precision can be compassionate", 92],
  ["The Deep Work Desk Setup", "A physical environment that tells your attention where to land.", "Focus", "environmental cues reduce initiation cost", "place the next tool and remove visible alternatives", "focus is easier when the room collaborates", 84],
  ["A CEO’s Guide to Boundaries", "Boundaries are agreements that protect mission, people, and attention.", "Leadership", "clear limits prevent hidden resentment", "state availability, response time, and exceptions", "a boundary is a promise about how work can happen", 91],
  ["The Compassionate Productivity Audit", "Measure your system by what it makes possible, not only what it extracts.", "Burnout Recovery", "healthy productivity includes recovery and meaning", "review effort, outcome, cost, and repeatability", "a system that damages capacity is not efficient", 89],
  ["The One-Page Weekly Reset", "A concise ritual for closing loops and choosing the week’s real centre of gravity.", "Mental Clarity", "weekly reflection reduces reactive planning", "choose three priorities and one thing to stop", "focus grows through subtraction", 88],
  ["How to Restart After a Bad Day", "A practical reset that does not require pretending the day did not hurt.", "Burnout Recovery", "repair begins with accurate acknowledgement", "name what happened, what remains, and one kind next action", "a restart is a transition, not a verdict", 94],
  ["The Attention Budget Worksheet", "Give your most important work a realistic share of your finite attention.", "Focus", "planning energy is as important as planning time", "score tasks by consequence and cognitive demand", "a budget makes trade-offs explicit", 86],
  ["Build a Culture of Psychological Safety", "Small leadership behaviours create the conditions for people to tell the truth early.", "Leadership", "safety is experienced through response patterns", "thank the person who surfaces a risk and ask what they see", "truth travels where punishment is not the default", 93],
  ["The Midday Mind Check", "A short diagnostic for catching drift before it becomes an afternoon collapse.", "Mental Clarity", "awareness creates choice before depletion", "rate energy, emotion, focus, and need from one to five", "data can be kind when it guides care", 85],
  ["Focus After Interruption", "A restart protocol for returning to important work without losing the thread.", "Focus", "re-entry is a distinct cognitive task", "write the last completed step before switching", "a visible thread shortens recovery time", 90],
  ["Recovery for High-Responsibility People", "Permission to recover when other people depend on your decisions.", "Burnout Recovery", "responsibility does not cancel human limits", "delegate one decision and protect one non-negotiable pause", "capacity is part of stewardship", 92],
  ["The Founder’s Decision Brief", "A one-page format for making complex choices legible to yourself and your team.", "Leadership", "decision quality improves when assumptions are visible", "write context, options, trade-offs, and trigger points", "clarity makes disagreement productive", 89],
  ["The 10-Minute Digital Boundary", "A small screen ritual for reclaiming the edge of your attention.", "Mental Clarity", "attention is trained by what receives the first and last glance", "move one high-noise app out of reach", "small boundaries accumulate into a different mental climate", 87],
  ["Design a Better Recovery Menu", "Create choices for different kinds of tired instead of prescribing one perfect rest routine.", "Burnout Recovery", "rest needs vary by nervous-system state", "choose from sensory, social, physical, and quiet options", "specific recovery choices beat vague advice", 91],
  ["The 25-Minute Focus Lab", "An evidence-informed experiment for rebuilding sustained attention.", "Focus", "timed practice creates feedback without demanding perfection", "protect one block and log the distractions", "measurement turns frustration into learning", 88],
  ["Lead the Next Conversation", "A practical guide for moving a stuck team from interpretation to action.", "Leadership", "teams need shared facts before shared solutions", "separate observations, stories, needs, and requests", "language can lower heat without lowering standards", 94],
  ["The Clarity Walk", "Use movement and sensory attention to loosen a problem that has become mentally rigid.", "Mental Clarity", "gentle movement can support flexible thinking", "walk without input and ask one precise question", "space lets useful connections surface", 86],
  ["The Weekend Recovery Plan", "Protect restoration without turning your time off into another performance project.", "Burnout Recovery", "recovery needs intention and spaciousness", "choose one anchor, one pleasure, and one empty block", "unstructured time is not wasted capacity", 90],
  ["The Focus-Friendly Team Ritual", "A short team practice that makes priorities, constraints, and handoffs visible.", "Leadership", "shared clarity reduces duplicated effort", "end each check-in with owner, next step, and risk", "coordination is a form of care", 92],
];

const fromSeed = (seedTuple: SeedTuple, type: ContentType, hourSlot: number): ContentPiece => {
  const [title, excerpt, category, focus, action, insight, trendingScore] = seedTuple;
  const seed: Seed = { hourSlot, title, excerpt, category, type, focus, action, insight, trendingScore };
  return ({
  id: `${seed.type}-${seed.hourSlot}`,
  hourSlot: seed.hourSlot,
  type: seed.type,
  title: seed.title,
  excerpt: seed.excerpt,
  content: buildContent(seed),
  category: seed.category,
  readTime: "4 min",
  image: imageFor(seed.hourSlot),
  author,
  trendingScore: seed.trendingScore,
  premium: seed.trendingScore >= 90,
  });
};

export const contentPool: ContentPiece[] = [
  ...articleSeeds.map((seed, hourSlot) => fromSeed(seed, "article", hourSlot)),
  ...guideSeeds.map((seed, hourSlot) => fromSeed(seed, "guide", hourSlot)),
];
export const getContentForHour = (hour: number) => ({
  currentArticle: contentPool.find((piece) => piece.hourSlot === hour && piece.type === "article") ?? null,
  currentGuide: contentPool.find((piece) => piece.hourSlot === hour && piece.type === "guide") ?? null,
});
