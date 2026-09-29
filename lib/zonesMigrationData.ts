export type LegacySubject = { id:string; name:string; phases:string[]; challenges:string[]; strategies:string[]; routines:string[] };

const commonBefore=["Preview the lesson structure and likely transitions.","Use a short, achievable starter to establish momentum.","Make expectations visible rather than relying only on spoken instructions."];
const commonDuring=["Chunk tasks into clear stages.","Build in a discreet way to ask for help or a short reset.","Use calm, specific language and avoid public correction where possible."];
const commonAfter=["Finish with a short reflection on what helped learning.","Use a predictable tidy/transition routine before the next lesson."];

export const legacySubjects:LegacySubject[]=[
["english","English",["Primary","KS3","GCSE","Sixth Form"],["Speaking or reading aloud","Extended writing stamina","Sensitive texts","Presentation anxiety"],["Rehearse answers with a partner before public speaking.","Use sentence starters and paragraph frames when cognitive load rises.","Break extended writing into timed micro-goals."],["Silent first-thought jot","Vocabulary preview","Two-minute writing sprint"]],
["maths","Mathematics",["Primary","KS3","GCSE","Sixth Form"],["Fear of mistakes","Multi-step problems","Time pressure","Working-memory overload"],["Use worked-example fading.","Teach a repeatable stuck routine: read, underline, identify knowns, choose a method, try one step.","Use mini-whiteboards before committing to a full solution."],["One easy-win starter","Estimate before calculating","Error-of-the-day discussion"]],
["biology","Biology",["KS3","GCSE","Sixth Form"],["Dense vocabulary","Practical uncertainty","Sensitive human biology","Unfamiliar data"],["Assign clear practical roles.","Pause practicals at fixed checkpoints.","Chunk extended responses into plan, evidence, link and conclusion."],["Practical readiness check","Diagram labelling","Predict–observe–explain"]],
["chemistry","Chemistry",["KS3","GCSE","Sixth Form"],["Lab safety anxiety","Multi-step methods","Abstract particle ideas","Calculation frustration"],["Show apparatus layout before practical work.","Use role cards.","Separate calculations into equation, substitution, units and answer."],["Equipment scan","Equation four-step routine","Observation then explanation"]],
["physics","Physics",["KS3","GCSE","Sixth Form"],["Equation anxiety","Multi-step calculations","Abstract models","Practical setup"],["Use diagram first, then symbols and algebra.","Use a consistent calculation routine.","Give checkpoints before measurements are taken."],["30-second sketch before maths","Equation card check","Predict–measure–reflect"]],
["science","General Science",["Primary","KS3"],["Busy practical environments","Rapid changes between explanation and activity","Scientific vocabulary"],["Use a visible practical sequence.","Limit instructions to the next stage only.","Build a calm equipment-return routine."],["Ready-to-learn check","Equipment roles","One-minute science sketch"]],
["geography","Geography",["KS3","GCSE","Sixth Form"],["Fieldwork uncertainty","Extended writing","Data interpretation","Complex case studies"],["Preview fieldwork routes and roles.","Use paragraph scaffolds for longer answers.","Provide calm data-analysis checkpoints."],["Map orientation starter","Case-study retrieval","Fieldwork role check"]],
["history","History",["KS3","GCSE","Sixth Form"],["Emotionally difficult topics","Source evaluation","Extended essays","Large knowledge load"],["Pre-warn sensitive material.","Separate source observation from inference.","Use essay planning frames before writing."],["Source noticing","Timeline reset","Plan-before-write"]],
["mfl","Modern Foreign Languages",["Primary","KS3","GCSE","Sixth Form"],["Speaking anxiety","Fear of mistakes","Fast listening tasks","Vocabulary overload"],["Allow private rehearsal before speaking.","Repeat listening with a clear purpose each time.","Use visual vocabulary and sentence builders."],["Partner rehearsal","Vocabulary sort","Low-stakes retrieval"]],
["computing","Computing",["KS3","GCSE","Sixth Form"],["Debugging frustration","Login or device problems","Complex multi-step tasks"],["Use a debugging checklist.","Provide a non-device fallback task for technical interruptions.","Make success checkpoints visible."],["Debug three-step routine","Predict code output","Save-point reminder"]],
["dt","Design & Technology",["KS3","GCSE"],["Tools and machinery","Project deadlines","Practical noise","Perfectionism"],["Preview safe tool use before movement.","Use visual workstation routines.","Break long projects into visible milestones."],["Tool-readiness scan","Design checkpoint","Workspace reset"]],
["art","Art & Design",["Primary","KS3","GCSE","Sixth Form"],["Perfectionism","Comparison with others","Open-ended tasks","Sensory materials"],["Frame experimentation as evidence of learning.","Offer material choices where possible.","Use time-boxed stages to prevent getting stuck."],["One-minute mark making","Process goal","Gallery reflection"]],
["music","Music",["Primary","KS3","GCSE","Sixth Form"],["Performance anxiety","Noise levels","Group coordination","Solo work"],["Offer rehearsal before performance.","Use clear noise-level expectations.","Create a quiet preparation option."],["Silent count-in","Rehearsal goal","Performance reflection"]],
["drama","Drama",["KS3","GCSE","Sixth Form"],["Public performance","Peer evaluation","High energy","Role boundaries"],["Use warm-up routines to shift energy.","Offer gradual participation routes.","Keep feedback specific and non-personal."],["Physical warm-up","Role reset","Rehearse before share"]],
["pe","Physical Education",["Primary","KS3","GCSE"],["Competition","Changing spaces","High physical arousal","Team conflict"],["Use a calm entry routine.","Separate competitive outcome from learning goal.","Build cool-down and reflection into the end."],["Readiness scale","Team role reminder","Cool-down reset"]],
["pshe","PSHE / RSE",["Primary","KS3","GCSE"],["Personal topics","Peer disclosure","Sensitive discussion","Emotional intensity"],["Set discussion boundaries before starting.","Never require personal disclosure.","Provide a private route to seek support after the lesson."],["Ground rules recap","Anonymous question box","Calm close"]],
["re","Religious Education",["KS3","GCSE","Sixth Form"],["Personal beliefs","Debate","Sensitive ethical issues","Extended evaluation"],["Use respectful discussion protocols.","Distinguish explaining a view from agreeing with it.","Use structured evaluation frames."],["Perspective sort","Silent think time","Evidence–view–evaluate"]],
["business","Business & Economics",["GCSE","Sixth Form"],["Long case studies","Data calculations","Evaluation writing","Time pressure"],["Chunk case studies into evidence sections.","Use calculation templates.","Plan evaluation before full prose."],["Case-study highlight","Calculation check","Decision ladder"]],
["food","Food & Nutrition",["KS3","GCSE"],["Kitchen safety","Time pressure","Sensory responses","Multi-step methods"],["Preview method and safety controls.","Assign workstation roles.","Use visual timers and staged clean-down."],["Safety scan","Method checkpoint","Clean-down reset"]],
["sixth","Sixth Form Study",["Sixth Form"],["Independent workload","Deadlines","Revision anxiety","Long study periods"],["Use realistic weekly planning.","Break revision into short measurable outcomes.","Build recovery and help-seeking into study plans."],["Top-three priorities","25-minute focus block","End-of-session review"]]
].map(([id,name,phases,challenges,strategies,routines])=>({id:id as string,name:name as string,phases:phases as string[],challenges:challenges as string[],strategies:strategies as string[],routines:routines as string[]}));

