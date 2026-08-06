'use client';

import Link from 'next/link';

export default function AuthShell({ title, subtitle, children, highlight }) {
  return (
    <main className="auth-shell">
      <div className="container auth-grid">
        <section className="panel auth-panel">
          <span className="badge">Live • Next.js</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <div className="auth-highlight">
            <strong>{highlight}</strong>
            <span>Server-connected profile, marketplace, and messaging flows.</span>
          </div>
        </section>
        <section className="panel auth-card">{children}</section>
      </div>
    </main>
  );
}
