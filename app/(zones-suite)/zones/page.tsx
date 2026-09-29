const features = [
  { href: "/regulation-room", icon: "◇", title: "Virtual Regulation Room", tag: "FREE", text: "The full interactive regulation space: room environments, calm coach, breathing, grounding, focus, movement, sensory controls and return-to-learning planning." },
  { href: "/zones-cpd", icon: "▣", title: "Zones CPD Academy", tag: "CPD", text: "Dedicated Zones professional development with facilitator-style learning, classroom application, subject examples and implementation reflection." },
  { href: "/zones-cpd/escape-room", icon: "⌁", title: "CPD Escape Room", tag: "PLUS", text: "Immersive staff scenarios, evidence clues, team roles, decision points, case rooms and a custom escape-room builder." },
  { href: "/zone-quest", icon: "◆", title: "Zone Quest", tag: "PLUS", text: "A fast interactive game for practising zone recognition, context, adult responses and regulation strategy choices." },
  { href: "/?zone=students", icon: "◉", title: "Student Check-ins", tag: "PRO", text: "Record regulation snapshots and context while keeping zone language non-judgemental." },
  { href: "/?zone=interventions", icon: "✓", title: "Intervention Plans", tag: "PLUS", text: "Create concise regulation support plans, choose strategies and review whether they are helping." },
];

export default function ZonesOverviewPage() {
  return <main className="zsPage">
    <section className="zsHero">
      <div><span className="zsEyebrow">FULL ZONES SUITE</span><h1>The original regulation toolkit is back inside Staff Development.</h1><p>This area restores the dedicated Zones experience rather than reducing it to a few cards. The tools use the same Staff Development sign-in, so there is no second account or old password gate.</p><div className="zsHeroActions"><a className="zsPrimary" href="/regulation-room">Enter Regulation Room</a><a className="zsSecondary" href="/zones-cpd">Open Zones CPD</a></div></div>
      <div className="zsZoneWheel" aria-label="Four regulation zones"><span className="blue">Blue</span><span className="green">Green</span><span className="yellow">Yellow</span><span className="red">Red</span><b>Every zone<br/>is valid</b></div>
    </section>
    <section className="zsPrinciple"><strong>Key principle</strong><p>Zones describe a regulation state, not a child. The goal is to notice needs, choose helpful support and build a dignified route back to learning—not to force everybody into Green.</p></section>
    <section className="zsFeatureGrid">{features.map(feature => <a className="zsFeatureCard" href={feature.href} key={feature.title}><span className="zsFeatureIcon">{feature.icon}</span><span className="zsTag">{feature.tag}</span><h2>{feature.title}</h2><p>{feature.text}</p><strong>Open →</strong></a>)}</section>
    <section className="zsStrip"><div><b>For staff</b><span>CPD, classroom strategies, escape rooms, implementation and intervention planning.</span></div><div><b>For pupils</b><span>Check-ins, calm-space activities, grounding, movement and return-to-learning support.</span></div><div><b>For leaders</b><span>Consistent language, implementation prompts and whole-school review.</span></div></section>
  </main>;
}
