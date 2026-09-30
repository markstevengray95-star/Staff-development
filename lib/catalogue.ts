import {
  categoryOrder,
  courses as sourceCourses,
  courseQualityAudit as sourceCourseQualityAudit,
  coursePresentationAudit as sourceCoursePresentationAudit,
  coursePracticeAudit as sourceCoursePracticeAudit,
  courseAssessmentAudit as sourceCourseAssessmentAudit,
  courseFollowThroughAudit as sourceCourseFollowThroughAudit,
  courseFacilitatorAudit as sourceCourseFacilitatorAudit,
  courseFinalQaAudit as sourceCourseFinalQaAudit,
  courseFinalQaSummary as sourceCourseFinalQaSummary,
  coursePresentationOverhaulPhase1Audit as sourcePresentationOverhaulPhase1Audit,
  courseProfessionalReadingPhase2Audit as sourceProfessionalReadingPhase2Audit,
  courseWorkshopActivityPhase3Audit as sourceWorkshopActivityPhase3Audit,
  courseProgressiveCasePhase4Audit as sourceProgressiveCasePhase4Audit,
  courseLivePresenterPhase5Audit as sourceLivePresenterPhase5Audit,
  coursePresentationEngagementPhase6Audit as sourcePresentationEngagementPhase6Audit,
  coursePresentationEngagementPhase6Summary as sourcePresentationEngagementPhase6Summary,
  courseFinalPresentationPhases7to10Audit as sourceFinalPresentationPhases7to10Audit,
  courseFinalPresentationPhases7to10Summary as sourceFinalPresentationPhases7to10Summary,
  courseMissionSimulationPhases11to12Audit as sourceMissionSimulationPhases11to12Audit,
  courseMissionSimulationPhases11to12Summary as sourceMissionSimulationPhases11to12Summary,
  auditPresentationOverhaulPhase1 as sourceAuditPresentationOverhaulPhase1,
  auditProfessionalReadingPhase2 as sourceAuditProfessionalReadingPhase2,
  auditWorkshopActivityPhase3 as sourceAuditWorkshopActivityPhase3,
  auditProgressiveCasePhase4 as sourceAuditProgressiveCasePhase4,
  auditLivePresenterPhase5 as sourceAuditLivePresenterPhase5,
  auditPresentationEngagementPhase6 as sourceAuditPresentationEngagementPhase6,
  auditFinalPresentationPhases7to10 as sourceAuditFinalPresentationPhases7to10,
  auditMissionSimulationPhases11to12 as sourceAuditMissionSimulationPhases11to12,
  getProfessionalReadingPhase2Pack as sourceGetProfessionalReadingPhase2Pack,
  isProfessionalReadingPhase2Module as sourceIsProfessionalReadingPhase2Module,
  countProfessionalReadingWords as sourceCountProfessionalReadingWords,
  PHASE2_READING_DEPTHS as sourcePhase2ReadingDepths,
  PRESENTATION_OVERHAUL_PHASE2_VERSION as sourcePresentationOverhaulPhase2Version,
  getWorkshopActivityPhase3Pack as sourceGetWorkshopActivityPhase3Pack,
  isWorkshopActivityPhase3Module as sourceIsWorkshopActivityPhase3Module,
  PHASE3_WORKSHOP_KINDS as sourcePhase3WorkshopKinds,
  PRESENTATION_OVERHAUL_PHASE3_VERSION as sourcePresentationOverhaulPhase3Version,
  getProgressiveCasePhase4ModulePack as sourceGetProgressiveCasePhase4ModulePack,
  isProgressiveCasePhase4Module as sourceIsProgressiveCasePhase4Module,
  PHASE4_CASE_STEPS as sourcePhase4CaseSteps,
  PRESENTATION_OVERHAUL_PHASE4_VERSION as sourcePresentationOverhaulPhase4Version,
  getCourseLivePresenterPhase5Moments as sourceGetCourseLivePresenterPhase5Moments,
  getLivePresenterPhase5MomentForModule as sourceGetLivePresenterPhase5MomentForModule,
  getNextLivePresenterPhase5Moment as sourceGetNextLivePresenterPhase5Moment,
  phase5LiveMomentActivityType as sourcePhase5LiveMomentActivityType,
  PHASE5_LIVE_MOMENT_KINDS as sourcePhase5LiveMomentKinds,
  PRESENTATION_OVERHAUL_PHASE5_VERSION as sourcePresentationOverhaulPhase5Version,
  PRESENTATION_OVERHAUL_PHASE6_VERSION as sourcePresentationOverhaulPhase6Version,
  getAdaptivePathwayPhase8Pack as sourceGetAdaptivePathwayPhase8Pack,
  isAdaptivePathwayPhase8Module as sourceIsAdaptivePathwayPhase8Module,
  PRESENTATION_OVERHAUL_PHASE7_VERSION as sourcePresentationOverhaulPhase7Version,
  PRESENTATION_OVERHAUL_PHASE8_VERSION as sourcePresentationOverhaulPhase8Version,
  PRESENTATION_OVERHAUL_PHASE9_VERSION as sourcePresentationOverhaulPhase9Version,
  PRESENTATION_OVERHAUL_PHASE10_VERSION as sourcePresentationOverhaulPhase10Version,
  getPhase11MissionPack as sourceGetPhase11MissionPack,
  getPhase12SimulationPack as sourceGetPhase12SimulationPack,
  getPhase12SimulationModulePack as sourceGetPhase12SimulationModulePack,
  isPhase11MissionModule as sourceIsPhase11MissionModule,
  isPhase12SimulationModule as sourceIsPhase12SimulationModule,
  PRESENTATION_OVERHAUL_PHASE11_VERSION as sourcePresentationOverhaulPhase11Version,
  PRESENTATION_OVERHAUL_PHASE12_VERSION as sourcePresentationOverhaulPhase12Version,
  PRESENTATION_LEARNING_CYCLE as sourcePresentationLearningCycle,
  PRESENTATION_OVERHAUL_PHASE1_VERSION as sourcePresentationOverhaulPhase1Version,
  auditCourseFinalQaPhase8 as sourceAuditCourseFinalQaPhase8,
  getPhase6RetrievalQuestions as sourceGetPhase6RetrievalQuestions,
  PHASE6_REVIEW_STAGES as sourcePhase6ReviewStages,
  getPhase7FacilitatorPlan as sourceGetPhase7FacilitatorPlan,
  getPhase7SlideGuide as sourceGetPhase7SlideGuide,
  PHASE7_SESSION_ROUTES as sourcePhase7SessionRoutes,
  COURSE_TEMPLATE_STAGES,
  COURSE_TEMPLATE_VERSION,
} from "teaching-cpd/lib/catalogue";
import type {
  Course as SourceCourse,
  Module as SourceModule,
  Role,
  CourseCategory,
  Phase7RouteMinutes,
  Phase7SlideGuide,
  Phase7FacilitatorPlan,
  Phase8Check,
  Phase8CourseAudit,
  Phase2ReadingDepth,
  Phase2ReadingPack,
  Phase2GlossaryItem,
  Phase2ReadingSection,
  Phase3WorkshopKind,
  Phase3WorkshopPack,
  Phase3WorkshopOption,
  Phase3BranchStage,
  Phase4ProgressiveCasePack,
  Phase4ProgressiveCaseModulePack,
  Phase4CaseStep,
  Phase4CaseNumber,
  Phase4RoleLens,
  Phase4Choice,
  Phase5LiveMoment,
  Phase5LiveMomentKind,
  Phase6EngagementAudit,
  Phase6EngagementCheck,
  Phase8PathRoute,
  Phase8AdaptivePack,
  FinalPresentationAudit,
  Phase11MissionStage,
  Phase11MissionPack,
  Phase12MeterEffects,
  Phase12SimulationChoice,
  Phase12SimulationState,
  Phase12SimulationPack,
  Phase11to12Audit,
} from "teaching-cpd/lib/catalogue";

