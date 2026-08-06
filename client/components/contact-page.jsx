'use client';

import { useState } from 'react';
import SiteShell from './site-shell';
import { submitContact } from '../lib/api';

const initialState = { name: '', email: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: 'info', text: 'Tell us what you want to build together.' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
      setStatus({ type: 'success', text: 'Thanks — your message has been received by the team.' });
      setForm(initialState);
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Contact form failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell title="Contact us" subtitle="The team is ready to help you connect the frontend to the server seamlessly." activePath="/contact">
      <div className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <input className="input" placeholder="Your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input className="input" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <textarea className="textarea" placeholder="What would you like to build?" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send inquiry'}</button>
          {status.text ? <div className={`status ${status.type === 'error' ? 'error' : ''}`}>{status.text}</div> : null}
        </form>
      </div>
    </SiteShell>
  );
}
