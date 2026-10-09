/* Mohammadreza Nobahari — portfolio main.js */

// ── Mobile nav ──
const navToggle = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");

if (navToggle && mobileMenu) {
  const setMenu = (open) => {
    mobileMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.textContent = open ? "Close" : "Menu";
  };

  navToggle.addEventListener("click", () => {
    setMenu(!mobileMenu.classList.contains("open"));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      setMenu(false);
      navToggle.focus();
    }
  });
}

// ── Scroll reveal ──
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("visible"));
}

// ── Nav active state ──
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

if (sections.length && navLinks.length) {
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
}

// ── Skills ──
const skillsData = {
  net: [
    { name: "Switching (L2/L3)", years: 2.5, desc: "VLAN, STP, trunk configuration" },
    { name: "Routing (OSPF/BGP)", years: 2, desc: "Dynamic routing protocol design" },
    { name: "VLANs / 802.1Q", years: 2.5, desc: "Segmentation & trunking" },
    { name: "Wi-Fi Design", years: 1.5, desc: "802.11 standards & deployment" },
    { name: "Wireshark / tcpdump", years: 2.2, desc: "Packet analysis & troubleshooting" },
    { name: "Load Balancing", years: 1.2, desc: "HA & traffic distribution" },
    { name: "VPN / IPsec", years: 1.8, desc: "Site-to-site & remote access" },
    { name: "SNMP / Syslog", years: 1.5, desc: "Monitoring & centralized logging" },
  ],
  sec: [
    { name: "FortiGate Firewall", years: 2.8, desc: "UTM, policies, HA configuration" },
    { name: "FortiWeb WAF", years: 2.5, desc: "Web application protection" },
    { name: "FortiAnalyzer", years: 2.2, desc: "Log analysis & reporting" },
    { name: "Sophos XG", years: 2, desc: "IPS, web filtering, endpoint" },
    { name: "IPS / IDS Tuning", years: 2, desc: "Threat detection & tuning" },
    { name: "Firewall Policies", years: 2.7, desc: "ACL, NAT, application filtering" },
    { name: "Zero Trust", years: 1, desc: "Concept & implementation" },
    { name: "DMZ Architecture", years: 1.8, desc: "Network segmentation design" },
  ],
  dev: [
    { name: "Python", years: 2, desc: "Automation, scripts, API integration" },
    { name: "C++", years: 1.5, desc: "Network tools, performance" },
    { name: "HTML / CSS", years: 2.2, desc: "Dashboards & web interfaces" },
    { name: "JavaScript", years: 1.8, desc: "Interactive tools & automation" },
    { name: "REST API", years: 2, desc: "API design & FortiGate integration" },
    { name: "Linux CLI", years: 2.5, desc: "Administration & troubleshooting" },
    { name: "Shell Scripting", years: 1.8, desc: "Bash automation workflows" },
    { name: "Git", years: 1.5, desc: "Version control & collaboration" },
  ],
};

function renderSkills(tab) {
  const panel = document.getElementById(`tab-${tab}`);
  if (!panel || !skillsData[tab]) return;

  panel.innerHTML = skillsData[tab]
    .map(
      (s) => `
    <div class="skill-item" data-name="${s.name.toLowerCase()}">
      <div>
        <span class="skill-name">${s.name}</span>
        <span class="skill-desc">${s.desc}</span>
      </div>
      <span class="skill-years">${s.years} yrs</span>
    </div>`
    )
    .join("");
}

["net", "sec", "dev"].forEach(renderSkills);

const skillSearch = document.querySelector(".skill-search");
const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const tabPanels = document.querySelectorAll(".tab-panel");

function activateTab(btn) {
  tabButtons.forEach((b) => {
    const on = b === btn;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", String(on));
    b.tabIndex = on ? 0 : -1;
  });
  tabPanels.forEach((p) => p.classList.remove("active"));
  const panel = document.getElementById(`tab-${btn.dataset.tab}`);
  if (panel) panel.classList.add("active");
  if (skillSearch) skillSearch.value = "";
  document.querySelectorAll(".skill-item").forEach((i) => (i.hidden = false));
}

tabButtons.forEach((btn, idx) => {
  btn.addEventListener("click", () => activateTab(btn));
  btn.addEventListener("keydown", (e) => {
    let next = null;
    if (e.key === "ArrowRight") next = tabButtons[(idx + 1) % tabButtons.length];
    if (e.key === "ArrowLeft") next = tabButtons[(idx - 1 + tabButtons.length) % tabButtons.length];
    if (next) {
      e.preventDefault();
      activateTab(next);
      next.focus();
    }
  });
});

