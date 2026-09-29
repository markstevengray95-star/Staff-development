"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { studioTools } from "@/lib/zonesMigrationData";

type Tool=typeof studioTools[number]["key"];
type Evidence={baseline:number;review:number};
type StudioState={tool:Tool;timer:number;running:boolean;role:string;poll:number[];evidence:Evidence;notes:string;completed:string[]};
const STORE="staff-development-zones-cpd-studio-v1";
const defaults:StudioState={tool:"activity",timer:600,running:false,role:"Observer",poll:[0,0,0,0],evidence:{baseline:3,review:3},notes:"",completed:[]};
const roles=["Observer","Evidence Analyst","Communication Lead","Environment Lead"];
const challenges=[
 {title:"Transition overload",prompt:"A class returns from lunch with high energy. Repeated verbal reminders increase and several pupils miss the starter.",asks:["What changed in the environment?","What can be made predictable?","Which adult response reduces unnecessary load without lowering expectations?"]},
 {title:"Practical pressure point",prompt:"Equipment collection starts while safety instructions are still happening. Movement and noise rise and key information is missed.",asks:["Which demands are simultaneous?","How could movement and explanation be separated?","What checkpoint preserves the science learning goal?"]},
 {title:"Public performance",prompt:"A pupil contributes well in writing but freezes when unexpectedly asked to read aloud.",asks:["What is observable rather than inferred?","How can participation be preserved?","What gradual route could build confidence?"]}
];
const textbook=[
 ["1. Regulation, not compliance","Zones language is a shared way to notice energy and emotion. A zone is not a behaviour grade and Green is not a reward."],
 ["2. Co-regulation","Adults can reduce verbal load, make the next step predictable, model calm problem-solving and preserve dignity while boundaries remain clear."],
 ["3. Language","Describe what is observable, acknowledge the state, keep the learning or safety goal clear, offer bounded choices and identify one next action."],
 ["4. Environment","Noise, movement, visual competition, uncertainty and transitions can change access to learning. Change one variable at a time and review impact."],
 ["5. Inclusion","SEND, EAL, sensory and communication differences may change how a pupil experiences the same environment. Support access without assuming lower capability."],
 ["6. Intervention","Define the barrier, strategy, baseline, success evidence and review date. Continue only when evidence and pupil voice suggest the strategy is useful."],
 ["7. Whole-school implementation","Consistency comes from shared principles plus subject-specific routines—not identical responses in every classroom."],
];

export default function ZonesCpdStudio(){
 const [state,setState]=useState<StudioState>(defaults);const [ready,setReady]=useState(false);const [caseIndex,setCaseIndex]=useState(0);const [hotspots,setHotspots]=useState<string[]>([]);const [prompt,setPrompt]=useState(0);const code=useMemo(()=>Math.random().toString(36).slice(2,8).toUpperCase(),[]);
 useEffect(()=>{try{const x=localStorage.getItem(STORE);if(x)setState({...defaults,...JSON.parse(x)})}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem(STORE,JSON.stringify(state))},[state,ready]);
 useEffect(()=>{if(!state.running)return;const t=window.setInterval(()=>setState(s=>s.timer>0?{...s,timer:s.timer-1}:{...s,running:false}),1000);return()=>clearInterval(t)},[state.running]);
 const tool=studioTools.find(x=>x.key===state.tool)!;const c=challenges[caseIndex%challenges.length];const diff=state.evidence.review-state.evidence.baseline;
 if(!ready)return <main className="zmPage">Opening Zones CPD Studio…</main>;
 return <main className="zmPage"><section className="zmHero studio"><div><span>ZONES CPD STUDIO</span><h1>The specialist tools from the original Zones CPD build.</h1><p>The activity lab, facilitator controls, evidence tools, classroom hotspot, deep-dive cases, inclusion training, textbook, live audience, team collaboration, presenter widgets and school-impact links are now grouped in one coherent studio.</p></div><div className="zmScore"><b>{state.completed.length}</b><small>tools explored</small></div></section>
 <div className="zmsLayout"><aside className="zmsTools">{studioTools.map(x=><button key={x.key} className={state.tool===x.key?'active':''} onClick={()=>{setState(s=>({...s,tool:x.key as Tool,completed:s.completed.includes(x.key)?s.completed:[...s.completed,x.key]}));}}><strong>{x.title}</strong><span>{x.desc}</span></button>)}</aside>
 <section className="zmsStage"><header><div><span>ACTIVE TOOL</span><h2>{tool.title}</h2><p>{tool.desc}</p></div><a href="/zones-cpd">Zones CPD home</a></header>
 {state.tool==='activity'&&<ActivityLab prompt={prompt} setPrompt={setPrompt}/>} 
 {state.tool==='facilitator'&&<Facilitator state={state} setState={setState}/>} 
 {state.tool==='graph'&&<GraphLab state={state} setState={setState} diff={diff}/>} 
 {state.tool==='hotspot'&&<Hotspot selected={hotspots} setSelected={setHotspots}/>} 
 {state.tool==='deepdive'&&<CaseLab c={c} next={()=>setCaseIndex(x=>x+1)}/>} 
 {state.tool==='inclusion'&&<Inclusion/>} 
 {state.tool==='textbook'&&<Textbook/>} 
 {state.tool==='live'&&<LiveAudience code={code} state={state} setState={setState}/>} 
 {state.tool==='collab'&&<Collaboration state={state} setState={setState} c={c} next={()=>setCaseIndex(x=>x+1)}/>} 
 {state.tool==='presenter'&&<Presenter state={state} setState={setState} prompt={prompt} setPrompt={setPrompt}/>} 
 {state.tool==='impact'&&<ImpactLink/>}
 </section></div></main>
}

