'use client';

import { useEffect, useState } from 'react';
import SiteShell from './site-shell';
import { fetchSkills } from '../lib/api';

function normalizeSkills(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.skills) return payload.skills;
  return [];
}

export default function DashboardPage() {
  const [skills, setSkills] = useState([]);
  const [status, setStatus] = useState('Loading live marketplace data…');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const payload = await fetchSkills();
        setSkills(normalizeSkills(payload));
        setStatus('Connected to the SkillSwap API.');
      } catch (error) {
        setSkills([]);
        setStatus(error.message || 'Unable to fetch live marketplace data.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <SiteShell title="Your dashboard" subtitle="A premium control center that mirrors your live marketplace activity." activePath="/dashboard">
      <div className="stat-grid">
        <div className="card">
          <p className="small">Live listings</p>
          <strong>{skills.length}</strong>
        </div>
        <div className="card">
          <p className="small">Current focus</p>
          <strong>Mentor-led growth</strong>
        </div>
        <div className="card">
          <p className="small">Server status</p>
          <strong>Connected</strong>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '1rem' }}>
        <div className="panel">
          <h2>Today’s momentum</h2>
          <ul className="list">
            <li className="list-item">A new skill request just landed in your inbox.</li>
            <li className="list-item">Your profile is ready for deeper discovery by the community.</li>
            <li className="list-item">The marketplace now reads from the server’s skill catalog.</li>
          </ul>
        </div>
        <div className="panel">
          <h2>Featured in the feed</h2>
          {skills.length > 0 ? (
            skills.slice(0, 3).map((skill) => (
              <div key={skill.id || skill.title} className="list-item">
                <strong>{skill.title}</strong>
                <p className="small">{skill.description}</p>
              </div>
            ))
          ) : (
            <div className="list-item">
              <p className="small">{loading ? 'Loading live feed…' : 'No live feed available. Log in and ensure the backend is running.'}</p>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
