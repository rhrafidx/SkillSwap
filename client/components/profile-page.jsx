'use client';

import { useEffect, useState } from 'react';
import SiteShell from './site-shell';
import { getCurrentUser } from '../lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Fetching your profile from the live API…');

  useEffect(() => {
    async function load() {
      try {
        const result = await getCurrentUser();
        setUser(result.user || result);
        setStatus('Loaded your profile.');
      } catch (error) {
        setUser(null);
        setStatus(error.message || 'Please sign in to view your profile.');
      }
    }

    load();
  }, []);

  return (
    <SiteShell title="Your profile" subtitle="Present your skills, strengths, and community reputation in one refined place." activePath="/profile">
      <div className="grid grid-2">
        <div className="panel">
          <div className="profile-card">
            <div className="avatar">{user?.name?.slice(0, 2).toUpperCase() || 'SS'}</div>
            <div>
              <h2>{user?.name || 'Guest'}</h2>
              <p className="small">{user?.email || 'Sign in to see your account details.'}</p>
            </div>
          </div>
          <p className="small">{status}</p>
        </div>
        <div className="panel">
          <h2>Skills you offer</h2>
          {user ? (
            <div className="chip-row">
              <span className="skill-tag">{user.createdAt ? `Member since ${new Date(user.createdAt).getFullYear()}` : 'Member since signup'}</span>
              <span className="skill-tag">Server-authenticated</span>
              <span className="skill-tag">Premium profile</span>
            </div>
          ) : (
            <p className="small">Once you sign in, your SkillSwap account and skills will show here.</p>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
