'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthShell from './auth-shell';
import { loginUser } from '../lib/api';

const initialState = { email: '', password: '' };

export default function LoginPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: 'info', text: 'Use your SkillSwap account to unlock the marketplace.' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await loginUser(form);
      setStatus({ type: 'success', text: `Welcome back${result?.user?.name ? `, ${result.user.name}` : ''}.` });
      setForm(initialState);
      router.push('/dashboard');
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to view your profile, swap requests, and upgraded marketplace dashboard." highlight="Secure sign-in with server-backed auth">
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="input-label">Email</label>
        <input className="input" placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <label className="input-label">Password</label>
        <input className="input" type="password" placeholder="Enter your password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="small">New here? <a href="/register">Create an account</a></p>
        {status.text ? <div className={`status ${status.type === 'error' ? 'error' : ''}`}>{status.text}</div> : null}
      </form>
    </AuthShell>
  );
}
