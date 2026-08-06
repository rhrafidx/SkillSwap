'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SiteShell from './site-shell';
import { fetchSkillById } from '../lib/api';

function SkillDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [skill, setSkill] = useState(null);

  const [status, setStatus] = useState('Loading skill details from the server…');

  useEffect(() => {
    async function load() {
      if (!id) {
        setStatus('No skill selected. Use the marketplace to choose a listing.');
        setSkill(null);
        return;
      }
      try {
        const payload = await fetchSkillById(id);
        setSkill(payload?.skill || payload);
        setStatus('Loaded skill details from the SkillSwap API.');
      } catch (error) {
        setSkill(null);
        setStatus(error.message || 'Unable to load this skill listing.');
      }
    }
    load();
  }, [id]);

  const activeSkill = skill;

  return (
    <SiteShell title="Skill details" subtitle="See the story behind a listing and the person who offers it." activePath="/skill-details">
      <div className="panel">
        <h2>{activeSkill?.title || 'No listing loaded'}</h2>
        <p className="small">{activeSkill?.description || status}</p>
        {activeSkill ? (
          <>
            <p><strong>Category:</strong> {activeSkill.category || 'Community skill'}</p>
            <p><strong>Owner:</strong> {activeSkill.owner?.name || activeSkill.owner || 'SkillSwap teammate'}</p>
            <a href="/contact" className="button button-primary">Request a session</a>
          </>
        ) : null}
      </div>
    </SiteShell>
  );
}

export default function SkillDetailsPage() {
  return (
    <Suspense fallback={<SiteShell title="Skill details" subtitle="Loading the selected listing…" activePath="/skill-details"><div className="panel">Loading details…</div></SiteShell>}>
      <SkillDetailsContent />
    </Suspense>
  );
}
