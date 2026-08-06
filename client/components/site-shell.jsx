'use client';

import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/chat', label: 'Messages' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/profile', label: 'Profile' },
  { href: '/settings', label: 'Settings' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteShell({ title, subtitle, activePath, children }) {
  return (
    <main className="page-shell">
      <div className="container app-shell">
        <aside className="sidebar">
          <Link href="/" className="brand">
            <span className="brand-badge">↺</span>
            <span>SkillSwap</span>
          </Link>
          <nav className="sidebar-nav" aria-label="Primary navigation">
            {navItems.map((item) => {
              const isActive = activePath === item.href || (activePath.startsWith('/skill') && item.href === '/marketplace');
              return (
                <Link key={item.href} href={item.href} className={`sidebar-link${isActive ? ' active' : ''}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="sidebar-card">
            <p className="small">Connected to the live SkillSwap API</p>
            <Link href="/login" className="button button-secondary">Sign in</Link>
          </div>
        </aside>

        <section className="app-content">
          <header className="page-header">
            <div>
              <p className="eyebrow">Premium experience</p>
              <h1>{title}</h1>
              <p className="small">{subtitle}</p>
            </div>
            <Link href="/marketplace" className="button button-primary">Explore skills</Link>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