if (skillSearch) {
  skillSearch.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll(".tab-panel.active .skill-item").forEach((item) => {
      item.hidden = !item.dataset.name.includes(q);
    });
  });
}

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

const fcCard = document.getElementById("flashcard");
if (fcCard) {
  let fcIndex = 0;
  let fcFlipped = false;

  const fcLabel = document.getElementById("fc-label");
  const fcQuestion = document.getElementById("fc-question");
  const fcAnswer = document.getElementById("fc-answer");

  const labelText = () =>
    `${fcFlipped ? "Answer" : "Question"} ${fcIndex + 1} of ${flashcards.length}`;

  function showFlashcard() {
    fcFlipped = false;
    fcCard.classList.remove("flipped");
    fcLabel.textContent = labelText();
    fcQuestion.textContent = flashcards[fcIndex].q;
    fcAnswer.textContent = flashcards[fcIndex].a;
  }

  function flipCard() {
    fcFlipped = !fcFlipped;
    fcCard.classList.toggle("flipped", fcFlipped);
    fcLabel.textContent = labelText();
  }

  fcCard.addEventListener("click", flipCard);
  fcCard.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      flipCard();
    }
  });

  document.getElementById("fc-prev")?.addEventListener("click", () => {
    fcIndex = (fcIndex - 1 + flashcards.length) % flashcards.length;
    showFlashcard();
  });

  document.getElementById("fc-next")?.addEventListener("click", () => {
    fcIndex = (fcIndex + 1) % flashcards.length;
    showFlashcard();
  });

  document.getElementById("fc-shuffle")?.addEventListener("click", () => {
    if (flashcards.length > 1) {
      let next;
      do {
        next = Math.floor(Math.random() * flashcards.length);
      } while (next === fcIndex);
      fcIndex = next;
    }
    showFlashcard();
  });

  showFlashcard();
}

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

  // /31 (RFC 3021) both addresses are usable; /32 is a single host.
  let firstHost, lastHost;
  if (prefix === 32) {
    firstHost = lastHost = intToIp(network);
  } else if (prefix === 31) {
    firstHost = intToIp(network);
    lastHost = intToIp(broadcast);
  } else {
    firstHost = intToIp(network + 1);
    lastHost = intToIp(broadcast - 1);
  }

  return {
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    mask: intToIp(mask),
    wildcard: intToIp(~mask >>> 0),
    firstHost,
    lastHost,
    totalHosts: hosts,
    prefix,
  };
}

const subnetBtn = document.getElementById("calc-subnet");
const cidrInput = document.getElementById("cidr-input");
const subnetOut = document.getElementById("subnet-result");
if (subnetBtn && cidrInput && subnetOut) {
  subnetBtn.addEventListener("click", () => {
    const result = calculateSubnet(cidrInput.value);

    if (result.error) {
      subnetOut.innerHTML = `<div class="err">${result.error}</div>`;
      return;
    }

    subnetOut.innerHTML = `
<div class="ok">✓ Subnet calculated</div>
<dl class="subnet-grid">
  <dt>Network</dt><dd>${result.network}/${result.prefix}</dd>
  <dt>Subnet mask</dt><dd>${result.mask}</dd>
  <dt>Wildcard</dt><dd>${result.wildcard}</dd>
  <dt>Broadcast</dt><dd>${result.broadcast}</dd>
  <dt>First host</dt><dd>${result.firstHost}</dd>
  <dt>Last host</dt><dd>${result.lastHost}</dd>
  <dt>Usable hosts</dt><dd>${result.totalHosts.toLocaleString("en-US")}</dd>
</dl>`;
  });

  cidrInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") subnetBtn.click();
  });
}

// ── Copy email (inline "Copied" feedback) ──
const emailLink = document.getElementById("email-link");
if (emailLink) {
  const label = emailLink.querySelector(".copy-label");
  const original = label ? label.textContent : "";
  const address = "mreza.nobahari@gmail.com";
  let resetTimer = null;

  emailLink.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (!navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard
      .writeText(address)
      .then(() => {
        if (!label) return;
        label.textContent = "Copied ✓";
        emailLink.classList.add("copied");
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          label.textContent = original;
          emailLink.classList.remove("copied");
        }, 1500);
      })
      .catch(() => {
        window.location.href = emailLink.href;
      });
  });
}
