"use client";

import { useEffect, useMemo, useState } from "react";

type Scene = "forest" | "ocean" | "rain" | "night";
type Station = "breathe" | "trace" | "ground" | "focus" | "body" | "sensory" | "sound" | "thoughts" | "plan" | "help";
type WallActivity = "ripple" | "trail" | "hunt" | "path" | "breathe" | "focus";
type Coach = "slow" | "wake" | "organise" | "return";

const stations: Record<Station,{name:string;icon:string;need:string;desc:string}> = {
  breathe:{name:"Breathing light",icon:"◌",need:"Slow things down",desc:"Follow a comfortable visual rhythm. Keep the breath natural and stop if it does not feel helpful."},
  trace:{name:"Trace & breathe",icon:"◇",need:"Focus attention",desc:"Trace a slow shape with your eyes or finger while breathing normally."},
  ground:{name:"Grounding hunt",icon:"◎",need:"Reconnect with the room",desc:"Notice neutral details one sense at a time."},
  focus:{name:"Focus lamp",icon:"◈",need:"Settle attention",desc:"Follow one slow visual target, then return to a still object."},
  body:{name:"Body reset",icon:"↕",need:"Release or wake up",desc:"Choose a small movement or supported stillness based on what feels useful."},
  sensory:{name:"Sensory mixer",icon:"▦",need:"Adjust stimulation",desc:"Change brightness and movement one thing at a time."},
  sound:{name:"Scene & sound",icon:"♫",need:"Create a calmer backdrop",desc:"Choose a visual environment that feels comfortable."},
  thoughts:{name:"Thought cloud",icon:"☁",need:"Organise thoughts",desc:"Put one thought down, sort it and choose one next action."},
  plan:{name:"Next-step board",icon:"▤",need:"Make starting easier",desc:"Reduce the return task to one small action and one help route."},
  help:{name:"Adult support",icon:"♡",need:"Ask for support",desc:"Use a simple sentence starter to reach a trusted adult."},
};

const coachRoutes: Record<Coach,{title:string;station:Station;steps:string[]}> = {
  slow:{title:"I need to slow down",station:"breathe",steps:["Choose a position that feels supported.","Look at one steady object or the breathing light.","Reduce extra language, noise or movement if that helps.","Try one regulation strategy without forcing it.","Choose a clear next step or stay here a little longer."]},
  wake:{title:"I need more energy",station:"body",steps:["Notice whether your energy feels low or heavy.","Choose a small movement: stand, stretch or shoulder roll.","Use water or a short walk if that is normally available.","Choose one short task with a clear start point.","Check whether you are ready or need another support."]},
  organise:{title:"My thoughts feel busy",station:"thoughts",steps:["Put the main thought or task into words.","Decide what needs attention now and what can wait.","Choose one help route if something is unclear.","Write only the first small action.","Return with that one action in mind."]},
  return:{title:"I want to return to learning",station:"plan",steps:["Notice your current energy without grading it.","Name one strategy that was useful, if any.","Choose your first task when you return.","Decide whether you need an adjustment or adult check-in.","Return when you have a clear first step—not when you feel perfect."]},
};