export { categoryOrder, COURSE_TEMPLATE_STAGES, COURSE_TEMPLATE_VERSION };
export const categories = categoryOrder;
export const courseQualityAudit = sourceCourseQualityAudit;
export const coursePresentationAudit = sourceCoursePresentationAudit;
export const coursePracticeAudit = sourceCoursePracticeAudit;
export const courseAssessmentAudit = sourceCourseAssessmentAudit;
export const courseFollowThroughAudit = sourceCourseFollowThroughAudit;
export const courseFacilitatorAudit = sourceCourseFacilitatorAudit;
export const courseFinalQaAudit = sourceCourseFinalQaAudit;
export const courseFinalQaSummary = sourceCourseFinalQaSummary;
export const coursePresentationOverhaulPhase1Audit = sourcePresentationOverhaulPhase1Audit;
export const courseProfessionalReadingPhase2Audit = sourceProfessionalReadingPhase2Audit;
export const courseWorkshopActivityPhase3Audit = sourceWorkshopActivityPhase3Audit;
export const courseProgressiveCasePhase4Audit = sourceProgressiveCasePhase4Audit;
export const courseLivePresenterPhase5Audit = sourceLivePresenterPhase5Audit;
export const coursePresentationEngagementPhase6Audit = sourcePresentationEngagementPhase6Audit;
export const coursePresentationEngagementPhase6Summary = sourcePresentationEngagementPhase6Summary;
export const courseFinalPresentationPhases7to10Audit = sourceFinalPresentationPhases7to10Audit;
export const courseFinalPresentationPhases7to10Summary = sourceFinalPresentationPhases7to10Summary;
export const courseMissionSimulationPhases11to12Audit = sourceMissionSimulationPhases11to12Audit;
export const courseMissionSimulationPhases11to12Summary = sourceMissionSimulationPhases11to12Summary;
export const PRESENTATION_LEARNING_CYCLE = sourcePresentationLearningCycle;
export const PRESENTATION_OVERHAUL_PHASE1_VERSION = sourcePresentationOverhaulPhase1Version;
export const PRESENTATION_OVERHAUL_PHASE2_VERSION = sourcePresentationOverhaulPhase2Version;
export const PRESENTATION_OVERHAUL_PHASE3_VERSION = sourcePresentationOverhaulPhase3Version;
export const PRESENTATION_OVERHAUL_PHASE4_VERSION = sourcePresentationOverhaulPhase4Version;
export const PRESENTATION_OVERHAUL_PHASE5_VERSION = sourcePresentationOverhaulPhase5Version;
export const PRESENTATION_OVERHAUL_PHASE6_VERSION = sourcePresentationOverhaulPhase6Version;
export const PRESENTATION_OVERHAUL_PHASE7_VERSION = sourcePresentationOverhaulPhase7Version;
export const PRESENTATION_OVERHAUL_PHASE8_VERSION = sourcePresentationOverhaulPhase8Version;
export const PRESENTATION_OVERHAUL_PHASE9_VERSION = sourcePresentationOverhaulPhase9Version;
export const PRESENTATION_OVERHAUL_PHASE10_VERSION = sourcePresentationOverhaulPhase10Version;
export const PRESENTATION_OVERHAUL_PHASE11_VERSION = sourcePresentationOverhaulPhase11Version;
export const PRESENTATION_OVERHAUL_PHASE12_VERSION = sourcePresentationOverhaulPhase12Version;
export const PHASE2_READING_DEPTHS = sourcePhase2ReadingDepths;
export const PHASE3_WORKSHOP_KINDS = sourcePhase3WorkshopKinds;
export const PHASE4_CASE_STEPS = sourcePhase4CaseSteps;
export const PHASE5_LIVE_MOMENT_KINDS = sourcePhase5LiveMomentKinds;
export const getPhase6RetrievalQuestions = sourceGetPhase6RetrievalQuestions;
export const PHASE6_REVIEW_STAGES = sourcePhase6ReviewStages;
export const PHASE7_SESSION_ROUTES = sourcePhase7SessionRoutes;
export type { Role, CourseCategory, Phase7RouteMinutes, Phase7SlideGuide, Phase7FacilitatorPlan, Phase8Check, Phase8CourseAudit, Phase2ReadingDepth, Phase2ReadingPack, Phase2GlossaryItem, Phase2ReadingSection, Phase3WorkshopKind, Phase3WorkshopPack, Phase3WorkshopOption, Phase3BranchStage, Phase4ProgressiveCasePack, Phase4ProgressiveCaseModulePack, Phase4CaseStep, Phase4CaseNumber, Phase4RoleLens, Phase4Choice, Phase5LiveMoment, Phase5LiveMomentKind, Phase6EngagementAudit, Phase6EngagementCheck, Phase8PathRoute, Phase8AdaptivePack, FinalPresentationAudit, Phase11MissionStage, Phase11MissionPack, Phase12MeterEffects, Phase12SimulationChoice, Phase12SimulationState, Phase12SimulationPack, Phase11to12Audit };
export type Module = CourseModule;

