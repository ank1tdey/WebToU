/* =========================
   WEBTO — INTERACTIONS
========================= */


/* 1. Current year in footer */

const currentYear = document.querySelector("#currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* 2. Scroll reveal animations */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


/* 3. Mobile navigation */

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const navItems = document.querySelectorAll(".nav-links a");

function closeMenu() {
  menuToggle.classList.remove("active");
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.contains("open");

  menuToggle.classList.toggle("active", !isOpen);
  navLinks.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navItems.forEach((link) => {
  link.addEventListener("click", closeMenu);
});


/* 4. Cursor glow effect — desktop only */

const cursorGlow = document.querySelector(".cursor-glow");

const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.style.opacity = "1";
  });

  document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
  });
}


/* 5. Interactive studio terminal */

const terminalForm = document.querySelector("#terminalForm");
const terminalInput = document.querySelector("#terminalInput");
const terminalOutput = document.querySelector("#terminalOutput");
const terminalSuggestions = document.querySelectorAll(
  ".terminal-suggestions button"
);

const terminalCommands = {
  help: `
Available commands:

  services    — What we do
  work        — Selected projects
  founders    — Meet the founders
  philosophy  — How we think
  contact     — Start a conversation
  clear       — Clear terminal
  `,

  services: `
Our services:

  01  Web design & development
  02  Brand identity
  03  Digital experiences
  04  Creative direction

We build with purpose, not just pixels.
  `,

  work: `
Selected work:

  01  ANK1TVERSE — Personal portfolio
  02  Sunday Club — Café concept
  03  Objects of Thought — Digital archive

More projects are in the making.
  `,

  founders: `
The people behind WEBTO:

  Ankit Dey
  Founder & Digital Head

  Soumyadeep
  Founder & Operations Head

Two curious minds.
One independent studio.
  `,

  philosophy: `
We believe:

  Good design should solve real problems.
  Technology should make things simpler.
  Every detail should have a reason.

Make it useful.
Make it memorable.
Make it mean something.
  `,

  contact: `
Have a project in mind?

Email:
ankitdeypersonal@gmail.com

Tell us what you're thinking.
We'll help you figure out what comes next.
  `,
};


function addTerminalLine(text, className = "") {
  const paragraph = document.createElement("p");

  paragraph.textContent = text;
  paragraph.className = className;

  terminalOutput.appendChild(paragraph);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}


function runTerminalCommand(command) {
  const normalizedCommand = command.trim().toLowerCase();

  if (!normalizedCommand) {
    return;
  }

  addTerminalLine(`visitor@webto:~$ ${normalizedCommand}`);

  if (normalizedCommand === "clear") {
    terminalOutput.innerHTML = "";
    return;
  }

  if (terminalCommands[normalizedCommand]) {
    addTerminalLine(
      terminalCommands[normalizedCommand].trim(),
      "terminal-response"
    );
  } else {
    addTerminalLine(
      `Command not found: "${normalizedCommand}". Type "help" to see available commands.`,
      "terminal-muted"
    );
  }
}


terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  runTerminalCommand(terminalInput.value);
  terminalInput.value = "";
});


terminalSuggestions.forEach((button) => {
  button.addEventListener("click", () => {
    const command = button.dataset.command;

    runTerminalCommand(command);
  });
});


/* 6. Subtle magnetic movement on round links */

const roundLinks = document.querySelectorAll(".round-link");

roundLinks.forEach((link) => {
  link.addEventListener("mousemove", (event) => {
    const rect = link.getBoundingClientRect();

    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    link.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  link.addEventListener("mouseleave", () => {
    link.style.transform = "";
  });
});

/* WEBTOU seamless marquee measured loop */
(() => {
  const track = document.querySelector(".marquee-track");
  const group = track?.querySelector(".marquee-group");
  if (!track || !group) return;

  let animation = null;
  let resizeFrame = 0;
  const speed = 42; // pixels per second

  const startMarquee = () => {
    const distance = group.getBoundingClientRect().width;
    if (!distance) return;

    if (animation) animation.cancel();

    const duration = (distance / speed) * 1000;

    animation = track.animate(
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: `translate3d(${-distance}px, 0, 0)` }
      ],
      {
        duration,
        iterations: Infinity,
        easing: "linear"
      }
    );
  };

  const scheduleRestart = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(startMarquee);
  };

  startMarquee();

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleRestart);
    observer.observe(group);
    observer.observe(track);
  } else {
    window.addEventListener("resize", scheduleRestart, { passive: true });
  }

  document.fonts?.ready?.then(scheduleRestart);
})();