export default function RegulationRoomPage(){
  const [scene,setScene]=useState<Scene>("forest");
  const [station,setStation]=useState<Station>("breathe");
  const [coach,setCoach]=useState<Coach>("slow");
  const [coachStep,setCoachStep]=useState(0);
  const [lowStim,setLowStim]=useState(false);
  const [reduced,setReduced]=useState(false);
  const [brightness,setBrightness]=useState(70);
  const [motion,setMotion]=useState(45);
  const [seconds,setSeconds]=useState(0);
  const [nextStep,setNextStep]=useState("");
  const [wall,setWall]=useState<WallActivity>("ripple");
  const [ripples,setRipples]=useState<{id:number;x:number;y:number}[]>([]);
  const [trail,setTrail]=useState(0);
  const [trailRun,setTrailRun]=useState(false);
  const [focus,setFocus]=useState(0);
  const [focusRun,setFocusRun]=useState(false);
  const [hunt,setHunt]=useState<string[]>([]);
  const [ground,setGround]=useState<number[]>([]);
  const [thought,setThought]=useState("");
  const [bucket,setBucket]=useState("now");

  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("staff-development-regulation-room")||"{}");if(saved.scene)setScene(saved.scene);if(saved.station)setStation(saved.station);if(saved.coach)setCoach(saved.coach);if(typeof saved.brightness==="number")setBrightness(saved.brightness);if(typeof saved.motion==="number")setMotion(saved.motion);if(typeof saved.nextStep==="string")setNextStep(saved.nextStep)}catch{}},[]);
  useEffect(()=>{localStorage.setItem("staff-development-regulation-room",JSON.stringify({scene,station,coach,brightness,motion,nextStep}))},[scene,station,coach,brightness,motion,nextStep]);
  useEffect(()=>{if(seconds<=0)return;const id=window.setInterval(()=>setSeconds(v=>Math.max(0,v-1)),1000);return()=>window.clearInterval(id)},[seconds]);
  useEffect(()=>{if(!trailRun)return;const id=window.setInterval(()=>setTrail(v=>(v+1)%10),1050);return()=>window.clearInterval(id)},[trailRun]);
  useEffect(()=>{if(!focusRun)return;const id=window.setInterval(()=>setFocus(v=>(v+1)%12),1350);return()=>window.clearInterval(id)},[focusRun]);

  const stationInfo=stations[station];
  const coachInfo=coachRoutes[coach];
  const timerText=useMemo(()=>`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`,[seconds]);

  function selectCoach(id:Coach){setCoach(id);setCoachStep(0);setStation(coachRoutes[id].station)}
  function rippleClick(event:React.MouseEvent<HTMLDivElement>){const rect=event.currentTarget.getBoundingClientRect();const item={id:Date.now(),x:event.clientX-rect.left,y:event.clientY-rect.top};setRipples(current=>[...current.slice(-10),item]);window.setTimeout(()=>setRipples(current=>current.filter(x=>x.id!==item.id)),2300)}

  return <main className={`zsPage rrPage scene-${scene} ${lowStim?"rrLowStim":""} ${reduced?"rrReduced":""}`}>
    <section className="rrHeader"><div><span className="zsEyebrow">VIRTUAL REGULATION ROOM</span><h1>Interactive calm space</h1><p>Explore, experiment and keep only strategies that feel useful. There is no target emotion and no score.</p></div><div className="rrHeaderActions"><button onClick={()=>setLowStim(v=>!v)}>{lowStim?"Standard visuals":"Low stimulation"}</button><button onClick={()=>setReduced(v=>!v)}>{reduced?"Movement on":"Reduce movement"}</button><a href="/zones">Exit room</a></div></section>

    <nav className="rrSceneBar">{(["forest","ocean","rain","night"] as Scene[]).map(id=><button className={scene===id?"active":""} onClick={()=>setScene(id)} key={id}>{id[0].toUpperCase()+id.slice(1)} room</button>)}</nav>

    <section className="rrMainGrid">
      <div className="rrWorldWrap">
        <div className="rrWorld" style={{filter:`brightness(${Math.max(45,brightness)}%)`}}>
          <div className="rrWindow"><span>{scene==="forest"?"forest canopy":scene==="ocean"?"slow horizon":scene==="rain"?"rain on glass":"quiet night sky"}</span></div><div className="rrSofa"/><div className="rrRug"/><div className="rrTable"/><div className="rrShelf"/><div className="rrLamp"/><div className="rrPlant"/>
          {(["breathe","trace","ground","focus","body","sensory","sound","thoughts","plan","help"] as Station[]).map((id,index)=><button key={id} onClick={()=>setStation(id)} className={`rrHotspot ${station===id?"active":""}`} style={{left:`${10+(index%5)*19}%`,top:`${28+Math.floor(index/5)*43}%`}}><b>{stations[id].icon}</b><span>{stations[id].name.split(" ")[0]}</span></button>)}
        </div>
        <div className="rrWorldHint">Choose a glowing station to change activity</div>
      </div>
      <aside className="rrCoach"><div className="rrCoachFace"><i/><i/><b/></div><span className="zsEyebrow">ADAPTIVE CALM COACH</span><h2>{coachInfo.title}</h2><div className="rrCoachText">{coachInfo.steps[coachStep]}</div><div className="rrStepDots">{coachInfo.steps.map((_,i)=><i className={i<=coachStep?"on":""} key={i}/>)}</div><div className="rrCoachButtons"><button disabled={coachStep===0} onClick={()=>setCoachStep(v=>Math.max(0,v-1))}>← Back</button><button onClick={()=>setCoachStep(v=>Math.min(coachInfo.steps.length-1,v+1))}>{coachStep===coachInfo.steps.length-1?"Ready":"Next →"}</button></div><h3>What do you need?</h3><div className="rrNeeds">{(Object.keys(coachRoutes) as Coach[]).map(id=><button className={coach===id?"active":""} onClick={()=>selectCoach(id)} key={id}>{coachRoutes[id].title}</button>)}</div><div className="rrTimer"><span>Guided time</span><strong>{timerText}</strong><div>{[60,180,300,600].map(n=><button key={n} onClick={()=>setSeconds(n)}>{n/60}m</button>)}<button onClick={()=>setSeconds(0)}>Stop</button></div></div></aside>
    </section>

    <section className="rrLowerGrid">
      <article className="rrCard rrStation"><header><span>{stationInfo.icon}</span><div><small>{stationInfo.need}</small><h2>{stationInfo.name}</h2></div></header><p>{stationInfo.desc}</p><StationActivity station={station} brightness={brightness} motion={motion} ground={ground} setGround={setGround} thought={thought} setThought={setThought} bucket={bucket} setBucket={setBucket} nextStep={nextStep} setNextStep={setNextStep}/></article>
      <article className="rrCard"><span className="zsEyebrow">ROOM MIXER</span><h2>Adjust the environment</h2><Range label="Brightness" value={brightness} onChange={setBrightness}/><Range label="Visual movement" value={motion} onChange={setMotion}/><p className="rrNote">Try changing one thing at a time so you can notice what actually helps.</p></article>
      <article className="rrCard"><span className="zsEyebrow">RETURN TO LEARNING</span><h2>Build your bridge back</h2><label className="rrField">First small step<textarea value={nextStep} onChange={e=>setNextStep(e.target.value)} placeholder="e.g. Open my book and answer question 1"/></label><div className="rrReturn"><button>Ready to return</button><button>I need a little longer</button><button>I need an adult</button></div></article>
    </section>

    <section className="rrWall"><header><div><span className="zsEyebrow">INTERACTIVE ACTIVITY WALL</span><h2>Choose a calm attention activity</h2><p>Pause, switch or stop at any time.</p></div></header><nav>{(["ripple","trail","hunt","path","breathe","focus"] as WallActivity[]).map(id=><button className={wall===id?"active":""} onClick={()=>setWall(id)} key={id}>{id[0].toUpperCase()+id.slice(1)}</button>)}</nav><div className="rrWallBody">
      {wall==="ripple"&&<div className="rrRipple" onClick={rippleClick}><span>Tap or click anywhere</span>{ripples.map(r=><i key={r.id} style={{left:r.x,top:r.y}}/>)}</div>}
      {wall==="trail"&&<div className="rrActivity"><div className="rrTrail">{Array.from({length:10},(_,i)=><i className={trail===i?"on":""} key={i}/>)}</div><div className="rrActionRow"><button onClick={()=>setTrailRun(v=>!v)}>{trailRun?"Pause":"Start"} light trail</button><button onClick={()=>{setTrailRun(false);setTrail(v=>(v+1)%10)}}>Next light</button><button onClick={()=>{setTrailRun(false);setTrail(0)}}>Restart</button></div><p>Follow one light at a time with your eyes.</p></div>}
      {wall==="hunt"&&<div className="rrActivity"><div className="rrHunt">{[["leaf","Leaf",18,28],["book","Book",61,69],["circle","Circle",84,57],["lamp","Lamp",76,22],["window","Window",27,18]].map(([id,label,left,top])=><button key={String(id)} className={hunt.includes(String(id))?"found":""} style={{left:`${left}%`,top:`${top}%`}} onClick={()=>setHunt(v=>v.includes(String(id))?v:[...v,String(id)])}>{label}</button>)}</div><strong>{hunt.length}/5 found</strong><p>Name one neutral detail about each object.</p></div>}
      {wall==="path"&&<div className="rrActivity"><div className="rrPath"><svg viewBox="0 0 760 270"><path d="M38 185 C125 40 215 35 290 155 S455 250 540 100 S660 35 720 135"/><circle r="12"><animateMotion dur="14s" repeatCount="indefinite" path="M38 185 C125 40 215 35 290 155 S455 250 540 100 S660 35 720 135"/></circle></svg></div><p>Notice → follow → pause → return to one still object.</p></div>}
      {wall==="breathe"&&<div className="rrActivity"><div className="rrBreathOrb"><span>comfortable breath</span></div><p>Let the light expand and contract while you breathe comfortably.</p></div>}
      {wall==="focus"&&<div className="rrActivity"><div className="rrFocusField">{Array.from({length:12},(_,i)=><button className={focus===i?"on":""} key={i}/>)}</div><div className="rrActionRow"><button onClick={()=>setFocusRun(v=>!v)}>{focusRun?"Pause":"Start"} slow focus</button><button onClick={()=>{setFocusRun(false);setFocus(v=>(v+1)%12)}}>Next point</button><button onClick={()=>{setFocusRun(false);setFocus(0)}}>Restart</button></div></div>}
    </div></section>
    <footer className="rrBoundary"><strong>Support boundary:</strong> this room is for practising everyday regulation strategies. It does not replace adult support, safeguarding, medical care or emergency procedures.</footer>
  </main>
}