function ActivityLab({prompt,setPrompt}:{prompt:number;setPrompt:(n:number)=>void}){const activities=[
 {title:"Language sort",task:"Rewrite a judgemental statement into neutral observation + need + next step.",items:["They are being lazy.","She is refusing to cooperate.","He always loses control."]},
 {title:"Strategy match",task:"Choose a support that matches the barrier rather than the colour alone.",items:["High noise during a practical","Low energy at lesson start","Anxiety before public speaking"]},
 {title:"Implementation sprint",task:"Select one routine your department could use consistently for two weeks.",items:["Visible first step","Private help signal","Predictable transition cue"]}
];const a=activities[prompt%activities.length];return <div className="zmsCard"><span>ACTIVITY {prompt%activities.length+1}/{activities.length}</span><h3>{a.title}</h3><p>{a.task}</p><div className="zmsChoiceGrid">{a.items.map(x=><button key={x}>{x}</button>)}</div><button className="zmPrimary" onClick={()=>setPrompt((prompt+1)%activities.length)}>Next activity</button></div>}

function Facilitator({state,setState}:{state:StudioState;setState:React.Dispatch<React.SetStateAction<StudioState>>}){return <div className="zmGrid2"><section className="zmsCard"><span>SESSION TIMER</span><div className="zmsTimer">{Math.floor(state.timer/60)}:{String(state.timer%60).padStart(2,"0")}</div><div className="zmsActions"><button onClick={()=>setState(s=>({...s,running:!s.running}))}>{state.running?'Pause':'Start'}</button><button onClick={()=>setState(s=>({...s,timer:300,running:false}))}>5m</button><button onClick={()=>setState(s=>({...s,timer:600,running:false}))}>10m</button><button onClick={()=>setState(s=>({...s,timer:1200,running:false}))}>20m</button></div></section><section className="zmsCard"><span>FACILITATOR SEQUENCE</span><ol><li>Set the learning question.</li><li>Elicit current practice before presenting content.</li><li>Use one case or activity.</li><li>Ask teams to identify a classroom application.</li><li>Capture a specific implementation commitment.</li><li>Set a review point and evidence source.</li></ol></section></div>}

function GraphLab({state,setState,diff}:{state:StudioState;setState:React.Dispatch<React.SetStateAction<StudioState>>;diff:number}){return <section className="zmsCard"><span>EVIDENCE LAB</span><h3>Baseline → review comparison</h3><div className="zmsSliders"><label>Baseline <b>{state.evidence.baseline}/5</b><input type="range" min="1" max="5" value={state.evidence.baseline} onChange={e=>setState(s=>({...s,evidence:{...s.evidence,baseline:Number(e.target.value)}}))}/></label><label>Review <b>{state.evidence.review}/5</b><input type="range" min="1" max="5" value={state.evidence.review} onChange={e=>setState(s=>({...s,evidence:{...s.evidence,review:Number(e.target.value)}}))}/></label></div><div className="zmsBars"><div><span>Baseline</span><i><b style={{width:`${state.evidence.baseline*20}%`}}/></i></div><div><span>Review</span><i><b style={{width:`${state.evidence.review*20}%`}}/></i></div></div><p className="zmNote">Change: {diff>0?'+':''}{diff}. Treat this as one evidence source. Combine it with pupil voice, observations, fidelity and context.</p></section>}

function Hotspot({selected,setSelected}:{selected:string[];setSelected:(x:string[])=>void}){const spots=["Noise & competing talk","Movement during explanation","Unclear first step","Visual overload","Public help-seeking","Equipment transition"];return <section className="zmsCard"><span>CLASSROOM HOTSPOT</span><h3>Inspect the environment</h3><div className="zmsRoom">{spots.map((x,i)=><button className={selected.includes(x)?'found':''} style={{left:`${12+(i%3)*34}%`,top:`${25+Math.floor(i/3)*43}%`}} key={x} onClick={()=>setSelected(selected.includes(x)?selected.filter(y=>y!==x):[...selected,x])}><b>{i+1}</b><span>{x}</span></button>)}</div><p>{selected.length}/{spots.length} features marked for discussion. Ask what evidence suggests each feature is actually a barrier for this group.</p></section>}

function CaseLab({c,next}:{c:{title:string;prompt:string;asks:string[]};next:()=>void}){return <section className="zmsCard"><span>CASE DEEP DIVE</span><h3>{c.title}</h3><p className="zmsCase">{c.prompt}</p><div className="zmsPrompts">{c.asks.map(x=><label key={x}>{x}<textarea placeholder="Team response…"/></label>)}</div><button className="zmPrimary" onClick={next}>Next case</button></section>}