export type CourseModule = SourceModule & {
  minutes: number;
  summary: string;
  keyPoints: string[];
  activity: string;
  reflection: string;
};

export type Course = Omit<SourceCourse, "modules"> & {
  audience: string;
  outcomes: string[];
  modules: CourseModule[];
};

function moduleSummary(module: SourceModule): string {
  switch (module.type) {
    case "content": return module.body;
    case "quiz": return module.question;
    case "scenario": return module.prompt;
    case "reflection": return module.prompt;
    case "visual": return module.caption || module.title;
    case "checklist": return module.prompt;
    case "activity": return module.prompt;
  }
}

function moduleKeyPoints(module: SourceModule): string[] {
  switch (module.type) {
    case "content": return module.keyPoints || [];
    case "quiz": return module.options;
    case "scenario": return module.options.map(option => option.label);
    case "reflection": return [];
    case "visual": return module.items.map(item => `${item.heading}: ${item.text}`);
    case "checklist": return module.items;
    case "activity": return module.instructions;
  }
}

function moduleActivity(module: SourceModule): string {
  switch (module.type) {
    case "quiz": return module.question;
    case "scenario": return module.prompt;
    case "reflection": return module.prompt;
    case "checklist": return module.prompt;
    case "activity": return module.prompt;
    case "visual": return `Use the visual to explain ${module.title.toLowerCase()}.`;
    case "content": return `Apply the key ideas from ${module.title} to your practice.`;
  }
}

