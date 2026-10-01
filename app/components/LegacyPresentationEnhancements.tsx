"use client";

import { usePathname } from "next/navigation";
import CoursePresentationController from "teaching-cpd/app/components/CoursePresentationController";
import CoursePresenterPhase3Controller from "teaching-cpd/app/components/CoursePresenterPhase3Controller";
import CourseReadingPhase2Controller from "teaching-cpd/app/components/CourseReadingPhase2Controller";
import CourseInteractivityController from "teaching-cpd/app/components/CourseInteractivityController";

// The Academy renders these controls in React. Keep the legacy DOM enhancements
// for migrated tools without allowing two systems to rewrite the Academy slide.
export default function LegacyPresentationEnhancements() {
  const pathname = usePathname();
  if (pathname === "/cpd" || pathname.startsWith("/cpd/")) return null;
  return <><CoursePresentationController /><CoursePresenterPhase3Controller /><CourseReadingPhase2Controller /><CourseInteractivityController /></>;
}
