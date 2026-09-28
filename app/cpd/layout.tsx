import type { ReactNode } from "react";
import DevelopmentDock from "teaching-cpd/app/components/DevelopmentDock";
import AppShellEnhancements from "teaching-cpd/app/components/AppShellEnhancements";
import CoursePresentationController from "teaching-cpd/app/components/CoursePresentationController";
import CourseDeepLinkController from "teaching-cpd/app/components/CourseDeepLinkController";
import CourseInteractivityController from "teaching-cpd/app/components/CourseInteractivityController";
import CpdZonesShortcuts from "../components/CpdZonesShortcuts";
import "teaching-cpd/app/globals.css";
import "teaching-cpd/app/mobile.css";
import "teaching-cpd/app/phase2.css";
import "teaching-cpd/app/phase2-live.css";
import "teaching-cpd/app/phase4.css";
import "teaching-cpd/app/phase56.css";
import "teaching-cpd/app/phase789.css";
import "teaching-cpd/app/stage1012.css";
import "teaching-cpd/app/phase1314.css";
import "teaching-cpd/app/course-enhancements.css";
import "teaching-cpd/app/course-visuals-plus.css";
import "teaching-cpd/app/course-interactive-visuals.css";
import "teaching-cpd/app/course-motion-plus.css";
import "teaching-cpd/app/course-lab.css";
import "teaching-cpd/app/course-engagement.css";
import "teaching-cpd/app/course-navigation.css";
import "teaching-cpd/app/course-module-navigation.css";
import "teaching-cpd/app/course-fun-engagement.css";
import "teaching-cpd/app/course-presentation-player.css";
import "teaching-cpd/app/development-dock.css";
import "teaching-cpd/app/course-studio.css";
import "teaching-cpd/app/course-packs.css";
import "teaching-cpd/app/course-reading.css";
import "teaching-cpd/app/school-access.css";
import "teaching-cpd/app/school-hub.css";
import "teaching-cpd/app/platform.css";
import "teaching-cpd/app/owner-portal.css";
import "teaching-cpd/app/staff-sync.css";
import "teaching-cpd/app/staff-access.css";
import "teaching-cpd/app/admin-login.css";
import "teaching-cpd/app/safeguarding.css";
import "teaching-cpd/app/safeguarding-documents.css";
import "teaching-cpd/app/digital-certificates.css";
import "teaching-cpd/app/certificate-verification.css";
import "teaching-cpd/app/reminders.css";
import "teaching-cpd/app/help.css";
import "teaching-cpd/app/launch-readiness.css";
import "teaching-cpd/app/recommendations.css";
import "teaching-cpd/app/micro-cpd.css";
import "teaching-cpd/app/impact.css";
import "teaching-cpd/app/department-cpd.css";
import "teaching-cpd/app/course-slide-formatting.css";
import "./zones-cpd-theme.css";
import "./zones-cpd-deck.css";

export default function CpdLayout({ children }: { children: ReactNode }) {
  return <>
    <AppShellEnhancements />
    <CoursePresentationController />
    <CourseDeepLinkController />
    <CourseInteractivityController />
    <CpdZonesShortcuts />
    <div id="main-content">{children}</div>
    <DevelopmentDock />
  </>;
}
