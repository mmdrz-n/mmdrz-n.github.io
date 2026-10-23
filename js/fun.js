/* Mohammadreza Nobahari — fun.js: terminal, Subnet Sprint, matrix easter egg.
   Loaded on every page; each feature only starts if its markup or trigger exists. */
(function () {
  const LANG = document.documentElement.lang === "de" ? "de" : "en";
  const ROOT = new URL("..", document.currentScript.src).href; // site root, from /js/fun.js
  const HOME = ROOT + (LANG === "de" ? "de/index.html" : "index.html");
  const BLOG = ROOT + (LANG === "de" ? "de/blog.html" : "blog.html");
  const onHome = !!document.getElementById("hero");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const store = {
    get(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* private mode: ignore */ }
    },
  };

  // ── IPv4 helpers ──
  const ipToInt = (ip) => ip.split(".").reduce((acc, o) => (acc << 8) + Number(o), 0) >>> 0;
  const intToIp = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  const maskOf = (prefix) => (prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0);
  const usable = (prefix) => (prefix >= 31 ? (prefix === 32 ? 1 : 2) : 2 ** (32 - prefix) - 2);

  function subnet(cidr) {
    const m = String(cidr).trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
    if (!m) return null;
    const prefix = Number(m[2]);
    if (prefix > 32 || m[1].split(".").some((o) => Number(o) > 255)) return null;
    const mask = maskOf(prefix);
    const network = (ipToInt(m[1]) & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    return { prefix, network: intToIp(network), broadcast: intToIp(broadcast), mask: intToIp(mask), hosts: usable(prefix) };
  }
  window.NetMath = { subnet, ipToInt, intToIp };

  const S = {
    en: {
      termTitle: "visitor@mmdrz-n: ~",
      welcome: 'Welcome to MN-OS 1.0. Type <b>help</b> to see what you can do.',
      notFound: (c) => `command not found: ${c}. Try <b>help</b>.`,
      help: [
        ["whoami", "who is this guy?"],
        ["skills", "what I work with"],
        ["projects", "things I've built"],
        ["blog", "latest articles · open &lt;n&gt;"],
        ["subnet &lt;cidr&gt;", "e.g. subnet 10.0.0.0/22"],
        ["ping &lt;host&gt;", "totally real network test"],
        ["traceroute &lt;host&gt;", "follow the packet"],
        ["game", "play Subnet Sprint"],
        ["joke", "a networking joke"],
        ["matrix", "you know what this does"],
        ["contact", "how to reach me"],
        ["sudo hire-me", "the best command"],
        ["clear / exit", "clean up / close"],
      ],
      whoami: "Mohammadreza Nobahari: Network &amp; Security Engineer · Python Automation · Educator. Based in Germany, open to remote work.",
      skills: "Network: VLANs, OSPF/BGP, Wi-Fi, UniFi, Wireshark, IPsec VPN\nSecurity: FortiGate (NSE 4), FortiWeb, FortiAnalyzer, Sophos XG, IPS tuning, Zero Trust\nDev: Python, C++, JavaScript, REST APIs, PowerShell, Git",
      projects: "FortiGate Policy Engine · FortiWeb WAF Ruleset · Multi-Floor VLAN Architecture\nThreat Intelligence Dashboard · Network Inventory Scanner · Sophos XG Rollout",
      contact: 'LinkedIn: linkedin.com/in/mohammadreza-nobahari-54370526a\nGitHub:   github.com/mmdrz-n\nEmail:    mreza.nobahari@gmail.com',
      hire: "[sudo] password for visitor: ********\nAccess granted. Redirecting you to the contact section…",
      rmrf: "IPS alert: signature 'Shell.Command.Injection' matched. Action: dropped. Nice try 😄",
      noPosts: "No posts index loaded on this page. Try the blog: ",
      openUsage: "usage: open &lt;number&gt;  (see blog)",
      badCidr: "usage: subnet 192.168.1.0/24",
      game: "Loading Subnet Sprint…",
      unreachable: "Request timed out. (Denied by forward policy check, policy 0 😉)",
      jokes: [
        "I'd tell you a UDP joke, but you might not get it.",
        "There are 10 types of people: those who understand binary and those who don't.",
        "Why do network engineers never get lost? They always follow the default route.",
        "I tried to come up with a TCP joke. I'll keep sending it until you acknowledge it.",
        "My firewall and I have a lot in common: we both deny everything by default.",
        "It's not DNS. There's no way it's DNS. …It was DNS.",
      ],
    },
    de: {
      termTitle: "besucher@mmdrz-n: ~",
      welcome: 'Willkommen bei MN-OS 1.0. Geben Sie <b>help</b> ein, um die Befehle zu sehen.',
      notFound: (c) => `Befehl nicht gefunden: ${c}. Versuchen Sie <b>help</b>.`,
      help: [
        ["whoami", "wer ist das?"],
        ["skills", "womit ich arbeite"],
        ["projects", "was ich gebaut habe"],
        ["blog", "neueste Artikel · open &lt;n&gt;"],
        ["subnet &lt;cidr&gt;", "z. B. subnet 10.0.0.0/22"],
        ["ping &lt;host&gt;", "ein absolut echter Netzwerktest"],
        ["traceroute &lt;host&gt;", "dem Paket folgen"],
        ["game", "Subnet Sprint spielen"],
        ["joke", "ein Netzwerkwitz"],
        ["matrix", "Sie wissen schon"],
        ["contact", "Kontaktmöglichkeiten"],
        ["sudo hire-me", "der beste Befehl"],
        ["clear / exit", "aufräumen / schließen"],
      ],
      whoami: "Mohammadreza Nobahari: Network &amp; Security Engineer · Python-Automatisierung · Wissensvermittler. In Deutschland, offen für Remote-Arbeit.",
      skills: "Netzwerk: VLANs, OSPF/BGP, WLAN, UniFi, Wireshark, IPsec-VPN\nSecurity: FortiGate (NSE 4), FortiWeb, FortiAnalyzer, Sophos XG, IPS-Tuning, Zero Trust\nEntwicklung: Python, C++, JavaScript, REST-APIs, PowerShell, Git",
      projects: "FortiGate Policy Engine · FortiWeb-WAF-Regelwerk · VLAN-Architektur über mehrere Etagen\nThreat-Intelligence-Dashboard · Netzwerk-Inventarscanner · Sophos-XG-Rollout",
      contact: 'LinkedIn: linkedin.com/in/mohammadreza-nobahari-54370526a\nGitHub:   github.com/mmdrz-n\nE-Mail:   mreza.nobahari@gmail.com',
      hire: "[sudo] Passwort für besucher: ********\nZugriff gewährt. Weiterleitung zum Kontaktbereich …",
      rmrf: "IPS-Alarm: Signatur 'Shell.Command.Injection' erkannt. Aktion: verworfen. Netter Versuch 😄",
      noPosts: "Auf dieser Seite ist kein Beitragsindex geladen. Zum Blog: ",
      openUsage: "Verwendung: open &lt;Nummer&gt;  (siehe blog)",
      badCidr: "Verwendung: subnet 192.168.1.0/24",
      game: "Subnet Sprint wird geladen …",
      unreachable: "Zeitüberschreitung. (Denied by forward policy check, policy 0 😉)",
      jokes: [
        "Ich würde Ihnen einen UDP-Witz erzählen, aber vielleicht kommt er nicht an.",
        "Es gibt 10 Arten von Menschen: die, die Binär verstehen, und die anderen.",
        "Warum verirren sich Netzwerker nie? Sie folgen immer der Default-Route.",
        "Ich habe einen TCP-Witz. Ich sende ihn so lange, bis Sie ihn bestätigen.",
        "Meine Firewall und ich: Wir lehnen beide standardmäßig alles ab.",
        "Es ist nicht DNS. Es kann nicht DNS sein. … Es war DNS.",
      ],
    },
  }[LANG];

  // ── Matrix rain ──
  function matrix(duration = 6000) {
    if (reduceMotion || document.querySelector(".matrix-canvas")) return;
    const c = document.createElement("canvas");
    c.className = "matrix-canvas";
    c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    const w = (c.width = window.innerWidth);
    const h = (c.height = window.innerHeight);
    const size = 16;
    const drops = Array.from({ length: Math.ceil(w / size) }, () => rand(-40, 0));
    const chars = "01アイウエオカキクケコサシスセソ<>/{}#$%FORTIGATE";
    let running = true;
    const stop = () => {
      running = false;
      c.classList.add("out");
      setTimeout(() => c.remove(), 600);
    };
    (function frame() {
      if (!running) return;
      ctx.fillStyle = "rgba(4,7,15,0.12)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size}px "JetBrains Mono", monospace`;
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > 0.97 ? "#ecfeff" : "#34d399";
        ctx.fillText(pick(chars), i * size, y * size);
        drops[i] = y * size > h && Math.random() > 0.975 ? 0 : y + 1;
      });
      requestAnimationFrame(frame);
    })();
    setTimeout(stop, duration);
    c.addEventListener("click", stop);
  }

  // Konami code → matrix
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let konamiPos = 0;
  document.addEventListener("keydown", (e) => {
    konamiPos = e.key === KONAMI[konamiPos] ? konamiPos + 1 : e.key === KONAMI[0] ? 1 : 0;
    if (konamiPos === KONAMI.length) {
      konamiPos = 0;
      matrix();
    }
  });

  // ── Terminal ──
  function goToContact() {
    setTimeout(() => {
      if (onHome) {
        closeOverlay();
        document.getElementById("contact")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      } else {
        location.href = HOME + "#contact";
      }
    }, 900);
  }

  function goToGame() {
    setTimeout(() => {
      if (onHome && document.getElementById("arcade")) {
        closeOverlay();
        document.getElementById("arcade").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        document.getElementById("sprint-start")?.focus({ preventScroll: true });
      } else {
        location.href = HOME + "#arcade";
      }
    }, 500);
  }

  function createTerminal(host) {
    host.classList.add("term");
    host.innerHTML = `
      <div class="term-head"><span class="term-dot"></span><span class="term-dot"></span><span class="term-dot"></span><span class="term-title">${S.termTitle}</span></div>
      <div class="term-out" role="log" aria-live="polite"></div>
      <label class="term-in"><span class="term-ps" aria-hidden="true">$</span><input type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Terminal command"></label>`;
    const out = host.querySelector(".term-out");
    const input = host.querySelector("input");
    const history = [];
    let hIndex = 0;

    const print = (html, cls = "") => {
      const line = document.createElement("div");
      line.className = `t-line ${cls}`;
      line.innerHTML = html;
      out.appendChild(line);
      out.scrollTop = out.scrollHeight;
    };
    const printLines = async (lines, delay = 0) => {
      for (const l of lines) {
        print(l);
        if (delay && !reduceMotion) await new Promise((r) => setTimeout(r, delay));
      }
    };

    const posts = () => window.POSTS || [];

    const commands = {
      help: () =>
        print(
          S.help
            .map(([c, d]) => {
              const visible = c.replace(/&lt;|&gt;/g, "x").length; // pad by rendered width, not entity length
              return `<span class="t-cmd">${c}${" ".repeat(Math.max(1, 22 - visible))}</span><span class="t-dim">${d}</span>`;
            })
            .join("\n")
        ),
      whoami: () => print(S.whoami),
      about: () => commands.whoami(),
      skills: () => print(esc(S.skills)),
      projects: () => print(esc(S.projects)),
      contact: () => print(esc(S.contact)),
      blog: () => {
        if (!posts().length) return print(`${S.noPosts}<a href="${BLOG}">${BLOG}</a>`);
        print(posts().map((p, i) => `<span class="t-cmd">[${i + 1}]</span> <a href="${ROOT}posts/${p.slug}.html">${esc(LANG === "de" ? p.title_de : p.title)}</a> <span class="t-dim">${p.minutes} min</span>`).join("\n"));
      },
      posts: () => commands.blog(),
      open: (args) => {
        const p = posts()[Number(args[0]) - 1];
        if (!p) return print(S.openUsage, "t-err");
        print(`→ ${esc(p.title)}`);
        setTimeout(() => (location.href = `${ROOT}posts/${p.slug}.html`), 400);
      },
      subnet: (args) => {
        const r = subnet(args[0] || "");
        if (!r) return print(S.badCidr, "t-err");
        print(
          `network    ${r.network}/${r.prefix}\nmask       ${r.mask}\nbroadcast  ${r.broadcast}\nhosts      ${r.hosts.toLocaleString(LANG === "de" ? "de-DE" : "en-US")}`
        );
      },
      ping: async (args) => {
        const host = esc(args[0] || "mmdrz-n.github.io");
        if (/^(10|192\.168|172\.(1[6-9]|2\d|3[01]))\./.test(host)) {
          return printLines([`PING ${host}`, S.unreachable].map((l, i) => (i ? `<span class="t-err">${l}</span>` : l)), 500);
        }
        const ip = `${rand(80, 200)}.${rand(1, 254)}.${rand(1, 254)}.${rand(1, 254)}`;
        const lines = [`PING ${host} (${ip}) 56(84) bytes of data.`];
        const times = [];
        for (let i = 1; i <= 4; i++) {
          const t = (Math.random() * 20 + 8).toFixed(1);
          times.push(Number(t));
          lines.push(`64 bytes from ${ip}: icmp_seq=${i} ttl=${rand(52, 60)} time=${t} ms`);
        }
        lines.push(`<span class="t-ok">4 packets transmitted, 4 received, 0% packet loss · avg ${(times.reduce((a, b) => a + b) / 4).toFixed(1)} ms</span>`);
        await printLines(lines, 350);
      },
      traceroute: async (args) => {
        const host = esc(args[0] || "hire.me");
        const hops = ["192.168.1.1 (home-router)", "10.64.0.1 (isp-gw)", "fra-ix.de-cix.net", "core1.security-mindset.net", "fortigate.defense-in-depth.lan", `${host} ★`];
        await printLines(hops.map((h, i) => `${String(i + 1).padStart(2)}  ${h}  ${(Math.random() * 10 + i * 4 + 1).toFixed(2)} ms`), 300);
      },
      tracert: (args) => commands.traceroute(args),
      joke: () => print(pick(S.jokes)),
      matrix: () => {
        print("Wake up, Neo…", "t-ok");
        matrix();
      },
      game: () => {
        print(S.game, "t-ok");
        goToGame();
      },
      sudo: (args) => {
        const sub = args.join(" ");
        if (sub === "hire-me" || sub === "hire me") {
          print(esc(S.hire), "t-ok");
          goToContact();
        } else if (/^rm\s+-rf/.test(sub)) {
          print(S.rmrf, "t-err");
        } else {
          print("visitor is not in the sudoers file. This incident will be reported. 🚨", "t-err");
        }
      },
      date: () => print(new Date().toString()),
      echo: (args) => print(esc(args.join(" "))),
      ls: () => print('about/  skills/  projects/  blog/  <span class="t-ok">secrets.txt</span>'),
      cat: (args) => print(args[0] === "secrets.txt" ? "The real secret: understand the protocol, not just the command. 🔐" : `cat: ${esc(args[0] || "")}: No such file`),
      coffee: () => print("   ( (\n    ) )\n  ........\n  |      |]\n  \\      /\n   `----'   brewing… ☕ 418 I'm a teapot"),
      clear: () => (out.innerHTML = ""),
      exit: () => closeOverlay(),
    };

    function run(raw) {
      const line = raw.trim();
      print(`<span class="t-ps">$</span> ${esc(line)}`, "t-echo");
      if (!line) return;
      history.push(line);
      hIndex = history.length;
      const [cmd, ...args] = line.split(/\s+/);
      const fn = commands[cmd.toLowerCase()];
      if (fn) fn(args);
      else print(S.notFound(esc(cmd)), "t-err");
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        run(input.value);
        input.value = "";
      } else if (e.key === "ArrowUp" && history.length) {
        e.preventDefault();
        hIndex = Math.max(0, hIndex - 1);
        input.value = history[hIndex];
      } else if (e.key === "ArrowDown" && history.length) {
        e.preventDefault();
        hIndex = Math.min(history.length, hIndex + 1);
        input.value = history[hIndex] || "";
      } else if (e.key === "Tab") {
        const matches = Object.keys(commands).filter((c) => c.startsWith(input.value.toLowerCase()));
        if (input.value && matches.length === 1) {
          e.preventDefault();
          input.value = matches[0] + " ";
        }
      }
      e.stopPropagation(); // keep ` and Konami keys inside the terminal
    });
    host.addEventListener("click", (e) => {
      if (!e.target.closest("a") && !window.getSelection().toString()) input.focus({ preventScroll: true });
    });

    print(S.welcome, "t-dim");
    return { input, run };
  }

  // Inline terminal (homepage arcade)
  document.querySelectorAll("[data-terminal]").forEach((el) => createTerminal(el));

  // Overlay terminal: press ` anywhere, or click any [data-open-terminal]
  let overlay = null;
  let lastFocus = null;
  function openOverlay() {
    lastFocus = document.activeElement;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "term-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "Terminal");
      overlay.innerHTML = '<div class="term-modal"></div>';
      document.body.appendChild(overlay);
      overlay.term = createTerminal(overlay.querySelector(".term-modal"));
      overlay.addEventListener("click", (e) => e.target === overlay && closeOverlay());
      overlay.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Escape") closeOverlay();
          // aria-modal: keep focus in the terminal (Tab still does command completion)
          if (e.key === "Tab") {
            e.preventDefault();
            if (document.activeElement !== overlay.term.input) overlay.term.input.focus();
          }
        },
        true
      );
    }
    overlay.classList.add("open");
    overlay.term.input.focus();
  }
  function closeOverlay() {
    if (!overlay?.classList.contains("open")) return;
    overlay.classList.remove("open");
    lastFocus?.focus?.({ preventScroll: true });
  }

  document.addEventListener("keydown", (e) => {
    const typing = e.target.closest?.("input, textarea, select, [contenteditable]");
    // e.code covers QWERTZ, where the same physical key is the ^ dead key
    if ((e.key === "`" || e.code === "Backquote") && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      overlay?.classList.contains("open") ? closeOverlay() : openOverlay();
    }
  });
  document.querySelectorAll("[data-open-terminal]").forEach((b) => b.addEventListener("click", openOverlay));

  // ── Subnet Sprint ──
  const sprint = document.getElementById("sprint");
  if (!sprint) return;

  const G = {
    en: {
      hosts: (p) => `How many usable hosts in a /${p}?`,
      network: (ip) => `Network address of ${ip}?`,
      broadcast: (ip) => `Broadcast address of ${ip}?`,
      mask: (p) => `Which subnet mask is /${p}?`,
      fits: (a, b) => `How many /${b} subnets fit in a /${a}?`,
      port: (s) => `Default port for ${s}?`,
      score: "Score",
      best: "Best",
      streak: "Streak",
      time: "Time",
      start: "Start sprint",
      again: "Play again",
      over: "Time's up!",
      newBest: "New personal best! 🏆",
      ranks: [[0, "Packet Rookie"], [5, "Cable Wrangler"], [10, "VLAN Tamer"], [15, "Subnet Sensei"], [22, "Routing Wizard"], [30, "Packet God"]],
      share: "Copy score",
      copied: "Copied ✓",
      shareText: (n, r) => `I scored ${n} in Subnet Sprint (${r}) — can you beat me? https://mmdrz-n.github.io/#arcade`,
      correct: "Correct",
      wrong: (a) => `Answer: ${a}`,
    },
    de: {
      hosts: (p) => `Wie viele nutzbare Hosts hat ein /${p}?`,
      network: (ip) => `Netzadresse von ${ip}?`,
      broadcast: (ip) => `Broadcast-Adresse von ${ip}?`,
      mask: (p) => `Welche Subnetzmaske ist /${p}?`,
      fits: (a, b) => `Wie viele /${b}-Netze passen in ein /${a}?`,
      port: (s) => `Standardport für ${s}?`,
      score: "Punkte",
      best: "Rekord",
      streak: "Serie",
      time: "Zeit",
      start: "Sprint starten",
      again: "Nochmal spielen",
      over: "Zeit abgelaufen!",
      newBest: "Neuer persönlicher Rekord! 🏆",
      ranks: [[0, "Paket-Neuling"], [5, "Kabel-Bändiger"], [10, "VLAN-Dompteur"], [15, "Subnetz-Sensei"], [22, "Routing-Magier"], [30, "Paket-Gott"]],
      share: "Ergebnis kopieren",
      copied: "Kopiert ✓",
      shareText: (n, r) => `Ich habe ${n} Punkte in Subnet Sprint (${r}) – schaffst du mehr? https://mmdrz-n.github.io/de/#arcade`,
      correct: "Richtig",
      wrong: (a) => `Antwort: ${a}`,
    },
  }[LANG];

  const PORTS = { SSH: 22, Telnet: 23, SMTP: 25, DNS: 53, HTTP: 80, HTTPS: 443, RDP: 3389, SNMP: 161, Syslog: 514, LDAP: 389, LDAPS: 636, SMB: 445, NTP: 123, "IKE (IPsec)": 500, BGP: 179, FTP: 21, "SQL Server": 1433, MySQL: 3306 };

  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  function options(correct, makeWrong) {
    const set = new Set([String(correct)]);
    let guard = 0;
    while (set.size < 4 && guard++ < 50) set.add(String(makeWrong()));
    return shuffle([...set]);
  }
  const randomIp = () => `${pick([10, 172, 192])}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`;

  const generators = [
    () => {
      const p = rand(20, 30);
      return { q: G.hosts(p), a: usable(p), opts: options(usable(p), () => usable(p + pick([-2, -1, 1, 2])) + pick([0, 0, 2])) };
    },
    () => {
      const p = rand(25, 30);
      const ip = randomIp();
      const r = subnet(`${ip}/${p}`);
      const net = ipToInt(r.network);
      const block = 2 ** (32 - p);
      return { q: G.network(`${ip}/${p}`), a: r.network, opts: options(r.network, () => intToIp(net + pick([-2, -1, 1, 2]) * block + pick([0, 0, 1]))) };
    },
    () => {
      const p = rand(25, 30);
      const ip = randomIp();
      const r = subnet(`${ip}/${p}`);
      const bc = ipToInt(r.broadcast);
      const block = 2 ** (32 - p);
      return { q: G.broadcast(`${ip}/${p}`), a: r.broadcast, opts: options(r.broadcast, () => intToIp(bc + pick([-1, 1]) * block * rand(1, 2) - pick([0, 1]))) };
    },
    () => {
      const p = rand(17, 30);
      const m = intToIp(maskOf(p));
      return { q: G.mask(p), a: m, opts: options(m, () => intToIp(maskOf(Math.min(32, Math.max(8, p + pick([-3, -2, -1, 1, 2, 3])))))) };
    },
    () => {
      const a = rand(16, 26);
      const b = a + rand(1, 5);
      const n = 2 ** (b - a);
      return { q: G.fits(a, b), a: n, opts: options(n, () => 2 ** Math.max(0, b - a + pick([-2, -1, 1, 2]))) };
    },
    () => {
      const name = pick(Object.keys(PORTS));
      const vals = Object.values(PORTS);
      return { q: G.port(name), a: PORTS[name], raw: true, opts: options(PORTS[name], () => pick(vals)) }; // ports: no "3,389"
    },
  ];

  const els = {
    q: sprint.querySelector(".sprint-q"),
    opts: sprint.querySelector(".sprint-opts"),
    score: sprint.querySelector("[data-score]"),
    best: sprint.querySelector("[data-best]"),
    streak: sprint.querySelector("[data-streak]"),
    time: sprint.querySelector("[data-time]"),
    bar: sprint.querySelector(".sprint-bar span"),
    start: document.getElementById("sprint-start"),
    feedback: sprint.querySelector(".sprint-feedback"),
  };
  const DURATION = 60;
  let state = { score: 0, streak: 0, left: DURATION, timer: null, current: null, playing: false };
  let best = Number(store.get("sprint-best")) || 0;
  els.best.textContent = best;

  function rankFor(n) {
    return G.ranks.filter(([min]) => n >= min).pop()[1];
  }

  function nextQuestion() {
    state.current = pick(generators)();
    els.q.textContent = state.current.q;
    els.opts.innerHTML = state.current.opts
      .map((o) => {
        const pretty = !state.current.raw && /^\d+$/.test(o) ? Number(o).toLocaleString(LANG === "de" ? "de-DE" : "en-US") : o;
        return `<button type="button" class="sprint-opt" data-v="${esc(o)}">${esc(pretty)}</button>`;
      })
      .join("");
    // answering disables + replaces the focused button; keep keyboard players in the game
    if (sprint.contains(document.activeElement) || document.activeElement === document.body) {
      els.opts.querySelector("button")?.focus({ preventScroll: true });
    }
  }

  function answer(btn) {
    if (!state.playing || btn.disabled) return;
    const ok = btn.dataset.v === String(state.current.a);
    els.opts.querySelectorAll("button").forEach((b) => {
      b.disabled = true;
      if (b.dataset.v === String(state.current.a)) b.classList.add("right");
    });
    if (ok) {
      state.score++;
      state.streak++;
      els.feedback.textContent = state.streak >= 3 ? `${G.correct} · 🔥 ${state.streak}` : G.correct;
      els.feedback.className = "sprint-feedback good";
    } else {
      btn.classList.add("wrong");
      state.streak = 0;
      els.feedback.textContent = G.wrong(state.current.a);
      els.feedback.className = "sprint-feedback bad";
      sprint.classList.remove("shake");
      void sprint.offsetWidth;
      sprint.classList.add("shake");
    }
    els.score.textContent = state.score;
    els.streak.textContent = state.streak;
    setTimeout(() => state.playing && nextQuestion(), ok ? 350 : 1100);
  }

  els.opts.addEventListener("click", (e) => {
    const b = e.target.closest(".sprint-opt");
    if (b) answer(b);
  });
  document.addEventListener("keydown", (e) => {
    if (!state.playing || !/^[1-4]$/.test(e.key) || e.target.closest?.("input, textarea")) return;
    const b = els.opts.querySelectorAll(".sprint-opt")[Number(e.key) - 1];
    if (b) answer(b);
  });

  function tick() {
    state.left--;
    els.time.textContent = state.left;
    els.bar.style.transform = `scaleX(${state.left / DURATION})`;
    if (state.left <= 0) finish();
  }

  function start() {
    clearInterval(state.timer);
    state = { score: 0, streak: 0, left: DURATION, timer: setInterval(tick, 1000), current: null, playing: true };
    sprint.classList.add("playing");
    sprint.classList.remove("finished");
    els.score.textContent = "0";
    els.streak.textContent = "0";
    els.time.textContent = DURATION;
    els.bar.style.transform = "scaleX(1)";
    els.feedback.textContent = "";
    els.start.hidden = true;
    nextQuestion();
    els.opts.querySelector("button")?.focus({ preventScroll: true });
  }

  function finish() {
    clearInterval(state.timer);
    state.playing = false;
    sprint.classList.remove("playing");
    sprint.classList.add("finished");
    const rank = rankFor(state.score);
    const isBest = state.score > best;
    if (isBest) {
      best = state.score;
      store.set("sprint-best", String(best));
      els.best.textContent = best;
    }
    els.q.innerHTML = `${G.over} <strong>${state.score}</strong> · ${esc(rank)}${isBest && best > 0 ? `<br><span class="sprint-best">${G.newBest}</span>` : ""}`;
    els.opts.innerHTML = `<button type="button" class="sprint-share">${G.share}</button>`;
    const share = els.opts.querySelector(".sprint-share");
    share.addEventListener("click", () => {
      navigator.clipboard?.writeText(G.shareText(state.score, rank)).then(() => (share.textContent = G.copied));
    });
    els.feedback.textContent = "";
    els.start.textContent = G.again;
    els.start.hidden = false;
    els.start.focus({ preventScroll: true });
    if (state.score >= 30) matrix(4000);
  }

  els.start.addEventListener("click", start);
})();
