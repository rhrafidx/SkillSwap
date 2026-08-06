'use client';

import SiteShell from './site-shell';

const threads = [
  { name: 'Aisha K.', topic: 'UI/UX feedback exchange', preview: 'I can share a polished critique if you open a short session.' },
  { name: 'Noah P.', topic: 'DevOps sprint swap', preview: 'Your deployment checklist looks excellent—want to compare notes?' },
];

export default function ChatPage() {
  return (
    <SiteShell title="Messages" subtitle="Keep your conversations flowing with the people behind each skill swap." activePath="/chat">
      <div className="panel">
        {threads.map((thread) => (
          <div key={thread.name} className="list-item">
            <strong>{thread.name}</strong>
            <p className="small">{thread.topic}</p>
            <p>{thread.preview}</p>
          </div>
        ))}
      </div>
    </SiteShell>
  );
}
