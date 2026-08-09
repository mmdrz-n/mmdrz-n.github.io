/* MR.NOBAHARI Portfolio — main.js */

// ── Custom cursor (desktop only, respects reduced motion) ──
(function initCursor() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = matchMedia("(pointer: coarse)").matches;
  if (prefersReduced || isTouch) return;

  document.body.classList.add("custom-cursor");
  const cursor = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursor-dot");
  let mx = -100, my = -100, cx = -100, cy = -100;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  document.querySelectorAll("a, button, .flashcard, .skill-item").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

  (function animate() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx - 11}px, ${cy - 11}px)`;
    cursorDot.style.transform = `translate(${mx - 2}px, ${my - 2}px)`;
    requestAnimationFrame(animate);
  })();
})();

// ── Mobile nav ──
const navToggle = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");

navToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  mobileMenu.setAttribute("aria-hidden", !open);
  navToggle.textContent = open ? "CLOSE" : "MENU";
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    navToggle.textContent = "MENU";
  });
});

// ── Scroll reveal ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ── Nav active state ──
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

window.addEventListener(
  "scroll",
  () => {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  },
  { passive: true }
);

// ── Skills data & rendering ──
const skillsData = {
  net: [
    { name: "Switching (L2/L3)", pct: 85, level: "Expert", years: 2.5, desc: "VLAN, STP, trunk configuration" },
    { name: "Routing (OSPF/BGP)", pct: 80, level: "Advanced", years: 2, desc: "Dynamic routing protocol design" },
    { name: "VLANs / 802.1Q", pct: 88, level: "Expert", years: 2.5, desc: "Segmentation & trunking" },
    { name: "Wi-Fi Design", pct: 72, level: "Intermediate", years: 1.5, desc: "802.11 standards & deployment" },
    { name: "Wireshark / tcpdump", pct: 82, level: "Advanced", years: 2.2, desc: "Packet analysis & troubleshooting" },
    { name: "Load Balancing", pct: 70, level: "Intermediate", years: 1.2, desc: "HA & traffic distribution" },
    { name: "VPN / IPsec", pct: 78, level: "Advanced", years: 1.8, desc: "Site-to-site & remote access" },
    { name: "SNMP / Syslog", pct: 75, level: "Intermediate", years: 1.5, desc: "Monitoring & centralized logging" },
  ],
  sec: [
    { name: "FortiGate Firewall", pct: 90, level: "Expert", years: 2.8, desc: "UTM, policies, HA configuration" },
    { name: "FortiWeb WAF", pct: 85, level: "Expert", years: 2.5, desc: "Web application protection" },
    { name: "FortiAnalyzer", pct: 82, level: "Advanced", years: 2.2, desc: "Log analysis & reporting" },
    { name: "Sophos XG", pct: 80, level: "Advanced", years: 2, desc: "IPS, web filtering, endpoint" },
    { name: "IPS / IDS Tuning", pct: 78, level: "Advanced", years: 2, desc: "Threat detection & tuning" },
    { name: "Firewall Policies", pct: 88, level: "Expert", years: 2.7, desc: "ACL, NAT, application filtering" },
    { name: "Zero Trust", pct: 70, level: "Intermediate", years: 1, desc: "Concept & implementation" },
    { name: "DMZ Architecture", pct: 76, level: "Advanced", years: 1.8, desc: "Network segmentation design" },
  ],
  dev: [
    { name: "Python", pct: 78, level: "Advanced", years: 2, desc: "Automation, scripts, API integration" },
    { name: "C++", pct: 72, level: "Intermediate", years: 1.5, desc: "Network tools, performance" },
    { name: "HTML / CSS", pct: 80, level: "Advanced", years: 2.2, desc: "Dashboards & web interfaces" },
    { name: "JavaScript", pct: 74, level: "Advanced", years: 1.8, desc: "Interactive tools & automation" },
    { name: "REST API", pct: 74, level: "Advanced", years: 2, desc: "API design & FortiGate integration" },
    { name: "Linux CLI", pct: 85, level: "Expert", years: 2.5, desc: "Administration & troubleshooting" },
    { name: "Shell Scripting", pct: 75, level: "Intermediate", years: 1.8, desc: "Bash automation workflows" },
    { name: "Git", pct: 68, level: "Intermediate", years: 1.5, desc: "Version control & collaboration" },
  ],
};

function renderSkills(tab) {
  const panel = document.getElementById(`tab-${tab}`);
  const r = 45;
  const circ = 2 * Math.PI * r;

  panel.innerHTML = skillsData[tab]
    .map(
      (s) => `
    <div class="skill-item reveal" data-name="${s.name.toLowerCase()}">
      <div class="skill-top">
        <div class="skill-circle">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle class="skill-circle-bg" cx="50" cy="50" r="${r}"/>
            <circle class="skill-circle-progress" cx="50" cy="50" r="${r}"
              style="stroke-dasharray:${circ};stroke-dashoffset:${circ * (100 - s.pct) / 100}"/>
          </svg>
          <div class="skill-circle-text">${s.pct}%</div>
        </div>
        <div>
          <div class="skill-name">${s.name}</div>
          <div class="skill-level ${s.level.toLowerCase()}">${s.level}</div>
          <div class="skill-experience">${s.years} yrs</div>
        </div>
      </div>
      <div class="skill-desc">${s.desc}</div>
    </div>`
    )
    .join("");

  panel.querySelectorAll(".skill-item").forEach((el) => observer.observe(el));
}

["net", "sec", "dev"].forEach(renderSkills);

// Tab switching
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    document.querySelector(".skill-search").value = "";
    document.querySelectorAll(".skill-item").forEach((i) => (i.style.display = ""));
  });
});

// Skill filter
document.querySelector(".skill-search").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll(".skill-item").forEach((item) => {
    item.style.display = item.dataset.name.includes(q) ? "" : "none";
  });
});

// ── Flashcards ──
const flashcards = [
  {
    q: "What is the purpose of a VLAN?",
    a: "A VLAN (Virtual LAN) logically segments a physical network into isolated broadcast domains. Devices in different VLANs cannot communicate without a router or Layer 3 switch — improving security and reducing broadcast traffic.",
  },
  {
    q: "What does OSPF stand for and when would you use it?",
    a: "Open Shortest Path First — a link-state interior gateway routing protocol. Use it in medium-to-large enterprise networks where you need fast convergence, hierarchical area design, and support for VLSM.",
  },
  {
    q: "What is the difference between a firewall policy and an ACL?",
    a: "Both filter traffic, but firewall policies (UTM) typically include application awareness, IPS, antivirus, and NAT in one rule. ACLs are simpler permit/deny lists — usually stateless at the router/switch level.",
  },
  {
    q: "Explain CIDR notation in one sentence.",
    a: "CIDR (Classless Inter-Domain Routing) uses a prefix length (e.g., /24) to define how many bits are the network portion of an IP address — enabling flexible subnet sizing without classful boundaries.",
  },
  {
    q: "What is defense-in-depth?",
    a: "A security strategy using multiple overlapping layers of controls — firewall, WAF, endpoint protection, segmentation, monitoring — so that if one layer fails, others still protect the system.",
  },
  {
    q: "Why automate network configuration with Python?",
    a: "Automation eliminates repetitive manual errors, enables version-controlled infrastructure, scales across hundreds of devices, and frees engineers to focus on design and troubleshooting instead of copy-paste CLI work.",
  },
];

let fcIndex = 0;
let fcFlipped = false;

const fcCard = document.getElementById("flashcard");
const fcLabel = document.getElementById("fc-label");
const fcQuestion = document.getElementById("fc-question");
const fcAnswer = document.getElementById("fc-answer");

function showFlashcard() {
  fcFlipped = false;
  fcCard.classList.remove("flipped");
  fcLabel.textContent = `QUESTION ${fcIndex + 1} / ${flashcards.length}`;
  fcQuestion.textContent = flashcards[fcIndex].q;
  fcAnswer.textContent = flashcards[fcIndex].a;
}

function flipCard() {
  fcFlipped = !fcFlipped;
  fcCard.classList.toggle("flipped", fcFlipped);
  fcLabel.textContent = fcFlipped
    ? `ANSWER ${fcIndex + 1} / ${flashcards.length}`
    : `QUESTION ${fcIndex + 1} / ${flashcards.length}`;
}

fcCard.addEventListener("click", flipCard);
fcCard.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    flipCard();
  }
});

document.getElementById("fc-prev").addEventListener("click", () => {
  fcIndex = (fcIndex - 1 + flashcards.length) % flashcards.length;
  showFlashcard();
});

document.getElementById("fc-next").addEventListener("click", () => {
  fcIndex = (fcIndex + 1) % flashcards.length;
  showFlashcard();
});

document.getElementById("fc-shuffle").addEventListener("click", () => {
  fcIndex = Math.floor(Math.random() * flashcards.length);
  showFlashcard();
});

showFlashcard();

// ── Subnet calculator ──
function ipToInt(ip) {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0;
}

function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

function calculateSubnet(cidr) {
  const match = cidr.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
  if (!match) return { error: "Invalid CIDR format. Use e.g. 192.168.1.0/24" };

  const ip = match[1];
  const prefix = parseInt(match[2], 10);
  if (prefix > 32) return { error: "Prefix must be 0–32" };

  const octets = ip.split(".").map(Number);
  if (octets.some((o) => o > 255)) return { error: "Invalid IP address" };

  const ipInt = ipToInt(ip);
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const hosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : Math.pow(2, 32 - prefix) - 2;

  return {
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    mask: intToIp(mask),
    wildcard: intToIp(~mask >>> 0),
    firstHost: prefix >= 31 ? "N/A" : intToIp(network + 1),
    lastHost: prefix >= 31 ? "N/A" : intToIp(broadcast - 1),
    totalHosts: hosts,
    prefix,
  };
}

document.getElementById("calc-subnet").addEventListener("click", () => {
  const input = document.getElementById("cidr-input").value;
  const result = calculateSubnet(input);
  const out = document.getElementById("subnet-result");

  if (result.error) {
    out.innerHTML = `<span style="color:var(--red)">✗ ${result.error}</span>`;
    return;
  }

  out.innerHTML = `
