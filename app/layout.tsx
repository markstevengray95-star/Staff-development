import type { Metadata } from "next";
import CoursePresentationController from "teaching-cpd/app/components/CoursePresentationController";
import CoursePresenterPhase3Controller from "teaching-cpd/app/components/CoursePresenterPhase3Controller";
import CoursePracticePhase4Controller from "teaching-cpd/app/components/CoursePracticePhase4Controller";
import CourseAssessmentPhase5Controller from "teaching-cpd/app/components/CourseAssessmentPhase5Controller";
import CourseFollowThroughPhase6Controller from "teaching-cpd/app/components/CourseFollowThroughPhase6Controller";
import CourseInteractivityController from "teaching-cpd/app/components/CourseInteractivityController";
import AccessGate from "./components/AccessGate";
import CpdNavigationBridge from "./components/CpdNavigationBridge";
import ZonesQuickAccess from "./components/ZonesQuickAccess";
import ZonesSidebarBridge from "./components/ZonesSidebarBridge";
import CourseAssessmentPhase5Sync from "./components/CourseAssessmentPhase5Sync";
import "./globals.css";
import "./zones-experience.css";
import "teaching-cpd/app/course-presentation-player.css";
import "teaching-cpd/app/course-slide-formatting.css";
import "teaching-cpd/app/phase3-presentation.css";
import "teaching-cpd/app/course-practice-phase4.css";
import "teaching-cpd/app/phase5-assessment.css";
import "teaching-cpd/app/course-followthrough-phase6.css";
import "teaching-cpd/app/impact.css";

export const metadata: Metadata = {
  title: "Staff Development | Whole-School Learning & Regulation",
  description: "A unified school platform for staff CPD, regulation, interventions, student support and implementation tracking.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CoursePresentationController />
        <CoursePresenterPhase3Controller />
        <CoursePracticePhase4Controller />
        <CourseAssessmentPhase5Controller />
        <CourseAssessmentPhase5Sync />
        <CourseFollowThroughPhase6Controller />
        <CourseInteractivityController />
        <CpdNavigationBridge />
        <ZonesQuickAccess />
        <ZonesSidebarBridge />
        <AccessGate>{children}</AccessGate>
      </body>
    </html>
  );
}
