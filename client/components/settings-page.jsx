'use client';

import SiteShell from './site-shell';

export default function SettingsPage() {
  return (
    <SiteShell title="Settings" subtitle="Tune your account preferences and privacy controls for a more focused experience." activePath="/settings">
      <div className="panel">
        <div className="grid grid-2">
          <div>
            <h2>Notifications</h2>
            <p className="small">Choose when you want to receive swap requests, direct messages, and platform updates.</p>
          </div>
          <div>
            <h2>Privacy</h2>
            <p className="small">Keep your profile visible to the community or limit discovery for a more curated experience.</p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
