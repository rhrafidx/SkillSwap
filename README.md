# SkillSwap

A peer-to-peer marketplace where people trade skills instead of money — teach what you know, learn what you don't.

This repo is currently a **front-end design prototype**: static HTML/CSS/JS with simulated interactions (fake API delays, mock data). No backend is connected yet.

---

## Tech stack

- Plain **HTML5**
- Plain **CSS3** (custom properties / design tokens, no framework, no preprocessor)
- Vanilla **JavaScript** (no build step, no dependencies)
- Google Fonts (Poppins)

No npm, no bundler — just open the files in a browser.

---

## Project structure

```
skillswap/
├── index.html            Homepage / marketing landing page
├── about.html             About / mission / team
├── contact.html            Contact form + FAQ
├── login.html               Log in
├── register.html            Sign up
├── marketplace.html         Browse & filter skills
├── skill-details.html        Single skill listing + request-exchange modal
├── dashboard.html           Logged-in home (stats, activity, recommendations)
├── chat.html                Messaging / conversations
├── notifications.html        Notification center
├── profile.html               User profile
├── settings.html             Account settings (incl. delete account modal)
├── style.css                 All styles (design tokens + components)
└── script.js                 All interactivity (shared across pages)
```

Pages fall into two layouts:
- **Public / marketing pages** (`index`, `about`, `contact`, `login`, `register`) — top navbar + footer.
- **Logged-in app pages** (`dashboard`, `marketplace`, `chat`, `profile`, `settings`, `notifications`, `skill-details`) — left sidebar shell.

`style.css` and `script.js` are shared by every page — there is only one of each for the whole site.

---

## Running it locally

This is a static site, so any local server works. From the project folder:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000/index.html`.

> ⚠️ **Known issue:** every page currently links to `../assets/css/style.css` and `../assets/js/script.js`, which assumes an `assets/css/` and `assets/js/` folder one level up from the HTML files. As uploaded, `style.css` and `script.js` sit flat alongside the HTML. Either:
> - move `style.css` → `assets/css/style.css` and `script.js` → `assets/js/script.js`, with the HTML files one level up, **or**
> - update the `<link>`/`<script>` paths in every HTML file to `style.css` / `script.js`.
>
> Nothing will render styled/interactive until this is fixed.

---

## Design system

Defined at the top of `style.css` as CSS custom properties:

- **Brand gradient**: blue → violet → lilac (`--primary`, `--secondary`, `--accent`)
- **Light/dark theme**: toggled via `[data-theme="dark"]` on `<html>`, persisted with the theme toggle button (`#themeToggle`) present on every page
- **Radii, shadows, spacing, transitions**: all tokenized (`--radius-sm/md/lg/pill`, `--shadow-sm/md/lg`, `--transition`)
- **Font**: Poppins, loaded via Google Fonts

Responsive breakpoints: 640 / 760 / 860 / 960 / 1024px, plus a `prefers-reduced-motion` query for accessibility.

---

## Known issues / open items

These were flagged during review and intentionally left for after the design phase:

| # | Issue | Where |
|---|---|---|
| 1 | Asset paths (`../assets/...`) don't match the flat file structure | all pages |
| 2 | Homepage hero search passes `?q=` / `?category=` to the marketplace, but the marketplace page never reads those query params to pre-filter results | `index.html` → `marketplace.html` |
| 3 | Top nav is inconsistent between pages — `index.html` lists "Dashboard" as a plain link mid-list; `about.html`/`contact.html` move it to the end with a `nav-links__soon` ("coming soon") style | `index.html`, `about.html`, `contact.html` |
| 4 | Footer newsletter form submit handling differs slightly between pages (`preventDefault()+reset()` vs `return false`) | footer, various pages |

---

## Backend integration checklist (not started)

Everything below is currently mocked with `setTimeout()` and hardcoded HTML — flagged in `script.js` with comments at each relevant spot. To connect a real backend:

1. Fix the asset-path issue above first.
2. Design the API contract (e.g. `GET /api/skills`, `POST /api/exchanges`, `GET /api/messages/:id`, auth endpoints).
3. Build a shared `fetch` wrapper (base URL, auth headers, error handling).
4. Convert static/hardcoded sections to data-driven rendering — start with the marketplace grid or dashboard stats, since they're the most self-contained.
5. Add real authentication (token/session storage) and guard the logged-in pages (`dashboard`, `chat`, `profile`, `settings`, `notifications` currently have no login check).
6. Wire up forms (login, register, contact, settings) to real endpoints — these are the closest to done, since validation and loading/success/error states are already built.

---

## Notes

- All avatars/photos use `pravatar.cc` placeholder images — swap for real assets before launch.
- No automated tests exist yet (none were in scope for this design phase).
- No accessibility audit tool has been run beyond manual checks (alt text present on all images, `aria-label`/`aria-expanded` on interactive controls, reduced-motion support).
