/* WEBTOU — INTERACTIONS */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Current year
  const year = $("#currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Scroll reveal: gracefully show content if IntersectionObserver is unavailable.
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Mobile navigation
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  const closeMenu = () => {
    if (!menuToggle || !navLinks) return;
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const opening = !navLinks.classList.contains("open");
      menuToggle.classList.toggle("active", opening);
      navLinks.classList.toggle("open", opening);
      document.body.classList.toggle("menu-open", opening);
      menuToggle.setAttribute("aria-expanded", String(opening));
      menuToggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
    });
    $$("a", navLinks).forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
  }

  // Cursor glow on pointer devices only
  const cursorGlow = $(".cursor-glow");
  if (cursorGlow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener("pointermove", event => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.style.opacity = "1";
    }, { passive: true });
    document.addEventListener("pointerleave", () => { cursorGlow.style.opacity = "0"; });
  }

  // Studio terminal
  const terminalForm = $("#terminalForm");
  const terminalInput = $("#terminalInput");
  const terminalOutput = $("#terminalOutput");
  const commands = {
    help: "Available commands:\n\n  services  — What we do\n  work      — Selected work\n  process   — How projects move\n  team      — Meet the team\n  pricing   — Pricing approach\n  contact   — Start a conversation\n  clear     — Clear terminal",
    services: "Our active services:\n\n  Website development\n  Landing page development\n  Graphic design\n  Brand identity & logo design\n  WordPress development\n  Social media management\n\nSEO and custom admin dashboards are planned for a future phase.",
    work: "Featured work:\n\n  01  MAA KAMAKHYA TOUR & TRAVELS\n      maakamakhyatourandtravels.in\n  02  ANK1TVERSE — My Portfolio\n      ank1tverse.tech\n\nBoth featured projects link to their live websites.",
    process: "Our workflow:\n\n  01  Understand the brief\n  02  Define scope and proposal\n  03  Design and get approval\n  04  Build and test\n  05  Launch and hand over",
    team: "The people behind WebToU:\n\n  Ankit — Founder & CTO\n  Soumyadeep — Chief Operating Officer\n  Dishan — Chief Client Officer",
    founders: "Founding team:\n\n  Ankit — Founder & CTO\n  Soumyadeep — Chief Operating Officer\n  Dishan — Chief Client Officer",
    pricing: "Indicative starting points:\n\n  Single-page website — ₹3,499\n  2–5 page website — ₹5,499\n  Brand identity — quoted by scope\n\nFinal pricing is confirmed in a written proposal.",
    philosophy: "We believe:\n\n  Good design should solve real problems.\n  Technology should make things simpler.\n  Every detail should have a reason.\n\nMake it useful. Make it memorable. Make it mean something.",
    contact: "Have a project in mind?\n\nEmail: ankitdeypersonal@gmail.com\n\nTell us what you’re thinking. We’ll help you figure out what comes next."
  };
  const addTerminalLine = (text, className = "") => {
    if (!terminalOutput) return;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    if (className) paragraph.className = className;
    terminalOutput.appendChild(paragraph);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };
  const runCommand = command => {
    const normalized = command.trim().toLowerCase();
    if (!normalized || !terminalOutput) return;
    addTerminalLine(`visitor@webtou:~$ ${normalized}`);
    if (normalized === "clear") { terminalOutput.replaceChildren(); return; }
    if (Object.prototype.hasOwnProperty.call(commands, normalized)) addTerminalLine(commands[normalized], "terminal-response");
    else addTerminalLine(`Command not found: "${normalized}". Type "help" to see available commands.`, "terminal-muted");
  };
  if (terminalForm && terminalInput) {
    terminalForm.addEventListener("submit", event => {
      event.preventDefault();
      runCommand(terminalInput.value);
      terminalInput.value = "";
    });
    $$(".terminal-suggestions button").forEach(button => button.addEventListener("click", () => runCommand(button.dataset.command || "")));
  }

  // Subtle magnetic movement on the hero round link
  $$(".round-link").forEach(link => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    link.addEventListener("pointermove", event => {
      const rect = link.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      link.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    link.addEventListener("pointerleave", () => { link.style.transform = ""; });
  });

  // The marquee is driven by a CSS loop so the duplicated groups meet seamlessly.
  // No JavaScript animation is applied here; this avoids competing transforms and blank gaps.

})();