function moduleReflection(module: SourceModule): string {
  return module.type === "reflection"
    ? module.prompt
    : `What will you change or test in your practice after ${module.title}?`;
}

function adaptCourse(course: SourceCourse): Course {
  const minutes = Math.max(5, Math.round(course.duration / Math.max(1, course.modules.length)));
  return {
    ...course,
    audience: course.recommendedFor.join(", ") || "All staff",
    outcomes: course.objectives,
    modules: course.modules.map(module => ({
      ...module,
      minutes,
      summary: moduleSummary(module),
      keyPoints: moduleKeyPoints(module),
      activity: moduleActivity(module),
      reflection: moduleReflection(module),
    })) as CourseModule[],
  };
}

export const courses: Course[] = sourceCourses.map(adaptCourse);

export function getPhase7FacilitatorPlan(course: Course, routeMinutes: Phase7RouteMinutes = 60) {
  return sourceGetPhase7FacilitatorPlan(course as unknown as SourceCourse, routeMinutes);
}

export function getPhase7SlideGuide(course: Course, module: CourseModule, routeMinutes: Phase7RouteMinutes = 60) {
  return sourceGetPhase7SlideGuide(course as unknown as SourceCourse, module as unknown as SourceModule, routeMinutes);
}

export function auditCourseFinalQaPhase8(course: Course) {
  return sourceAuditCourseFinalQaPhase8(course as unknown as SourceCourse);
}

export function auditPresentationOverhaulPhase1(course: Course) {
  return sourceAuditPresentationOverhaulPhase1(course as unknown as SourceCourse);
}

export function auditProfessionalReadingPhase2(course: Course) {
  return sourceAuditProfessionalReadingPhase2(course as unknown as SourceCourse);
}

export function getProfessionalReadingPhase2Pack(course: Course, moduleOrId: CourseModule | string) {
  return sourceGetProfessionalReadingPhase2Pack(course as unknown as SourceCourse, moduleOrId as unknown as SourceModule | string);
}

