/* Mohammadreza Nobahari — portfolio main.js */

// ── i18n (English default; German on <html lang="de"> pages) ──
const LANG = document.documentElement.lang === "de" ? "de" : "en";
const tr = (v) => (typeof v === "string" ? v : v[LANG]);

const STRINGS = {
  en: {
    menu: "Menu",
    close: "Close",
    years: (n) => `${n} ${n === 1 ? "yr" : "yrs"}`,
    question: "Question",
    answer: "Answer",
    of: "of",
    errFormat: "Invalid CIDR format. Use e.g. 192.168.1.0/24",
    errPrefix: "Prefix must be 0–32",
    errIp: "Invalid IP address",
    calculated: "Subnet calculated",
    network: "Network",
    mask: "Subnet mask",
    wildcard: "Wildcard",
    broadcast: "Broadcast",
    firstHost: "First host",
    lastHost: "Last host",
    usableHosts: "Usable hosts",
    numberLocale: "en-US",
    copied: "Copied ✓",
  },
  de: {
    menu: "Menü",
    close: "Schließen",
    years: (n) => `${n.toLocaleString("de-DE")} ${n === 1 ? "Jahr" : "Jahre"}`,
    question: "Frage",
    answer: "Antwort",
    of: "von",
    errFormat: "Ungültiges CIDR-Format. Beispiel: 192.168.1.0/24",
    errPrefix: "Das Präfix muss zwischen 0 und 32 liegen",
    errIp: "Ungültige IP-Adresse",
    calculated: "Subnetz berechnet",
    network: "Netzadresse",
    mask: "Subnetzmaske",
    wildcard: "Wildcard-Maske",
    broadcast: "Broadcast-Adresse",
    firstHost: "Erster Host",
    lastHost: "Letzter Host",
    usableHosts: "Nutzbare Hosts",
    numberLocale: "de-DE",
    copied: "Kopiert ✓",
  },
};
const t = STRINGS[LANG];

// ── Mobile nav ──
const navToggle = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");

if (navToggle && mobileMenu) {
  const setMenu = (open) => {
    mobileMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.textContent = open ? t.close : t.menu;
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
    { name: "Switching (L2/L3)", years: 2.5, desc: { en: "VLAN, STP, trunk configuration", de: "VLAN, STP, Trunk-Konfiguration" } },
    { name: "Routing (OSPF/BGP)", years: 2, desc: { en: "Dynamic routing protocol design", de: "Design dynamischer Routing-Protokolle" } },
    { name: "VLANs / 802.1Q", years: 2.5, desc: { en: "Segmentation & trunking", de: "Segmentierung & Trunking" } },
    { name: { en: "Wi-Fi Design", de: "WLAN-Design" }, years: 1.5, desc: { en: "802.11 standards & deployment", de: "802.11-Standards & Bereitstellung" } },
    { name: "UniFi (Ubiquiti)", years: 1, desc: { en: "UniFi Network, APs, switches & gateways", de: "UniFi Network, Access Points, Switches & Gateways" } },
    { name: "Wireshark", years: 2.2, desc: { en: "Packet analysis & troubleshooting", de: "Paketanalyse & Fehlersuche" } },
    { name: "Load Balancing", years: 1.2, desc: { en: "HA & traffic distribution", de: "Hochverfügbarkeit & Lastverteilung" } },
    { name: "VPN / IPsec", years: 1.8, desc: { en: "Site-to-site & remote access", de: "Site-to-Site & Remote Access" } },
    { name: "SNMP / Syslog", years: 1.5, desc: { en: "Monitoring & centralized logging", de: "Monitoring & zentrales Logging" } },
    { name: "Microsoft Hyper-V", years: 1, desc: { en: "VMs, virtual switches, checkpoints", de: "VMs, virtuelle Switches, Prüfpunkte" } },
  ],
  sec: [
    { name: "FortiGate Firewall", years: 2.8, desc: { en: "UTM, policies, HA configuration", de: "UTM, Policies, HA-Konfiguration" } },
    { name: "FortiWeb WAF", years: 2.5, desc: { en: "Web application protection", de: "Schutz von Webanwendungen" } },
    { name: "FortiAnalyzer", years: 2.2, desc: { en: "Log analysis & reporting", de: "Log-Analyse & Reporting" } },
    { name: "Sophos XG", years: 2, desc: { en: "IPS, web filtering, endpoint", de: "IPS, Webfilter, Endpoint-Schutz" } },
    { name: { en: "IPS / IDS Tuning", de: "IPS-/IDS-Tuning" }, years: 2, desc: { en: "Threat detection & tuning", de: "Bedrohungserkennung & Feinabstimmung" } },
    { name: { en: "Firewall Policies", de: "Firewall-Policies" }, years: 2.7, desc: { en: "ACL, NAT, application filtering", de: "ACL, NAT, Anwendungsfilterung" } },
    { name: "Zero Trust", years: 1, desc: { en: "Concept & implementation", de: "Konzept & Umsetzung" } },
    { name: { en: "DMZ Architecture", de: "DMZ-Architektur" }, years: 1.8, desc: { en: "Network segmentation design", de: "Design der Netzwerksegmentierung" } },
  ],
  dev: [
    { name: "Python", years: 2, desc: { en: "Automation, scripts, API integration", de: "Automatisierung, Skripte, API-Integration" } },
    { name: "C++", years: 1.5, desc: { en: "Network tools, performance", de: "Netzwerktools, Performance" } },
    { name: "HTML / CSS", years: 2.2, desc: { en: "Dashboards & web interfaces", de: "Dashboards & Weboberflächen" } },
    { name: "JavaScript", years: 1.8, desc: { en: "Interactive tools & automation", de: "Interaktive Tools & Automatisierung" } },
    { name: { en: "REST API", de: "REST-API" }, years: 2, desc: { en: "API design & FortiGate integration", de: "API-Design & FortiGate-Integration" } },
    { name: { en: "PowerShell Scripting", de: "PowerShell-Scripting" }, years: 1.5, desc: { en: "Windows & Hyper-V automation", de: "Windows- & Hyper-V-Automatisierung" } },
    { name: "Git", years: 1.5, desc: { en: "Version control & collaboration", de: "Versionsverwaltung & Zusammenarbeit" } },
  ],
};

