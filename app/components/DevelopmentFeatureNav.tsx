"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type LinkItem = readonly [string, string];
type MenuSection = { title: string; links: LinkItem[] };

function activePath(pathname:string,href:string){
  return pathname===href||(href!=="/"&&pathname.startsWith(`${href}/`));
}

const primaryLinks:LinkItem[]=[
  ["/ai-coach","✦ AI CPD Tutor"],
  ["/dashboard","Dashboard"],
  ["/cpd","Courses"],
  ["/training","My CPD"],
];

const schoolLinks:LinkItem[]=[
  ["/knowledge-base","School Knowledge"],
  ["/appraisal","Appraisal"],
  ["/compliance","Compliance"],
  ["/induction","Induction"],
  ["/departments","Departments"],
  ["/learning-walks","Learning Walks"],
  ["/improvement","School Improvement"],
];

const personalLinks:LinkItem[]=[
  ["/development","Development cycle"],
  ["/pathways/personal","Personal pathway"],
  ["/actions","Action plans"],
  ["/coaching","Coaching"],
  ["/portfolio","Portfolio"],
  ["/impact","Impact reviews"],
  ["/recommendations","Recommendations"],
];

const leadershipLinks:LinkItem[]=[
  ["/leadership","Leadership dashboard"],
  ["/improvement/programmes","Improvement → CPD"],
  ["/live-presenter","Presenter 2.0"],
  ["/facilitator","Facilitator packs"],
];

const builderLinks:LinkItem[]=[
  ["/ai-course-builder","AI Course Builder"],
  ["/builder","Course creator"],
  ["/policy-training","Policy training"],
  ["/presentation-overhaul-final","Presentation QA"],
  ["/course-quality-dashboard","Course QA"],
  ["/school-access","School access"],
  ["/admin","CPD admin"],
];

export default function DevelopmentFeatureNav(){
  const pathname=usePathname();
  const [role,setRole]=useState("");
  const [platformAdmin,setPlatformAdmin]=useState(false);

  useEffect(()=>{
    const client=getSupabaseBrowserClient();
    let mounted=true;
    (async()=>{
      const {data:auth}=await client.auth.getUser();
      if(!auth.user)return;
      const [{data:profile},{data:platform}]=await Promise.all([
        client.from("staff_profiles").select("role").eq("id",auth.user.id).maybeSingle(),
        client.from("platform_admins").select("user_id").eq("user_id",auth.user.id).maybeSingle(),
      ]);
      if(!mounted)return;
      setRole(profile?.role||"");
      setPlatformAdmin(Boolean(platform));
    })();
    return()=>{mounted=false;};
  },[]);

  const menuSections=useMemo<MenuSection[]>(()=>{
    const sections:MenuSection[]=[{title:"My development",links:personalLinks}];
    if(["Department Lead","CPD Lead","Admin"].includes(role)) sections.push({title:"Lead & present",links:leadershipLinks});
    if(["CPD Lead","Admin"].includes(role)) sections.push({title:"Build & manage",links:builderLinks});
    if(role==="Admin") sections.push({title:"Staff administration",links:[["/staff-access","Staff access"],["/staff-sync","Staff sync"]]});
    if(platformAdmin) sections.push({title:"Platform",links:[["/owner-portal","Owner portal"],["/platform","Platform settings"]]});
    return sections;
  },[role,platformAdmin]);

  const allManagedPaths=[...primaryLinks,...schoolLinks,...personalLinks,...leadershipLinks,...builderLinks];
  const visible=pathname==="/"||allManagedPaths.some(([href])=>activePath(pathname,href));
  if(!visible)return null;

  const schoolActive=schoolLinks.some(([href])=>activePath(pathname,href));
  const moreActive=menuSections.some(section=>section.links.some(([href])=>activePath(pathname,href)));

  return <nav className="developmentFeatureNav" aria-label="Staff development navigation">
    <span className="developmentNavLabel">Staff Development</span>
    <div className="developmentPrimaryLinks">
      {primaryLinks.map(([href,label],index)=><a key={href} href={href} className={`${activePath(pathname,href)?"active":""} ${index===0?"aiPrimary":""}`.trim()}>{label}</a>)}
    </div>

    <details className={`developmentMenu ${schoolActive?"active":""}`}>
      <summary>School</summary>
      <div className="developmentMenuPanel singleSection">
        <section>
          <strong>School tools</strong>
          {schoolLinks.map(([href,label])=><a key={href} href={href} className={activePath(pathname,href)?"active":""}>{label}</a>)}
        </section>
      </div>
    </details>

    <details className={`developmentMenu ${moreActive?"active":""}`}>
      <summary>More</summary>
      <div className="developmentMenuPanel">
        {menuSections.map(section=><section key={section.title}>
          <strong>{section.title}</strong>
          {section.links.map(([href,label])=><a key={href} href={href} className={activePath(pathname,href)?"active":""}>{label}</a>)}
        </section>)}
      </div>
    </details>
  </nav>;
}