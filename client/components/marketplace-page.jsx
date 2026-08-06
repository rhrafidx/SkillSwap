'use client';

import { useEffect, useState } from 'react';
import SiteShell from './site-shell';
import { fetchSkills } from '../lib/api';

function normalizeSkills(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.skills) return payload.skills;
  return [];
}

export default function MarketplacePage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Loading the marketplace from the server…');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const payload = await fetchSkills();
        if (!cancelled) {
          setSkills(normalizeSkills(payload));
          setStatus('Marketplace refreshed from the live SkillSwap API.');
        }
      } catch (error) {
        if (!cancelled) {
          setSkills([]);
          setStatus(error.message || 'Unable to load marketplace listings.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteShell title="Skill marketplace" subtitle="Browse premium skill swaps that are loaded from the server when available." activePath="/marketplace">
      <div className="panel">
        <div className="section-title">
          <h2>Live catalog</h2>
          <span className="badge">{loading ? 'Loading…' : `${skills.length} listings`}</span>
        </div>
        <p className="small">{status}</p>
        <div className="grid grid-3">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <article key={skill.id || skill.title} className="card">
                <span className="skill-tag">{skill.category || 'Skill'}</span>
                <h3>{skill.title}</h3>
                <p>{skill.description || 'A polished skill swap listing from the live API.'}</p>
                <p className="small">Offered by {skill.owner?.name || skill.owner || 'SkillSwap community'}</p>
                <a href={`/skill-details?id=${skill.id}`} className="button button-secondary">View details</a>
              </article>
            ))
          ) : (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <h3>No active skill listings</h3>
              <p className="small">Connect to the SkillSwap backend to browse the latest marketplace content.</p>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