export const lessonFramework={before:commonBefore,during:commonDuring,after:commonAfter};

export const legacyResources=[
{title:"Student Regulation Plan",audience:"Student",desc:"A one-page personalised plan for noticing signals, naming needs and selecting strategies."},
{title:"Teacher Quick Guide",audience:"Staff",desc:"A concise classroom response guide for each zone."},
{title:"Classroom Strategy Menu",audience:"Student / Staff",desc:"A printable menu of regulation strategies grouped by need."},
{title:"Post-Lesson Reflection",audience:"Student",desc:"A short reflection on what happened, what helped and what to try next."},
{title:"Family Guide",audience:"Families",desc:"A plain-language explanation of the school approach and shared language."},
{title:"Department Checklist",audience:"Staff",desc:"A subject-team checklist for routines, environment, language and inclusion."},
{title:"20-Minute CPD Outline",audience:"Staff",desc:"A staff-meeting structure for consistent implementation."},
{title:"Classroom Poster",audience:"Student / Staff",desc:"A reminder that all zones are valid and strategies should match need to situation."}
];

export const implementationAudit=[
"Staff use consistent, non-judgemental language about all four zones.","Students can access regulation strategies without public embarrassment.","Subject departments have adapted routines to their own learning environments.","Practical subjects include regulation in safety and transition routines.","SEND and EAL needs are considered in implementation.","Staff understand that regulation is not the same as compliance.","Students have opportunities to reflect on which strategies actually help.","Families receive a clear explanation of the shared language.","The school reviews implementation using student and staff feedback.","Escalation and safeguarding procedures remain separate from everyday regulation support."
];

