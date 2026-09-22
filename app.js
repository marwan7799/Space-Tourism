(function () {
  "use strict";

  const D = window.SPACE_DATA;
  const page = document.body.dataset.page;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const raf = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : (fn) => setTimeout(fn, 16);

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Tiny safe DOM builder: h("p", {class:"x", text:"hi"}, child, …) */
  function h(tag, props = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v === false || v === null || v === undefined) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    kids.flat().forEach((c) => c !== null && c !== undefined && el.append(c));
    return el;
  }

  /* ---------------------------------------------------------------
     Storage (localStorage, but never crash if it is blocked)
  ---------------------------------------------------------------- */
  const KEYS = { users: "st_users", session: "st_session", booking: "st_booking", notify: "st_notify" };
  const memory = {};
  const store = {
    get(key, fallback = null) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return key in memory ? memory[key] : fallback;
      }
    },
    set(key, value) {
      memory[key] = value;
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* memory fallback */ }
    },
    remove(key) {
      delete memory[key];
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    },
  };

  /* ---------------------------------------------------------------
     Cross-page navigation: fade the body out, then actually leave.
     `leaving` stops us fading the page in if a guard is about to
     redirect it straight back out again.
  ---------------------------------------------------------------- */
  let leaving = false;

  function goTo(url) {
    if (leaving) return;
    leaving = true;
    if (reduceMotion) { location.href = url; return; }
    document.body.classList.remove("is-ready");
    setTimeout(() => { location.href = url; }, 260);
  }

  function redirect(url) {
    leaving = true;
    location.replace(url);
  }

  /** Any click on a link into another page of this site fades out first. */
  function interceptCrossPageLinks() {
    document.addEventListener("click", (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || !/\.html($|[?#])/.test(href)) return;
      e.preventDefault();
      goTo(href);
    });
  }

  /* ---------------------------------------------------------------
     Auth (simulated)
  ---------------------------------------------------------------- */
  function randomHex(bytes) {
    const a = new Uint8Array(bytes);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
    else for (let i = 0; i < bytes; i++) a[i] = Math.floor(Math.random() * 256);
    return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function hashPassword(salt, password) {
    const data = new TextEncoder().encode(salt + ":" + password);
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
    }
    // Very weak fallback for browsers without SubtleCrypto (demo only).
    let x = 5381;
    for (const b of data) x = ((x << 5) + x + b) >>> 0;
    return "weak-" + x.toString(16);
  }

  const getSession = () => store.get(KEYS.session);
  const normEmail = (e) => String(e).trim().toLowerCase();

  async function signUp({ name, email, password }) {
    const users = store.get(KEYS.users, []);
    const mail = normEmail(email);
    if (users.some((u) => u.email === mail)) {
      return { ok: false, field: "email", message: "An account with this email already exists. Sign in instead." };
    }
    const salt = randomHex(8);
    users.push({ name: name.trim(), email: mail, salt, hash: await hashPassword(salt, password) });
    store.set(KEYS.users, users);
    store.set(KEYS.session, { name: name.trim(), email: mail });
    return { ok: true };
  }

  async function signIn({ email, password }) {
    const mail = normEmail(email);
    const user = store.get(KEYS.users, []).find((u) => u.email === mail);
    const hash = user ? await hashPassword(user.salt, password) : null;
    if (!user || hash !== user.hash) {
      return { ok: false, field: "form", message: "The email or password is incorrect." };
    }
    store.set(KEYS.session, { name: user.name, email: user.email });
    return { ok: true };
  }

  function signOut() {
    store.remove(KEYS.session);
    store.remove(KEYS.booking);
    goTo("index.html");
  }

  /* ---------------------------------------------------------------
     Booking helpers
  ---------------------------------------------------------------- */
  const findDestination = (id) => D.DESTINATIONS.find((d) => d.id === id);

  function startBooking(destinationId) {
    store.set(KEYS.booking, { destination: destinationId, status: "pending" });
    goTo(getSession() ? "journey.html" : "signin.html");
  }

  /* ---------------------------------------------------------------
     Shared: header / nav
  ---------------------------------------------------------------- */
  function renderHeader() {
    const header = $("#site-header");
    if (!header) return;

    const onHome = page === "home";
    const base = onHome ? "" : "index.html";
    const links = [
      { n: "00", label: "Home", href: onHome ? "#home" : "index.html", key: "home" },
      { n: "01", label: "Destination", href: base + "#destination", key: "destination" },
      { n: "02", label: "Crew", href: base + "#crew", key: "crew" },
      { n: "03", label: "Technology", href: base + "#technology", key: "technology" },
    ];

    const nav = h("nav", { class: "nav", id: "nav", "aria-label": "Main" });
    links.forEach((l) => {
      const a = h("a", { class: "nav__link", href: l.href, "data-key": l.key }, h("b", { text: l.n }), h("span", { text: l.label }));
      if (onHome && l.key === "home") { a.classList.add("is-active"); a.setAttribute("aria-current", "page"); }
      nav.append(a);
    });

    const session = getSession();
    if (session) {
      nav.append(
        h("span", { class: "nav__user", text: "Hi, " + session.name.split(" ")[0] }),
        h("button", { class: "nav__auth", type: "button", text: "Sign out", onclick: signOut })
      );
    } else if (page !== "signin") {
      nav.append(h("a", { class: "nav__auth", href: "signin.html", text: "Sign in" }));
    }

    const toggle = h("button", {
      class: "nav-toggle", type: "button", "aria-controls": "nav", "aria-expanded": "false", "aria-label": "Open menu",
    }, h("span"), h("span"), h("span"));

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

    header.append(
      h("a", { class: "site-header__logo", href: "index.html", "aria-label": "Space Tourism — home" },
        h("img", { src: "./files/logo.svg", alt: "", width: "48", height: "48" })),
      h("span", { class: "site-header__line", "aria-hidden": "true" }),
      toggle,
      nav
    );
  }

  /** Mark one nav link as current (used by the home page's own view/scroll state). */
  function setActiveNavKey(key) {
    $$(".nav__link").forEach((a) => {
      const on = a.dataset.key === key;
      a.classList.toggle("is-active", on);
      on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
    });
  }

  /** Fade-out → update → fade-in for a group of elements (in-place content swap). */
  function createSwapper(targets) {
    let timer;
    return function run(update) {
      if (reduceMotion) return update();
      targets.forEach((t) => t.classList.add("is-swapping"));
      clearTimeout(timer);
      timer = setTimeout(() => {
        update();
        raf(() => targets.forEach((t) => t.classList.remove("is-swapping")));
      }, 300);
    };
  }

  const preload = (urls) => urls.forEach((u) => { const i = new Image(); i.src = u; });

  /* ---------------------------------------------------------------
     Page: home  (hero, crew, technology, coming soon, destination)
  ---------------------------------------------------------------- */
  function initHome() {
    /* ---- Crew ---- */
    const cPhoto = $("#crew-photo"), cRole = $("#crew-role"), cName = $("#crew-name"), cBio = $("#crew-bio");
    const cDots = $("#crew-dots");
    const cSwap = createSwapper([$("#crew-copy"), cPhoto]);
    let crewIndex = 0;

    const paintCrew = (i) => {
      const m = D.CREW[i];
      cRole.textContent = m.role;
      cName.textContent = m.name;
      cBio.textContent = m.bio;
      cPhoto.src = m.image;
      cPhoto.alt = m.name + ", " + m.role;
    };
    D.CREW.forEach((m, i) => {
      cDots.append(h("button", {
        class: "dot", type: "button", "aria-label": m.name + ", " + m.role,
        "aria-current": String(i === 0),
        onclick: () => {
          if (i === crewIndex) return;
          crewIndex = i;
          $$(".dot", cDots).forEach((d, j) => d.setAttribute("aria-current", String(j === i)));
          cSwap(() => paintCrew(i));
        },
      }));
    });
    paintCrew(0);

    /* ---- Technology ---- */
    const tNums = $("#tech-nums"), tName = $("#tech-name"), tDesc = $("#tech-desc");
    const tImg = $("#tech-img"), tSrc = $("#tech-src");
    const tSwap = createSwapper([$("#tech-copy"), tImg]);
    let techIndex = 0;

    const paintTech = (i) => {
      const t = D.TECHNOLOGY[i];
      tName.textContent = t.name;
      tDesc.textContent = t.description;
      tSrc.srcset = t.landscape;
      tImg.src = t.portrait;
      tImg.alt = t.name;
    };
    D.TECHNOLOGY.forEach((t, i) => {
      tNums.append(h("button", {
        class: "tech-num", type: "button", text: String(i + 1), "aria-label": t.name,
        "aria-pressed": String(i === 0),
        onclick: () => {
          if (i === techIndex) return;
          techIndex = i;
          $$(".tech-num", tNums).forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
          tSwap(() => paintTech(i));
        },
      }));
    });
    paintTech(0);

    preload(D.CREW.map((m) => m.image));
    preload(D.TECHNOLOGY.flatMap((t) => [t.portrait, t.landscape]));

    /* ---- Coming soon ---- */
    const grid = $("#soon-grid");
    const notify = new Set(store.get(KEYS.notify, []));
    const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    D.COMING_SOON.forEach((item) => {
      const btn = h("button", { class: "btn btn--ghost", type: "button" });
      const paint = () => {
        const on = notify.has(item.id);
        btn.textContent = on ? "You’ll be notified" : "Notify me";
        btn.setAttribute("aria-pressed", String(on));
      };
      btn.addEventListener("click", () => {
        notify.has(item.id) ? notify.delete(item.id) : notify.add(item.id);
        store.set(KEYS.notify, Array.from(notify));
        paint();
      });
      paint();
      grid.append(h("article", { class: "soon-card" },
        h("p", { class: "soon-card__kind", text: item.kind }),
        h("h3", { class: "soon-card__title", text: item.title }),
        h("p", { class: "soon-card__text", text: item.text }),
        h("p", { class: "soon-card__date", text: "Bookings open " + fmtDate(item.opens) }),
        btn
      ));
    });

    const first = D.COMING_SOON[0];
    const target = new Date(first.opens).getTime();
    const units = { d: $("[data-unit=days]"), h: $("[data-unit=hours]"), m: $("[data-unit=minutes]"), s: $("[data-unit=seconds]") };
    $("#countdown-caption").textContent = first.title + " · " + fmtDate(first.opens);
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      let left = Math.max(0, target - Date.now());
      const days = Math.floor(left / 864e5); left -= days * 864e5;
      const hrs = Math.floor(left / 36e5); left -= hrs * 36e5;
      const min = Math.floor(left / 6e4); left -= min * 6e4;
      const sec = Math.floor(left / 1e3);
      units.d.textContent = days; units.h.textContent = pad(hrs); units.m.textContent = pad(min); units.s.textContent = pad(sec);
    };
    tick();
    setInterval(tick, 1000);

    /* ---- Scroll-spy for the nav (only meaningful while the home view is showing) ---- */
    const sections = ["home", "destination", "crew", "technology", "coming-soon"].map((id) => document.getElementById(id));
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) setActiveNavKey(entry.target.id); });
      }, { rootMargin: "-45% 0px -45% 0px" });
      sections.forEach((s) => s && io.observe(s));
    }

    /* ---------------------------------------------------------------
       Destination — a normal section in the scroll now, same as
       Crew or Coming Soon. The tabs just swap the copy in place.
    ---------------------------------------------------------------- */
    const tabs = $("#planet-tabs");
    const pImg = $("#planet-img");
    const pSwap = createSwapper([pImg, $("#planet-body")]);
    let currentPlanet = null;

    const paintPlanet = (d) => {
      pImg.src = d.image;
      pImg.alt = d.name;
      $("#planet-name").textContent = d.name;
      $("#planet-desc").textContent = d.description;
      $("#planet-dist").textContent = d.distance;
      $("#planet-time").textContent = d.travel;
      $("#ship-note").textContent = "You’d fly on the " + D.SHIPS[d.id].name + ". A quick age, height and weight check comes after you sign in.";
    };
    const selectPlanet = (id, instant) => {
      const d = findDestination(id) || D.DESTINATIONS[0];
      if (d.id === currentPlanet && !instant) return;
      currentPlanet = d.id;
      $$("button", tabs).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.id === d.id)));
      instant ? paintPlanet(d) : pSwap(() => paintPlanet(d));
    };
    D.DESTINATIONS.forEach((d) => {
      tabs.append(h("button", {
        type: "button", "data-id": d.id, text: d.name, "aria-pressed": "false",
        onclick: () => { selectPlanet(d.id); history.replaceState(null, "", "#destination/" + d.id); },
      }));
    });
    $("#book-btn").addEventListener("click", () => startBooking(currentPlanet));
    preload(D.DESTINATIONS.map((d) => d.image));

    /* In-page links (nav items, "Explore", "Book a flight" footer link) —
       everything is one scroll now, so these all just scroll to a section.
       A link like "#destination/mars" also pre-selects that planet's tab. */
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const raw = a.getAttribute("href").slice(1);
      if (!raw) return;
      const [target, pid] = raw.split("/");
      if (!["home", "crew", "technology", "destination"].includes(target)) return;
      e.preventDefault();
      if (target === "destination" && pid) selectPlanet(pid);
      document.getElementById(target)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });

    /* Initial route, straight from the URL hash — no animation on first paint */
    const initHash = location.hash.slice(1);
    const [initTarget, initPid] = initHash.split("/");
    selectPlanet(initTarget === "destination" && initPid ? initPid : D.DESTINATIONS[0].id, true);
    if (initHash) document.getElementById(initTarget)?.scrollIntoView({ block: "start" });
  }

  /* ---------------------------------------------------------------
     Forms: shared helpers
  ---------------------------------------------------------------- */
  function setFieldError(input, message) {
    const err = document.getElementById(input.id + "-error");
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", input.id + "-error");
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
    if (err) err.textContent = message || "";
  }

  /* ---------------------------------------------------------------
     Page: sign in / create account
  ---------------------------------------------------------------- */
  function initSignin() {
    const booking = store.get(KEYS.booking);
    const pending = booking && booking.status === "pending" && findDestination(booking.destination);
    const nextUrl = pending ? "journey.html" : "index.html";

    if (getSession()) { redirect(nextUrl); return; }

    const form = $("#auth-form");
    const title = $("#auth-title");
    const submit = $("#auth-submit");
    const formError = $("#form-error");
    const context = $("#auth-context");
    const modeButtons = $$("[data-mode]");
    const signupOnly = $$("[data-only=signup]");
    let mode = new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "signin";

    if (pending) {
      context.hidden = false;
      context.textContent = "Sign in to continue booking your trip to " + findDestination(booking.destination).name + ".";
    }

    function setMode(next) {
      mode = next;
      title.textContent = mode === "signup" ? "Create your account" : "Sign in";
      submit.textContent = mode === "signup" ? "Create account" : "Sign in";
      modeButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
      signupOnly.forEach((el) => { el.hidden = mode !== "signup"; });
      form.elements.password.autocomplete = mode === "signup" ? "new-password" : "current-password";
      $$("input", form).forEach((i) => setFieldError(i, ""));
      formError.textContent = "";
    }
    modeButtons.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
    setMode(mode);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = form.elements;
      const nameInput = f.namedItem("name");
      $$("input", form).forEach((i) => setFieldError(i, ""));
      formError.textContent = "";

      const errors = [];
      if (mode === "signup" && nameInput.value.trim().length < 2) errors.push([nameInput, "Enter your full name."]);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) errors.push([f.email, "Enter a valid email address."]);
      if (mode === "signup" && f.password.value.length < 8) errors.push([f.password, "Use at least 8 characters."]);
      if (mode === "signin" && !f.password.value) errors.push([f.password, "Enter your password."]);
      if (mode === "signup" && f.confirm.value !== f.password.value) errors.push([f.confirm, "The passwords don’t match."]);

      if (errors.length) {
        errors.forEach(([input, msg]) => setFieldError(input, msg));
        errors[0][0].focus();
        return;
      }

      submit.disabled = true;
      const payload = { name: nameInput.value, email: f.email.value, password: f.password.value };
      const result = mode === "signup" ? await signUp(payload) : await signIn(payload);
      if (!result.ok) {
        submit.disabled = false;
        if (result.field === "email") { setFieldError(f.email, result.message); f.email.focus(); }
        else formError.textContent = result.message;
        return;
      }
      goTo(nextUrl);
    });
  }

  /* ---------------------------------------------------------------
     Page: journey  (eligibility check)
  ---------------------------------------------------------------- */
  function initJourney() {
    if (!getSession()) { redirect("signin.html"); return; }
    const booking = store.get(KEYS.booking);
    const dest = booking && findDestination(booking.destination);
    if (!dest) { redirect("index.html#destination"); return; }
    const ship = D.SHIPS[dest.id];

    /* Left: trip + ship summary */
    $("#trip-img").src = dest.image;
    $("#trip-img").alt = "";
    $("#trip-dest").textContent = dest.name;
    $("#trip-meta").textContent = dest.distance + " away, " + dest.travel + " each way";
    $("#trip-ship").textContent = ship.name;
    $("#trip-blurb").textContent = ship.blurb;
    const limits = $("#trip-limits");
    D.FIELDS.forEach((f) => {
      const [min, max] = ship.limits[f.key];
      limits.append(h("div", {}, h("dt", { text: f.label }), h("dd", { text: min + "–" + max + " " + f.unit })));
    });

    /* Right: form */
    const form = $("#journey-form");
    const results = $("#results");
    const submit = $("#journey-submit");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      results.replaceChildren();
      const input = {};
      D.FIELDS.forEach((f) => { input[f.key] = form.elements[f.key].value; });
      const res = D.checkEligibility(dest.id, input);

      // Typos / empty fields: point at the field, don't call it a rejection.
      D.FIELDS.forEach((f) => setFieldError(form.elements[f.key], ""));
      if (res.invalid) {
        let firstBad = null;
        res.checks.forEach((c) => {
          if (c.invalid) { const el = form.elements[c.key]; setFieldError(el, c.message); firstBad = firstBad || el; }
        });
        firstBad.focus();
        return;
      }

      const list = h("ul", { class: "checks" });
      res.checks.forEach((c) => {
        list.append(h("li", { class: c.pass ? "is-pass" : "is-fail" },
          h("span", { class: "checks__icon", "aria-hidden": "true", text: c.pass ? "✓" : "✕" }),
          h("span", {},
            h("strong", { text: c.label + ": " + c.value + " " + c.unit }),
            h("span", { class: "checks__msg", text: c.message }))));
      });

      if (res.ok) {
        const ref = "ST-" + randomHex(3).toUpperCase();
        store.set(KEYS.booking, {
          destination: dest.id, status: "approved", ref,
          details: { age: Number(input.age), height: Number(input.height), weight: Number(input.weight) },
        });
        submit.disabled = true;
        results.append(
          h("div", { class: "alert alert--ok", role: "status" },
            h("p", { class: "alert__title", text: "You meet every requirement for the " + ship.name + "." }),
            list,
            h("p", { text: "Taking you to your confirmation…" }),
            h("a", { class: "text-link", href: "done.html", text: "Go now" }))
        );
        setTimeout(() => { goTo("done.html"); }, 1600);
      } else {
        const alert = h("div", { class: "alert alert--error", role: "alert", tabindex: "-1" },
          h("p", { class: "alert__title", text: "You can’t continue with this flight." }),
          list,
          h("p", { text: "Requirements are set per ship. Another destination may have different limits." }),
          h("a", { class: "btn btn--ghost", href: "index.html#destination/" + dest.id, text: "Choose another destination" }));
        results.append(alert);
        alert.focus();
      }
    });
  }

  /* ---------------------------------------------------------------
     Page: done  (end of process)
  ---------------------------------------------------------------- */
  function initDone() {
    const session = getSession();
    const booking = store.get(KEYS.booking);
    const dest = booking && findDestination(booking.destination);
    if (!session) { redirect("signin.html"); return; }
    if (!dest || booking.status !== "approved") { redirect(dest ? "journey.html" : "index.html#destination"); return; }
    const ship = D.SHIPS[dest.id];

    $("#pass-dest").textContent = dest.name;
    $("#pass-name").textContent = session.name;
    $("#pass-ship").textContent = ship.name;
    $("#pass-dist").textContent = dest.distance;
    $("#pass-time").textContent = dest.travel;
    $("#pass-ref").textContent = booking.ref;

    $("#book-another").addEventListener("click", () => {
      store.remove(KEYS.booking);
      goTo("index.html#destination");
    });
  }

  /* ---------------------------------------------------------------
     Boot
  ---------------------------------------------------------------- */
  renderHeader();
  interceptCrossPageLinks();
  ({ home: initHome, signin: initSignin, journey: initJourney, done: initDone }[page] || function () {})();

  // Fade the page in — unless a guard above already sent us elsewhere.
  if (!leaving) raf(() => document.body.classList.add("is-ready"));
})();
