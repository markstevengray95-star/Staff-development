import {
  categoryOrder,
  courses as sourceCourses,
  courseQualityAudit as sourceCourseQualityAudit,
  coursePresentationAudit as sourceCoursePresentationAudit,
  coursePracticeAudit as sourceCoursePracticeAudit,
  courseAssessmentAudit as sourceCourseAssessmentAudit,
  courseFollowThroughAudit as sourceCourseFollowThroughAudit,
  COURSE_TEMPLATE_STAGES,
  COURSE_TEMPLATE_VERSION,
} from "teaching-cpd/lib/catalogue";
import type {
  Course as SourceCourse,
  Module as SourceModule,
  Role,
  CourseCategory,
} from "teaching-cpd/lib/catalogue";

export { categoryOrder, COURSE_TEMPLATE_STAGES, COURSE_TEMPLATE_VERSION };
export const categories = categoryOrder;
export const courseQualityAudit = sourceCourseQualityAudit;
export const coursePresentationAudit = sourceCoursePresentationAudit;
export const coursePracticeAudit = sourceCoursePracticeAudit;
export const courseAssessmentAudit = sourceCourseAssessmentAudit;
export const courseFollowThroughAudit = sourceCourseFollowThroughAudit;
export type { Role, CourseCategory };
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