<span class="ok">✓ Subnet calculated successfully</span>
<span class="key">Network:    </span><span class="val">${result.network}/${result.prefix}</span>
<span class="key">Subnet Mask:</span><span class="val">${result.mask}</span>
<span class="key">Wildcard:   </span><span class="val">${result.wildcard}</span>
<span class="key">Broadcast:  </span><span class="val">${result.broadcast}</span>
<span class="key">First Host: </span><span class="val">${result.firstHost}</span>
<span class="key">Last Host:  </span><span class="val">${result.lastHost}</span>
<span class="key">Usable Hosts:</span><span class="val">${result.totalHosts}</span>`;
});

document.getElementById("cidr-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("calc-subnet").click();
});

// ── AI fact button ──
const notif = document.getElementById("notif");
const aiFacts = [
  "🤖 The term 'Artificial Intelligence' was coined in 1956 at Dartmouth College.",
  "🤖 A neural network's 'neurons' are just weighted math functions, not real brain cells.",
  "🤖 GPT stands for Generative Pre-trained Transformer.",
  "🤖 The Transformer architecture powering modern AI was introduced in a 2017 paper called 'Attention Is All You Need'.",
  "🤖 AI can now generate working firewall configs — but it still can't make coffee.",
  "🤖 The first chatbot, ELIZA, was built in 1966 and just rephrased your sentences as questions.",
  "🤖 Deep Blue beat chess champion Garry Kasparov in 1997.",
  "🤖 Training a large language model can use more electricity than some small towns.",
  "🤖 AI models don't 'think' — they predict the most statistically likely next token.",
  "🤖 The word 'robot' comes from the Czech word 'robota', meaning forced labor.",
  "🤖 Some AI models can now write, debug, and explain firewall policies faster than a junior engineer.",
  "🤖 Reinforcement learning is how AI learned to beat humans at Go, a game with more positions than atoms in the universe.",
  "🤖 AI hallucinations aren't bugs exactly — they're confident guesses dressed up as facts.",
  "🤖 The first AI 'winter' happened in the 1970s when funding and hype both collapsed.",
  "🤖 Fun fact: even Claude doesn't know exactly why it says what it says — just like your brain and its neurons.",
];

const aiFactBtn = document.getElementById("ai-fact-btn");
aiFactBtn.addEventListener("click", () => {
  const fact = aiFacts[Math.floor(Math.random() * aiFacts.length)];
  notif.textContent = fact;
  notif.classList.add("ai-mode");
  notif.classList.remove("show");
  void notif.offsetWidth; // restart animation
  notif.classList.add("show");
  clearTimeout(window.__notifTimer);
  window.__notifTimer = setTimeout(() => {
    notif.classList.remove("show");
  }, 4500);
});

// ── Copy email (silent, no notification) ──
document.getElementById("email-link").addEventListener("click", (e) => {
  if (e.ctrlKey || e.metaKey) return;
  e.preventDefault();
  navigator.clipboard.writeText("mreza.nobahari@gmail.com").catch(() => {});
});
