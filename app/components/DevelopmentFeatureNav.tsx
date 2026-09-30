"use client";

import { usePathname } from "next/navigation";

const coreLinks=[
  ["/dashboard","Dashboard"],
  ["/ai-coach","AI Coach"],
  ["/knowledge-base","School Knowledge"],
  ["/learning-walks","Learning Walks"],
  ["/pathways/personal","Personal Pathway"],
] as const;

const workflowLinks=[
  ["/appraisal","Appraisal"],
  ["/compliance","Compliance"],
  ["/induction","Induction"],
  ["/departments","Departments"],
  ["/improvement/programmes","Improvement → CPD"],
  ["/live-presenter","Presenter 2.0"],
  ["/ai-course-builder","AI Course Builder"],
  ["/presentation-overhaul-final","Presentation QA"],
] as const;

export default function DevelopmentFeatureNav(){
  const pathname=usePathname();
  const visible=pathname==="/"||["/dashboard","/cpd","/coach","/ai-coach","/knowledge-base","/learning-walks","/pathways","/improvement","/live","/live-presenter","/facilitator","/impact","/development","/leadership","/ai-course-builder","/builder","/appraisal","/compliance","/induction","/departments","/presentation-overhaul-final"].some(prefix=>pathname===prefix||pathname.startsWith(`${prefix}/`));
  if(!visible)return null;
  const workflowActive=workflowLinks.some(([href])=>pathname===href||pathname.startsWith(`${href}/`));
  return <nav className="developmentFeatureNav" aria-label="Staff development tools">
    <strong>Development tools</strong>
    {coreLinks.map(([href,label])=><a key={href} href={href} className={pathname===href||pathname.startsWith(`${href}/`)?"active":""}>{label}</a>)}
    <details className={`developmentWorkflowMenu ${workflowActive?"active":""}`}>
      <summary>School workflows</summary>
      <div>{workflowLinks.map(([href,label])=><a key={href} href={href} className={pathname===href||pathname.startsWith(`${href}/`)?"active":""}>{label}</a>)}</div>
    </details>
  </nav>;
}