function renderSkills(tab) {
  const panel = document.getElementById(`tab-${tab}`);
  if (!panel || !skillsData[tab]) return;

  panel.innerHTML = skillsData[tab]
    .map((s) => {
      const name = tr(s.name);
      return `
    <div class="skill-item" data-name="${name.toLowerCase()}">
      <div>
        <span class="skill-name">${name}</span>
        <span class="skill-desc">${tr(s.desc)}</span>
      </div>
      <span class="skill-years">${t.years(s.years)}</span>
    </div>`;
    })
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
const flashcards = {
  en: [
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
  ],
  de: [
    {
      q: "Wozu dient ein VLAN?",
      a: "Ein VLAN (Virtual LAN) unterteilt ein physisches Netzwerk logisch in voneinander isolierte Broadcast-Domänen. Geräte in unterschiedlichen VLANs können ohne Router oder Layer-3-Switch nicht miteinander kommunizieren — das erhöht die Sicherheit und reduziert den Broadcast-Traffic.",
    },
    {
      q: "Wofür steht OSPF und wann setzt man es ein?",
      a: "Open Shortest Path First — ein Link-State-Routingprotokoll für das Routing innerhalb eines Netzes (Interior Gateway Protocol). Es eignet sich für mittlere bis große Unternehmensnetzwerke, die schnelle Konvergenz, ein hierarchisches Area-Design und VLSM-Unterstützung benötigen.",
    },
    {
      q: "Was ist der Unterschied zwischen einer Firewall-Policy und einer ACL?",
      a: "Beide filtern Traffic, doch Firewall-Policies (UTM) vereinen in einer Regel meist Anwendungserkennung, IPS, Virenschutz und NAT. ACLs sind einfachere Permit-/Deny-Listen — auf Router- bzw. Switch-Ebene in der Regel zustandslos.",
    },
    {
      q: "Erklären Sie die CIDR-Notation in einem Satz.",
      a: "CIDR (Classless Inter-Domain Routing) legt über eine Präfixlänge (z. B. /24) fest, wie viele Bits einer IP-Adresse zum Netzanteil gehören — und ermöglicht so flexible Subnetzgrößen ohne starre Netzklassen.",
    },
    {
      q: "Was bedeutet Defense-in-Depth?",
      a: "Eine Sicherheitsstrategie mit mehreren, sich überlappenden Schutzebenen — Firewall, WAF, Endpoint-Schutz, Segmentierung, Monitoring —, sodass das System auch dann geschützt bleibt, wenn eine Ebene versagt.",
    },
    {
      q: "Warum sollte man Netzwerkkonfigurationen mit Python automatisieren?",
      a: "Automatisierung beseitigt wiederkehrende manuelle Fehler, ermöglicht versionierte Infrastruktur, skaliert über Hunderte von Geräten und gibt Engineers Freiraum für Design und Troubleshooting statt mühsamer Copy-and-paste-Arbeit in der CLI.",
    },
  ],
}[LANG];

const fcCard = document.getElementById("flashcard");
if (fcCard) {
  let fcIndex = 0;
  let fcFlipped = false;

  const fcLabel = document.getElementById("fc-label");
  const fcQuestion = document.getElementById("fc-question");
  const fcAnswer = document.getElementById("fc-answer");

  const labelText = () =>
    `${fcFlipped ? t.answer : t.question} ${fcIndex + 1} ${t.of} ${flashcards.length}`;

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
  if (!match) return { error: t.errFormat };

  const ip = match[1];
  const prefix = parseInt(match[2], 10);
  if (prefix > 32) return { error: t.errPrefix };

  const octets = ip.split(".").map(Number);
  if (octets.some((o) => o > 255)) return { error: t.errIp };

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
<div class="ok">✓ ${t.calculated}</div>
<dl class="subnet-grid">
  <dt>${t.network}</dt><dd>${result.network}/${result.prefix}</dd>
  <dt>${t.mask}</dt><dd>${result.mask}</dd>
  <dt>${t.wildcard}</dt><dd>${result.wildcard}</dd>
  <dt>${t.broadcast}</dt><dd>${result.broadcast}</dd>
  <dt>${t.firstHost}</dt><dd>${result.firstHost}</dd>
  <dt>${t.lastHost}</dt><dd>${result.lastHost}</dd>
  <dt>${t.usableHosts}</dt><dd>${result.totalHosts.toLocaleString(t.numberLocale)}</dd>
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
        label.textContent = t.copied;
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