export const tutorActivities=[
{name:"Arrival reset",minutes:3,steps:["Private zone/energy check-in","Choose one intention for the morning","Identify one strategy available if needed"]},
{name:"Plan the day",minutes:5,steps:["Scan today’s timetable","Mark one likely pressure point","Choose a preparation strategy","Identify who to ask for help"]},
{name:"Friday reflection",minutes:5,steps:["What helped learning this week?","Which strategy was most useful?","What will I repeat next week?"]},
{name:"Transition rehearsal",minutes:4,steps:["Name the next transition","Predict what could make it difficult","Choose one practical support","Rehearse the first step"]}
];

export const transitions={
"Lesson change":["Show the next destination and equipment needed","Use a consistent pack-away cue","Allow a brief movement/reset route","Start the next lesson with a predictable entry task"],
"Lunch / break":["Preview where to go and how to re-enter learning","Offer quieter alternatives where available","Use a clear return-time cue","Plan sensory recovery after a busy space"],
"Assembly":["Preview seating and duration","Clarify expectations before entering","Offer a discreet support route","Use a calm exit and re-entry plan"],
"PE / changing":["Make changing expectations predictable","Allow extra transition time where agreed","Use clear equipment roles","Plan the move back to classroom learning"],
"Assessment / exam":["Clarify timing and first-step routine","Use a brief grounding sequence","Keep reasonable adjustments visible","Plan a calm post-assessment transition"],
"Trip / off-site":["Use a visual itinerary","Identify meeting points and trusted adults","Preview unfamiliar transitions","Plan food, sensory and travel needs"],
"School phase change":["Use repeated orientation visits","Build a visual map/routine guide","Share agreed regulation strategies with receiving staff","Review the plan after the first weeks"]
};

export const observationItems=["Lesson structure and transitions are visible or clearly explained.","Staff language is descriptive and non-judgemental.","Students have a discreet route to ask for help or a reset.","Regulation support preserves access to the learning goal where possible.","Practical/group tasks use clear roles and checkpoints.","Reasonable sensory or communication supports are respected.","The close of the lesson supports a calm transition onward.","No zone is treated as a reward, sanction or behaviour label."];

export const environmentCriteria=["Noise load is understood and manageable","Visual clutter and competing displays are controlled","Entry, movement and exit routines are predictable","Students can ask for help discreetly","Movement/reset options are available where appropriate","Sensory needs can be supported without unnecessary attention","Seating/layout offers appropriate choice and clear sightlines","Key routines and expectations are easy to find"];

export const impactMetrics=["Leadership & strategy","Staff development","Curriculum implementation","Pupil / staff / parent voice","Targeted interventions","Parent & carer engagement"];

export const rolloutMilestones=["Nominate implementation lead","Establish baseline","Launch core staff CPD","Department implementation","Targeted intervention review","Family communication","Impact review","SLT / governor report"];

export const studioTools=[
{key:"activity",title:"Activity Lab",desc:"Facilitated staff activities, application tasks and scenario work."},
{key:"facilitator",title:"Facilitator Console",desc:"Session sequencing, timers, prompts and delivery controls."},
{key:"graph",title:"Graph & Evidence Lab",desc:"Compare baseline and review evidence for implementation discussions."},
{key:"hotspot",title:"Classroom Hotspot",desc:"Inspect classroom features and identify regulation-supportive adaptations."},
{key:"deepdive",title:"Session Deep Dive",desc:"Structured case analysis linking signals, context, language and support."},
{key:"inclusion",title:"Inclusion Session",desc:"Explore SEND, EAL, communication and sensory access without lowering expectations."},
{key:"textbook",title:"Zones CPD Textbook",desc:"Reference material for regulation language, co-regulation and implementation."},
{key:"live",title:"Live Audience",desc:"Presenter prompts, session codes and participant-ready activities."},
{key:"collab",title:"Team Collaboration",desc:"Assign roles and work through cases cooperatively."},
{key:"presenter",title:"Presenter Widgets",desc:"Timers, pulse checks, random prompts and facilitation widgets."},
{key:"impact",title:"School Impact",desc:"Connect training to implementation evidence and next actions."}
];
