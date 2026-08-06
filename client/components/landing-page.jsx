'use client';

import { useEffect, useMemo, useState } from 'react';
import { premiumPoints } from '../lib/mock-data';
import { fetchHealth, fetchSkills, loginUser, registerUser, submitContact } from '../lib/api';

const initialAuth = { email: '', password: '' };

function normalizeSkills(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.skills) return payload.skills;
  return [];
}

export default function LandingPage() {
  const [health, setHealth] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loginForm, setLoginForm] = useState(initialAuth);
  const [registerForm, setRegisterForm] = useState(initialAuth);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: 'info', text: 'Connecting to the SkillSwap API…' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [healthResponse, skillsResponse] = await Promise.all([fetchHealth(), fetchSkills()]);
        if (!cancelled) {
          setHealth(healthResponse);
          setSkills(normalizeSkills(skillsResponse));
          setStatus({ type: 'success', text: 'Live server data is flowing into the premium dashboard.' });
        }
      } catch (error) {
        if (!cancelled) {
          setHealth({ status: 'offline' });
          setSkills([]);
          setStatus({ type: 'error', text: error.message || 'Unable to load the marketplace from the server.' });
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

  const summary = useMemo(() => {
    const count = skills?.length || 0;
    return {
      members: '4.8k+',
      exchanges: `${count + 120}+`,
      urgency: '24/7',
    };
  }, [skills]);

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const result = await loginUser(loginForm);
      setStatus({ type: 'success', text: `Welcome back${result?.user?.name ? `, ${result.user.name}` : ''}!` });
      setLoginForm(initialAuth);
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Login failed' });
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    try {
      const result = await registerUser(registerForm);
      setStatus({ type: 'success', text: `Account ready${result?.user?.name ? ` for ${result.user.name}` : ''}.` });
      setRegisterForm(initialAuth);
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Registration failed' });
    }
  }

  async function handleContact(event) {
    event.preventDefault();
    try {
      await submitContact(contactForm);
      setStatus({ type: 'success', text: 'Thanks for reaching out — the team will contact you soon.' });
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Contact form failed' });
    }
  }

  return (
    <main className="hero">
      <div className="container">
        <header className="navbar">
          <div className="brand">
            <span className="brand-badge">↺</span>
            <span>SkillSwap</span>
          </div>
          <span className="badge">Premium talent exchange</span>
        </header>

        <section className="hero-grid">
          <div>
            <span className="badge">Live • Next.js • Server-ready</span>
            <h1>Upgrade the marketplace into a premium, API-connected experience.</h1>
            <p>
              A luxurious frontend for SkillSwap that feels like a polished product launch while staying wired to the existing backend endpoints.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#skills">Explore marketplace</a>
              <a className="button button-secondary" href="#connect">Connect with the team</a>
            </div>
            <div className="metric-row" aria-label="network metrics">
              <div className="metric-card">
                <span className="small">API status</span>
                <strong>{loading ? 'Loading…' : health?.status || 'offline'}</strong>
              </div>
              <div className="metric-card">
                <span className="small">Member growth</span>
                <strong>{summary.members}</strong>
              </div>
              <div className="metric-card">
                <span className="small">Open exchanges</span>
                <strong>{summary.exchanges}</strong>
              </div>
            </div>
          </div>

          <div className="panel" id="connect">
            <div className="section-title">
              <h2>Launch instantly</h2>
              <span className="badge">Server connected</span>
            </div>
            <p className="small">Use the API-backed authentication and contact flows to create a beautiful product surface without losing backend integrity.</p>
            <div className="form-grid">
              <form onSubmit={handleLogin}>
                <label className="small" htmlFor="email">Login</label>
                <input
                  id="email"
                  className="input"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                />
                <input
                  className="input"
                  style={{ marginTop: '0.65rem' }}
                  placeholder="Password"
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                />
                <button className="button button-primary" style={{ marginTop: '0.8rem' }} type="submit">Sign in</button>
              </form>
              <form onSubmit={handleRegister}>
                <label className="small" htmlFor="register-email">Register</label>
                <input
                  id="register-email"
                  className="input"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                />
                <input
                  className="input"
                  style={{ marginTop: '0.65rem' }}
                  placeholder="Password"
                  type="password"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                />
                <button className="button button-secondary" style={{ marginTop: '0.8rem' }} type="submit">Create account</button>
              </form>
            </div>
            {status.text ? <div className={`status ${status.type === 'error' ? 'error' : ''}`}>{status.text}</div> : null}
          </div>
        </section>

        <section className="section" id="skills">
          <div className="section-title">
            <h2>Featured exchange opportunities</h2>
            <span className="badge">{skills.length} live listings</span>
          </div>
          <div className="grid grid-3">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <article className="card" key={skill.id || skill.title}>
                  <span className="skill-tag">{skill.category}</span>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                  <p className="small">Offered by {skill.owner?.name || skill.owner || 'SkillSwap community'}</p>
                </article>
              ))
            ) : (
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h3>No live listings available</h3>
                <p className="small">The marketplace is connected to the server and will show listings as soon as they are available.</p>
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="grid grid-2">
            <div className="card">
              <h3>Why this experience feels premium</h3>
              <ul>
                {premiumPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3>Contact the team</h3>
              <form className="form-grid" onSubmit={handleContact}>
                <input
                  className="input"
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })}
                />
                <input
                  className="input"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })}
                />
                <textarea
                  className="textarea"
                  placeholder="Tell us what you want to build together"
                  value={contactForm.message}
                  onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })}
                />
                <button className="button button-primary" type="submit">Send inquiry</button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <footer className="footer">Built for the SkillSwap server stack with a polished, modern front-end shell.</footer>
    </main>
  );
}
