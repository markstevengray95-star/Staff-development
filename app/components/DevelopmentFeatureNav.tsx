"use client";

import { usePathname } from "next/navigation";

const links=[
  ["/dashboard","Dashboard"],
  ["/ai-coach","AI Coach"],
  ["/knowledge-base","School Knowledge"],
  ["/learning-walks","Learning Walks"],
  ["/pathways/personal","Personal Pathway"],
  ["/improvement/programmes","Improvement → CPD"],
  ["/live-presenter","Presenter 2.0"],
  ["/ai-course-builder","AI Course Builder"],
] as const;

export default function DevelopmentFeatureNav(){
  const pathname=usePathname();
  const visible=pathname==="/"||["/dashboard","/cpd","/coach","/ai-coach","/knowledge-base","/learning-walks","/pathways","/improvement","/live","/live-presenter","/facilitator","/impact","/development","/leadership","/ai-course-builder","/builder"].some(prefix=>pathname===prefix||pathname.startsWith(`${prefix}/`));
  if(!visible)return null;
  return <nav className="developmentFeatureNav" aria-label="Staff development tools"><strong>Development tools</strong>{links.map(([href,label])=><a key={href} href={href} className={pathname===href||pathname.startsWith(`${href}/`)?"active":""}>{label}</a>)}</nav>;
}