function Range({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void}){return <label className="rrRange"><span>{label}<output>{value}%</output></span><input type="range" min="0" max="100" value={value} onChange={e=>onChange(Number(e.target.value))}/></label>}

function StationActivity({station,brightness,motion,ground,setGround,thought,setThought,bucket,setBucket,nextStep,setNextStep}:{station:Station;brightness:number;motion:number;ground:number[];setGround:(v:number[])=>void;thought:string;setThought:(v:string)=>void;bucket:string;setBucket:(v:string)=>void;nextStep:string;setNextStep:(v:string)=>void}){
  if(station==="breathe")return <div className="rrStationActivity"><div className="rrBreathOrb"><span>gently in<br/>slowly out</span></div></div>;
  if(station==="trace")return <div className="rrStationActivity rrTrace"><svg viewBox="0 0 320 170"><path d="M34 126 C62 30 132 28 158 92 S246 156 290 48"/><circle r="8"><animateMotion dur="8s" repeatCount="indefinite" path="M34 126 C62 30 132 28 158 92 S246 156 290 48"/></circle></svg><p>Follow the moving point. Pause whenever you want.</p></div>;
  if(station==="ground")return <div className="rrGround">{[[5,"see"],[4,"feel"],[3,"hear"],[2,"smell"],[1,"next step"]].map(([n,label],i)=><button className={ground.includes(i)?"done":""} onClick={()=>setGround(ground.includes(i)?ground.filter(x=>x!==i):[...ground,i])} key={i}><b>{n}</b><span>{label}</span></button>)}</div>;
  if(station==="focus")return <div className="rrStationActivity"><div className="rrFocusTrack"><i style={{animationDuration:`${Math.max(4,14-motion/10)}s`}}/></div><p>Follow the moving light, then choose one still object.</p></div>;
  if(station==="body")return <div className="rrChoiceGrid">{["Shoulder roll","Hand stretch","Stand & reach","Wall push","Short walk","Supported stillness"].map(x=><button key={x}>{x}</button>)}</div>;
  if(station==="sensory")return <div className="rrStationActivity"><div className="rrSensoryPreview" style={{filter:`brightness(${brightness}%)`}}><i/><i/><i/></div><p>Use the room mixer to reduce or increase visual stimulation.</p></div>;
  if(station==="sound")return <div className="rrChoiceGrid">{["Forest","Ocean","Rain","Quiet night","No sound"].map(x=><button key={x}>{x}</button>)}</div>;
  if(station==="thoughts")return <div className="rrStationActivity"><textarea value={thought} onChange={e=>setThought(e.target.value)} placeholder="Put one thought here…"/><div className="rrActionRow">{["now","later","ask for help"].map(x=><button className={bucket===x?"active":""} onClick={()=>setBucket(x)} key={x}>{x}</button>)}</div></div>;
  if(station==="plan")return <div className="rrStationActivity"><textarea value={nextStep} onChange={e=>setNextStep(e.target.value)} placeholder="What is the smallest useful first step?"/><p>Keep the return step concrete and small.</p></div>;
  return <div className="rrStationActivity"><div className="rrSupportScripts"><button>“I need a quiet minute.”</button><button>“Can you show me the first step?”</button><button>“I am not ready to talk yet.”</button><button>“Can I check in with an adult?”</button></div></div>;
}
