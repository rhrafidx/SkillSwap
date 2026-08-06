// Quick end-to-end smoke test. Starts the app and exercises every endpoint.
// Not part of the app — used to verify the API works. Run: node test-e2e.js
const app = require('./src/app');
const prisma = require('./src/config/prisma');

const PORT = 4555;
const base = `http://localhost:${PORT}/api`;
let pass = 0, fail = 0;

async function call(method, path, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function check(name, cond) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.log(`  ❌ ${name}`); }
}

async function run() {
  const server = app.listen(PORT);
  const tag = Date.now();
  try {
    let r = await call('GET', '/health');
    check('health returns ok', r.status === 200 && r.data.status === 'ok');

    // Register two users
    const alice = (await call('POST', '/auth/register', { body: { name: 'Alice', email: `alice${tag}@t.com`, password: 'secret123' } }));
    check('register alice -> 201 + token', alice.status === 201 && !!alice.data.token);
    const bob = (await call('POST', '/auth/register', { body: { name: 'Bob', email: `bob${tag}@t.com`, password: 'secret123' } }));
    check('register bob -> 201', bob.status === 201);

    const aliceToken = alice.data.token, bobToken = bob.data.token;
    const bobId = bob.data.user.id;

    // Duplicate email rejected
    const dup = await call('POST', '/auth/register', { body: { name: 'Alice2', email: `alice${tag}@t.com`, password: 'secret123' } });
    check('duplicate email -> 409', dup.status === 409);

    // Login
    const login = await call('POST', '/auth/login', { body: { email: `alice${tag}@t.com`, password: 'secret123' } });
    check('login -> 200 + token', login.status === 200 && !!login.data.token);
    const badLogin = await call('POST', '/auth/login', { body: { email: `alice${tag}@t.com`, password: 'wrong' } });
    check('wrong password -> 401', badLogin.status === 401);

    // me (protected)
    const me = await call('GET', '/auth/me', { token: aliceToken });
    check('me with token -> 200', me.status === 200 && me.data.user.name === 'Alice');
    const noAuth = await call('GET', '/auth/me');
    check('me without token -> 401', noAuth.status === 401);

    // Bob creates a skill
    const skill = await call('POST', '/skills', { token: bobToken, body: { title: 'Guitar Lessons', category: 'music', description: 'Learn chords fast.' } });
    check('create skill -> 201', skill.status === 201 && !!skill.data.skill.id);
    const skillId = skill.data.skill.id;

    // List + search skills (public)
    const list = await call('GET', '/skills');
    check('list skills -> 200 with items', list.status === 200 && list.data.skills.length >= 1);
    const search = await call('GET', '/skills?q=guitar');
    check('search q=guitar finds it', search.data.skills.some(s => s.id === skillId));

    // Alice requests an exchange for Bob's skill
    const ex = await call('POST', '/exchanges', { token: aliceToken, body: { skillId, offerSkill: 'Cooking', message: 'Trade?' } });
    check('create exchange -> 201', ex.status === 201 && ex.data.exchange.status === 'pending');
    // Bob cannot request his own skill
    const ownEx = await call('POST', '/exchanges', { token: bobToken, body: { skillId, offerSkill: 'X' } });
    check('own-skill exchange -> 400', ownEx.status === 400);

    // Bob sees received, accepts it
    const received = await call('GET', '/exchanges/received', { token: bobToken });
    check('bob received list has 1', received.data.exchanges.length === 1);
    const accept = await call('PATCH', `/exchanges/${ex.data.exchange.id}/status`, { token: bobToken, body: { status: 'accepted' } });
    check('accept exchange -> accepted', accept.data.exchange.status === 'accepted');
    // Alice (not owner) cannot change status
    const forbidden = await call('PATCH', `/exchanges/${ex.data.exchange.id}/status`, { token: aliceToken, body: { status: 'declined' } });
    check('non-owner status change -> 403', forbidden.status === 403);

    // Messaging
    const msg = await call('POST', '/messages', { token: aliceToken, body: { receiverId: bobId, body: 'Hi Bob!' } });
    check('send message -> 201', msg.status === 201);
    const thread = await call('GET', `/messages/${bobId}`, { token: aliceToken });
    check('thread has message', thread.data.messages.length === 1 && thread.data.messages[0].body === 'Hi Bob!');
    const convos = await call('GET', '/messages', { token: aliceToken });
    check('conversation list has 1', convos.data.conversations.length === 1);

    // Contact (public)
    const contact = await call('POST', '/contact', { body: { name: 'Carol', email: 'c@t.com', subject: 'Hello', message: 'Great site!' } });
    check('contact -> 201', contact.status === 201);
    const badContact = await call('POST', '/contact', { body: { name: 'Carol' } });
    check('contact missing fields -> 400', badContact.status === 400);

    // Unknown route
    const nf = await call('GET', '/nope');
    check('unknown route -> 404', nf.status === 404);

  } catch (e) {
    console.error('Test crashed:', e);
    fail++;
  } finally {
    server.close();
    await prisma.$disconnect();
    console.log(`\n  RESULT: ${pass} passed, ${fail} failed`);
    process.exit(fail === 0 ? 0 : 1);
  }
}

run();
