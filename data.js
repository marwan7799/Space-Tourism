(function () {
  "use strict";

  const IMG = "./files/";

  const DESTINATIONS = [
    {
      id: "moon",
      name: "Moon",
      image: IMG + "image-moon.png",
      description:
        "See our planet as you’ve never seen it before. A perfect relaxing trip away to help regain perspective and come back refreshed. While you’re there, take in some history by visiting the Luna 2 and Apollo 11 landing sites.",
      distance: "384,400 km",
      travel: "3 days",
    },
    {
      id: "mars",
      name: "Mars",
      image: IMG + "image-mars.png",
      description:
        "Don’t forget to pack your hiking boots. You’ll need them to tackle Olympus Mons, the tallest planetary mountain in our solar system. It’s two and a half times the size of Everest!",
      distance: "225 mil. km",
      travel: "9 months",
    },
    {
      id: "europa",
      name: "Europa",
      image: IMG + "image-europa.png",
      description:
        "The smallest of the four Galilean moons orbiting Jupiter, Europa is a winter lover’s dream. With an icy surface, it’s perfect for a bit of ice skating, curling, hockey, or simple relaxation in your snug wintery cabin.",
      distance: "628 mil. km",
      travel: "3 years",
    },
    {
      id: "titan",
      name: "Titan",
      image: IMG + "image-titan.png",
      description:
        "The only moon known to have a dense atmosphere other than Earth, Titan is a home away from home (just a few hundred degrees colder!). As a bonus, you get striking views of the Rings of Saturn.",
      distance: "1.6 bil. km",
      travel: "7 years",
    },
  ];

  const CREW = [
    {
      name: "Douglas Hurley",
      role: "Commander",
      image: IMG + "image-douglas-hurley.png",
      bio: "Douglas Gerald Hurley is an American engineer, former Marine Corps pilot and former NASA astronaut. He launched into space for the third time as commander of Crew Dragon Demo-2.",
    },
    {
      name: "Anousheh Ansari",
      role: "Flight Engineer",
      image: IMG + "image-anousheh-ansari.png",
      bio: "Anousheh Ansari is an Iranian American engineer and co-founder of Prodea Systems. Ansari was the fourth self-funded space tourist, the first self-funded woman to fly to the ISS, and the first Iranian in space.",
    },
    {
      name: "Mark Shuttleworth",
      role: "Mission Specialist",
      image: IMG + "image-mark-shuttleworth.png",
      bio: "Mark Richard Shuttleworth is the founder and CEO of Canonical, the company behind the Linux-based Ubuntu operating system. Shuttleworth became the first South African to travel to space as a space tourist.",
    },
    {
      name: "Victor Glover",
      role: "Pilot",
      image: IMG + "image-victor-glover.png",
      bio: "Pilot on the first operational flight of the SpaceX Crew Dragon to the International Space Station. Glover is a commander in the U.S. Navy where he pilots an F/A-18. He was a crew member of Expedition 64, and served as a station systems flight engineer.",
    },
  ];

  const TECHNOLOGY = [
    {
      name: "Launch vehicle",
      portrait: IMG + "image-launch-vehicle-portrait.jpg",
      landscape: IMG + "image-launch-vehicle-landscape.jpg",
      description:
        "A launch vehicle or carrier rocket is a rocket-propelled vehicle used to carry a payload from Earth's surface to space, usually to Earth orbit or beyond. Our WEB-X carrier rocket is the most powerful in operation. Standing 150 metres tall, it's quite an awe-inspiring sight on the launch pad!",
    },
    {
      name: "Spaceport",
      portrait: IMG + "image-spaceport-portrait.jpg",
      landscape: IMG + "image-spaceport-landscape.jpg",
      description:
        "A spaceport or cosmodrome is a site for launching (or receiving) spacecraft, by analogy to the seaport for ships or airport for aircraft. Based in the famous Cape Canaveral, our spaceport is ideally situated to take advantage of the Earth’s rotation for launch.",
    },
    {
      name: "Space capsule",
      portrait: IMG + "image-space-capsule-portrait.jpg",
      landscape: IMG + "image-space-capsule-landscape.jpg",
      description:
        "A space capsule is an often-crewed spacecraft that uses a blunt-body reentry capsule to reenter the Earth's atmosphere without wings. Our capsule is where you'll spend your time during the flight. It includes a space gym, cinema, and plenty of other activities to keep you entertained.",
    },
  ];

  // Placeholder content — swap for your real roadmap.
  const COMING_SOON = [
    {
      id: "helios",
      kind: "Orbital stay",
      title: "Helios Station",
      opens: "2027-03-01T09:00:00Z",
      text: "A week in low Earth orbit with a panoramic observation deck, sixteen sunrises a day and zero-gravity dining.",
    },
    {
      id: "shackleton",
      kind: "Lunar surface",
      title: "Shackleton Base",
      opens: "2027-09-01T09:00:00Z",
      text: "Overnight stays at the Moon’s south pole, in a pressurised habitat with a view of the permanently shadowed craters.",
    },
    {
      id: "ganymede",
      kind: "Deep space",
      title: "Ganymede Expedition",
      opens: "2028-06-01T09:00:00Z",
      text: "The largest moon in the solar system. A long-haul cruise for travellers who want to be first to the Jupiter system.",
    },
  ];

  /* ---------------------------------------------------------------
     Ships + entry requirements.
     THESE NUMBERS ARE PLACEHOLDERS — set your own. Each destination
     has its own ship, and longer trips are stricter (more life
     support, smaller cabins). Ranges are inclusive: [min, max].
  ---------------------------------------------------------------- */
  const SHIPS = {
    moon: {
      name: "Luna Hopper",
      blurb: "A compact three-day capsule with big windows and a short, gentle flight profile.",
      limits: { age: [18, 75], height: [150, 195], weight: [45, 110] },
    },
    mars: {
      name: "Ares Cruiser",
      blurb: "A nine-month transfer ship with private cabins, a small gym and a greenhouse deck.",
      limits: { age: [21, 65], height: [150, 190], weight: [45, 100] },
    },
    europa: {
      name: "Galileo Voyager",
      blurb: "A three-year cruiser built for the Jupiter system, with radiation-shielded sleeping pods.",
      limits: { age: [21, 60], height: [150, 190], weight: [45, 95] },
    },
    titan: {
      name: "Cassini Ark",
      blurb: "Our long-haul ship: seven years each way, so cabin space and life support are tightly budgeted.",
      limits: { age: [25, 55], height: [155, 185], weight: [50, 90] },
    },
  };

  // "hard" = sanity range for typos (not an eligibility rule).
  const FIELDS = [
    { key: "age", label: "Age", unit: "years", hard: [1, 120] },
    { key: "height", label: "Height", unit: "cm", hard: [50, 250] },
    { key: "weight", label: "Weight", unit: "kg", hard: [15, 350] },
  ];

  /**
   * Compare a traveller's numbers with the ship for a destination.
   * Returns { ok, invalid, checks[] }.
   *  - invalid: something isn't a usable number (a typo, not a rejection)
   *  - ok:      every value is inside the ship's limits
   */
  function checkEligibility(destId, input) {
    const ship = SHIPS[destId];
    if (!ship) throw new Error("Unknown destination: " + destId);

    const checks = FIELDS.map((f) => {
      const raw = input[f.key];
      const text = String(raw === undefined || raw === null ? "" : raw).trim();
      const value = text === "" ? NaN : Number(text);
      const [min, max] = ship.limits[f.key];
      const c = { key: f.key, label: f.label, unit: f.unit, value, min, max, invalid: false, pass: false, message: "" };

      if (!Number.isFinite(value)) {
        c.invalid = true;
        c.message = "Enter a number.";
      } else if (value < f.hard[0] || value > f.hard[1]) {
        c.invalid = true;
        c.message = "Enter a realistic value (" + f.hard[0] + "–" + f.hard[1] + " " + f.unit + ").";
      } else if (value < min) {
        c.message = "Below the minimum of " + min + " " + f.unit + ".";
      } else if (value > max) {
        c.message = "Above the maximum of " + max + " " + f.unit + ".";
      } else {
        c.pass = true;
        c.message = "Within the " + min + "–" + max + " " + f.unit + " range.";
      }
      return c;
    });

    return {
      ok: checks.every((c) => c.pass),
      invalid: checks.some((c) => c.invalid),
      checks,
    };
  }

  const api = { DESTINATIONS, CREW, TECHNOLOGY, COMING_SOON, SHIPS, FIELDS, checkEligibility };

  if (typeof window !== "undefined") window.SPACE_DATA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
