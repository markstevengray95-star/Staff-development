import type { Metadata } from "next";
import CoursePresentationController from "teaching-cpd/app/components/CoursePresentationController";
import CoursePresenterPhase3Controller from "teaching-cpd/app/components/CoursePresenterPhase3Controller";
import CoursePracticePhase4Controller from "teaching-cpd/app/components/CoursePracticePhase4Controller";
import CourseAssessmentPhase5Controller from "teaching-cpd/app/components/CourseAssessmentPhase5Controller";
import CourseFollowThroughPhase6Controller from "teaching-cpd/app/components/CourseFollowThroughPhase6Controller";
import CourseFacilitatorPhase7Controller from "teaching-cpd/app/components/CourseFacilitatorPhase7Controller";
import CourseReadingPhase2Controller from "teaching-cpd/app/components/CourseReadingPhase2Controller";
import CourseWorkshopPhase3Controller from "teaching-cpd/app/components/CourseWorkshopPhase3Controller";
import CourseProgressiveCasePhase4Controller from "teaching-cpd/app/components/CourseProgressiveCasePhase4Controller";
import CourseLivePresenterPhase5Controller from "teaching-cpd/app/components/CourseLivePresenterPhase5Controller";
import CourseAdaptivePathPhase8Controller from "teaching-cpd/app/components/CourseAdaptivePathPhase8Controller";
import CourseInteractivityController from "teaching-cpd/app/components/CourseInteractivityController";
import AccessGate from "./components/AccessGate";
import CpdNavigationBridge from "./components/CpdNavigationBridge";
import ZonesQuickAccess from "./components/ZonesQuickAccess";
import ZonesSidebarBridge from "./components/ZonesSidebarBridge";
import CourseAssessmentPhase5Sync from "./components/CourseAssessmentPhase5Sync";
import DevelopmentFeatureNav from "./components/DevelopmentFeatureNav";
import HomeNavigationSimplifier from "./components/HomeNavigationSimplifier";
import "./globals.css";
import "./zones-experience.css";
import "./development-feature-nav.css";
import "./home-navigation-simplifier.css";
import "./school-workflows.css";
import "teaching-cpd/app/course-presentation-player.css";
import "teaching-cpd/app/course-slide-formatting.css";
import "teaching-cpd/app/phase3-presentation.css";
import "teaching-cpd/app/course-practice-phase4.css";
import "teaching-cpd/app/phase5-assessment.css";
import "teaching-cpd/app/course-followthrough-phase6.css";
import "teaching-cpd/app/phase7-facilitator.css";
import "teaching-cpd/app/course-reading-phase2.css";
import "teaching-cpd/app/course-workshop-phase3.css";
import "teaching-cpd/app/course-progressive-case-phase4.css";
import "teaching-cpd/app/course-live-presenter-phase5.css";
import "teaching-cpd/app/course-finish-phase7-10.css";
import "teaching-cpd/app/five-feature-suite.css";
import "teaching-cpd/app/ai-platform.css";
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
        <CourseFacilitatorPhase7Controller />
        <CourseReadingPhase2Controller />
        <CourseWorkshopPhase3Controller />
        <CourseProgressiveCasePhase4Controller />
        <CourseLivePresenterPhase5Controller />
        <CourseAdaptivePathPhase8Controller />
        <CourseInteractivityController />
        <CpdNavigationBridge />
        <DevelopmentFeatureNav />
        <HomeNavigationSimplifier />
        <ZonesQuickAccess />
        <ZonesSidebarBridge />
        <AccessGate>{children}</AccessGate>
      </body>
    </html>
  );
}