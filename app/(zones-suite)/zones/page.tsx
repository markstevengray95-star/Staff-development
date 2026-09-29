const features = [
  { href: "/regulation-room", icon: "◇", title: "Virtual Regulation Room", tag: "FREE", text: "The full interactive regulation space: room environments, calm coach, breathing, grounding, focus, movement, sensory controls and return-to-learning planning." },
  { href: "/zones-cpd", icon: "▣", title: "Zones CPD Academy", tag: "CPD", text: "Dedicated Zones professional development with facilitator-style learning, classroom application, subject examples and implementation reflection." },
  { href: "/zones-cpd/studio", icon: "◫", title: "Zones CPD Studio", tag: "PLUS", text: "Activity lab, facilitator console, evidence graphs, classroom hotspots, inclusion training, live audience, team collaboration, textbook and presenter widgets." },
  { href: "/zones-cpd/escape-room", icon: "⌁", title: "CPD Escape Room", tag: "PLUS", text: "Immersive staff scenarios, evidence clues, team roles, decision points, case rooms and a custom escape-room builder." },
  { href: "/zone-quest", icon: "◆", title: "Zone Quest", tag: "PLUS", text: "A fast interactive game for practising zone recognition, context, adult responses and regulation strategy choices." },
  { href: "/zones-school", icon: "▥", title: "Whole-School Platform", tag: "PRO", text: "Local insights, 20 subject guides, lesson planning, printable resources, implementation audit, impact tracking and school operations." },
  { href: "/?zone=students", icon: "◉", title: "Student Check-ins", tag: "PRO", text: "Record regulation snapshots and context while keeping zone language non-judgemental." },
  { href: "/?zone=interventions", icon: "✓", title: "Intervention Plans", tag: "PLUS", text: "Create concise regulation support plans, choose strategies and review whether they are helping." },
];

export default function ZonesOverviewPage() {
  return <main className="zsPage">
    <section className="zsHero">
      <div><span className="zsEyebrow">COMPLETE ZONES SUITE</span><h1>The original regulation platform and its CPD tools are now inside Staff Development.</h1><p>The migration now covers the pupil tools, staff tools, subject implementation, planning, resources, operations, impact, full Regulation Room and the specialist Zones CPD modules from the original repository. Everything uses the same CPD-project sign-in.</p><div className="zsHeroActions"><a className="zsPrimary" href="/regulation-room">Enter Regulation Room</a><a className="zsSecondary" href="/zones-school">Open School Platform</a></div></div>
      <div className="zsZoneWheel" aria-label="Four regulation zones"><span className="blue">Blue</span><span className="green">Green</span><span className="yellow">Yellow</span><span className="red">Red</span><b>Every zone<br/>is valid</b></div>
    </section>
    <section className="zsPrinciple"><strong>Key principle</strong><p>Zones describe a regulation state, not a child. The goal is to notice needs, choose helpful support and build a dignified route back to learning—not to force everybody into Green.</p></section>
    <section className="zsFeatureGrid">{features.map(feature => <a className="zsFeatureCard" href={feature.href} key={feature.title}><span className="zsFeatureIcon">{feature.icon}</span><span className="zsTag">{feature.tag}</span><h2>{feature.title}</h2><p>{feature.text}</p><strong>Open →</strong></a>)}</section>
    <section className="zsStrip"><div><b>For staff</b><span>Full CPD academy, studio, classroom strategies, escape rooms and subject implementation.</span></div><div><b>For pupils</b><span>Check-ins, Zone Quest, calm-space activities, grounding, movement and return-to-learning support.</span></div><div><b>For leaders</b><span>Implementation audits, school operations, impact evidence, rollout planning and intervention review.</span></div></section>
  </main>;
}
