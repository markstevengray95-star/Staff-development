export type CourseModule = {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  keyPoints: string[];
  activity: string;
  reflection: string;
};

export type Course = {
  id: string;
  title: string;
  category: string;
  audience: string;
  duration: number;
  summary: string;
  outcomes: string[];
  modules: CourseModule[];
};

const module = (id: string, title: string, summary: string, keyPoints: string[], activity: string, reflection: string, minutes = 12): CourseModule => ({
  id, title, summary, keyPoints, activity, reflection, minutes,
});

export const courses: Course[] = [
  {
    id: "zones-foundations",
    title: "Zones of Regulation: Whole-School Foundations",
    category: "Regulation & Wellbeing",
    audience: "All staff",
    duration: 60,
    summary: "Build a shared, non-judgemental language for emotions, energy and regulation across the school day.",
    outcomes: ["Use the four-zone language consistently", "Separate feelings from behaviour", "Coach pupils towards useful regulation strategies", "Plan inclusive classroom routines"],
    modules: [
      module("z1", "A shared regulation language", "Understand what each zone communicates and why no zone is inherently good or bad.", ["Blue: low energy states", "Green: ready and regulated states", "Yellow: heightened energy or uncertainty", "Red: very high intensity states", "A pupil can be in any zone and still need dignity and support"], "Sort six classroom situations by likely energy state, then identify what additional information you would need before responding.", "Where could your own language unintentionally frame a zone as naughty or wrong?"),
      module("z2", "Co-regulation before self-regulation", "Explore how adult tone, pacing, predictability and relationships shape a pupil's ability to regulate.", ["Regulation is relational", "Reduce language during overload", "Offer bounded choices", "Model calm recovery after mistakes", "Repair matters more than perfection"], "Rewrite three common correction phrases so they preserve boundaries while reducing escalation.", "Which adult behaviour has the biggest impact on regulation in your classroom?"),
      module("z3", "Strategy matching", "Move beyond generic calming techniques by matching strategies to the pupil, context and goal.", ["A strategy must fit the state", "Movement can regulate as effectively as stillness", "Sensory needs vary", "Choice increases ownership", "Review whether the strategy actually worked"], "Create a three-option regulation menu for one lesson you teach.", "What evidence would tell you a strategy is helping rather than simply stopping visible behaviour?"),
      module("z4", "Whole-school implementation", "Build consistency without forcing every classroom to look identical.", ["Agree common language", "Teach routines explicitly", "Use visual prompts", "Track patterns, not labels", "Review implementation with pupils and staff"], "Draft one whole-school expectation and one flexible classroom adaptation.", "What needs to be consistent across your school, and what should remain teacher-specific?"),
    ],
  },
  {
    id: "rosenshine",
    title: "Rosenshine's Principles in Everyday Teaching",
    category: "Teaching & Learning",
    audience: "Teachers and teaching assistants",
    duration: 75,
    summary: "Turn Rosenshine's principles into practical lesson routines without making teaching mechanical.",
    outcomes: ["Plan retrieval and review", "Model new learning in small steps", "Use questioning to check understanding", "Move from guided to independent practice"],
    modules: [
      module("r1", "Review and retrieval", "Use short, purposeful review to reactivate prior knowledge before new learning.", ["Review relevant knowledge, not random facts", "Keep retrieval low stakes", "Mix recall with explanation", "Respond to patterns of error"], "Design a five-minute retrieval starter that directly prepares pupils for your next lesson.", "How will the answers change what you do next?"),
      module("r2", "Small steps and modelling", "Reduce avoidable cognitive load through worked examples, narration and carefully sequenced practice.", ["Break complex processes into meaningful chunks", "Model expert thinking", "Fade support gradually", "Use examples and non-examples"], "Choose a difficult task and write the first three modelling steps you would demonstrate.", "Which step do pupils most often skip or misunderstand?"),
      module("r3", "Checking for understanding", "Replace 'does everyone understand?' with evidence-rich questioning.", ["Sample the whole room", "Ask pupils to explain why", "Use hinge questions", "Act on misconceptions immediately"], "Create one hinge question with distractors linked to likely misconceptions.", "What would each wrong answer tell you?"),
      module("r4", "Guided to independent practice", "Build enough successful practice before removing scaffolds.", ["High success rates matter", "Feedback should be timely", "Scaffolds should fade", "Independent practice needs monitoring"], "Map one task across I do, We do, You do, including where support will be removed.", "What evidence will show pupils are genuinely ready for independence?"),
    ],
  },
  {
    id: "adaptive-teaching",
    title: "Adaptive Teaching Without Lowering Expectations",
    category: "Inclusion & SEND",
    audience: "All classroom staff",
    duration: 65,
    summary: "Adapt access, explanation, scaffolding and practice while protecting ambitious curriculum goals.",
    outcomes: ["Distinguish adaptation from simplification", "Use flexible scaffolds", "Plan responsive checks", "Support SEND and EAL learners within ambitious lessons"],
    modules: [
      module("a1", "Keep the goal ambitious", "Start from the same important learning goal and adjust the route, support or representation.", ["Adapt access before reducing challenge", "Identify the core learning", "Remove irrelevant barriers", "Use temporary scaffolds"], "Take one upcoming task and identify the core learning versus avoidable barriers.", "Which support can you remove once pupils are secure?"),
      module("a2", "Responsive explanation", "Use examples, visuals, vocabulary support and re-teaching based on evidence from pupils.", ["Pre-teach key vocabulary", "Use dual coding carefully", "Give worked examples", "Check before moving on"], "Redesign one explanation using a visual, one example and one check for understanding.", "Which pupils are most likely to benefit and why?"),
      module("a3", "Scaffolds that fade", "Use prompts, sentence stems, checklists and models as bridges to independence.", ["Match scaffold to barrier", "Avoid permanent dependence", "Fade deliberately", "Teach pupils how to use supports"], "Create a scaffold with a clear plan for how it will be reduced over three lessons.", "How will you know when the scaffold is no longer needed?"),
    ],
  },
  {
    id: "behaviour-relationships",
    title: "Behaviour, Relationships and De-escalation",
    category: "Behaviour & Culture",
    audience: "All staff",
    duration: 70,
    summary: "Combine clear boundaries with calm, relational responses that reduce escalation and improve follow-through.",
    outcomes: ["Use predictable routines", "Correct behaviour without public escalation", "Apply de-escalation language", "Use repair and follow-up effectively"],
    modules: [
      module("b1", "Predictability and routines", "Reduce behaviour problems by teaching routines as explicitly as curriculum content.", ["Name the routine", "Model it", "Practise it", "Correct calmly", "Re-teach after breaks or change"], "Choose one weak routine and plan how you will teach it tomorrow.", "Which part of the routine is currently assumed rather than taught?"),
      module("b2", "Low-key correction", "Use brief, private and proportionate responses wherever possible.", ["Correct the behaviour, not the child", "Keep language short", "Avoid public argument", "Give take-up time", "Follow through consistently"], "Rewrite a high-conflict correction into a calm 10-second script.", "What makes it easier for a pupil to comply without losing face?"),
      module("b3", "De-escalation", "Recognise rising arousal and reduce demands on processing while maintaining safety and boundaries.", ["Lower verbal load", "Slow pace", "Offer two safe options", "Create space where appropriate", "Return to the issue later"], "For a common escalation point, write a two-option response and a later follow-up question.", "What adult behaviours could accidentally intensify the moment?"),
      module("b4", "Repair and reset", "Use restorative follow-up to rebuild relationships and improve future choices.", ["Discuss when calm", "Be specific about impact", "Hear the pupil's perspective", "Agree a next-step behaviour", "Re-enter positively"], "Create a four-question repair conversation for your setting.", "How will the pupil know the incident is genuinely over?"),
    ],
  },
  {
    id: "maslow-needs",
    title: "Maslow, Needs and Readiness to Learn",
    category: "Regulation & Wellbeing",
    audience: "All staff",
    duration: 45,
    summary: "Use needs-based thinking as a reflective lens while avoiding simplistic 'hierarchy before learning' assumptions.",
    outcomes: ["Explain Maslow's model and limitations", "Identify barriers to readiness", "Use practical classroom supports", "Avoid deterministic assumptions"],
    modules: [
      module("m1", "The model and its limits", "Understand the familiar hierarchy while recognising that human needs do not operate in a fixed staircase.", ["Physiological needs", "Safety", "Belonging", "Esteem", "Growth and fulfilment", "Needs can overlap rather than occur in strict order"], "Take a pupil scenario and identify two plausible needs without assuming either is the sole cause.", "Where might the hierarchy be useful, and where might it oversimplify?"),
      module("m2", "Readiness to learn", "Notice practical barriers such as uncertainty, belonging, sensory load and fear of failure.", ["Predictability supports safety", "Belonging supports participation", "Success builds confidence", "Regulation can be supported inside learning"], "Audit one lesson for moments that may create avoidable uncertainty or threat.", "What small change could improve readiness without lowering expectations?"),
      module("m3", "Needs-aware teaching", "Use routines, relationships and accessible challenge rather than trying to diagnose hidden causes.", ["Stay curious", "Use observable evidence", "Offer proportionate support", "Escalate concerns through school systems"], "Write one needs-aware response to disengagement that keeps the pupil connected to learning.", "How will you avoid turning a framework into a label?"),
    ],
  },
  {
    id: "retrieval-practice",
    title: "Retrieval Practice and Long-Term Memory",
    category: "Teaching & Learning",
    audience: "Teachers",
    duration: 50,
    summary: "Design retrieval that strengthens useful knowledge and informs teaching rather than becoming a disconnected quiz routine.",
    outcomes: ["Choose high-value knowledge", "Space and interleave retrieval", "Use feedback effectively", "Interpret errors diagnostically"],
    modules: [
      module("rp1", "What retrieval is for", "Retrieval strengthens access to knowledge when pupils actively recall rather than simply re-read.", ["Recall should be effortful but achievable", "Feedback prevents error becoming entrenched", "Spacing matters", "Retrieval should support future learning"], "Select eight items from one topic that pupils will need again later.", "Which knowledge is important enough to retrieve repeatedly?"),
      module("rp2", "Better retrieval design", "Use varied formats and cumulative review instead of relying on one quiz style.", ["Mix recall, explanation and application", "Use cumulative questions", "Vary surface features", "Keep stakes low"], "Create a six-question retrieval set with three different response types.", "Which question provides the richest diagnostic information?"),
      module("rp3", "Responding to the evidence", "Decide whether errors need re-teaching, more practice or simply a reminder.", ["Look for class-wide patterns", "Separate slips from misconceptions", "Re-teach before moving on when necessary", "Track recurring gaps"], "Create a simple rule for what you will do if 20%, 50% or 80% of pupils miss a question.", "How will retrieval change teaching rather than just measure it?"),
    ],
  },
  {
    id: "feedback",
    title: "Feedback That Moves Learning Forward",
    category: "Teaching & Learning",
    audience: "Teachers and teaching assistants",
    duration: 55,
    summary: "Focus feedback on the next useful action and build time for pupils to respond to it.",
    outcomes: ["Prioritise high-impact feedback", "Reduce marking workload", "Use whole-class feedback", "Plan pupil response"],
    modules: [
      module("f1", "What feedback needs to do", "Effective feedback helps pupils close a specific gap between current and desired performance.", ["Anchor feedback to the learning goal", "Be selective", "Give a usable next step", "Build response time"], "Take a piece of work and write one feedback comment that leads to an immediate pupil action.", "Would the pupil know exactly what to do next?"),
      module("f2", "Whole-class feedback", "Use patterns across the class to address misconceptions efficiently.", ["Group common strengths and errors", "Re-teach shared gaps", "Use exemplars", "Avoid copying the same comment repeatedly"], "Design a one-page whole-class feedback routine for a recent assessment.", "Which errors need whole-class teaching and which need individual support?"),
      module("f3", "Making pupils use feedback", "Feedback has limited value if pupils do not act on it.", ["Schedule improvement time", "Model how to improve", "Ask pupils to explain changes", "Re-check the improved work"], "Add a ten-minute response sequence to your next marked task.", "How will you verify that the feedback changed understanding, not just presentation?"),
    ],
  },
  {
    id: "metacognition",
    title: "Metacognition and Independent Learners",
    category: "Teaching & Learning",
    audience: "Teachers",
    duration: 55,
    summary: "Teach pupils how to plan, monitor and evaluate their approach to demanding learning tasks.",
    outcomes: ["Model strategic thinking", "Use planning prompts", "Teach monitoring strategies", "Build useful reflection"],
    modules: [
      module("mc1", "Make expert thinking visible", "Model not only what to do but how an expert chooses a strategy and checks progress.", ["Narrate decisions", "Model uncertainty", "Show how to recover from errors", "Compare alternative strategies"], "Write a think-aloud script for the first minute of a difficult task.", "Which expert decisions are usually invisible to pupils?"),
      module("mc2", "Plan, monitor, evaluate", "Give pupils concrete prompts for each stage of independent work.", ["Plan: what is the goal?", "Monitor: is this working?", "Evaluate: what should change next time?"], "Create one prompt card pupils can use during independent work.", "Which prompt could become a habit rather than a permanent scaffold?"),
      module("mc3", "Reflection with purpose", "Move beyond generic 'what went well' questions towards reflection linked to strategy choice.", ["Focus on process", "Compare strategy and outcome", "Name transferable learning", "Set one next experiment"], "Replace three generic reflection questions with strategy-focused alternatives.", "How will reflection influence the next task?"),
    ],
  },
  {
    id: "send-classroom",
    title: "SEND: Practical Inclusive Classroom Strategies",
    category: "Inclusion & SEND",
    audience: "All classroom staff",
    duration: 70,
    summary: "Improve access through routines, communication, chunking, visuals and responsive scaffolding.",
    outcomes: ["Reduce unnecessary processing load", "Use accessible instructions", "Plan sensory-aware routines", "Review support through evidence"],
    modules: [
      module("s1", "Accessible instructions", "Make directions easier to process without reducing intellectual challenge.", ["Gain attention before speaking", "Use short sequenced instructions", "Display key steps", "Check understanding through action"], "Rewrite a long classroom instruction into three visible steps.", "How will pupils show that they understood the instruction?"),
      module("s2", "Chunking and visual structure", "Use visible sequence and task boundaries to support working memory and independence.", ["Show start and finish", "Chunk long tasks", "Use models", "Signal transitions"], "Turn one 30-minute task into three clear chunks with checkpoints.", "Where might pupils become lost or overloaded?"),
      module("s3", "Sensory and regulation-aware teaching", "Consider environmental factors such as noise, movement, lighting and transitions.", ["Notice patterns", "Offer reasonable options", "Prepare pupils for change", "Keep support discreet"], "Audit one room or lesson for a sensory barrier you can alter.", "How could you improve access without isolating the pupil?"),
      module("s4", "Reviewing what works", "Use observation and pupil voice to test whether support improves participation and learning.", ["Set a specific aim", "Collect simple evidence", "Review after a defined period", "Keep, adapt or stop the strategy"], "Choose one support and define what improvement would look like over two weeks.", "What evidence will prevent support becoming permanent by default?"),
    ],
  },
  {
    id: "eal",
    title: "EAL: Language-Rich Teaching Across the Curriculum",
    category: "Inclusion & SEND",
    audience: "All classroom staff",
    duration: 60,
    summary: "Support multilingual learners through explicit vocabulary, structured talk, models and meaningful participation.",
    outcomes: ["Plan subject vocabulary", "Use structured talk", "Provide language models", "Avoid reducing conceptual challenge"],
    modules: [
      module("e1", "Language and cognition", "Pupils may understand concepts beyond what they can yet express in English.", ["Separate language proficiency from thinking", "Preserve conceptual challenge", "Use visuals and examples", "Allow rehearsal before public response"], "Take one high-level question and add support that helps language without giving away the thinking.", "How might language mask what a pupil actually understands?"),
      module("e2", "Vocabulary instruction", "Teach the words pupils need to participate in subject thinking.", ["Select high-value words", "Teach meaning in context", "Show morphology and word families", "Revisit across lessons"], "Choose five words for an upcoming unit and identify how each will be revisited.", "Which word is most likely to block understanding if left implicit?"),
      module("e3", "Structured talk and writing", "Give pupils sentence patterns, rehearsal time and models that support increasingly independent expression.", ["Model academic language", "Use paired rehearsal", "Provide temporary sentence frames", "Fade support"], "Create two sentence stems for explanation and one for evaluation in your subject.", "How will you move pupils from the stem towards independent language?"),
    ],
  },
  {
    id: "safeguarding-awareness",
    title: "Safeguarding Awareness and Professional Curiosity",
    category: "Safeguarding",
    audience: "All staff",
    duration: 45,
    summary: "Reinforce professional curiosity, accurate recording and the importance of following your school's safeguarding procedures.",
    outcomes: ["Recognise why small concerns matter", "Record observable information accurately", "Know when to escalate", "Maintain appropriate professional boundaries"],
    modules: [
      module("sg1", "Notice and record", "Safeguarding records should distinguish what was seen or heard from interpretation.", ["Record promptly", "Use the pupil's own words where relevant", "Separate fact from inference", "Include date, context and action taken"], "Rewrite a vague concern note into an objective record using only observable information.", "Which phrases in your original wording were interpretations rather than facts?"),
      module("sg2", "Professional curiosity", "Patterns can matter even when individual incidents appear minor.", ["Notice changes", "Avoid explaining away concerns", "Share through school systems", "Do not investigate beyond your role"], "For a fictional pattern of small changes, identify what you would record and who you would inform according to school policy.", "What could make adults dismiss a concern too quickly?"),
      module("sg3", "Boundaries and escalation", "Follow your school's current safeguarding policy and designated safeguarding procedures.", ["Know the DSL route", "Do not promise secrecy", "Escalate urgent concerns immediately", "Use approved systems"], "Locate the current school safeguarding procedure and identify the exact reporting route staff should use.", "What would a new member of staff still need explained?"),
    ],
  },
  {
    id: "instructional-coaching",
    title: "Instructional Coaching for Schools",
    category: "Leadership & Coaching",
    audience: "Middle leaders, mentors and coaches",
    duration: 70,
    summary: "Use focused observation, small action steps, modelling and deliberate practice to improve classroom habits.",
    outcomes: ["Identify high-leverage action steps", "Give precise feedback", "Use modelling and rehearsal", "Track implementation without creating surveillance"],
    modules: [
      module("ic1", "Choose the smallest useful step", "Coaching works best when the next action is specific enough to practise immediately.", ["Start from pupil learning", "Choose one high-leverage behaviour", "Make the action observable", "Avoid overloaded targets"], "Turn a broad target such as 'improve questioning' into one observable action step.", "Can the teacher practise this action in under five minutes?"),
      module("ic2", "Model and rehearse", "Show what the action looks and sounds like, then practise before the next lesson.", ["Use concrete models", "Rehearse realistic moments", "Give short feedback", "Repeat until fluent"], "Write a 90-second rehearsal for one coaching action step.", "What would make the rehearsal feel safe and useful rather than performative?"),
      module("ic3", "Evidence and follow-up", "Review whether the change improved pupil learning and whether the action has become reliable.", ["Collect narrow evidence", "Celebrate implementation", "Refine the step", "Move on when secure"], "Define two indicators that would show the action step is improving learning.", "How will you keep coaching developmental rather than judgemental?"),
    ],
  },
];

export const categories = Array.from(new Set(courses.map((course) => course.category)));
