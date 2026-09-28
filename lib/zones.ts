export type ZoneId = "blue" | "green" | "yellow" | "red";

export type Zone = {
  id: ZoneId;
  name: string;
  energy: string;
  examples: string[];
  strategies: string[];
};

export const zones: Zone[] = [
  {
    id: "blue",
    name: "Blue Zone",
    energy: "Low energy or reduced alertness",
    examples: ["Tired", "Sad", "Unwell", "Bored", "Slow to get started"],
    strategies: ["Brief movement", "Water break", "Simple first step", "Positive connection", "Quiet sensory reset"],
  },
  {
    id: "green",
    name: "Green Zone",
    energy: "Steady, focused or comfortable energy",
    examples: ["Calm", "Focused", "Content", "Ready", "Connected"],
    strategies: ["Maintain the routine", "Use challenge appropriately", "Keep movement and breaks available", "Notice what is working", "Prepare for transitions"],
  },
  {
    id: "yellow",
    name: "Yellow Zone",
    energy: "Heightened energy, uncertainty or emotional intensity",
    examples: ["Worried", "Frustrated", "Excited", "Fidgety", "Overwhelmed"],
    strategies: ["Reduce verbal load", "Slow breathing", "Short movement break", "Use a visual plan", "Offer two manageable choices"],
  },
  {
    id: "red",
    name: "Red Zone",
    energy: "Very high intensity or loss of regulation",
    examples: ["Furious", "Panicked", "Out of control", "Highly distressed", "Explosive energy"],
    strategies: ["Prioritise safety", "Use very little language", "Create space", "Co-regulate calmly", "Return to problem-solving after regulation"],
  },
];

export const regulationTools = [
  { id: "box-breath", title: "Box breathing", detail: "Breathe in, hold, breathe out and pause for four steady counts each." },
  { id: "five-senses", title: "Five-senses grounding", detail: "Notice what you can see, hear, feel, smell and taste to reconnect with the present moment." },
  { id: "movement", title: "Movement reset", detail: "Use a short walk, stretch or purposeful classroom job to change energy levels." },
  { id: "first-step", title: "One clear first step", detail: "Reduce task overload by identifying only the next small action." },
  { id: "choice", title: "Two-choice reset", detail: "Offer two safe, workable options so the pupil keeps some control without losing the boundary." },
  { id: "quiet", title: "Quiet reset", detail: "Use a calm, low-stimulation space briefly, with a clear route back to learning." },
];

export const scenarios = [
  { id: 1, text: "A pupil arrives after lunch, looks tired, puts their head down and is slow to begin.", likely: "blue" as ZoneId, response: "Connect briefly, reduce the first-step demand and consider movement or water before assuming disengagement." },
  { id: 2, text: "A pupil is bouncing in their seat before a practical they have been looking forward to.", likely: "yellow" as ZoneId, response: "Excitement can sit in Yellow. Channel the energy with a clear routine and purposeful role rather than treating it as misbehaviour." },
  { id: 3, text: "A pupil is working steadily, asking for help appropriately and recovering from small mistakes.", likely: "green" as ZoneId, response: "Notice what is helping and maintain the conditions that support successful regulation." },
  { id: 4, text: "A pupil is shouting, unable to process lengthy instructions and pushing materials away.", likely: "red" as ZoneId, response: "Prioritise safety, reduce language, create space and delay problem-solving until the pupil is more regulated." },
  { id: 5, text: "A pupil keeps checking the clock, tapping their pencil and asking repeated questions before a test.", likely: "yellow" as ZoneId, response: "Treat the behaviour as possible anxiety or heightened alertness; clarify the plan and offer a brief regulation strategy." },
  { id: 6, text: "A pupil is quiet and calm during independent work but says they are worried about getting the answer wrong.", likely: "yellow" as ZoneId, response: "Visible stillness does not always mean Green. Use pupil voice and context rather than judging the zone from appearance alone." },
];

export const subjectIdeas = [
  { subject: "Science", ideas: ["Regulation check before practical work", "Use visual practical sequences", "Assign structured roles during high-energy activities"] },
  { subject: "English", ideas: ["Use emotion vocabulary through characters", "Offer short planning pauses before extended writing", "Build predictable discussion routines"] },
  { subject: "Maths", ideas: ["Normalise productive struggle", "Use first-step prompts", "Provide worked examples as temporary regulation support during overload"] },
  { subject: "PE", ideas: ["Use movement intentionally to regulate", "Prepare pupils for competition intensity", "Teach recovery routines after high-arousal activity"] },
  { subject: "Humanities", ideas: ["Use visual lesson maps", "Build discussion turn-taking routines", "Pre-warn emotionally demanding content"] },
  { subject: "Creative subjects", ideas: ["Offer sensory choices where practical", "Use clear transition warnings", "Provide structured ways to restart after frustration"] },
];
