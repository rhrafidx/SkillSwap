'use client';

import SiteShell from './site-shell';

export default function AboutPage() {
  return (
    <SiteShell title="About SkillSwap" subtitle="A human-first marketplace for sharing expertise without friction." activePath="/about">
      <div className="grid grid-2">
        <div className="panel">
          <h2>Our mission</h2>
          <p className="small">SkillSwap turns passive expertise into shared momentum. The platform helps people exchange lessons and grow together through the power of practical knowledge.</p>
        </div>
        <div className="panel">
          <h2>Why it feels premium</h2>
          <p className="small">The experience balances real API connectivity with thoughtful visuals, smooth motions, and easily navigable workflows that feel complete from first visit.</p>
        </div>
      </div>
    </SiteShell>
  );
}