function Inclusion(){const rows=[["Communication","Reduce unnecessary spoken load; make key steps visible; check understanding without public pressure."],["Sensory access","Consider noise, movement, light, touch and crowding; avoid assuming one sensory preference fits everybody."],["EAL","Use visuals, modelling and vocabulary support without confusing language acquisition with low cognitive ability."],["Executive function","Externalise sequences, time and first steps; make restarting easier after interruption."],["SEM​​H / anxiety","Increase predictability, preserve dignity and provide a clear help route while keeping learning expectations meaningful."]];return <section className="zmsCard"><span>INCLUSION SESSION</span><h3>Access without lowering ambition</h3><div className="zmsTable">{rows.map(([a,b])=><div key={a}><strong>{a}</strong><p>{b}</p></div>)}</div><p className="zmNote">Individual plans and professional advice take priority over generic strategies.</p></section>}

function Textbook(){return <section className="zmsCard"><span>ZONES CPD TEXTBOOK</span><h3>Core reference</h3><div className="zmsTextbook">{textbook.map(([h,p])=><article key={h}><h4>{h}</h4><p>{p}</p></article>)}</div></section>}

function LiveAudience({code,state,setState}:{code:string;state:StudioState;setState:React.Dispatch<React.SetStateAction<StudioState>>}){const options=["Very confident","Fairly confident","Unsure","Need more practice"];const total=state.poll.reduce((a,b)=>a+b,0);return <div className="zmGrid2"><section className="zmsCard"><span>LIVE SESSION</span><h3>Room {code}</h3><div className="zmsQr"><QRCode value={`https://schoolcpd.vercel.app/live?zones=${code}`} size={150}/></div><p>Use the main CPD Live system for cloud participant responses. This Zones studio provides the regulation-specific facilitator layer.</p><a className="zmPrimary link" href="/live">Open cloud Live CPD</a></section><section className="zmsCard"><span>QUICK PULSE</span><h3>How confident are we applying this consistently?</h3>{options.map((x,i)=><button className="zmsPoll" key={x} onClick={()=>setState(s=>({...s,poll:s.poll.map((v,j)=>j===i?v+1:v)}))}><span>{x}</span><i><b style={{width:`${total?100*state.poll[i]/total:0}%`}}/></i><em>{state.poll[i]}</em></button>)}</section></div>}

function Collaboration({state,setState,c,next}:{state:StudioState;setState:React.Dispatch<React.SetStateAction<StudioState>>;c:{title:string;prompt:string;asks:string[]};next:()=>void}){return <section className="zmsCard"><span>TEAM COLLABORATION</span><h3>Choose a role and investigate together</h3><div className="zmsRoleGrid">{roles.map(r=><button className={state.role===r?'active':''} key={r} onClick={()=>setState(s=>({...s,role:r}))}>{r}</button>)}</div><div className="zmsCase"><strong>{c.title}</strong><p>{c.prompt}</p></div><p><strong>{state.role} focus:</strong> {state.role==='Observer'?'Separate observation from interpretation.':state.role==='Evidence Analyst'?'Look for pupil voice, fidelity, outcome and context.':state.role==='Communication Lead'?'Review adult language, clarity, choice and next steps.':'Review noise, movement, uncertainty and environmental demand.'}</p><button className="zmPrimary" onClick={next}>Change case</button></section>}

function Presenter({state,setState,prompt,setPrompt}:{state:StudioState;setState:React.Dispatch<React.SetStateAction<StudioState>>;prompt:number;setPrompt:(n:number)=>void}){const prompts=["What changed before the difficulty?","Which response preserves dignity and the learning goal?","What evidence would tell us the strategy helped?","How would this routine look in a practical subject?","What would the pupil say was useful?"];return <div className="zmGrid2"><section className="zmsCard"><span>PRESENTER TIMER</span><div className="zmsTimer">{Math.floor(state.timer/60)}:{String(state.timer%60).padStart(2,"0")}</div><button className="zmPrimary" onClick={()=>setState(s=>({...s,running:!s.running}))}>{state.running?'Pause':'Start'}</button></section><section className="zmsCard"><span>RANDOM PROMPT</span><h3>{prompts[prompt%prompts.length]}</h3><button className="zmPrimary" onClick={()=>setPrompt((prompt+1)%prompts.length)}>Another prompt</button></section></div>}

function ImpactLink(){return <section className="zmsCard"><span>SCHOOL IMPACT</span><h3>Connect CPD to implementation</h3><p>The original school-impact layer is now integrated with the whole-school regulation workspace and the main CPD Impact tool. Record implementation scores, rollout milestones, observations, intervention reviews and leadership notes without switching accounts.</p><div className="zmsActions"><a className="zmPrimary link" href="/zones-school">Open Zones School Platform</a><a className="zmPrimary link secondary" href="/impact">Open CPD Impact</a></div></section>}