export function isProfessionalReadingPhase2Module(module: CourseModule | undefined) {
  return sourceIsProfessionalReadingPhase2Module(module as unknown as SourceModule | undefined);
}

export const countProfessionalReadingWords = sourceCountProfessionalReadingWords;

export function auditWorkshopActivityPhase3(course: Course) {
  return sourceAuditWorkshopActivityPhase3(course as unknown as SourceCourse);
}

export function getWorkshopActivityPhase3Pack(course: Course, module: CourseModule | undefined | null) {
  return sourceGetWorkshopActivityPhase3Pack(course as unknown as SourceCourse, module as unknown as SourceModule | undefined | null);
}

export function isWorkshopActivityPhase3Module(module: CourseModule | undefined | null) {
  return sourceIsWorkshopActivityPhase3Module(module as unknown as SourceModule | undefined | null);
}

export function auditProgressiveCasePhase4(course: Course) {
  return sourceAuditProgressiveCasePhase4(course as unknown as SourceCourse);
}

export function getProgressiveCasePhase4ModulePack(course: Course, module: CourseModule | undefined | null) {
  return sourceGetProgressiveCasePhase4ModulePack(course as unknown as SourceCourse, module as unknown as SourceModule | undefined | null);
}

export function isProgressiveCasePhase4Module(module: CourseModule | undefined | null) {
  return sourceIsProgressiveCasePhase4Module(module as unknown as SourceModule | undefined | null);
}

export function auditLivePresenterPhase5(course: Course) {
  return sourceAuditLivePresenterPhase5(course as unknown as SourceCourse);
}

export function getCourseLivePresenterPhase5Moments(course: Course) {
  return sourceGetCourseLivePresenterPhase5Moments(course as unknown as SourceCourse);
}

export function getLivePresenterPhase5MomentForModule(course: Course, module: CourseModule | undefined | null) {
  return sourceGetLivePresenterPhase5MomentForModule(course as unknown as SourceCourse, module as unknown as SourceModule | undefined | null);
}

export function getNextLivePresenterPhase5Moment(course: Course, module: CourseModule | undefined | null) {
  return sourceGetNextLivePresenterPhase5Moment(course as unknown as SourceCourse, module as unknown as SourceModule | undefined | null);
}

export const phase5LiveMomentActivityType = sourcePhase5LiveMomentActivityType;

export function auditPresentationEngagementPhase6(course: Course) {
  return sourceAuditPresentationEngagementPhase6(course as unknown as SourceCourse);
}

export function auditFinalPresentationPhases7to10(course: Course) {
  return sourceAuditFinalPresentationPhases7to10(course as unknown as SourceCourse);
}

export function getAdaptivePathwayPhase8Pack(course: Course, module: CourseModule | undefined | null) {
  return sourceGetAdaptivePathwayPhase8Pack(course as unknown as SourceCourse, module as unknown as SourceModule | undefined | null);
}

export function isAdaptivePathwayPhase8Module(module: CourseModule | undefined | null) {
  return sourceIsAdaptivePathwayPhase8Module(module as unknown as SourceModule | undefined | null);
}

export function auditMissionSimulationPhases11to12(course: Course) {
  return sourceAuditMissionSimulationPhases11to12(course as unknown as SourceCourse);
}

export function getPhase11MissionPack(course: Course) {
  return sourceGetPhase11MissionPack(course as unknown as SourceCourse);
}

export function getPhase12SimulationPack(course: Course, simulationNumber: 1 | 2) {
  return sourceGetPhase12SimulationPack(course as unknown as SourceCourse, simulationNumber);
}

export function getPhase12SimulationModulePack(course: Course, module: CourseModule | undefined | null) {
  return sourceGetPhase12SimulationModulePack(course as unknown as SourceCourse, module as unknown as SourceModule | undefined | null);
}

export function isPhase11MissionModule(module: CourseModule | undefined | null) {
  return sourceIsPhase11MissionModule(module as unknown as SourceModule | undefined | null);
}

export function isPhase12SimulationModule(module: CourseModule | undefined | null) {
  return sourceIsPhase12SimulationModule(module as unknown as SourceModule | undefined | null);
}
