<div align="center">

# 🚀 Space Tourism

**Book your ticket off this planet.**

A cinematic, front-end space tourism site — pick a destination, meet your crew, learn the tech, and get cleared for launch.

[![Made with HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](#)
[![Made with CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](#)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat&logo=javascript&logoColor=black)](#)
[![No Build Step](https://img.shields.io/badge/Build%20Step-None-brightgreen)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

[**Live Demo →**](https://marwan7799.github.io/Space-Tourism/) · [Report a Bug](https://github.com/marwan7799/Space-Tourism/issues/new) · [Request a Feature](https://github.com/marwan7799/Space-Tourism/issues/new/choose)

</div>

---

### ✨ See it in action

![Space Tourism preview](./files/Screenshot/screenshot1.png)

---

## Why this exists

Most "space tourism" demos are a static hero image and a form. This one goes further: it's a small, self-contained **booking flow** with real client-side state, real (simulated) authentication, and eligibility rules per spacecraft — all with zero frameworks and zero build tools. Open the HTML file and it just works.

## 🌌 Features

- **🪐 Pick a destination** — Moon, Mars, Europa or Titan, each with its own distance, travel time and description, right in the scroll alongside the crew and tech sections.
- **👩‍🚀 Meet your crew** — commander, engineer, specialist and pilot, with a smooth crossfade between profiles.
- **🛰️ Space launch 101** — an interactive breakdown of the launch vehicle, spaceport and space capsule.
- **⏳ Live countdown** — a real-time countdown to the next booking window, with a "Notify me" toggle per upcoming mission.
- **🔐 Simulated accounts** — sign up / sign in with SHA-256–hashed passwords (via the Web Crypto API), stored in `localStorage`. No back end required to try it out.
- **🧬 Per-ship eligibility checks** — every destination has its own ship with its own age / height / weight limits. Fail a check and you're told exactly why, and given a graceful way to pick another destination.
- **🎟️ Boarding-pass confirmation** — a proper "you're cleared for launch" screen with a booking reference, once you pass the pre-flight check.
- **🎬 Two kinds of motion, done properly:**
  - In-page sections crossfade smoothly with no navigation.
  - Sign in → pre-flight check → confirmation are real pages (so no one can skip a step by editing the URL), each fading out on exit and in on arrival for a seamless feel.
- **♿ Accessible by default** — skip link, keyboard-navigable tabs, `aria-live` form errors, and full respect for `prefers-reduced-motion`.
- **📱 Fully responsive** — from a 4K desktop down to a small phone.

## 🧭 The booking flow

```
Pick a destination ──Book──▶ Sign in (skipped if already signed in)
                                   │
                                   ▼
                          Pre-flight check ──fails──▶ blocked, pick another destination
                                   │ passes
                                   ▼
                            🎉 Confirmation
```

## 🛠️ Built with

No frameworks. No bundler. No `node_modules`. Just the platform:

| | |
|---|---|
| **Structure** | Semantic HTML5 |
| **Style** | Hand-written CSS3 (custom properties, Grid, Flexbox) |
| **Behavior** | Vanilla JavaScript (ES6+), one script for every page |
| **Storage** | `localStorage`, with an in-memory fallback if it's blocked |
| **Auth** | Web Crypto API (`SubtleCrypto.digest`) for password hashing |
| **Fonts** | [Barlow, Barlow Condensed & Bellefair](https://fonts.google.com) via Google Fonts |

## 🚀 Getting started

No install, no dependencies, no build step.

```bash
git clone https://github.com/your-username/space-tourism.git
cd space-tourism
```

Then either:
- **Just open it** — double-click `index.html`, or
- **Serve it locally** (recommended, so relative paths behave exactly like production):
  ```bash
  npx serve .
  # or: python3 -m http.server
  ```

That's it. No `npm install`, no waiting.

## 📁 Project structure

```
space-tourism/
├─ index.html      # Home — hero, destinations, crew, tech, coming soon
├─ signin.html     # Sign in / create account
├─ journey.html    # Pre-flight check (age / height / weight vs. the ship)
├─ done.html       # Boarding-pass confirmation
├─ style.css       # All styling
├─ data.js         # All content + booking rules (edit this to reskin the site)
├─ app.js          # All behavior — one script, shared across every page
└─ files/          # Images (logo, backgrounds, destinations, crew, tech)
```

## 🎨 Making it your own

Everything content-related lives in **`data.js`** — destinations, crew bios, technology copy, upcoming missions, and each ship's entry requirements. Change the data, not the markup:

```js
const SHIPS = {
  moon: {
    name: "Luna Hopper",
    limits: { age: [18, 75], height: [150, 195], weight: [45, 110] },
  },
  // ...
};
```

Want a new destination? Add it to `DESTINATIONS` and give it a matching entry in `SHIPS` — the UI wires itself up automatically.

## ⚠️ A note on the demo auth

There's no server here on purpose — accounts and bookings live in the browser's `localStorage`, so this is a **front-end demo**, not production-ready auth. Anyone with dev tools can inspect or edit that data. Please don't reuse a real password when trying it out.

## 🗺️ Roadmap

- [ ] Real backend + database for accounts and bookings
- [ ] Payment flow (mock or Stripe test mode)
- [ ] Dark/light theme toggle
- [ ] i18n support
- [ ] E2E tests

Have an idea? [Open an issue](#) — contributions and suggestions are very welcome.

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-thing`)
3. Commit your changes (`git commit -m 'Add amazing thing'`)
4. Push to the branch (`git push origin feature/amazing-thing`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">

Built for anyone who's ever looked up and wondered what it would take to actually go.

⭐ **If you like it, star the repo** — it helps more than you'd think.

</div>
