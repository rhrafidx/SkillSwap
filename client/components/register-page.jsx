'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthShell from './auth-shell';
import { registerUser } from '../lib/api';

const initialState = { email: '', password: '' };

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: 'info', text: 'Create an account and start exploring premium skills.' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await registerUser(form);
      setStatus({ type: 'success', text: `Account ready${result?.user?.name ? ` for ${result.user.name}` : ''}.` });
      setForm(initialState);
      router.push('/dashboard');
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Join SkillSwap" subtitle="Create your account in a few seconds and start connecting with teachers and learners." highlight="Fast onboarding with the same API as the server">
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="input-label">Email</label>
        <input className="input" placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <label className="input-label">Password</label>
        <input className="input" type="password" placeholder="Choose a secure password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
        <p className="small">Already have an account? <a href="/login">Sign in</a></p>
        {status.text ? <div className={`status ${status.type === 'error' ? 'error' : ''}`}>{status.text}</div> : null}
      </form>
    </AuthShell>
  );
}
