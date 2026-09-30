"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const secondaryLabels=new Set([
  "Zones Practice",
  "Interventions",
  "Live Activities",
  "Staff Dashboard",
  "Resources",
  "Plans & Access",
]);

const moreTools=[
  ["Zones Practice","◆"],
  ["Interventions","✓"],
  ["Live Activities","◫"],
  ["Staff Dashboard","▦"],
  ["Resources","▤"],
  ["Plans & Access","✦"],
] as const;

function clean(value:string|null|undefined){return (value||"").replace(/\s+/g," ").trim();}

export default function HomeNavigationSimplifier(){
  const pathname=usePathname();
  const [sidebar,setSidebar]=useState<HTMLElement|null>(null);

  useEffect(()=>{
    if(pathname!=="/"){setSidebar(null);return;}
    const target=document.querySelector<HTMLElement>(".sidebar");
    setSidebar(target);
  },[pathname]);

  useEffect(()=>{
    if(!sidebar)return;
    const apply=()=>{
      sidebar.querySelectorAll<HTMLButtonElement>(".navButton").forEach(button=>{
        const hide=secondaryLabels.has(clean(button.textContent));
        if(button.classList.contains("navCompactHidden")!==hide)button.classList.toggle("navCompactHidden",hide);
      });
      sidebar.querySelectorAll<HTMLElement>(".sidebarSection").forEach(section=>{
        const visible=[...section.querySelectorAll<HTMLButtonElement>(".navButton")].some(button=>!button.classList.contains("navCompactHidden"));
        if(section.classList.contains("navSectionHidden")===visible)section.classList.toggle("navSectionHidden",!visible);
      });
    };
    apply();
    const observer=new MutationObserver(apply);
    observer.observe(sidebar,{subtree:true,attributes:true,attributeFilter:["class"],childList:true});
    return()=>observer.disconnect();
  },[sidebar]);

  if(!sidebar)return null;

  const openView=(label:string)=>{
    const button=[...sidebar.querySelectorAll<HTMLButtonElement>(".navButton")].find(item=>clean(item.textContent)===label);
    button?.click();
  };

  return <>
    {createPortal(<a className="sidebarAiTutor" href="/ai-coach"><span>✦</span><div><strong>AI CPD Tutor</strong><small>Ask, plan and reflect</small></div></a>,sidebar)}
    {createPortal(<details className="sidebarMoreTools">
      <summary><span>•••</span><div><strong>More tools</strong><small>Practice, live and admin</small></div></summary>
      <div className="sidebarMorePanel">
        {moreTools.map(([label,icon])=><button key={label} type="button" onClick={()=>openView(label)}><span>{icon}</span>{label}</button>)}
      </div>
    </details>,sidebar)}
  </>;
}
