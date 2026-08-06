'use client';

import SiteShell from './site-shell';

const items = [
  { title: 'New swap request', detail: 'Aisha wants to exchange UI review sessions for a React workshop.' },
  { title: 'Marketplace update', detail: 'Three new listings were added to the SkillSwap API catalog.' },
  { title: 'Message reminder', detail: 'You have a pending thread with Daniel about your upcoming session.' },
];

export default function NotificationsPage() {
  return (
    <SiteShell title="Notifications" subtitle="Stay on top of community requests and the latest marketplace activity." activePath="/notifications">
      <div className="panel">
        {items.map((item) => (
          <div key={item.title} className="list-item">
            <strong>{item.title}</strong>
            <p className="small">{item.detail}</p>
          </div>
        ))}
      </div>
    </SiteShell>
  );
}
